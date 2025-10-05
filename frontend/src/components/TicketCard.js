import { Link } from 'react-router-dom';
import { FiClock, FiUser } from 'react-icons/fi';
import { getSLAStatus, getSLAColor, formatTimeLeft } from '../utils/slaHelpers';

const TicketCard = ({ ticket }) => {
  const slaStatus = getSLAStatus(ticket.slaDeadline, ticket.status);
  const slaColor = getSLAColor(slaStatus);

  const statusColors = {
    'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  const priorityColors = {
    'Low': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'Medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'High': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };

  return (
    <Link to={`/ticket/${ticket._id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 dark:border-gray-700 h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {ticket.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {ticket.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[ticket.status]}`}>
            {ticket.status}
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            {ticket.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FiUser className="w-4 h-4" />
            <span className="text-xs">{ticket.createdBy?.name || 'Unknown'}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium ${slaColor}`}>
            <FiClock className="w-4 h-4" />
            <span className="text-xs">{formatTimeLeft(ticket.slaDeadline, ticket.status)}</span>
          </div>
        </div>

        {ticket.assignedTo && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Assigned to: <span className="font-medium text-gray-700 dark:text-gray-300">{ticket.assignedTo.name}</span>
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default TicketCard;