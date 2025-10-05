export const getSLAStatus = (slaDeadline, status) => {
  if (status === 'Resolved' || status === 'Closed') {
    return 'completed';
  }

  const now = new Date();
  const deadline = new Date(slaDeadline);
  const timeLeft = deadline - now;
  const hoursLeft = timeLeft / (1000 * 60 * 60);

  if (timeLeft < 0) {
    return 'breach';
  } else if (hoursLeft <= 6) {
    return 'critical';
  } else if (hoursLeft <= 24) {
    return 'warning';
  } else {
    return 'ok';
  }
};

export const getSLAColor = (status) => {
  const colors = {
    ok: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
    warning: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30',
    critical: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
    breach: 'text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-900/50',
    completed: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-700/50'
  };
  return colors[status] || colors.ok;
};

export const formatTimeLeft = (slaDeadline, status) => {
  if (status === 'Resolved' || status === 'Closed') {
    return 'Completed';
  }

  const now = new Date();
  const deadline = new Date(slaDeadline);
  const timeLeft = deadline - now;

  if (timeLeft < 0) {
    return 'SLA BREACH';
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m left`;
};
