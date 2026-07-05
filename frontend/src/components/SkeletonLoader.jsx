import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="glass-card" style={{ height: '420px', pointerEvents: 'none' }}>
      <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: '0' }} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="skeleton" style={{ height: '24px', width: '70%' }} />
        <div className="skeleton" style={{ height: '16px', width: '40%' }} />
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <div className="skeleton" style={{ height: '16px', width: '20%' }} />
          <div className="skeleton" style={{ height: '16px', width: '20%' }} />
          <div className="skeleton" style={{ height: '16px', width: '20%' }} />
        </div>
        <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: '28px', width: '35%' }} />
          <div className="skeleton" style={{ height: '36px', width: '25%', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
};

export const PropertyDetailsSkeleton = () => {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="skeleton" style={{ height: '40px', width: '50%' }} />
        <div className="skeleton" style={{ height: '20px', width: '30%' }} />
        <div className="skeleton" style={{ height: '450px', width: '100%', borderRadius: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="skeleton" style={{ height: '150px', width: '100%' }} />
            <div className="skeleton" style={{ height: '200px', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: '36px', width: '30%' }} />
        <div className="skeleton" style={{ height: '44px', width: '15%', borderRadius: '8px' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />
        <div className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />
      </div>
      <div className="skeleton" style={{ height: '350px', width: '100%', borderRadius: '12px' }} />
    </div>
  );
};
