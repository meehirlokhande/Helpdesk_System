import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiBarChart2, FiClock, FiCheckCircle, FiAlertCircle, FiUsers } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import API from '../utils/api';
import TicketCard from '../components/TicketCard';
import TicketFilters from '../components/TicketFilters';
import MobileFilterToggle from '../components/MobileFilterToggle';
import Pagination from '../components/Pagination';

const AdminDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview');
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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });
      
      const { data } = await API.get(`/tickets?${params}`);
      setTickets(data.tickets);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const analyticsRes = await API.get('/analytics/dashboard');
      setAnalytics(analyticsRes.data);
      await fetchTickets(1);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
 
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const isDark = theme === 'dark';

  const statCards = [
    {
      title: 'Total Tickets',
      value: analytics?.overview.total || 0,
      icon: FiBarChart2,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600',
      darkBg: 'dark:from-indigo-600 dark:to-indigo-700'
    },
    {
      title: 'Open',
      value: analytics?.overview.open || 0,
      icon: FiAlertCircle,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      darkBg: 'dark:from-blue-600 dark:to-blue-700'
    },
    {
      title: 'In Progress',
      value: analytics?.overview.inProgress || 0,
      icon: FiClock,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-yellow-600',
      darkBg: 'dark:from-yellow-600 dark:to-yellow-700'
    },
    {
      title: 'Resolved',
      value: analytics?.overview.resolved || 0,
      icon: FiCheckCircle,
      color: 'green',
      bgGradient: 'from-green-500 to-green-600',
      darkBg: 'dark:from-green-600 dark:to-green-700'
    },
    {
      title: 'Closed',
      value: analytics?.overview.closed || 0,
      icon: FiCheckCircle,
      color: 'gray',
      bgGradient: 'from-gray-500 to-gray-600',
      darkBg: 'dark:from-gray-600 dark:to-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">System-wide ticket management and analytics</p>
        </div>

        {/* View Toggle */}
        <div className="mb-6">
          <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-full sm:w-auto">
            <button
              onClick={() => setView('overview')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                view === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView('tickets')}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                view === 'tickets'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Tickets
            </button>
          </div>
        </div>

        {view === 'overview' && analytics && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {statCards.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} ${stat.darkBg} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <div className="p-6 relative">
                    <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} ${stat.darkBg} rounded-xl shadow-lg mb-4 w-fit`}>
                      <stat.icon className="w-6 h-6 text-white" />
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

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* SLA Compliance */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiClock className="text-indigo-600 dark:text-indigo-400" />
                  SLA Compliance
                </h3>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - analytics.sla.compliancePercentage / 100)}`}
                        className="text-indigo-600 dark:text-indigo-400"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.sla.compliancePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">On Time</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{analytics.sla.onTime}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Breached</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{analytics.sla.breached}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiBarChart2 className="text-purple-600 dark:text-purple-400" />
                  <span className="text-sm sm:text-base">Category Distribution</span>
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryStats}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: isDark ? '#fff' : '#000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Priority Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiAlertCircle className="text-orange-600 dark:text-orange-400" />
                  <span className="text-sm sm:text-base">Priority Distribution</span>
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.priorityStats}>
                    <XAxis 
                      dataKey="_id" 
                      stroke={isDark ? '#9ca3af' : '#6b7280'}
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke={isDark ? '#9ca3af' : '#6b7280'}
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#fff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: isDark ? '#fff' : '#000'
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Agent Workload */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <FiUsers className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm sm:text-base">Agent Workload</span>
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {analytics.agentWorkload.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {item.agent.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{item.agent}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex-1 sm:w-32 md:w-48 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 sm:h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 h-2.5 sm:h-3 rounded-full transition-all"
                          style={{ width: `${Math.min((item.assigned / 10) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {item.assigned} tickets
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'tickets' && (
          <>
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

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{tickets.length}</span> of{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span> tickets
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
      </div>
    </div>
  );
};

export default AdminDashboard;