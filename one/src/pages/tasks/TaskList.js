import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const fetchTasks = async () => {
        try {
            let url = '/tasks';
            if (search) url = `/tasks/search?title=${search}`;
            else if (statusFilter) url = `/tasks/search?status=${statusFilter}`;
            const response = await api.get(url);
            setTasks(response.data);
        } catch (err) {
            setError('Failed to load tasks');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [search, statusFilter]);

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
                <h2 style={styles.heading}>Tasks</h2>

                <div style={styles.filters}>
                    <input
                        style={styles.input}
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setStatusFilter('');
                        }}
                    />
                    <select
                        style={styles.input}
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setSearch('');
                        }}>
                        <option value="">All Statuses</option>
                        <option value="REPORTED">Reported</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        {user.role !== 'USER' && (
                            <>
                                <option value="PENDING_MATERIAL_APPROVAL">Pending Material</option>
                                <option value="COMPLETED_PENDING_CONFIRMATION">Pending Confirmation</option>
                            </>
                        )}
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                {tasks.length === 0 ? (
                    <p style={styles.empty}>No tasks found.</p>
                ) : (
                    <div style={styles.grid}>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                style={styles.card}
                                onClick={() => navigate(`/tasks/${task.taskCode}`)}>
                                <div style={styles.cardHeader}>
                                    <span style={styles.taskCode}>{task.taskCode}</span>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: statusColor(task.status)
                                    }}>
                                        {task.status}
                                    </span>
                                </div>
                                <p style={styles.taskName}>{task.taskName}</p>
                                <p style={styles.meta}>Asset: {task.assetName}</p>
                                <p style={styles.meta}>Reported by: {task.ReportedBy}</p>
                                <p style={styles.meta}>
                                    Assigned Tech: {task.AssignedTo || 'Unassigned'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '1100px',
        margin: '0 auto',
    },
    heading: {
        fontSize: '22px',
        marginBottom: '16px',
        color: '#616F84',
    },
    filters: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
    },
    input: {
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        minWidth: '200px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskCode: {
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace',
    },
    badge: {
        fontSize: '11px',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    taskName: {
        margin: 0,
        fontWeight: 'bold',
        fontSize: '15px',
        color: '#616F84',
    },
    meta: {
        margin: 0,
        fontSize: '13px',
        color: '#666',
    },
    error: {
        color: 'red',
        fontSize: '13px',
    },
    empty: {
        color: '#666',
        fontSize: '14px',
    },
};

export default TaskList;