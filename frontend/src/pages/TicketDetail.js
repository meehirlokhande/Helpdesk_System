import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiCalendar, FiPaperclip } from 'react-icons/fi';
import API from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { getSLAStatus, getSLAColor, formatTimeLeft } from '../utils/slaHelpers';
import API_BASE_URL from '../config/api.config';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');

  const fetchTicket = async () => {
    try {
      const { data } = await API.get(`/tickets/${id}`);
      setTicket(data);
      setSelectedAgent(data.assignedTo?._id || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const fetchAgents = async () => {
    if (user.role === 'admin') {
      try {
        const { data } = await API.get('/analytics/agents');
        setAgents(data);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchComments();
    fetchAgents();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await API.put(`/tickets/${id}/status`, { status: newStatus });
      fetchTicket();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedAgent) return;
    try {
      await API.put(`/tickets/${id}/assign`, { agentId: selectedAgent });
      fetchTicket();
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await API.post('/comments', {
        ticket: id,
        content: newComment
      });
      setNewComment('');
      fetchComments();
      fetchTicket();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-xl text-gray-600 dark:text-gray-400">Ticket not found</div>
      </div>
    );
  }

  const slaStatus = getSLAStatus(ticket.slaDeadline, ticket.status);
  const slaColor = getSLAColor(slaStatus);

  const statusColors = {
    'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  const canUpdateStatus = user.role === 'agent' || user.role === 'admin';
  const canAssign = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6 px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
        >
          <FiArrowLeft />
          <span className="text-sm sm:text-base">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Main Ticket Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{ticket.title}</h1>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColors[ticket.status]} whitespace-nowrap w-fit`}>
                  {ticket.status}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6 text-sm sm:text-base">{ticket.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg text-sm font-medium">
                  {ticket.category}
                </span>
                <span className="px-3 py-1.5 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-lg text-sm font-medium">
                  {ticket.priority} Priority
                </span>
              </div>

              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                    <FiPaperclip />
                    <span>Attachments</span>
                  </h3>
                  <div className="space-y-2">
                    {ticket.attachments.map((file, index) => (
                      <a
                        key={index}
                        href={`${API_BASE_URL}/${file.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm sm:text-base"
                      >
                        {file.filename}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Comments</h2>
              
              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">No comments yet</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment._id} className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-r-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{comment.user.name}</span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddComment}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Add Comment
                </button>
              </form>
            </div>

            {/* History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">History</h2>
              <div className="space-y-3">
                {ticket.history.map((entry, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">{entry.performedBy?.name || 'System'}</span>
                      <span className="text-gray-600 dark:text-gray-300"> {entry.action} </span>
                      <span className="text-gray-500 dark:text-gray-400">{entry.details}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Ticket Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Ticket Info</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Created By</div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <FiUser className="text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{ticket.createdBy?.name}</span>
                  </div>
                </div>

                {ticket.assignedTo && (
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Assigned To</div>
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <FiUser className="text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-900 dark:text-white">{ticket.assignedTo.name}</span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">Created</div>
                  <div className="flex items-center gap-2 text-sm sm:text-base">
                    <FiCalendar className="text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">SLA Status</div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${slaColor} text-sm sm:text-base`}>
                    <FiClock />
                    <span>{formatTimeLeft(ticket.slaDeadline, ticket.status)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Status Card */}
            {canUpdateStatus && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Update Status</h3>
                <div className="space-y-2">
                  {['Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      disabled={ticket.status === status}
                      className={`w-full px-4 py-3 rounded-lg text-left text-sm sm:text-base transition-all ${
                        ticket.status === status
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-300 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assign Ticket Card */}
            {canAssign && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Assign Ticket</h3>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  <option value="">Select Agent</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={!selectedAgent}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                >
                  Assign
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;