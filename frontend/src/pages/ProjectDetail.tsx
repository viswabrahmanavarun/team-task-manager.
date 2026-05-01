import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, CheckCircle2, Clock, AlertCircle, Calendar, MoreVertical, Trash2, Edit3, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CreateTaskModal from '../components/CreateTaskModal';
import AddMemberModal from '../components/AddMemberModal';

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  admin: Member;
  members: Member[];
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  dueDate: string;
  assignedTo: Member;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      const [projRes, tasksRes] = await Promise.all([
        axios.get(`http://localhost:5001/api/projects/${id}`, config),
        axios.get(`http://localhost:5001/api/tasks/project/${id}`, config),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching project data', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.put(`http://localhost:5001/api/tasks/${taskId}`, { status: newStatus }, config);
      fetchData();
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` },
      };
      await axios.delete(`http://localhost:5001/api/tasks/${taskId}`, config);
      fetchData();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const getUserColor = (id: string) => {
    const colors = [
      '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#475569'
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) return <div className="container flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!project) return null;

  const columns = [
    { title: 'To Do', icon: <Clock size={18} />, color: 'var(--text-muted)' },
    { title: 'In Progress', icon: <AlertCircle size={18} />, color: 'var(--warning)' },
    { title: 'Completed', icon: <CheckCircle2 size={18} />, color: 'var(--success)' },
  ];

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      <header style={{ margin: '3rem 0' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.5rem' }}>{project.name}</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>{project.description}</p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'Admin' && (
              <button onClick={() => setIsMemberModalOpen(true)} className="btn btn-secondary gap-2">
                <UserPlus size={18} />
                Manage Team
              </button>
            )}
            {user?.role === 'Admin' && (
              <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary gap-2">
                <Plus size={18} />
                Add Task
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '80px' }}>Admin:</span>
            <div className="flex items-center gap-2" style={{ background: 'var(--bg-subtle)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: getUserColor(project.admin._id), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'white' }}>
                {project.admin.name.charAt(0)}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{project.admin.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '80px' }}>Team:</span>
            <div className="flex flex-wrap gap-2">
              {project.members.length === 0 ? (
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No members added yet</span>
              ) : (
                project.members.map((m) => (
                  <div key={m._id} className="flex items-center gap-2" style={{ background: 'var(--bg-subtle)', padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: getUserColor(m._id), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'white' }}>
                      {m.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{m.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', minHeight: '60vh' }}>
        {columns.map((col) => (
          <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex items-center gap-2" style={{ padding: '0 0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: col.color }}>{col.icon}</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{col.title}</h3>
              <span style={{ marginLeft: 'auto', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {tasks.filter(t => t.status === col.title).length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
              {tasks.filter(t => t.status === col.title).map((task) => (
                <motion.div
                  key={task._id}
                  layoutId={task._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card glass"
                  style={{ padding: '1.25rem', cursor: 'default' }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{task.title}</h4>
                    <div className="flex gap-2">
                      <select 
                         value={task.status} 
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        disabled={user?.role !== 'Admin' && task.assignedTo?._id !== user?._id}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: (user?.role === 'Admin' || task.assignedTo?._id === user?._id) ? 'pointer' : 'default' }}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {user?.role === 'Admin' && (
                        <button onClick={() => deleteTask(task._id)} style={{ background: 'none', color: 'var(--error)', opacity: 0.6 }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    {task.assignedTo && (
                      <div title={`Assigned to ${task.assignedTo.name}`} style={{ width: '28px', height: '28px', borderRadius: '50%', background: getUserColor(task.assignedTo._id), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                        {task.assignedTo.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isTaskModalOpen && (
          <CreateTaskModal 
            projectId={id!}
            members={[project.admin, ...project.members]}
            onClose={() => setIsTaskModalOpen(false)}
            onSuccess={() => { setIsTaskModalOpen(false); fetchData(); }}
          />
        )}
        {isMemberModalOpen && (
          <AddMemberModal 
            project={project}
            onClose={() => setIsMemberModalOpen(false)}
            onSuccess={() => { setIsMemberModalOpen(false); fetchData(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
