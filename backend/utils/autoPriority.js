const detectPriority = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();
  
  const highPriorityKeywords = [
    'urgent', 'critical', 'emergency', 'asap', 'immediately',
    'payment failed', 'security', 'breach', 'down', 'crash',
    'not working', 'broken', 'error', 'can\'t access', 'cannot login',
    'data loss', 'production', 'outage', 'hack'
  ];
  
  const mediumPriorityKeywords = [
    'issue', 'problem', 'bug', 'help', 'question',
    'slow', 'performance', 'delay', 'missing'
  ];
  
  for (const keyword of highPriorityKeywords) {
    if (text.includes(keyword)) {
      return 'High';
    }
  }
  
  for (const keyword of mediumPriorityKeywords) {
    if (text.includes(keyword)) {
      return 'Medium';
    }
  }
  
  return 'Low';
};

module.exports = { detectPriority };
