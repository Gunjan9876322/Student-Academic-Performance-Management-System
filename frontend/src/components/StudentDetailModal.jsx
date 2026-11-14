import React, { useState, useEffect } from 'react';
import { X, User, CalendarCheck, Award, Mail, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { attendanceApi, marksApi } from '../api';

export default function StudentDetailModal({
  isOpen,
  student,
  token,
  onClose,
  onRecordAttendance,
  onAddMarks
}) {
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'attendance', 'marks'

  useEffect(() => {
    if (!isOpen || !student?._id || !token) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [attRes, marksRes] = await Promise.all([
          attendanceApi.getAll(token, student._id),
          marksApi.getAll(token, student._id)
        ]);
        setAttendance(attRes || []);
        setMarks(marksRes || []);
      } catch (err) {
        console.error('Failed to fetch student details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, student, token]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !student) return null;

  // Compute metrics
  const totalAtt = attendance.length;
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const attPct = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

  const totalObtained = marks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
  const totalMax = marks.reduce((sum, m) => sum + (Number(m.maximum) || 100), 0);
  const marksPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.875rem' }}>
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', lineHeight: 1.2 }}>{student.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }} className="mono">
                {student.rollNo} • {student.department} (Sem {student.semester})
              </div>
            </div>
          </div>
          <button type="button" className="btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid var(--glass-border)' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance ({attendance.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'marks' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.875rem' }}
            onClick={() => setActiveTab('marks')}
          >
            Marks & Exams ({marks.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Loading student academic profile...
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Summary Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="glass-card" style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          ATTENDANCE RATE
                        </span>
                        <CalendarCheck size={18} style={{ color: 'var(--color-emerald)' }} />
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {totalAtt > 0 ? `${attPct}%` : 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {presentCount} of {totalAtt} recorded classes attended
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                          ACADEMIC AVERAGE
                        </span>
                        <Award size={18} style={{ color: 'var(--color-cyan)' }} />
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {marks.length > 0 ? `${marksPct}%` : 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Across {marks.length} recorded {marks.length === 1 ? 'assessment' : 'assessments'}
                      </div>
                    </div>
                  </div>

                  {/* Student Info Details */}
                  <div className="glass-card" style={{ padding: '20px' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
                      Personal & Academic Information
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Roll Number</span>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }} className="mono">{student.rollNo}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full Name</span>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{student.name}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</span>
                        <div style={{ fontWeight: 500, fontSize: '0.925rem' }}>{student.email || '—'}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department</span>
                        <div><span className="glass-badge indigo">{student.department}</span></div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Semester</span>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Semester {student.semester}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'attendance' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Attendance History ({totalAtt} records)
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onRecordAttendance(student)}
                    >
                      <CalendarCheck size={14} /> Record Entry
                    </button>
                  </div>

                  {attendance.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No attendance records found for this student.
                    </div>
                  ) : (
                    <div className="table-responsive" style={{ maxHeight: '300px' }}>
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map((att) => (
                            <tr key={att._id}>
                              <td className="mono" style={{ fontSize: '0.8rem' }}>
                                {new Date(att.date).toLocaleDateString()}
                              </td>
                              <td style={{ fontWeight: 500 }}>{att.subject}</td>
                              <td>
                                <span className={`glass-badge ${att.status === 'Present' ? 'emerald' : 'rose'}`}>
                                  {att.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'marks' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Exam & Assessment Records ({marks.length})
                    </span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onAddMarks(student)}
                    >
                      <Award size={14} /> Add Marks
                    </button>
                  </div>

                  {marks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No marks recorded for this student yet.
                    </div>
                  ) : (
                    <div className="table-responsive" style={{ maxHeight: '300px' }}>
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>Subject</th>
                            <th>Exam</th>
                            <th>Score</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marks.map((m) => {
                            const pct = Math.round(((Number(m.obtained) || 0) / (Number(m.maximum) || 100)) * 100);
                            return (
                              <tr key={m._id}>
                                <td style={{ fontWeight: 600 }}>{m.subject}</td>
                                <td>{m.exam}</td>
                                <td className="mono">
                                  <strong>{m.obtained}</strong> / {m.maximum}
                                </td>
                                <td>
                                  <span className={`glass-badge ${pct >= 75 ? 'emerald' : pct >= 50 ? 'amber' : 'rose'}`}>
                                    {pct}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
