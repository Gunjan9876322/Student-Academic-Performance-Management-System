import React, { useState } from 'react';
import { BarChart2, PieChart, TrendingUp } from 'lucide-react';

export function DepartmentBarChart({ students = [] }) {
  const [hoveredDept, setHoveredDept] = useState(null);

  // Group students by department
  const counts = students.reduce((acc, s) => {
    const dept = (s.department || 'Other').toUpperCase();
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([name, count]) => ({ name, count }));
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="glass-card chart-container">
      <div className="chart-header">
        <div>
          <div className="chart-title">
            <BarChart2 size={20} style={{ color: 'var(--color-indigo)' }} />
            Students by Department
          </div>
          <div className="chart-subtitle">Enrollment across departments</div>
        </div>
        <span className="glass-badge indigo">{data.length} Depts</span>
      </div>

      <div className="chart-body">
        {data.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No department data available
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.map((item) => {
              const pct = Math.round((item.count / maxCount) * 100);
              const isHovered = hoveredDept === item.name;

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredDept(item.name)}
                  onMouseLeave={() => setHoveredDept(null)}
                  style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.925rem' }}>
                    <span style={{ fontWeight: 600, color: isHovered ? 'var(--color-indigo)' : 'var(--text-primary)' }}>
                      {item.name}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {item.count} {item.count === 1 ? 'student' : 'students'} ({Math.round((item.count / students.length) * 100)}%)
                    </span>
                  </div>

                  <div
                    style={{
                      height: '11px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        borderRadius: '9999px',
                        background: isHovered
                          ? 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)'
                          : 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)',
                        boxShadow: isHovered ? '0 0 12px rgba(99, 102, 241, 0.5)' : 'none',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function AttendanceDonutChart({ attendance = [] }) {
  const total = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = total - presentCount;
  const presentPct = total > 0 ? Math.round((presentCount / total) * 100) : 0;
  const absentPct = total > 0 ? 100 - presentPct : 0;

  // SVG circle calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (presentPct / 100) * circumference;

  return (
    <div className="glass-card chart-container">
      <div className="chart-header">
        <div>
          <div className="chart-title">
            <PieChart size={20} style={{ color: 'var(--color-emerald)' }} />
            Attendance Ratio
          </div>
          <div className="chart-subtitle">Class attendance breakdown</div>
        </div>
        <span className={`glass-badge ${presentPct >= 75 ? 'emerald' : presentPct >= 60 ? 'amber' : 'rose'}`}>
          {total > 0 ? `${presentPct}% Overall` : 'No Data'}
        </span>
      </div>

      <div className="chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '34px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px' }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="rgba(244, 63, 94, 0.2)"
              strokeWidth="14"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="url(#emeraldGrad)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={total > 0 ? strokeDashoffset : circumference}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <span style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {total > 0 ? `${presentPct}%` : '0%'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
              Present
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>Present</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {presentCount} records ({presentPct}%)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: '#f43f5e', boxShadow: '0 0 8px rgba(244, 63, 94, 0.4)' }} />
            <div>
              <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>Absent</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {absentCount} records ({absentPct}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PerformanceChart({ marks = [] }) {
  // Categorize scores into grade brackets
  const brackets = {
    'A+ (90-100%)': 0,
    'A (80-89%)': 0,
    'B (70-79%)': 0,
    'C (60-69%)': 0,
    'D (40-59%)': 0,
    'F (<40%)': 0
  };

  marks.forEach(m => {
    const max = Number(m.maximum) || 100;
    const obt = Number(m.obtained) || 0;
    const pct = (obt / max) * 100;

    if (pct >= 90) brackets['A+ (90-100%)']++;
    else if (pct >= 80) brackets['A (80-89%)']++;
    else if (pct >= 70) brackets['B (70-79%)']++;
    else if (pct >= 60) brackets['C (60-69%)']++;
    else if (pct >= 40) brackets['D (40-59%)']++;
    else brackets['F (<40%)']++;
  });

  const total = marks.length;
  const entries = Object.entries(brackets);
  const maxBracketCount = Math.max(...Object.values(brackets), 1);

  return (
    <div className="glass-card chart-container">
      <div className="chart-header">
        <div>
          <div className="chart-title">
            <TrendingUp size={20} style={{ color: 'var(--color-cyan)' }} />
            Grade Distribution
          </div>
          <div className="chart-subtitle">Scores categorized by grade tiers</div>
        </div>
        <span className="glass-badge cyan">{total} Entries</span>
      </div>

      <div className="chart-body">
        {total === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            No marks recorded yet
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(85px, 1fr))', gap: '14px', alignItems: 'flex-end', minHeight: '160px', paddingTop: '20px' }}>
            {entries.map(([label, count]) => {
              const heightPct = (count / maxBracketCount) * 100;
              const isPassing = !label.startsWith('F');

              return (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {count}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '46px',
                      height: '110px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: `${Math.max(heightPct, 6)}%`,
                        borderRadius: '6px 6px 0 0',
                        background: isPassing
                          ? 'linear-gradient(180deg, #06b6d4 0%, #6366f1 100%)'
                          : 'linear-gradient(180deg, #f43f5e 0%, #be123c 100%)',
                        boxShadow: isPassing ? '0 0 10px rgba(6, 182, 212, 0.3)' : '0 0 10px rgba(244, 63, 94, 0.3)',
                        transition: 'height 0.4s ease'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
