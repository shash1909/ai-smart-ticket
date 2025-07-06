import Ticket from '../models/ticket.js';
import User from '../models/user.js';
import { inngest } from '../inngest/client.js';

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const ticket = new Ticket({
      title,
      description,
      user: userId
    });

    await ticket.save();

    // Trigger AI processing and email notification
    await inngest.send({
      name: 'ticket/create',
      data: {
        ticketId: ticket._id.toString(),
        title: ticket.title,
        description: ticket.description,
        userId: userId,
        userEmail: req.user.email,
        userName: req.user.name
      }
    });

    await ticket.populate('user', 'name email');

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tickets = await Ticket.find(filter)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email skills');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Get ticket by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('user', 'name email')
     .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket updated successfully', ticket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    // Verify the assigned user exists and is a moderator or admin
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !['moderator', 'admin'].includes(assignedUser.role)) {
      return res.status(400).json({ message: 'Invalid assignee' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { assignedTo, status: 'in-progress' },
      { new: true }
    ).populate('user', 'name email')
     .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket assigned successfully', ticket });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const tickets = await Ticket.find({ user: userId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ tickets });
  } catch (error) {
    console.error('Get user tickets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};