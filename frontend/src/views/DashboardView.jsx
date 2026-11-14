import React from 'react';
import {
  Users,
  CalendarCheck,
  Award,
  Layers,
  UserPlus,
  Eye,
  ArrowRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { DepartmentBarChart, AttendanceDonutChart, PerformanceChart } from '../components/Charts';

export default function DashboardView({
  students = [],
  attendance = [],
  marks = [],
  user,
  onNavigate,
  onOpenAddStudent,
  onOpenRecordAttendance,
  onOpenAddMarks,
  onViewStudent
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const totalStudents = students.length;

  const totalAttRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const attRate = totalAttRecords > 0 ? Math.round((presentCount / totalAttRecords) * 100) : 0;

  const totalMarksRecords = marks.length;
  const totalObtained = marks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
  const totalMax = marks.reduce((sum, m) => sum + (Number(m.maximum) || 100), 0);
  const avgScore = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

  const uniqueDepts = new Set(students.map(s => (s.department || '').toUpperCase()).filter(Boolean));
  const deptsCount = uniqueDepts.size;

  const recentStudents = [...students].slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Section */}
      <div className="welcome-hero">
        <div className="welcome-content">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 6px' }}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1>{greeting}, {user?.name || 'Admin'}</h1>
          <p style={{ maxWidth: '560px', marginTop: '8px', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Here's a quick look at your students, attendance records, and academic results.
          </p>
        </div>

        <div className="welcome-actions">
          <button type="button" className="btn btn-primary" onClick={onOpenAddStudent}>
            <UserPlus size={16} /> Add Student
          </button>
          <button type="button" className="btn btn-secondary" onClick={onOpenRecordAttendance}>
            <CalendarCheck size={16} /> Record Attendance
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          title="Students"
          value={totalStudents}
          icon={Users}
          color="indigo"
          meta={deptsCount > 0 ? `Across ${deptsCount} department${deptsCount === 1 ? '' : 's'}` : null}
        />

        <StatCard
          title="Attendance"
          value={totalAttRecords > 0 ? `${attRate}%` : '—'}
          icon={CalendarCheck}
          color="emerald"
          meta={totalAttRecords > 0 ? `${presentCount} present / ${totalAttRecords} total` : 'No records yet'}
        />

        <StatCard
          title="Avg. Score"
          value={totalMarksRecords > 0 ? `${avgScore}%` : '—'}
          icon={Award}
          color="cyan"
          meta={totalMarksRecords > 0 ? `${totalMarksRecords} assessment${totalMarksRecords === 1 ? '' : 's'} recorded` : 'No marks yet'}
        />

        <StatCard
          title="Departments"
          value={deptsCount || '—'}
          icon={Layers}
          color="violet"
          meta={deptsCount > 0 ? Array.from(uniqueDepts).slice(0, 3).join(', ') : 'No data'}
        />
      </div>

      {/* Charts */}
      <div className="dashboard-charts-grid">
        <DepartmentBarChart students={students} />
        <AttendanceDonutChart attendance={attendance} />
      </div>

      {/* Performance + Recent Students */}
      <div className="dashboard-main-grid">
        <PerformanceChart marks={marks} />

        {/* Recent Students */}
        <div className="glass-card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recent Students
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Latest enrollments
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('students')}
              style={{ fontSize: '0.825rem', padding: '5px 12px' }}
            >
              View all <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ flex: 1, padding: '10px 14px' }}>
            {recentStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No students yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentStudents.map((s) => (
                  <div
                    key={s._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      transition: 'background 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => onViewStudent(s)}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--table-row-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="user-avatar" style={{ width: '34px', height: '34px', fontSize: '0.8rem' }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} className="mono">
                          {s.rollNo} · {s.department}
                        </div>
                      </div>
                    </div>

                    <Eye size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
