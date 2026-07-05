import React from 'react';

export const StatCard = ({ icon, label, value, color, bg }) => (
  <div
    className="glass-panel"
    style={{
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
      minWidth: '140px',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { size: 22, color })}
    </div>
    <div>
      <div style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
        {label}
      </div>
    </div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const config = {
    pending:   { bg: 'rgba(245,158,11,0.12)', color: '#d97706', label: '⏳ Pending' },
    approved:  { bg: 'rgba(16,185,129,0.12)', color: '#059669', label: '✅ Approved' },
    cancelled: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: '❌ Cancelled' },
    completed: { bg: 'rgba(14,165,233,0.12)', color: '#0284c7', label: '🏁 Completed' },
  };
  const c = config[status] || config.pending;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        background: c.bg,
        color: c.color,
        fontFamily: 'var(--font-heading)',
      }}
    >
      {c.label}
    </span>
  );
};
