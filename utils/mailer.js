import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS
  }
});

export const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const mailOptions = {
    from: '"Smart Ticketing System" <noreply@smarttickets.com>',
    to: to,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Smart Ticketing System!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        <p>Best regards,<br>Smart Ticketing System Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendTicketNotificationEmail = async ({ 
  to, 
  name, 
  ticketId, 
  title, 
  status, 
  assignedTo, 
  description, 
  enhancedDescription 
}) => {
  let subject, content;

  if (status === 'created') {
    subject = `Ticket Created: ${title}`;
    content = `
      <h2 style="color: #333;">Ticket Created Successfully</h2>
      <p>Hi ${name},</p>
      <p>Your support ticket has been created and is being processed by our AI system.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Ticket Details:</h3>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Status:</strong> ${status === 'created' ? 'Open' : status}</p>
        ${assignedTo ? `<p><strong>Assigned to:</strong> ${assignedTo}</p>` : ''}
      </div>
      <p>You will receive updates as your ticket progresses.</p>
    `;
  } else if (status === 'assigned') {
    subject = `New Ticket Assigned: ${title}`;
    content = `
      <h2 style="color: #333;">New Ticket Assigned to You</h2>
      <p>Hi ${name},</p>
      <p>A new support ticket has been assigned to you based on your skills and expertise.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3>Ticket Details:</h3>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Original Description:</strong></p>
        <p style="margin-left: 20px;">${description}</p>
        ${enhancedDescription ? `
          <p><strong>AI Enhanced Analysis:</strong></p>
          <p style="margin-left: 20px; font-style: italic;">${enhancedDescription}</p>
        ` : ''}
      </div>
      <p>Please log in to the system to view and manage this ticket.</p>
    `;
  }

  const mailOptions = {
    from: '"Smart Ticketing System" <noreply@smarttickets.com>',
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${content}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.APP_URL}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            View Ticket
          </a>
        </div>
        <p>Best regards,<br>Smart Ticketing System Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};