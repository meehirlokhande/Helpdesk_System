import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiUser, FiFileText, FiMenu, FiX } from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm border-b border-indigo-500/20 dark:border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
            <div className="bg-white/10 rounded-lg p-1.5">
              <FiFileText className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">HelpDesk</span>
          </Link>
          
          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="hover:text-indigo-200 dark:hover:text-indigo-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <NotificationDropdown />
                  
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                    <FiUser className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs bg-indigo-500 dark:bg-indigo-600 px-2 py-1 rounded-md capitalize">
                      {user.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-indigo-200 dark:hover:text-indigo-300 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex lg:hidden items-center gap-2">
                <ThemeToggle />
                <NotificationDropdown />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="space-y-3">
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Dashboard
              </Link>
              
              <div className="px-4 py-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <span className="inline-block text-xs bg-indigo-500 dark:bg-indigo-600 px-2 py-1 rounded-md capitalize mt-1">
                  {user.role}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;