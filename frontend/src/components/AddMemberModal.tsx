import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus, Search, Loader2, Check } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface AddMemberModalProps {
  project: any;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ project, onClose, onSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const { data } = await api.get(`/api/auth/search?q=${query}`, config);
      setResults(data);
    } catch (error) {
      console.error('Search error', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (userId: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await api.put(`/api/projects/${project._id}/members`, { userId }, config);
      onSuccess();
    } catch (error) {
      console.error('Add member error', error);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="card glass"
        style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 1001 }}
      >
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
              <UserPlus size={20} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add Team Members</h2>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', background: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
          {results.length > 0 ? (
            results.map((u) => {
              const isMember = project.members.some((m: any) => m._id === u._id) || project.admin._id === u._id;
              return (
                <div key={u._id} className="flex items-center justify-between p-3" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </div>
                  {isMember ? (
                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <Check size={14} /> Member
                    </span>
                  ) : (
                    <button 
                      onClick={() => addMember(u._id)}
                      className="btn-secondary" 
                      style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })
          ) : query && !loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No users found</div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default AddMemberModal;
