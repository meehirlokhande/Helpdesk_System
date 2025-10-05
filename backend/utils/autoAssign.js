const User = require('../models/User');
const Ticket = require('../models/Ticket');

const findLeastBusyAgent = async () => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true });
    
    if (agents.length === 0) {
      return null;
    }
    
    let leastBusyAgent = null;
    let minActiveTickets = Infinity;
    
    for (const agent of agents) {
      const activeTickets = await Ticket.countDocuments({
        assignedTo: agent._id,
        status: { $nin: ['Resolved', 'Closed'] }
      });
      
      if (activeTickets < minActiveTickets) {
        minActiveTickets = activeTickets;
        leastBusyAgent = agent;
      }
    }
    
    return leastBusyAgent;
  } catch (error) {
    console.error('Error finding least busy agent:', error);
    return null;
  }
};

module.exports = { findLeastBusyAgent };
