import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Folder, Users, ChevronRight, LayoutGrid, List, CheckSquare, Clock, AlertCircle, Search } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CreateProjectModal from '../components/CreateProjectModal';

interface Project {
  _id: string;
  name: string;
  description: string;
  admin: { name: string };
  members: string[];
  createdAt: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchDashboardData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const [projRes, statsRes] = await Promise.all([
        api.get('/api/projects', config),
        api.get('/api/tasks/stats', config),
      ]);
      setProjects(projRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <header className="flex justify-between items-center" style={{ margin: '3rem 0 2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}! Here's what's happening.</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary gap-2"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </header>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Tasks', value: stats.totalTasks, icon: <List size={20} />, color: 'var(--primary)' },
            { label: 'Completed', value: stats.completedTasks, icon: <CheckSquare size={20} />, color: 'var(--success)' },
            { label: 'In Progress', value: stats.inProgressTasks, icon: <Clock size={20} />, color: 'var(--warning)' },
            { label: 'Overdue', value: stats.overdueTasks, icon: <AlertCircle size={20} />, color: 'var(--error)' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="card glass"
              style={{ padding: '1.5rem', borderLeft: `4px solid ${stat.color}` }}
            >
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</span>
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Projects</h2>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            style={{ paddingLeft: '40px' }} 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center" style={{ padding: '4rem' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="card glass flex flex-col items-center justify-center" style={{ padding: '4rem', textAlign: 'center' }}>
          <Folder size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No projects found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0.5rem 0 1.5rem' }}>
            {searchTerm ? `No projects matching "${searchTerm}"` : (user?.role === 'Admin' 
              ? "You haven't created any projects yet. Start by creating your first one!"
              : "You aren't assigned to any projects yet.")}
          </p>
          {user?.role === 'Admin' && !searchTerm && (
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">Create First Project</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/project/${project._id}`} className="card glass flex flex-col gap-4 hover-card" style={{ height: '100%', display: 'flex' }}>
                <div className="flex justify-between items-start">
                  <div style={{ padding: '10px', background: 'var(--bg-subtle)', borderRadius: '10px', color: 'var(--primary)' }}>
                    <Folder size={20} />
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Users size={14} />
                    <span>{project.members.length + 1} members</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchDashboardData();
          }} 
        />
      )}

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
