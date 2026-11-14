import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  X
} from 'lucide-react';

/* Custom logo mark — a simple "S" letterform, not a stock icon */
function LogoMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 8.5C7 6.567 8.567 5 10.5 5H14C15.933 5 17.5 6.567 17.5 8.5C17.5 10.433 15.933 12 14 12H10C8.067 12 6.5 13.567 6.5 15.5C6.5 17.433 8.067 19 10 19H13.5C15.433 19 17 17.433 17 15.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Sidebar({
  activeView,
  setActiveView,
  isCollapsed,
  setIsCollapsed,
  theme,
  toggleTheme,
  user,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
  counts = {}
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: counts.students },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: counts.attendance },
    { id: 'marks', label: 'Marks & Results', icon: Award, badge: counts.marks },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleNavClick = (viewId) => {
    setActiveView(viewId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 39 }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <LogoMark size={22} />
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-name">SAPMS</span>
                <span className="sidebar-brand-desc">Student Management</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className="btn-ghost btn-icon"
            style={{ display: isMobileOpen ? 'none' : 'flex' }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button
              type="button"
              className="btn-ghost btn-icon"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {!isCollapsed ? 'Navigation' : ''}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="nav-item-icon">
                  <Icon size={20} />
                </div>
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {/* Theme Toggle */}
          <button
            type="button"
            className="nav-item"
            onClick={toggleTheme}
            style={{ marginBottom: '4px' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <div className="nav-item-icon">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            {!isCollapsed && <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>}
          </button>

          {/* User Profile Card */}
          <div className="user-profile-card">
            <div className="user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>

            {!isCollapsed && (
              <div className="user-info" style={{ flex: 1 }}>
                <span className="user-name" title={user?.name || 'Administrator'}>
                  {user?.name || 'Admin User'}
                </span>
                <span className="user-role">
                  {user?.role || 'admin'}
                </span>
              </div>
            )}

            {!isCollapsed && (
              <button
                type="button"
                className="btn-ghost btn-sm"
                onClick={onLogout}
                title="Sign out"
                aria-label="Sign out"
                style={{ padding: '6px' }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
