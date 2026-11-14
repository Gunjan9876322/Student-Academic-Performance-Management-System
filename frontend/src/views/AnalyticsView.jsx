import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass
} from 'lucide-react';
import { DepartmentBarChart, AttendanceDonutChart, PerformanceChart } from '../components/Charts';

export default function AnalyticsView({
  students = [],
  attendance = [],
  marks = []
}) {
  // Aggregate stats by department
  const deptStats = students.reduce((acc, s) => {
    const dept = (s.department || 'Other').toUpperCase();
    if (!acc[dept]) {
      acc[dept] = {
        name: dept,
        studentIds: new Set(),
        students: []
      };
    }
    acc[dept].studentIds.add(String(s._id));
    acc[dept].students.push(s);
    return acc;
  }, {});

  // Compute attendance & marks per dept
  const deptReport = Object.values(deptStats).map((d) => {
    // Attendance for this dept
    const deptAtt = attendance.filter((a) => {
      const studentId = a.student?._id ? String(a.student._id) : String(a.student);
      return d.studentIds.has(studentId);
    });
    const attPresent = deptAtt.filter((a) => a.status === 'Present').length;
    const attPct = deptAtt.length > 0 ? Math.round((attPresent / deptAtt.length) * 100) : null;

    // Marks for this dept
    const deptMarks = marks.filter((m) => {
      const studentId = m.student?._id ? String(m.student._id) : String(m.student);
      return d.studentIds.has(studentId);
    });
    const obt = deptMarks.reduce((sum, m) => sum + (Number(m.obtained) || 0), 0);
    const max = deptMarks.reduce((sum, m) => sum + (Number(m.maximum) || 100), 0);
    const scorePct = max > 0 ? Math.round((obt / max) * 100) : null;

    return {
      department: d.name,
      studentCount: d.students.length,
      attendanceRate: attPct,
      averageScore: scorePct
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="glass-icon-box violet">
            <Compass size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Analytics Overview</h3>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Attendance and academic performance breakdown by department.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="dashboard-charts-grid">
        <DepartmentBarChart students={students} />
        <AttendanceDonutChart attendance={attendance} />
      </div>

      <PerformanceChart marks={marks} />

      {/* Department Comparative Table */}
      <div className="glass-card table-card">
        <div className="chart-header" style={{ padding: '18px 22px', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <div className="chart-title">
              <BarChart3 size={18} style={{ color: 'var(--color-indigo)' }} />
              Department Comparison
            </div>
            <div className="chart-subtitle">Attendance and scores across departments</div>
          </div>
          <span className="glass-badge indigo">{deptReport.length} Branches</span>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Enrolled Students</th>
                <th>Attendance</th>
                <th>Avg. Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deptReport.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No department data available
                  </td>
                </tr>
              ) : (
                deptReport.map((row) => (
                  <tr key={row.department}>
                    <td>
                      <span className="glass-badge indigo" style={{ fontSize: '0.875rem' }}>
                        {row.department}
                      </span>
                    </td>

                    <td style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {row.studentCount} {row.studentCount === 1 ? 'student' : 'students'}
                    </td>

                    <td>
                      {row.attendanceRate !== null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className={`glass-badge ${
                              row.attendanceRate >= 75 ? 'emerald' : row.attendanceRate >= 60 ? 'amber' : 'rose'
                            }`}
                          >
                            {row.attendanceRate}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No logs</span>
                      )}
                    </td>

                    <td>
                      {row.averageScore !== null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className={`glass-badge ${
                              row.averageScore >= 70 ? 'cyan' : row.averageScore >= 50 ? 'indigo' : 'rose'
                            }`}
                          >
                            {row.averageScore}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No marks</span>
                      )}
                    </td>

                    <td>
                      {row.attendanceRate && row.attendanceRate >= 75 && row.averageScore && row.averageScore >= 60 ? (
                        <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                          <CheckCircle2 size={16} /> On Track
                        </span>
                      ) : (
                        <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
                          <AlertTriangle size={16} /> Needs Attention
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
