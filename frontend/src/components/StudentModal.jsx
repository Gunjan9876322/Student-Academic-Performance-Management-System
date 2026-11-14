import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck, AlertCircle } from 'lucide-react';

export default function StudentModal({
  isOpen,
  mode = 'add', // 'add' or 'edit'
  initialData = null,
  onSave,
  onClose
}) {
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    email: '',
    department: 'CSE',
    semester: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        rollNo: initialData.rollNo || '',
        name: initialData.name || '',
        email: initialData.email || '',
        department: initialData.department || 'CSE',
        semester: initialData.semester || 1
      });
    } else {
      setFormData({
        rollNo: '',
        name: '',
        email: '',
        department: 'CSE',
        semester: 1
      });
    }
    setError('');
  }, [initialData, mode, isOpen]);

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
    if (!formData.rollNo.trim() || !formData.name.trim()) {
      setError('Roll number and full name are required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['CSE', 'ECE', 'IT', 'MECH', 'CIVIL', 'AIDS', 'EEE'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            {mode === 'add' ? (
              <>
                <UserPlus size={20} style={{ color: 'var(--color-indigo)' }} />
                Add New Student
              </>
            ) : (
              <>
                <UserCheck size={20} style={{ color: 'var(--color-indigo)' }} />
                Edit Student Details
              </>
            )}
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
                Roll Number <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input mono"
                placeholder="e.g. CS2026001"
                required
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. student@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Semester</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="form-input"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : mode === 'add' ? 'Add Student' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
