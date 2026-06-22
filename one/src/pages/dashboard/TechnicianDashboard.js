import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const TechnicianDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/tasks').then(res => setTasks(res.data));
    }, []);

    const assignedTasks = tasks.filter(t => t.status === 'ASSIGNED');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const pendingMaterial = tasks.filter(
        t => t.status === 'PENDING_MATERIAL_APPROVAL'
    );

    const statusColor = (status) => {
        const colors = {
            ASSIGNED: '#3b82f6',
            IN_PROGRESS: '#8b5cf6',
            PENDING_MATERIAL_APPROVAL: '#ef4444',
            COMPLETED_PENDING_CONFIRMATION: '#f97316',
            COMPLETED: '#10b981',
        };
        return colors[status] || '#666';
    };

    const TaskSection = ({ title, taskList, emptyMsg }) => (
        <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
                {title}
                <span style={styles.count}>{taskList.length}</span>
            </h3>
            {taskList.length === 0 ? (
                <p style={styles.empty}>{emptyMsg}</p>
            ) : (
                taskList.map(task => (
                    <div
                        key={task.id}
                        style={styles.taskRow}
                        onClick={() => navigate(`/tasks/${task.taskCode}`)}>
                        <div style={styles.taskLeft}>
                            <span style={styles.taskCode}>{task.taskCode}</span>
                            <span style={styles.taskName}>{task.taskName}</span>
                            <span style={styles.asset}>{task.assetName}</span>
                        </div>
                        <span style={{
                            ...styles.badge,
                            backgroundColor: statusColor(task.status)
                        }}>
                            {task.status}
                        </span>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2 style={styles.heading}>Technician Dashboard</h2>
                <p style={styles.subtitle}>Welcome, {user.username}</p>

                {/* ── Summary ── */}
                <div style={styles.summaryCard}>
                    <h3 style={styles.summaryTitle}>Technician Ticket Summary</h3>
                    <div style={styles.summaryStats}>
                        <p>Assigned: <b>{assignedTasks.length}</b></p>
                        <p>In Progress: <b>{inProgressTasks.length}</b></p>
                        <p>Awaiting Materials: <b>{pendingMaterial.length}</b></p>
                    </div>
                </div>

                <TaskSection
                    title="Assigned to Me"
                    taskList={assignedTasks}
                    emptyMsg="No tasks assigned yet."
                />
                <TaskSection
                    title="In Progress"
                    taskList={inProgressTasks}
                    emptyMsg="No tasks in progress."
                />
                <TaskSection
                    title="Awaiting Material Approval"
                    taskList={pendingMaterial}
                    emptyMsg="No pending material requests."
                />
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '900px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '22px',
        color: '#616F84',
        margin: 0,
    },
    subtitle: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '20px',
    },
    summaryCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '32px',
    },
    summaryTitle: {
        margin: '0 0 16px 0',
        fontSize: '18px',
        color: '#616F84',
    },
    summaryStats: {
        display: 'flex',
        gap: '24px',
        color: '#555',
        fontSize: '15px',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: '16px',
    },
    sectionTitle: {
        fontSize: '15px',
        color: '#616F84',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    count: {
        backgroundColor: '#917E71',
        color: 'white',
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    taskRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: '6px',
        border: '1px solid #f0f0f0',
        marginBottom: '8px',
        cursor: 'pointer',
    },
    taskLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    taskCode: {
        fontSize: '11px',
        color: '#999',
        fontFamily: 'monospace',
    },
    taskName: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#616F84',
    },
    asset: {
        fontSize: '12px',
        color: '#888',
    },
    badge: {
        fontSize: '11px',
        color: 'white',
        padding: '3px 10px',
        borderRadius: '12px',
        whiteSpace: 'nowrap',
    },
    empty: {
        color: '#999',
        fontSize: '13px',
        margin: 0,
    },
};

export default TechnicianDashboard;