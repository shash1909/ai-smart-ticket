import { inngest } from '../client.js';
import { processTicketWithAI } from '../../utils/ai.js';
import { sendTicketNotificationEmail } from '../../utils/mailer.js';
import Ticket from '../../models/ticket.js';
import User from '../../models/user.js';

export const onTicketCreate = inngest.createFunction(
  { id: 'ticket-create' },
  { event: 'ticket/create' },
  async ({ event, step }) => {
    const { ticketId, title, description, userId, userEmail, userName } = event.data;

    // Step 1: Process ticket with AI
    const aiMetadata = await step.run('process-with-ai', async () => {
      return await processTicketWithAI(title, description);
    });

    // Step 2: Update ticket with AI metadata and assign moderator
    const updatedTicket = await step.run('update-ticket-and-assign', async () => {
      // Find best matching moderator based on skills
      const moderators = await User.find({ 
        role: { $in: ['moderator', 'admin'] } 
      });

      let bestModerator = null;
      let maxSkillMatch = 0;

      if (aiMetadata.suggestedSkills && aiMetadata.suggestedSkills.length > 0) {
        for (const moderator of moderators) {
          const matchingSkills = moderator.skills.filter(skill => 
            aiMetadata.suggestedSkills.some(suggestedSkill => 
              skill.toLowerCase().includes(suggestedSkill.toLowerCase()) ||
              suggestedSkill.toLowerCase().includes(skill.toLowerCase())
            )
          );

          if (matchingSkills.length > maxSkillMatch) {
            maxSkillMatch = matchingSkills.length;
            bestModerator = moderator;
          }
        }
      }

      // If no skill match found, assign to first available moderator
      if (!bestModerator && moderators.length > 0) {
        bestModerator = moderators[0];
      }

      // Update ticket with AI metadata and assignment
      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          aiMetadata,
          priority: aiMetadata.priority || 'medium',
          assignedTo: bestModerator ? bestModerator._id : null,
          status: bestModerator ? 'in-progress' : 'open'
        },
        { new: true }
      ).populate('assignedTo', 'name email');

      return ticket;
    });

    // Step 3: Send notification emails
    await step.run('send-notification-emails', async () => {
      // Send confirmation email to user
      await sendTicketNotificationEmail({
        to: userEmail,
        name: userName,
        ticketId: ticketId,
        title: title,
        status: 'created',
        assignedTo: updatedTicket.assignedTo?.name
      });

      // Send assignment email to moderator if assigned
      if (updatedTicket.assignedTo) {
        await sendTicketNotificationEmail({
          to: updatedTicket.assignedTo.email,
          name: updatedTicket.assignedTo.name,
          ticketId: ticketId,
          title: title,
          status: 'assigned',
          description: description,
          enhancedDescription: aiMetadata.enhancedDescription
        });
      }

      console.log(`Notification emails sent for ticket ${ticketId}`);
    });

    return { success: true, ticketId, assignedTo: updatedTicket.assignedTo?.name };
  }
);