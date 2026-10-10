import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import { providerApi } from '../api/providerApi';
import { Wrench, Zap, Sparkles, Tv, Hammer, Paintbrush, ShieldCheck, Clock, Award, Star, ArrowRight, Search, CheckCircle } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ICON_MAP = {
  Wrench: Wrench,
  Zap: Zap,
  Sparkles: Sparkles,
  Tv: Tv,
  Hammer: Hammer,
  Paintbrush: Paintbrush,
};

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [topProviders, setTopProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, provRes] = await Promise.all([
          categoryApi.getAll(),
          providerApi.getAllApproved(),
        ]);
        setCategories(catRes.data);
        setTopProviders(provRes.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
        <div className="badge badge-in_progress mb-2" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Smart Local Service Marketplace
        </div>
        <h1 style={{ fontSize: '3.2rem', lineHeight: 1.15, marginBottom: '1.5rem' }}>
          On-Demand Local Services, <br />
          <span className="text-gradient">Upfront Pricing & Verified Pros</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Book certified plumbers, electricians, cleaners, and repair experts near you. Submit service requests, get custom quotes, and track jobs in real time.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/services" className="btn btn-primary btn-lg">
            <Search size={20} />
            <span>Browse Services</span>
          </Link>
          <Link to="/register?role=PROVIDER" className="btn btn-secondary btn-lg">
            <BriefcaseIcon />
            <span>Become a Service Provider</span>
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid-3 mb-4" style={{ marginTop: '2rem' }}>
        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={26} color="var(--accent-primary)" />
          </div>
          <h3>Verified Professionals</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            All service providers undergo admin approval, background evaluation, and client review checks.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Award size={26} color="var(--accent-cyan)" />
          </div>
          <h3>Transparent Quotations</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            No hidden costs. Receive detailed price quotes directly from top providers before accepting any job.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Clock size={26} color="var(--accent-emerald)" />
          </div>
          <h3>Real-Time Tracking</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Follow your job status seamlessly: Request → Quote → Accepted → Work In Progress → Completed.
          </p>
        </div>
      </section>

      {/* Service Categories */}
      <section className="mt-4 mb-4">
        <div className="flex-between mb-4">
          <div>
            <h2>Explore Top Categories</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Browse services by industry specialization</p>
          </div>
          <Link to="/services" className="btn btn-outline btn-sm">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid-3">
            {categories.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || Wrench;
              return (
                <Link key={cat.id} to={`/services?categoryId=${cat.id}`} className="glass-card glass-card-interactive" style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComp size={26} color="#fff" />
                    </div>
                    <div>
                      <h4 style={{ color: '#fff' }}>{cat.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Service Providers */}
      {topProviders.length > 0 && (
        <section className="mt-4 mb-4">
          <div className="flex-between mb-4">
            <div>
              <h2>Top Rated Service Providers</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Experienced local specialists with proven customer satisfaction</p>
            </div>
            <Link to="/services" className="btn btn-outline btn-sm">
              <span>See Providers</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {topProviders.map((prov) => (
              <div key={prov.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4>{prov.businessName}</h4>
                    <p style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 500 }}>{prov.name} • {prov.city}</p>
                  </div>
                  <div className="badge badge-approved">Verified</div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '1rem 0', minHeight: '40px' }}>
                  {prov.bio}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <StarRating rating={prov.rating || 5.0} totalReviews={prov.totalReviews || 0} />
                  <Link to={`/providers/${prov.id}`} className="btn btn-secondary btn-sm">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Workflow Step Indicator */}
      <section className="glass-card mt-4 p-4" style={{ textAlign: 'center' }}>
        <h2 className="mb-2">How ServiceHub Works</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Get work done in 4 simple steps</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 700 }}>1</div>
            <h4>Submit Request</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Describe your issue, set preferred date and address.</p>
          </div>

          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-cyan)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 700 }}>2</div>
            <h4>Receive Quotes</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Approved providers respond with estimated costs & messages.</p>
          </div>

          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 700 }}>3</div>
            <h4>Accept & Confirm</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Select your preferred quote to create a confirmed booking.</p>
          </div>

          <div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-emerald)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 700 }}>4</div>
            <h4>Work Completed & Rate</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>Job is executed, marked finished, and reviewed.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);
