import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, AlertCircle } from 'lucide-react';

export default function AttendanceModal({
  isOpen,
  students = [],
  preselectedStudent = null,
  onSave,
  onClose
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    student: '',
    date: todayStr,
    subject: 'Data Structures',
    status: 'Present'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedStudent?._id) {
      setFormData((prev) => ({
        ...prev,
        student: preselectedStudent._id,
        date: todayStr,
        status: 'Present'
      }));
    } else if (students.length > 0 && !formData.student) {
      setFormData((prev) => ({
        ...prev,
        student: students[0]._id,
        date: todayStr,
        status: 'Present'
      }));
    }
    setError('');
  }, [preselectedStudent, students, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student) {
      setError('Please select a student');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        ...formData,
        date: new Date(formData.date).toISOString()
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  };

  const commonSubjects = [
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Web Technologies',
    'Software Engineering',
    'Machine Learning'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <CalendarCheck size={20} style={{ color: 'var(--color-emerald)' }} />
            Record Attendance
          </div>
          <button type="button" className="btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="glass-badge rose" style={{ width: '100%', padding: '10px 14px', marginBottom: '16px', borderRadius: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Student <span className="required">*</span>
              </label>
              <select
                className="form-select"
                value={formData.student}
                onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                required
              >
                <option value="">Select a student...</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.rollNo} — {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Attendance Status <span className="required">*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${formData.status === 'Present' ? 'btn-primary' : 'btn-secondary'}`}
                    style={formData.status === 'Present' ? { background: '#10b981', borderColor: '#10b981' } : {}}
                    onClick={() => setFormData({ ...formData, status: 'Present' })}
                  >
                    Present
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${formData.status === 'Absent' ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={() => setFormData({ ...formData, status: 'Absent' })}
                  >
                    Absent
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Subject / Course <span className="required">*</span>
              </label>
              <input
                type="text"
                list="subjects-list"
                className="form-input"
                placeholder="e.g. Operating Systems"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
              <datalist id="subjects-list">
                {commonSubjects.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Recording...' : 'Record Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
