import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  Filter,
  TrendingUp,
  PlusCircle,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function MarksView({
  marks = [],
  students = [],
  onOpenAddMarks
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Compute stats
  const totalAssessments = marks.length;
  const totalObtained = marks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
  const totalMax = marks.reduce((sum, m) => sum + (Number(m.maximum) || 100), 0);
  const avgScore = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  // Highest score percentage
  let highestPct = 0;
  marks.forEach((m) => {
    const p = Math.round(((Number(m.obtained) || 0) / (Number(m.maximum) || 100)) * 100);
    if (p > highestPct) highestPct = p;
  });

  // Pass rate (>= 40%)
  const passedCount = marks.filter((m) => {
    const p = ((Number(m.obtained) || 0) / (Number(m.maximum) || 100)) * 100;
    return p >= 40;
  }).length;
  const passRate = totalAssessments > 0 ? Math.round((passedCount / totalAssessments) * 100) : 0;

  // Unique exams & subjects for filter
  const examList = useMemo(() => {
    const set = new Set(marks.map((m) => m.exam).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [marks]);

  const subjectList = useMemo(() => {
    const set = new Set(marks.map((m) => m.subject).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [marks]);

  // Filter marks
  const filteredMarks = useMemo(() => {
    return marks.filter((m) => {
      const q = searchQuery.toLowerCase();
      const studentName = m.student?.name || '';
      const rollNo = m.student?.rollNo || '';
      const subject = m.subject || '';
      const exam = m.exam || '';

      const matchesSearch =
        studentName.toLowerCase().includes(q) ||
        rollNo.toLowerCase().includes(q) ||
        subject.toLowerCase().includes(q) ||
        exam.toLowerCase().includes(q);

      const matchesExam = examFilter === 'ALL' || m.exam === examFilter;
      const matchesSub = subjectFilter === 'ALL' || m.subject === subjectFilter;

      return matchesSearch && matchesExam && matchesSub;
    });
  }, [marks, searchQuery, examFilter, subjectFilter]);

  const totalPages = Math.ceil(filteredMarks.length / pageSize) || 1;
  const paginatedMarks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMarks.slice(start, start + pageSize);
  }, [filteredMarks, currentPage, pageSize]);

  const getGrade = (pct) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Marks KPI Cards */}
      <div className="stats-grid">
        <StatCard
          title="AVERAGE ACADEMIC SCORE"
          value={totalAssessments > 0 ? `${avgScore}%` : '—'}
          icon={Award}
          color="cyan"
          meta="Average across all recorded tests"
        />

        <StatCard
          title="OVERALL PASS RATE"
          value={totalAssessments > 0 ? `${passRate}%` : '—'}
          icon={TrendingUp}
          color="emerald"
          meta={`${passedCount} of ${totalAssessments} passed (>= 40%)`}
        />

        <StatCard
          title="HIGHEST PERFORMANCE"
          value={totalAssessments > 0 ? `${highestPct}%` : '—'}
          icon={Award}
          color="indigo"
          meta="Top score achieved"
        />

        <StatCard
          title="TOTAL ASSESSMENTS"
          value={totalAssessments}
          icon={FileCheck}
          color="violet"
          meta="Graded tests & exams"
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

            {/* Exam Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '140px', padding: '10px 38px 10px 14px', fontSize: '0.9rem' }}
              value={examFilter}
              onChange={(e) => {
                setExamFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {examList.map((ex) => (
                <option key={ex} value={ex}>
                  {ex === 'ALL' ? 'Exam: All' : ex}
                </option>
              ))}
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
              {subjectList.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'ALL' ? 'Subject: All' : sub}
                </option>
              ))}
            </select>
          </div>

          <div className="table-toolbar-right">
            <button type="button" className="btn btn-primary" onClick={onOpenAddMarks}>
              <Award size={16} /> Enter Marks
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
                <th>Subject</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMarks.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="empty-icon">
                        <Award size={28} />
                      </div>
                      <div className="empty-title">No Academic Marks Found</div>
                      <p className="empty-desc">
                        {marks.length === 0
                          ? 'No exam marks or scores have been recorded yet. Click "Enter Marks" to add exam outcomes.'
                          : 'No mark entries matched your current search filters.'}
                      </p>
                      {marks.length === 0 && (
                        <button type="button" className="btn btn-primary btn-sm" onClick={onOpenAddMarks}>
                          <Award size={15} /> Enter First Marks
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMarks.map((item) => {
                  const obt = Number(item.obtained) || 0;
                  const max = Number(item.maximum) || 100;
                  const pct = Math.round((obt / max) * 100);
                  const grade = getGrade(pct);

                  return (
                    <tr key={item._id}>
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

                      <td style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                        {item.subject}
                      </td>

                      <td>
                        <span className="glass-badge indigo">{item.exam}</span>
                      </td>

                      <td className="mono">
                        <strong style={{ fontSize: '1rem' }}>{obt}</strong> / {max}
                      </td>

                      <td>
                        <span className={`glass-badge ${pct >= 75 ? 'emerald' : pct >= 40 ? 'cyan' : 'rose'}`}>
                          {pct}%
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            color: pct >= 75 ? '#34d399' : pct >= 40 ? '#38bdf8' : '#fb7185'
                          }}
                        >
                          {grade}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMarks.length > 0 && (
          <div className="table-pagination">
            <div>
              Showing{' '}
              <strong>
                {Math.min((currentPage - 1) * pageSize + 1, filteredMarks.length)}
              </strong>{' '}
              to <strong>{Math.min(currentPage * pageSize, filteredMarks.length)}</strong> of{' '}
              <strong>{filteredMarks.length}</strong> mark entries
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
