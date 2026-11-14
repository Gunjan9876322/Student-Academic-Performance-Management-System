import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({
  activeView,
  onOpenMobileSidebar,
  user
}) {
  const titles = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of students, attendance, and results' },
    students: { title: 'Students', subtitle: 'Manage student records and profiles' },
    attendance: { title: 'Attendance', subtitle: 'Track and record class attendance' },
    marks: { title: 'Marks & Results', subtitle: 'Exam scores and academic records' },
    analytics: { title: 'Analytics', subtitle: 'Department-level performance breakdown' }
  };

  const current = titles[activeView] || titles.dashboard;

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="btn-ghost btn-icon"
          style={{ display: 'none' }}
          id="mobile-sidebar-toggle"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <style>{`
          @media (max-width: 768px) {
            #mobile-sidebar-toggle {
              display: inline-flex !important;
            }
          }
        `}</style>

        <div className="header-title-box">
          <h2 className="header-title">{current.title}</h2>
          <span className="header-subtitle">{current.subtitle}</span>
        </div>
      </div>

      <div className="header-right">
        {user?.role && (
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'capitalize'
          }}>
            Signed in as {user.role}
          </span>
        )}
      </div>
    </header>
  );
}
