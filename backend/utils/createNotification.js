const Notification = require('../models/Notification');

const createNotification = async ({ user, ticket, type, message, metadata = {} }) => {
  try {
    await Notification.create({
      user,
      ticket,
      type,
      message,
      metadata
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { createNotification };
