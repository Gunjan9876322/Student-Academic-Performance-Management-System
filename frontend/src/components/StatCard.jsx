import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'indigo', meta }) {
  return (
    <div className="glass-card glass-card-hover stat-card">
      <div className="stat-header">
        <span className="stat-label">{title}</span>
        <div className={`glass-icon-box ${color}`}>
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-body">
        <span className="stat-value">{value}</span>
      </div>

      {meta && (
        <div className="stat-meta">
          <span>{meta}</span>
        </div>
      )}
    </div>
  );
}
