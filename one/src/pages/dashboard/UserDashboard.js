import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/tasks').then(res => setTasks(res.data));
    }, []);

    const completed = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'CLOSED').length;
    const active = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CLOSED').length;

    const stats = [
        { label: 'Total Reported', value: tasks.length, icon: '📋', color: '#5C6B7A' },
        { label: 'Active', value: active, icon: '⚙', color: '#D97706' },
        { label: 'Completed', value: completed, icon: '✓', color: '#059669' },
    ];

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.pageHeader}>
                    <div>
                        <h2 style={styles.heading}>Dashboard</h2>
                        <p style={styles.subheading}>Welcome back, <strong>{user.username}</strong></p>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={styles.statsGrid}>
                    {stats.map(s => (
                        <div key={s.label} style={styles.statCard}>
                            <div style={{ ...styles.statIcon, color: s.color }}>{s.icon}</div>
                            <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
                            <div style={styles.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={styles.actionsSection}>
                    <h3 style={styles.sectionTitle}>Quick Actions</h3>
                    <div style={styles.actionGrid}>
                        <button style={styles.actionCard} onClick={() => navigate('/tasks/create')}>
                            <span style={styles.actionIcon}>+</span>
                            <div>
                                <div style={styles.actionTitle}>Raise New Ticket</div>
                                <div style={styles.actionDesc}>Report a new maintenance issue</div>
                            </div>
                        </button>
                        <button style={{ ...styles.actionCard, ...styles.actionCardSecondary }} onClick={() => navigate('/tasks')}>
                            <span style={styles.actionIcon}>☰</span>
                            <div>
                                <div style={styles.actionTitle}>View My Tickets</div>
                                <div style={styles.actionDesc}>Track all your reported issues</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        backgroundColor: '#F0EBE5',
        minHeight: '100vh',
    },
    container: {
        padding: '32px 36px',
        maxWidth: '960px',
        margin: '0 auto',
    },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '28px',
    },
    heading: {
        margin: '0 0 4px 0',
        fontSize: '24px',
        fontWeight: '700',
        color: '#2C3A47',
        letterSpacing: '-0.4px',
    },
    subheading: {
        margin: 0,
        fontSize: '14px',
        color: '#6B7280',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px',
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px 20px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        border: '1px solid rgba(229,224,219,0.5)',
    },
    statIcon: {
        fontSize: '22px',
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '700',
        lineHeight: 1,
        letterSpacing: '-1px',
    },
    statLabel: {
        fontSize: '13px',
        color: '#6B7280',
        fontWeight: '500',
    },
    actionsSection: {
        marginBottom: '24px',
    },
    sectionTitle: {
        margin: '0 0 16px 0',
        fontSize: '15px',
        fontWeight: '600',
        color: '#2C3A47',
        letterSpacing: '-0.1px',
    },
    actionGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
    },
    actionCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '22px 24px',
        backgroundColor: '#5C6B7A',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(92,107,122,0.25)',
    },
    actionCardSecondary: {
        backgroundColor: '#8C7B6E',
        boxShadow: '0 2px 8px rgba(140,123,110,0.25)',
    },
    actionIcon: {
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
    },
    actionTitle: {
        fontSize: '15px',
        fontWeight: '600',
        marginBottom: '3px',
    },
    actionDesc: {
        fontSize: '12.5px',
        opacity: 0.75,
    },
};

export default UserDashboard;