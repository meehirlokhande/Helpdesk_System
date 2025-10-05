const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { createNotification } = require('../utils/createNotification');

router.post('/', protect, [
  body('ticket').notEmpty().withMessage('Ticket ID is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { ticket, content } = req.body;

    const ticketExists = await Ticket.findById(ticket);
    if (!ticketExists) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const username = match[1];
      const user = await User.findOne({ name: new RegExp(`^${username}$`, 'i') });
      if (user) {
        mentions.push(user._id);
      }
    }

    const comment = await Comment.create({
      ticket,
      user: req.user._id,
      content,
      mentions
    });

    ticketExists.history.push({
      action: 'Comment Added',
      performedBy: req.user._id,
      details: 'New comment added'
    });
    await ticketExists.save();

    if (ticketExists.createdBy.toString() !== req.user._id.toString()) {
      await createNotification({
        user: ticketExists.createdBy,
        ticket: ticketExists._id,
        type: 'ticket_commented',
        message: `${req.user.name} commented on your ticket: ${ticketExists.title}`,
        metadata: { performedBy: req.user.name }
      });
    }

    if (ticketExists.assignedTo && ticketExists.assignedTo.toString() !== req.user._id.toString()) {
      await createNotification({
        user: ticketExists.assignedTo,
        ticket: ticketExists._id,
        type: 'ticket_commented',
        message: `${req.user.name} commented on ticket: ${ticketExists.title}`,
        metadata: { performedBy: req.user.name }
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name email')
      .populate('mentions', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:ticketId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('user', 'name email')
      .populate('mentions', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
