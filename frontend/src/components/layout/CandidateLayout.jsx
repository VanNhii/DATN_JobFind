import { logout } from '@/store/slices/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

// Navigation configuration for candidate
const navigationConfig = [
  {
    name: 'Dashboard',
    href: '/candidate/dashboard',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z',
  },
  {
    name: 'Tìm việc làm',
    href: '/candidate/jobs',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V4',
  },
  {
    name: 'Đơn ứng tuyển',
    href: '/candidate/applications',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    name: 'Lịch phỏng vấn',
    href: '/candidate/interviews',
    icon: 'M8 7V3a4 4 0 118 0v4a1 1 0 102 0V3a6 6 0 10-12 0v4a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3v-8a3 3 0 00-3-3z',
  },
  {
    name: 'Hồ sơ cá nhân',
    href: '/candidate/profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
];

// Icon component for reusability
const Icon = ({ paths, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {Array.isArray(paths) ? paths.map((path, index) => (
      <path key={index} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    )) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths} />
    )}
  </svg>
);

// Navigation item component
const NavigationItem = ({ item, isActive, isCollapsed, onClick }) => {
  const baseClasses = "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200";
  const activeClasses = isActive 
    ? "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-900 border-l-4 border-blue-600 shadow-md" 
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm";
  
  return (
    <Link
      to={item.href}
      className={`${baseClasses} ${activeClasses} ${isCollapsed ? 'justify-center px-3' : ''}`}
      title={isCollapsed ? item.name : ''}
      onClick={onClick}
    >
      <Icon 
        paths={item.icon} 
        className={`h-6 w-6 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-700 stroke-[2.5]' : 'text-gray-500'}`} 
      />
      {!isCollapsed && <span className="truncate font-semibold">{item.name}</span>}
    </Link>
  );
};

// Sidebar component
const Sidebar = ({ navigation, location, isCollapsed, isMobileOpen, onMobileClose }) => {  
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        {/* Logo/Brand */}
        <div className={`flex items-center flex-shrink-0 px-4 mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">JobPortal</h1>
                <p className="text-xs text-gray-500 font-medium">Ứng viên</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href !== '/candidate/dashboard' && location.pathname.startsWith(item.href));
            return (
              <NavigationItem 
                key={item.name} 
                item={item} 
                isActive={isActive}
                isCollapsed={isCollapsed}
                onClick={onMobileClose}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// Header component  
const Header = ({ onToggleSidebar, onMobileMenuToggle, isCollapsed, user, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={onMobileMenuToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <Icon paths="M4 6h16M4 12h16M4 18h16" className="h-6 w-6" />
      </button>
      
      {/* Desktop sidebar toggle */}
      <button
        type="button"
        className="hidden lg:flex px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        onClick={onToggleSidebar}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Icon paths={isCollapsed ? "M4 6h16M4 12h8m-8 6h16" : "M6 18L18 6M6 6l12 12"} className="h-5 w-5" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex">
          {/* Search can be added here if needed */}
        </div>
        
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notifications button */}
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Icon paths="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.first_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {user?.first_name} {user?.last_name}
                </span>
              </button>
            </div>
            
            {showUserMenu && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Link
                  to="/candidate/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main layout component
const CandidateLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        // Close any dropdowns
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Đăng xuất thành công');
      navigate('/');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${isMobileOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <Icon paths="M6 18L18 6M6 6l12 12" className="h-6 w-6 text-white" />
            </button>
          </div>
          <Sidebar 
            navigation={navigationConfig} 
            location={location} 
            isCollapsed={false}
            isMobileOpen={isMobileOpen}
            onMobileClose={() => setIsMobileOpen(false)}
          />
        </div>
        <div className="flex-shrink-0 w-14" />
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:flex lg:flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
        <div className="flex flex-col w-full">
          <Sidebar 
            navigation={navigationConfig} 
            location={location} 
            isCollapsed={isCollapsed}
            isMobileOpen={false}
            onMobileClose={() => {}}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header 
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          isCollapsed={isCollapsed}
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;