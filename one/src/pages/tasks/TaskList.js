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

const statusLabel = (s) => s.replace(/_/g, ' ');

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, statusFilter]);

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.pageHeader}>
                    <div>
                        <h2 style={styles.heading}>Tasks</h2>
                        <p style={styles.subheading}>{tasks.length} task{tasks.length !== 1 ? 's' : ''} found</p>
                    </div>
                    {user.role === 'USER' && (
                        <button style={styles.newButton} onClick={() => navigate('/tasks/create')}>
                            + Report Issue
                        </button>
                    )}
                </div>

                <div style={styles.filters}>
                    <div style={styles.searchWrapper}>
                        <span style={styles.searchIcon}>⌕</span>
                        <input
                            style={styles.searchInput}
                            placeholder="Search by title…"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setStatusFilter('');
                            }}
                        />
                    </div>
                    <select
                        style={styles.select}
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

                {error && <div style={styles.errorBox}>⚠ {error}</div>}

                {tasks.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📭</div>
                        <p style={styles.emptyText}>No tasks found</p>
                        <p style={styles.emptySubtext}>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                style={styles.card}
                                onClick={() => navigate(`/tasks/${task.taskCode}`)}>
                                <div style={styles.cardTop}>
                                    <span style={styles.taskCode}>{task.taskCode}</span>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: statusColor(task.status),
                                    }}>
                                        {statusLabel(task.status)}
                                    </span>
                                </div>
                                <p style={styles.taskName}>{task.taskName}</p>
                                <div style={styles.cardMeta}>
                                    <span style={styles.metaItem}>🔧 {task.assetName}</span>
                                    <span style={styles.metaItem}>👤 {task.ReportedBy}</span>
                                    <span style={styles.metaItem}>
                                        ⚙ {task.AssignedTo || 'Unassigned'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F0EBE5', minHeight: '100vh' },
    container: { padding: '32px 36px', maxWidth: '1140px', margin: '0 auto' },
    pageHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '24px',
    },
    heading: { margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#2C3A47', letterSpacing: '-0.4px' },
    subheading: { margin: 0, fontSize: '13px', color: '#9CA3AF' },
    newButton: {
        padding: '10px 18px',
        backgroundColor: '#5C6B7A',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(92,107,122,0.25)',
    },
    filters: { display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' },
    searchWrapper: { position: 'relative', flex: 1, maxWidth: '360px' },
    searchIcon: {
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        color: '#9CA3AF', fontSize: '18px', lineHeight: 1,
    },
    searchInput: {
        paddingLeft: '38px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px',
        borderRadius: '8px', border: '1.5px solid #E5E0DB',
        fontSize: '14px', backgroundColor: 'white', color: '#2C3A47',
        width: '100%', boxSizing: 'border-box',
    },
    select: {
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1.5px solid #E5E0DB',
        fontSize: '14px',
        backgroundColor: 'white',
        color: '#2C3A47',
        minWidth: '180px',
    },
    errorBox: {
        padding: '10px 16px', backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA', borderRadius: '8px',
        color: '#B91C1C', fontSize: '13px', marginBottom: '16px',
    },
    emptyState: {
        textAlign: 'center', padding: '60px 20px',
        backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
    },
    emptyIcon: { fontSize: '40px', marginBottom: '12px' },
    emptyText: { margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#374151' },
    emptySubtext: { margin: 0, fontSize: '13px', color: '#9CA3AF' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        border: '1px solid rgba(229,224,219,0.5)',
        transition: 'all 0.15s ease',
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    taskCode: { fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace', fontWeight: '500', letterSpacing: '0.5px' },
    badge: {
        fontSize: '11px', color: 'white',
        padding: '3px 9px', borderRadius: '20px',
        fontWeight: '600', letterSpacing: '0.2px', whiteSpace: 'nowrap',
    },
    taskName: { margin: 0, fontWeight: '700', fontSize: '15px', color: '#2C3A47', lineHeight: '1.4' },
    cardMeta: { display: 'flex', flexDirection: 'column', gap: '3px' },
    metaItem: { fontSize: '12px', color: '#6B7280' },
};

export default TaskList;