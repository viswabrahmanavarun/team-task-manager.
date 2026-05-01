import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Shield, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Member' | 'Admin'>('Member');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
        role,
      });
      login(data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)', padding: '2rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card glass flex" 
        style={{ width: '100%', maxWidth: '1200px', padding: 0, overflow: 'hidden', border: '1px solid var(--glass-border)' }}
      >
        {/* Left Side: Image */}
        <div className="auth-image-side" style={{ flex: 1.2, position: 'relative', minHeight: '750px' }}>
          <img 
            src="/auth-bg.png" 
            alt="Team Working" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.2), rgba(0,0,0,0.6))' }}></div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', color: 'white', textAlign: 'center' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>Empower Your Workflow.</h2>
            <p style={{ fontSize: '1.5rem', opacity: 0.9, fontWeight: 500 }}>Create your account and start collaborating with your team today.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex items-center justify-center" style={{ padding: '3rem' }}>
          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div className="flex flex-col items-center gap-3" style={{ marginBottom: '2rem' }}>
              <div style={{ padding: '16px', background: 'var(--bg-subtle)', borderRadius: '16px', color: 'var(--primary)' }}>
                <UserPlus size={32} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Join the Team</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Create your account to start managing tasks</p>
            </div>

            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: '12px', color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px' }}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px' }}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <div style={{ position: 'relative' }}>
                  <Shield size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <select
                    className="form-input"
                    style={{ paddingLeft: '44px', height: '48px', appearance: 'none' }}
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                  >
                    <option value="Member">Team Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', marginTop: '1rem' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 1024px) {
          .auth-image-side { display: none !important; }
          .card.glass.flex { max-width: 500px !important; }
        }
      `}</style>
    </div>
  );
};

export default Signup;
