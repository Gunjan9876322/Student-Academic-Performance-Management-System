import React, { useState, useEffect, useCallback } from 'react';
import {
  authApi,
  studentsApi,
  attendanceApi,
  marksApi
} from './api';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import StudentModal from './components/StudentModal';
import StudentDetailModal from './components/StudentDetailModal';
import AttendanceModal from './components/AttendanceModal';
import MarksModal from './components/MarksModal';

// Views
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import StudentsView from './views/StudentsView';
import AttendanceView from './views/AttendanceView';
import MarksView from './views/MarksView';
import AnalyticsView from './views/AnalyticsView';

export default function App() {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => localStorage.getItem('sapms_theme') || 'dark');

  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sapms_user') || 'null');
    } catch {
      return null;
    }
  });

  // Navigation & layout state
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Application data
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Modal states
  const [studentModal, setStudentModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [detailModal, setDetailModal] = useState({ isOpen: false, student: null });
  const [attendanceModal, setAttendanceModal] = useState({ isOpen: false, preselectedStudent: null });
  const [marksModal, setMarksModal] = useState({ isOpen: false, preselectedStudent: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, student: null });

  // Sync theme attribute with document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sapms_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast notification helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all data from backend
  const loadData = useCallback(async (authToken = token) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const [studentsRes, attRes, marksRes] = await Promise.allSettled([
        studentsApi.getAll(authToken),
        attendanceApi.getAll(authToken),
        marksApi.getAll(authToken)
      ]);

      if (studentsRes.status === 'fulfilled') {
        setStudents(studentsRes.value || []);
      } else {
        console.warn('Students fetch error:', studentsRes.reason);
      }

      if (attRes.status === 'fulfilled') {
        setAttendance(attRes.value || []);
      } else {
        console.warn('Attendance fetch error:', attRes.reason);
      }

      if (marksRes.status === 'fulfilled') {
        setMarks(marksRes.value || []);
      } else {
        console.warn('Marks fetch error:', marksRes.reason);
      }
    } catch (err) {
      console.error('Data load exception:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadData(token);
    } else {
      setStudents([]);
      setAttendance([]);
      setMarks([]);
    }
  }, [token, loadData]);

  // Auth: Login
  const handleLogin = async (email, password) => {
    const res = await authApi.login(email, password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      if (res.user) {
        localStorage.setItem('sapms_user', JSON.stringify(res.user));
        setUser(res.user);
      }
      setToken(res.token);
      addToast('Welcome back! Signed in successfully.', 'success');
      loadData(res.token);
    }
  };

  // Auth: Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sapms_user');
    setToken('');
    setUser(null);
    setStudents([]);
    setAttendance([]);
    setMarks([]);
    addToast('You have been logged out safely.', 'info');
  };

  // Student CRUD: Save (Add or Edit)
  const handleSaveStudent = async (formData) => {
    if (studentModal.mode === 'add') {
      await studentsApi.create(token, formData);
      addToast(`Student "${formData.name}" registered successfully!`, 'success');
    } else if (studentModal.data?._id) {
      await studentsApi.update(token, studentModal.data._id, formData);
      addToast(`Student details for "${formData.name}" updated!`, 'success');
    }
    await loadData();
  };

  // Student CRUD: Delete Confirm
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.student?._id) return;
    try {
      await studentsApi.delete(token, deleteConfirm.student._id);
      addToast(`Student "${deleteConfirm.student.name}" deleted.`, 'info');
      setDeleteConfirm({ isOpen: false, student: null });
      await loadData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete operation failed', 'error');
    }
  };

  // Attendance CRUD: Save Entry
  const handleSaveAttendance = async (formData) => {
    await attendanceApi.create(token, formData);
    addToast('Attendance record logged successfully!', 'success');
    await loadData();
  };

  // Marks CRUD: Save Entry
  const handleSaveMarks = async (formData) => {
    await marksApi.create(token, formData);
    addToast('Examination marks saved successfully!', 'success');
    await loadData();
  };

  // Handlers for Opening Modals
  const handleOpenAddStudent = () => {
    setStudentModal({ isOpen: true, mode: 'add', data: null });
  };

  const handleOpenEditStudent = (student) => {
    setStudentModal({ isOpen: true, mode: 'edit', data: student });
  };

  const handleOpenViewStudent = (student) => {
    setDetailModal({ isOpen: true, student });
  };

  const handleOpenDeleteStudent = (student) => {
    setDeleteConfirm({ isOpen: true, student });
  };

  const handleOpenRecordAttendance = (student = null) => {
    setAttendanceModal({ isOpen: true, preselectedStudent: student });
  };

  const handleOpenAddMarks = (student = null) => {
    setMarksModal({ isOpen: true, preselectedStudent: student });
  };

  // If unauthenticated, show modern login portal
  if (!token) {
    return (
      <>
        <LoginView
          onLogin={handleLogin}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        counts={{
          students: students.length,
          attendance: attendance.length,
          marks: marks.length
        }}
      />

      {/* Main Content Viewport */}
      <div className={`app-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          activeView={activeView}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          user={user}
        />

        <main className="content-body">
          {activeView === 'dashboard' && (
            <DashboardView
              students={students}
              attendance={attendance}
              marks={marks}
              user={user}
              onNavigate={setActiveView}
              onOpenAddStudent={handleOpenAddStudent}
              onOpenRecordAttendance={() => handleOpenRecordAttendance(null)}
              onOpenAddMarks={() => handleOpenAddMarks(null)}
              onViewStudent={handleOpenViewStudent}
            />
          )}

          {activeView === 'students' && (
            <StudentsView
              students={students}
              onOpenAddStudent={handleOpenAddStudent}
              onEditStudent={handleOpenEditStudent}
              onViewStudent={handleOpenViewStudent}
              onDeleteStudent={handleOpenDeleteStudent}
              onRecordAttendance={handleOpenRecordAttendance}
              onAddMarks={handleOpenAddMarks}
            />
          )}

          {activeView === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              students={students}
              onOpenRecordAttendance={() => handleOpenRecordAttendance(null)}
            />
          )}

          {activeView === 'marks' && (
            <MarksView
              marks={marks}
              students={students}
              onOpenAddMarks={() => handleOpenAddMarks(null)}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView
              students={students}
              attendance={attendance}
              marks={marks}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <StudentModal
        isOpen={studentModal.isOpen}
        mode={studentModal.mode}
        initialData={studentModal.data}
        onSave={handleSaveStudent}
        onClose={() => setStudentModal({ isOpen: false, mode: 'add', data: null })}
      />

      <StudentDetailModal
        isOpen={detailModal.isOpen}
        student={detailModal.student}
        token={token}
        onClose={() => setDetailModal({ isOpen: false, student: null })}
        onRecordAttendance={(s) => {
          setDetailModal({ isOpen: false, student: null });
          handleOpenRecordAttendance(s);
        }}
        onAddMarks={(s) => {
          setDetailModal({ isOpen: false, student: null });
          handleOpenAddMarks(s);
        }}
      />

      <AttendanceModal
        isOpen={attendanceModal.isOpen}
        students={students}
        preselectedStudent={attendanceModal.preselectedStudent}
        onSave={handleSaveAttendance}
        onClose={() => setAttendanceModal({ isOpen: false, preselectedStudent: null })}
      />

      <MarksModal
        isOpen={marksModal.isOpen}
        students={students}
        preselectedStudent={marksModal.preselectedStudent}
        onSave={handleSaveMarks}
        onClose={() => setMarksModal({ isOpen: false, preselectedStudent: null })}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete student "${deleteConfirm.student?.name}" (${deleteConfirm.student?.rollNo})? This action cannot be reversed.`}
        confirmText="Yes, Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, student: null })}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
