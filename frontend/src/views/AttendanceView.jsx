import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function AttendanceView({
  attendance = [],
  students = [],
  onOpenRecordAttendance
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Compute metrics
  const totalRecords = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const absentCount = totalRecords - presentCount;
  const attendanceRate = totalRecords > 0 ? Math.round((presentCount / totalRecords) * 100) : 0;

  // Subjects for filter
  const subjects = useMemo(() => {
    const set = new Set(attendance.map((a) => a.subject).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [attendance]);

  // Filter attendance records
  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const q = searchQuery.toLowerCase();
      const studentName = a.student?.name || '';
      const rollNo = a.student?.rollNo || '';
      const subject = a.subject || '';

      const matchesSearch =
        studentName.toLowerCase().includes(q) ||
        rollNo.toLowerCase().includes(q) ||
        subject.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
      const matchesSubject = subjectFilter === 'ALL' || a.subject === subjectFilter;

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [attendance, searchQuery, statusFilter, subjectFilter]);

  const totalPages = Math.ceil(filteredAttendance.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAttendance.slice(start, start + pageSize);
  }, [filteredAttendance, currentPage, pageSize]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Attendance KPI Cards */}
      <div className="stats-grid">
        <StatCard
          title="ATTENDANCE PERCENTAGE"
          value={totalRecords > 0 ? `${attendanceRate}%` : '—'}
          icon={CalendarCheck}
          color="emerald"
          meta="Institutional target: 75% minimum"
        />

        <StatCard
          title="PRESENT SESSIONS"
          value={presentCount}
          icon={CheckCircle2}
          color="cyan"
          meta={`${attendanceRate}% of recorded sessions`}
        />

        <StatCard
          title="ABSENT SESSIONS"
          value={absentCount}
          icon={XCircle}
          color="rose"
          meta={`${100 - attendanceRate}% of recorded sessions`}
        />

        <StatCard
          title="RECORDED SESSIONS"
          value={totalRecords}
          icon={Calendar}
          color="indigo"
          meta="Total class sessions tracked"
        />
      </div>

      {/* Main Table Container */}
      <div className="glass-card table-card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="input-wrapper" style={{ flex: 1, minWidth: '220px' }}>
              <span className="input-icon">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-input has-icon"
                placeholder="Search by student name, roll number, or subject..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '140px', padding: '10px 38px 10px 14px', fontSize: '0.9rem' }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">Status: All</option>
              <option value="Present">Present Only</option>
              <option value="Absent">Absent Only</option>
            </select>

            {/* Subject Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '150px', padding: '10px 38px 10px 14px', fontSize: '0.9rem' }}
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'ALL' ? 'Subject: All' : sub}
                </option>
              ))}
            </select>
          </div>

          <div className="table-toolbar-right">
            <button type="button" className="btn btn-primary" onClick={onOpenRecordAttendance}>
              <CalendarCheck size={16} /> Record Attendance
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <CalendarCheck size={28} />
                      </div>
                      <div className="empty-title">No Attendance Records</div>
                      <p className="empty-desc">
                        {attendance.length === 0
                          ? 'No attendance entries have been recorded yet. Click "Record Attendance" to log attendance.'
                          : 'No attendance records matched your filter criteria.'}
                      </p>
                      {attendance.length === 0 && (
                        <button type="button" className="btn btn-primary btn-sm" onClick={onOpenRecordAttendance}>
                          <CalendarCheck size={15} /> Record First Entry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item) => (
                  <tr key={item._id}>
                    <td className="mono" style={{ fontSize: '0.9rem' }}>
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.8rem' }}>
                          {(item.student?.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {item.student?.name || 'Unknown Student'}
                        </span>
                      </div>
                    </td>

                    <td className="mono" style={{ fontSize: '0.9rem' }}>
                      {item.student?.rollNo || '—'}
                    </td>

                    <td style={{ fontWeight: 500, fontSize: '0.925rem' }}>
                      {item.subject}
                    </td>

                    <td>
                      <span className={`glass-badge ${item.status === 'Present' ? 'emerald' : 'rose'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAttendance.length > 0 && (
          <div className="table-pagination">
            <div>
              Showing{' '}
              <strong>
                {Math.min((currentPage - 1) * pageSize + 1, filteredAttendance.length)}
              </strong>{' '}
              to <strong>{Math.min(currentPage * pageSize, filteredAttendance.length)}</strong> of{' '}
              <strong>{filteredAttendance.length}</strong> attendance records
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`pagination-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className="pagination-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
