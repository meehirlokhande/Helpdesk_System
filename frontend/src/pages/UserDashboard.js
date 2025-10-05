import { useState, useEffect, useContext } from 'react';
import { FiPlus, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import TicketCard from '../components/TicketCard';
import CreateTicketModal from '../components/CreateTicketModal';
import TicketFilters from '../components/TicketFilters';
import MobileFilterToggle from '../components/MobileFilterToggle';
import Pagination from '../components/Pagination';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    slaBreach: ''
  });

  const fetchTickets = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });
      
      const { data } = await API.get(`/tickets?${params}`);
      setTickets(data.tickets);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/analytics/my-stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchTickets(pagination.page);
    fetchStats();
  }, []);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        search: '',
        status: '',
        priority: '',
        category: '',
        dateFrom: '',
        dateTo: '',
        slaBreach: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSearch = () => {
    fetchTickets(1);
  };

  const handlePageChange = (page) => {
    fetchTickets(page);
  };

  const handleTicketCreated = () => {
    fetchTickets(1);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats?.total || 0,
      icon: FiTrendingUp,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600',
      darkBg: 'dark:from-indigo-600 dark:to-indigo-700'
    },
    {
      title: 'Open',
      value: stats?.statusBreakdown?.find(s => s._id === 'Open')?.count || 0,
      icon: FiAlertCircle,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      darkBg: 'dark:from-blue-600 dark:to-blue-700'
    },
    {
      title: 'In Progress',
      value: stats?.statusBreakdown?.find(s => s._id === 'In Progress')?.count || 0,
      icon: FiClock,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-yellow-600',
      darkBg: 'dark:from-yellow-600 dark:to-yellow-700'
    },
    {
      title: 'Resolved',
      value: stats?.statusBreakdown?.find(s => s._id === 'Resolved')?.count || 0,
      icon: FiCheckCircle,
      color: 'green',
      bgGradient: 'from-green-500 to-green-600',
      darkBg: 'dark:from-green-600 dark:to-green-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage and track your support tickets</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              <FiPlus className="group-hover:rotate-90 transition-transform" />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} ${stat.darkBg} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} ${stat.darkBg} rounded-xl shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-3 py-1 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 text-xs font-medium rounded-full`}>
                      Active
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters - Desktop */}
        <div className="hidden lg:block mb-6">
          <TicketFilters
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Filters - Mobile Toggle */}
        <MobileFilterToggle
          filters={filters}
          onChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tickets Section */}
        {tickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-16 text-center border border-gray-100 dark:border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPlus className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first support ticket
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                Create your first ticket →
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{tickets.length}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> tickets
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {showCreateModal && (
          <CreateTicketModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleTicketCreated}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;