import React, { useState, useEffect } from 'react';
import { X, Award, AlertCircle } from 'lucide-react';

export default function MarksModal({
  isOpen,
  students = [],
  preselectedStudent = null,
  onSave,
  onClose
}) {
  const [formData, setFormData] = useState({
    student: '',
    subject: 'Data Structures & Algorithms',
    exam: 'Midterm Exam',
    obtained: '',
    maximum: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedStudent?._id) {
      setFormData((prev) => ({
        ...prev,
        student: preselectedStudent._id,
        obtained: ''
      }));
    } else if (students.length > 0 && !formData.student) {
      setFormData((prev) => ({
        ...prev,
        student: students[0]._id,
        obtained: ''
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
    if (!formData.exam.trim()) {
      setError('Exam name is required');
      return;
    }
    if (formData.obtained === '' || isNaN(formData.obtained)) {
      setError('Please enter valid obtained marks');
      return;
    }
    if (Number(formData.obtained) > Number(formData.maximum)) {
      setError('Obtained marks cannot exceed maximum marks');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        ...formData,
        obtained: Number(formData.obtained),
        maximum: Number(formData.maximum)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save marks');
    } finally {
      setLoading(false);
    }
  };

  const exams = ['Midterm Exam', 'Final Examination', 'Quiz 1', 'Quiz 2', 'Lab Assessment', 'Project Evaluation'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Award size={20} style={{ color: 'var(--color-cyan)' }} />
            Enter Academic Marks
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

            <div className="form-group">
              <label className="form-label">
                Subject / Course <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Operating Systems"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Exam / Assessment Name <span className="required">*</span>
              </label>
              <input
                type="text"
                list="exam-types"
                className="form-input"
                placeholder="e.g. Final Examination"
                required
                value={formData.exam}
                onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
              />
              <datalist id="exam-types">
                {exams.map((ex) => (
                  <option key={ex} value={ex} />
                ))}
              </datalist>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  Obtained Marks <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.maximum}
                  className="form-input mono"
                  placeholder="e.g. 85"
                  required
                  value={formData.obtained}
                  onChange={(e) => setFormData({ ...formData, obtained: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Maximum Marks <span className="required">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-input mono"
                  placeholder="e.g. 100"
                  required
                  value={formData.maximum}
                  onChange={(e) => setFormData({ ...formData, maximum: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Marks'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
