import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const statusColor = (status) => {
    const colors = {
        REPORTED:                      '#D97706',
        ASSIGNED:                      '#6D5F54',
        IN_PROGRESS:                   '#7C5C8A',
        PENDING_MATERIAL_APPROVAL:     '#C0392B',
        COMPLETED_PENDING_CONFIRMATION:'#C2710C',
        COMPLETED:                     '#147A5E',
    };
    return colors[status] || '#6B7280';
};

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/tasks').then(res => setTasks(res.data));
    }, []);

    const assignedTasks   = tasks.filter(t => t.status === 'ASSIGNED');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const pendingMaterial = tasks.filter(t => t.status === 'PENDING_MATERIAL_APPROVAL');

    const stats = [
        { label: 'Assigned to Me', value: assignedTasks.length,   color: '#6D5F54' },
        { label: 'In Progress',     value: inProgressTasks.length, color: '#7C5C8A' },
        { label: 'Awaiting Materials', value: pendingMaterial.length, color: '#C0392B' },
    ];

    const TaskSection = ({ title, taskList, emptyMsg }) => (
        <div style={styles.section}>
            <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}>{title}</h3>
                <span style={styles.count}>{taskList.length}</span>
            </div>
            {taskList.length === 0 ? (
                <p style={styles.empty}>{emptyMsg}</p>
            ) : (
                <div style={styles.taskList}>
                    {taskList.map(task => (
                        <div
                            key={task.id}
                            style={styles.taskRow}
                            onClick={() => navigate(`/tasks/${task.taskCode}`)}>
                            <div style={styles.taskLeft}>
                                <span style={styles.taskCode}>{task.taskCode}</span>
                                <span style={styles.taskName}>{task.taskName}</span>
                                <span style={styles.asset}>{task.assetName}</span>
                            </div>
                            <span style={{ ...styles.badge, backgroundColor: statusColor(task.status) }}>
                                {task.status.replace(/_/g, ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.pageHeader}>
                    <div>
                        <h2 style={styles.heading}>Technician Dashboard</h2>
                        <p style={styles.subheading}>Welcome back, <strong>{user.username}</strong></p>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    {stats.map(s => (
                        <div key={s.label} style={styles.statCard}>
                            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                            <div style={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                <TaskSection title="Assigned to Me"           taskList={assignedTasks}   emptyMsg="No tasks assigned yet." />
                <TaskSection title="In Progress"              taskList={inProgressTasks} emptyMsg="No tasks in progress." />
                <TaskSection title="Awaiting Material Approval" taskList={pendingMaterial} emptyMsg="No pending material requests." />
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F0EBE5', minHeight: '100vh' },
    container: { padding: '32px 36px', maxWidth: '960px', margin: '0 auto' },
    pageHeader: { marginBottom: '28px' },
    heading: { margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#2C3A47', letterSpacing: '-0.4px' },
    subheading: { margin: 0, fontSize: '14px', color: '#6B7280' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
        border: '1px solid rgba(229,224,219,0.5)',
    },
    statValue: { fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', marginBottom: '4px' },
    statLabel: { fontSize: '13px', color: '#6B7280', fontWeight: '500' },
    section: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
        marginBottom: '16px',
        border: '1px solid rgba(229,224,219,0.5)',
    },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
    sectionTitle: { margin: 0, fontSize: '15px', fontWeight: '600', color: '#2C3A47' },
    count: {
        backgroundColor: '#F0EBE5',
        color: '#5C6B7A',
        fontSize: '12px',
        fontWeight: '700',
        padding: '2px 9px',
        borderRadius: '12px',
        border: '1px solid #E5E0DB',
    },
    taskList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    taskRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #F0EBE5',
        cursor: 'pointer',
        backgroundColor: '#FAFAF9',
        transition: 'all 0.15s ease',
    },
    taskLeft: { display: 'flex', flexDirection: 'column', gap: '2px' },
    taskCode: { fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', fontWeight: '500', letterSpacing: '0.5px' },
    taskName: { fontSize: '14px', fontWeight: '600', color: '#2C3A47' },
    asset: { fontSize: '12px', color: '#6B7280' },
    badge: {
        fontSize: '11px',
        color: 'white',
        padding: '3px 10px',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
        fontWeight: '600',
        letterSpacing: '0.3px',
    },
    empty: { color: '#9CA3AF', fontSize: '13px', margin: 0, fontStyle: 'italic' },
};

export default TechnicianDashboard;