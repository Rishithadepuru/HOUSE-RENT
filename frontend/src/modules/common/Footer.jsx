import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '64px 0 24px 0',
      transition: 'background var(--transition-normal)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '48px'
        }} className="footer-grid">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                H
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>
                House<span style={{ color: 'var(--primary)' }}>Hunt</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '320px' }}>
              Find, rent, or buy your next dream home. HouseHunt delivers a premium real estate browsing experience with full transparency and verified listings.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="#" className="theme-toggle-btn" style={{ width: '36px', height: '36px' }}><Twitter size={16} /></a>
              <a href="#" className="theme-toggle-btn" style={{ width: '36px', height: '36px' }}><Facebook size={16} /></a>
              <a href="#" className="theme-toggle-btn" style={{ width: '36px', height: '36px' }}><Github size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Link to="#" style={{ hover: 'color: var(--primary)' }}>About Us</Link>
              <Link to="#" style={{ hover: 'color: var(--primary)' }}>Our Services</Link>
              <Link to="#" style={{ hover: 'color: var(--primary)' }}>Careers</Link>
              <Link to="#" style={{ hover: 'color: var(--primary)' }}>Press Kit</Link>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Discover
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Link to="/search?city=mumbai">Mumbai Listings</Link>
              <Link to="/search?city=bangalore">Bangalore Villas</Link>
              <Link to="/search?city=delhi">Delhi Studios</Link>
              <Link to="/search">All Properties</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <Link to="#">Help Center</Link>
              <Link to="#">Safety Guidelines</Link>
              <Link to="#">Terms of Service</Link>
              <Link to="#">Privacy Policy</Link>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)', marginBottom: '24px' }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }} className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} HouseHunt Inc. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} style={{ color: 'var(--danger)', fill: 'var(--danger)' }} /> for premium real estate management.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
