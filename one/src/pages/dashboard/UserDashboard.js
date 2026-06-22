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

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2 style={styles.heading}>Welcome, {user.username}</h2>

                {/* ── Single Summary Card ── */}
                <div style={styles.summaryCard}>
                    <h3 style={styles.summaryTitle}>User Ticket Summary</h3>
                    <div style={styles.summaryStats}>
                        <p>Total Reported: <b>{tasks.length}</b></p>
                        <p>Completed: <b>{tasks.filter(t => t.status === 'COMPLETED' || t.status === 'CLOSED').length}</b></p>
                        <p>In Progress: <b>{tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CLOSED').length}</b></p>
                    </div>
                </div>

                {/* ── Action Buttons ── */}
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.actionButton}
                        onClick={() => navigate('/tasks/create')}>
                        + Raise New Ticket
                    </button>
                    <button
                        style={styles.actionButton}
                        onClick={() => navigate('/tasks')}>
                        View My Tickets
                    </button>
                </div>
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
    buttonContainer: {
        display: 'flex',
        gap: '16px',
    },
    actionButton: {
        flex: 1,
        padding: '20px',
        backgroundColor: '#917E71',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        textAlign: 'center',
    },
};

export default UserDashboard;