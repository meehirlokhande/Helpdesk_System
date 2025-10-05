const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { detectPriority } = require('../utils/autoPriority');
const { findLeastBusyAgent } = require('../utils/autoAssign');
const { createNotification } = require('../utils/createNotification');

router.post('/', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Description is required' });
    }
    
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path
    })) : [];

    const detectedPriority = priority || detectPriority(title, description);
    
    const slaHours = {
      'High': 24,
      'Medium': 48,
      'Low': 72
    };
    const slaDeadline = new Date(Date.now() + slaHours[detectedPriority] * 60 * 60 * 1000);
    
    const leastBusyAgent = await findLeastBusyAgent();

    const historyEntries = [{
      action: 'Created',
      performedBy: req.user._id,
      details: 'Ticket created'
    }];

    if (!priority && detectedPriority !== 'Low') {
      historyEntries.push({
        action: 'Auto-Prioritized',
        performedBy: req.user._id,
        details: `Priority automatically set to ${detectedPriority} based on content`
      });
    }

    if (leastBusyAgent) {
      historyEntries.push({
        action: 'Auto-Assigned',
        performedBy: req.user._id,
        details: `Automatically assigned to ${leastBusyAgent.name}`
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      category: category || 'Issue',
      priority: detectedPriority,
      slaDeadline,
      createdBy: req.user._id,
      assignedTo: leastBusyAgent ? leastBusyAgent._id : null,
      attachments,
      history: historyEntries
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ 
      message: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'agent') {
      query.assignedTo = req.user._id;
    }

    const { status, priority, category, search, dateFrom, dateTo, slaBreach, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    if (slaBreach === 'true') {
      query.slaDeadline = { $lt: new Date() };
      query.status = { $nin: ['Resolved', 'Closed'] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const total = await Ticket.countDocuments(query);
    
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    tickets.forEach(ticket => {
      if (ticket.status !== 'Resolved' && ticket.status !== 'Closed') {
        if (new Date() > ticket.slaDeadline) {
          ticket.slaBreach = true;
        }
      }
    });

    res.json({
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('history.performedBy', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    if (req.user.role === 'agent' && 
        ticket.assignedTo && 
        ticket.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ticket' });
    }

    if (ticket.status !== 'Resolved' && ticket.status !== 'Closed') {
      if (new Date() > ticket.slaDeadline) {
        ticket.slaBreach = true;
      }
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/assign', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const agent = await User.findById(req.body.agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(400).json({ message: 'Invalid agent' });
    }

    ticket.assignedTo = req.body.agentId;
    ticket.history.push({
      action: 'Assigned',
      performedBy: req.user._id,
      details: `Assigned to ${agent.name}`
    });

    await ticket.save();

    await createNotification({
      user: req.body.agentId,
      ticket: ticket._id,
      type: 'ticket_assigned',
      message: `You have been assigned to ticket: ${ticket.title}`,
      metadata: { performedBy: req.user.name }
    });

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role === 'agent' && 
        ticket.assignedTo && 
        ticket.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    const oldStatus = ticket.status;
    ticket.status = req.body.status;

    if (req.body.status === 'Resolved') {
      ticket.resolvedAt = new Date();
    }

    if (req.body.status === 'Closed') {
      ticket.closedAt = new Date();
    }

    ticket.history.push({
      action: 'Status Updated',
      performedBy: req.user._id,
      details: `Status changed from ${oldStatus} to ${req.body.status}`
    });

    await ticket.save();

    await createNotification({
      user: ticket.createdBy,
      ticket: ticket._id,
      type: 'ticket_status_changed',
      message: `Ticket "${ticket.title}" status changed from ${oldStatus} to ${req.body.status}`,
      metadata: { oldStatus, newStatus: req.body.status, performedBy: req.user.name }
    });

    if (ticket.assignedTo && ticket.assignedTo.toString() !== ticket.createdBy.toString()) {
      await createNotification({
        user: ticket.assignedTo,
        ticket: ticket._id,
        type: 'ticket_status_changed',
        message: `Ticket "${ticket.title}" status changed from ${oldStatus} to ${req.body.status}`,
        metadata: { oldStatus, newStatus: req.body.status, performedBy: req.user.name }
      });
    }

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
