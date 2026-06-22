import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const AuthDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load users');
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks/all');
            setTasks(response.data);
        } catch (err) {
            setError('Failed to load tasks');
        }
    };

    const handleRoleChange = async (username, newRole) => {
        try {
            await api.put(`/auth/users/${username}/role?role=${newRole}`);
            setSuccess(`Role for ${username} updated successfully!`);
            setError('');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`Failed to update role for ${username}`);
            setSuccess('');
        }
    };

    const handleDeleteUser = async (username) => {
        if (!window.confirm(`Are you sure you want to delete ${username}?`)) return;
        try {
            await api.delete(`/auth/users/${username}`);
            setSuccess(`User ${username} deleted successfully!`);
            setError('');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(`Failed to delete user ${username}. They might have existing tasks.`);
            setSuccess('');
        }
    };

    const statusColor = (status) => {
        const colors = {
            REPORTED: '#f59e0b',
            ASSIGNED: '#3b82f6',
            IN_PROGRESS: '#8b5cf6',
            PENDING_MATERIAL_APPROVAL: '#ef4444',
            COMPLETED_PENDING_CONFIRMATION: '#f97316',
            COMPLETED: '#10b981',
        };
        return colors[status] || '#666';
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <h2 style={styles.heading}>Admin Dashboard</h2>
                <p style={styles.subtitle}>Welcome, {user.username}</p>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Manage Users</h3>
                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Username</th>
                                    <th style={styles.th}>Current Role</th>
                                    <th style={styles.th}>Action</th>
                                    <th style={styles.th}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.username}>
                                        <td style={styles.td}>{u.username}</td>
                                        <td style={styles.td}>{u.role}</td>
                                        <td style={styles.td}>
                                            <select
                                                style={styles.select}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.username, e.target.value)}
                                                disabled={u.username === user.username}
                                            >
                                                <option value="USER">User</option>
                                                <option value="TECHNICIAN">Technician</option>
                                                <option value="MANAGER">Manager</option>
                                                <option value="AUTH">Auth Admin</option>
                                            </select>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => handleDeleteUser(u.username)}
                                                disabled={u.username === user.username}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>All System Tasks</h3>
                    {tasks.length === 0 ? (
                        <p style={styles.empty}>No tasks in the system.</p>
                    ) : (
                        <div style={styles.list}>
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    style={styles.taskRow}
                                    onClick={() => navigate(`/tasks/${task.taskCode}`)}>
                                    <div style={styles.taskLeft}>
                                        <span style={styles.taskCode}>{task.taskCode}</span>
                                        <span style={styles.taskName}>{task.taskName}</span>
                                    </div>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: statusColor(task.status)
                                    }}>
                                        {task.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
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
        margin: 0,
    },
    subtitle: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '20px',
    },
    section: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '18px',
        color: '#616F84',
        marginBottom: '12px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '1px solid #ddd',
        color: '#616F84',
        fontWeight: 'bold',
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        color: '#333',
    },
    select: {
        padding: '6px 10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    deleteButton: {
        padding: '6px 12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px',
    },
    success: {
        color: 'green',
        fontSize: '14px',
        marginBottom: '10px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    taskRow: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '14px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    taskLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
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
    badge: {
        fontSize: '11px',
        color: 'white',
        padding: '3px 10px',
        borderRadius: '12px',
    },
    empty: {
        color: '#666',
        fontSize: '14px',
    },
};

export default AuthDashboard;
