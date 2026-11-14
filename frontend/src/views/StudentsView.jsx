import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit3,
  Trash2,
  CalendarCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function StudentsView({
  students = [],
  onOpenAddStudent,
  onEditStudent,
  onViewStudent,
  onDeleteStudent,
  onRecordAttendance,
  onAddMarks
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Departments list for filter
  const departments = useMemo(() => {
    const set = new Set(students.map((s) => (s.department || '').toUpperCase()).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [students]);

  // Semesters list for filter
  const semesters = useMemo(() => {
    const set = new Set(students.map((s) => s.semester).filter(Boolean));
    return ['ALL', ...Array.from(set).sort((a, b) => a - b)];
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.department && s.department.toLowerCase().includes(q));

      const matchesDept = selectedDept === 'ALL' || (s.department || '').toUpperCase() === selectedDept;
      const matchesSem = selectedSemester === 'ALL' || String(s.semester) === String(selectedSemester);

      return matchesSearch && matchesDept && matchesSem;
    });
  }, [students, searchQuery, selectedDept, selectedSemester]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card table-card">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <div className="input-wrapper" style={{ flex: 1, minWidth: '220px' }}>
              <span className="input-icon">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-input has-icon"
                placeholder="Search students by roll number, name, department..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            {/* Department Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '140px', padding: '10px 38px 10px 14px', fontSize: '0.9rem' }}
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  Dept: {d}
                </option>
              ))}
            </select>

            {/* Semester Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '130px', padding: '10px 38px 10px 14px', fontSize: '0.9rem' }}
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                setCurrentPage(1);
              }}
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Sem: {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="table-toolbar-right">
            <button type="button" className="btn btn-primary" onClick={onOpenAddStudent}>
              <UserPlus size={16} /> Add Student
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll Number</th>
                <th>Email</th>
                <th>Department</th>
                <th>Semester</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Users size={28} />
                      </div>
                      <div className="empty-title">No Students Found</div>
                      <p className="empty-desc">
                        {students.length === 0
                          ? 'No student records have been created yet. Click "Add Student" to enroll your first student.'
                          : 'No students matched your search criteria. Try adjusting your query or filters.'}
                      </p>
                      {students.length === 0 && (
                        <button type="button" className="btn btn-primary btn-sm" onClick={onOpenAddStudent}>
                          <UserPlus size={15} /> Add First Student
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.875rem' }}>
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {s.name}
                        </span>
                      </div>
                    </td>

                    <td className="mono" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      {s.rollNo}
                    </td>

                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                      {s.email || '—'}
                    </td>

                    <td>
                      <span className="glass-badge indigo">{s.department || 'CSE'}</span>
                    </td>

                    <td>
                      <span className="glass-badge cyan">Sem {s.semester || 1}</span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => onViewStudent(s)}
                          title="View student profile & grades"
                          aria-label="View student"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => onRecordAttendance(s)}
                          title="Record attendance"
                          aria-label="Record attendance"
                        >
                          <CalendarCheck size={18} style={{ color: 'var(--color-emerald)' }} />
                        </button>

                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => onAddMarks(s)}
                          title="Enter marks"
                          aria-label="Enter marks"
                        >
                          <Award size={18} style={{ color: 'var(--color-cyan)' }} />
                        </button>

                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => onEditStudent(s)}
                          title="Edit student"
                          aria-label="Edit student"
                        >
                          <Edit3 size={18} />
                        </button>

                        <button
                          type="button"
                          className="btn-ghost btn-sm"
                          onClick={() => onDeleteStudent(s)}
                          title="Delete student"
                          aria-label="Delete student"
                          style={{ color: 'var(--color-rose)' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        {filteredStudents.length > 0 && (
          <div className="table-pagination">
            <div>
              Showing{' '}
              <strong>
                {Math.min((currentPage - 1) * pageSize + 1, filteredStudents.length)}
              </strong>{' '}
              to <strong>{Math.min(currentPage * pageSize, filteredStudents.length)}</strong> of{' '}
              <strong>{filteredStudents.length}</strong> students
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                className="pagination-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
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
                aria-label="Next page"
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
