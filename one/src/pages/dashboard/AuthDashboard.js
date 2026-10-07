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

    const roleColors = {
        USER: '#5C6B7A',
        TECHNICIAN: '#7C5C8A',
        MANAGER: '#D97706',
        AUTH: '#C0392B',
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.pageHeader}>
                    <div>
                        <h2 style={styles.heading}>Admin Dashboard</h2>
                        <p style={styles.subheading}>Welcome back, <strong>{user.username}</strong></p>
                    </div>
                </div>

                {error && (
                    <div style={styles.errorBox}>
                        <span>⚠</span> {error}
                    </div>
                )}
                {success && (
                    <div style={styles.successBox}>
                        <span>✓</span> {success}
                    </div>
                )}

                {/* Users Section */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>Manage Users</h3>
                        <span style={styles.count}>{users.length}</span>
                    </div>
                    <div style={styles.card}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeaderRow}>
                                    <th style={styles.th}>Username</th>
                                    <th style={styles.th}>Current Role</th>
                                    <th style={styles.th}>Change Role</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.username} style={styles.tr}>
                                        <td style={styles.td}>
                                            <div style={styles.userCell}>
                                                <div style={styles.userAvatar}>{u.username.charAt(0).toUpperCase()}</div>
                                                <span style={styles.userName}>{u.username}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.rolePill,
                                                backgroundColor: `${roleColors[u.role]}18`,
                                                color: roleColors[u.role],
                                                borderColor: `${roleColors[u.role]}30`,
                                            }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <select
                                                style={styles.select}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.username, e.target.value)}
                                                disabled={u.username === user.username}>
                                                <option value="USER">User</option>
                                                <option value="TECHNICIAN">Technician</option>
                                                <option value="MANAGER">Manager</option>
                                                <option value="AUTH">Auth Admin</option>
                                            </select>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={{
                                                    ...styles.deleteButton,
                                                    opacity: u.username === user.username ? 0.35 : 1,
                                                    cursor: u.username === user.username ? 'not-allowed' : 'pointer',
                                                }}
                                                onClick={() => handleDeleteUser(u.username)}
                                                disabled={u.username === user.username}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tasks Overview */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>All System Tasks</h3>
                        <span style={styles.count}>{tasks.length}</span>
                    </div>
                    {tasks.length === 0 ? (
                        <p style={styles.empty}>No tasks in the system.</p>
                    ) : (
                        <div style={styles.taskList}>
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    style={styles.taskRow}
                                    onClick={() => navigate(`/tasks/${task.taskCode}`)}>
                                    <div style={styles.taskLeft}>
                                        <span style={styles.taskCode}>{task.taskCode}</span>
                                        <span style={styles.taskName}>{task.taskName}</span>
                                    </div>
                                    <span style={{ ...styles.badge, backgroundColor: statusColor(task.status) }}>
                                        {task.status.replace(/_/g, ' ')}
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
    page: { backgroundColor: '#F0EBE5', minHeight: '100vh' },
    container: { padding: '32px 36px', maxWidth: '960px', margin: '0 auto' },
    pageHeader: { marginBottom: '28px' },
    heading: { margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#2C3A47', letterSpacing: '-0.4px' },
    subheading: { margin: 0, fontSize: '14px', color: '#6B7280' },
    errorBox: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 16px', backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA', borderRadius: '8px',
        color: '#B91C1C', fontSize: '13px', marginBottom: '16px',
    },
    successBox: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 16px', backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0', borderRadius: '8px',
        color: '#166534', fontSize: '13px', marginBottom: '16px',
    },
    section: { marginBottom: '28px' },
    sectionHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' },
    sectionTitle: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#2C3A47' },
    count: {
        backgroundColor: '#F0EBE5', color: '#5C6B7A',
        fontSize: '12px', fontWeight: '700', padding: '2px 9px',
        borderRadius: '12px', border: '1px solid #E5E0DB',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
        border: '1px solid rgba(229,224,219,0.5)',
        overflow: 'hidden',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderRow: { backgroundColor: '#FAFAF9' },
    th: {
        textAlign: 'left',
        padding: '13px 18px',
        borderBottom: '1px solid #E5E0DB',
        color: '#6B7280',
        fontWeight: '600',
        fontSize: '12px',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    tr: { borderBottom: '1px solid #F5F3F0' },
    td: { padding: '13px 18px', color: '#2C3A47', fontSize: '14px' },
    userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
    userAvatar: {
        width: '28px', height: '28px', borderRadius: '50%',
        backgroundColor: '#E5E0DB', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: '600', color: '#5C6B7A',
    },
    userName: { fontWeight: '500' },
    rolePill: {
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '700',
        border: '1px solid transparent',
        letterSpacing: '0.3px',
    },
    select: {
        padding: '7px 10px',
        borderRadius: '6px',
        border: '1.5px solid #E5E0DB',
        fontSize: '13px',
        backgroundColor: '#FAFAF9',
        color: '#2C3A47',
    },
    deleteButton: {
        padding: '6px 14px',
        backgroundColor: 'transparent',
        color: '#C0392B',
        border: '1.5px solid #C0392B',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.15s ease',
    },
    taskList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    taskRow: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '14px 18px',
        boxShadow: '0 2px 6px rgba(44,58,71,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', border: '1px solid rgba(229,224,219,0.5)',
        transition: 'all 0.15s ease',
    },
    taskLeft: { display: 'flex', flexDirection: 'column', gap: '3px' },
    taskCode: { fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', fontWeight: '500', letterSpacing: '0.5px' },
    taskName: { fontSize: '14px', fontWeight: '600', color: '#2C3A47' },
    badge: {
        fontSize: '11px', color: 'white',
        padding: '3px 10px', borderRadius: '20px',
        fontWeight: '600', letterSpacing: '0.3px',
    },
    empty: { color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic' },
};

export default AuthDashboard;
