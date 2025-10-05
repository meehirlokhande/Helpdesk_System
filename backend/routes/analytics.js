const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });

    const allTickets = await Ticket.find({ status: { $nin: ['Resolved', 'Closed'] } });
    const breachedTickets = allTickets.filter(ticket => new Date() > ticket.slaDeadline).length;
    const onTimeTickets = totalTickets - breachedTickets;

    const categoryStats = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const agents = await User.find({ role: 'agent' }).select('name email');
    const agentWorkload = await Promise.all(agents.map(async (agent) => {
      const assigned = await Ticket.countDocuments({ 
        assignedTo: agent._id,
        status: { $nin: ['Resolved', 'Closed'] }
      });
      return {
        agent: agent.name,
        assigned
      };
    }));

    const slaCompliance = totalTickets > 0 
      ? ((onTimeTickets / totalTickets) * 100).toFixed(2) 
      : 0;

    res.json({
      overview: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets
      },
      sla: {
        breached: breachedTickets,
        onTime: onTimeTickets,
        compliancePercentage: slaCompliance
      },
      categoryStats,
      priorityStats,
      agentWorkload
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-stats', protect, async (req, res) => {
  try {
    if (req.user.role === 'user') {
      const myTickets = await Ticket.countDocuments({ createdBy: req.user._id });
      const statusBreakdown = await Ticket.aggregate([
        { $match: { createdBy: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      res.json({
        total: myTickets,
        statusBreakdown
      });
    } else if (req.user.role === 'agent') {
      const assignedToMe = await Ticket.countDocuments({ assignedTo: req.user._id });
      const pending = await Ticket.countDocuments({ 
        assignedTo: req.user._id,
        status: { $nin: ['Resolved', 'Closed'] }
      });
      const resolved = await Ticket.countDocuments({ 
        assignedTo: req.user._id,
        status: 'Resolved'
      });

      res.json({
        total: assignedToMe,
        pending,
        resolved
      });
    } else {
      res.status(403).json({ message: 'Not available for admin' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/agents', protect, authorize('admin'), async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true }).select('_id name email');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
