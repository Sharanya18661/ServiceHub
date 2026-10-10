import React from 'react';
import { Wrench, Heart, Shield, Award, Clock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="logo mb-2" style={{ fontSize: '1.25rem' }}>
            <Wrench size={22} />
            <span>ServiceHub</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Smart Local Service Management Platform. Connecting homeowners and businesses with vetted, reliable, top-rated local professionals.
          </p>
        </div>

        <div>
          <h4 className="mb-2">Services</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li>Plumbing & Leak Repairs</li>
            <li>Electrical & Wiring</li>
            <li>Home Deep Cleaning</li>
            <li>Appliance Maintenance</li>
            <li>Carpentry & Finishing</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2">Platform Guarantee</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} style={{ color: 'var(--accent-emerald)' }} />
              <span>100% Verified Service Providers</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={16} style={{ color: 'var(--accent-amber)' }} />
              <span>Transparent Upfront Quotes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: 'var(--accent-cyan)' }} />
              <span>Real-time Status Tracking</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2.5rem', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} ServiceHub Platform. All rights reserved. Powered by Spring Boot 3 & React.
      </div>
    </footer>
  );
};
