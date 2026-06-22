import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const TaskDetail = () => {
    const { taskCode } = useParams();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [materialRequests, setMaterials] = useState([]);
    const [error, setError] = useState('');
    const [techUsername, setTechUsername] = useState('');
    const [techWorkloads, setTechWorkloads] = useState([]);
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [materialForm, setMaterialForm] = useState({
        materialName: '',
        description: ''
    });

    const fetchTask = async () => {
        try {
            const res = await api.get(`/tasks/${taskCode}`);
            setTask(res.data);
        } catch (err) {
            setError('Failed to load task');
        }
    };

    const fetchMaterialRequests = async () => {
        try {
            const res = await api.get(`/materials/${taskCode}`);
            setMaterials(res.data);
        } catch (err) {}
    };

    useEffect(() => {
        fetchTask();
        fetchMaterialRequests();
        if (user.role === 'MANAGER') {
            api.get('/auth/technicians/workload').then(res => setTechWorkloads(res.data)).catch(console.error);
        }
    }, [taskCode]);

    // ── Actions ──────────────────────────────────────────

    const handleAssign = async () => {
        try {
            await api.put(`/tasks/${taskCode}/assign?technicianUsername=${techUsername}`);
            fetchTask();
        } catch (err) {
            setError('Failed to assign task');
        }
    };

    const handlePickUp = async () => {
        try {
            await api.put(`/tasks/${taskCode}/pickup`);
            fetchTask();
        } catch (err) {
            setError('Failed to pick up task');
        }
    };

    const handleMarkDone = async () => {
        try {
            await api.put(`/tasks/${taskCode}/done`);
            fetchTask();
        } catch (err) {
            setError('Failed to mark task done');
        }
    };

    const handleConfirm = async () => {
        try {
            await api.put(`/tasks/${taskCode}/confirm`);
            fetchTask();
        } catch (err) {
            setError('Failed to confirm completion');
        }
    };

    const handleVerify = async () => {
        try {
            await api.put(`/tasks/${taskCode}/verify`);
            fetchTask();
        } catch (err) {
            setError('Failed to verify completion');
        }
    };

    const handleRestart = async () => {
        try {
            await api.put(`/tasks/${taskCode}/restart`);
            fetchTask();
        } catch (err) {
            setError('Failed to restart task');
        }
    };

    const handleRequestMaterial = async () => {
        try {
            await api.post(`/materials/${taskCode}/request`, materialForm);
            setMaterialForm({ materialName: '', description: '' });
            fetchTask();
            fetchMaterialRequests();
        } catch (err) {
            setError('Failed to request material');
        }
    };

    const handleResolve = async (requestId, approve) => {
        try {
            await api.put(`/materials/${requestId}/respond?approve=${approve}`);
            fetchTask();
            fetchMaterialRequests();
        } catch (err) {
            setError('Failed to resolve material request');
        }
    };

    const handleReapply = (materialName) => {
        setMaterialForm({
            materialName: materialName,
            description: ''
        });
        setShowMaterialForm(true);
    };

    const hasPendingMaterial = materialRequests.some(r => r.status === 'PENDING');

    if (error && !task) return <div><Navbar /><p style={styles.error}>{error}</p></div>;
    if (!task) return <div><Navbar /><p style={styles.loading}>Loading...</p></div>;
    return (
        <div>
            <Navbar />
            <div style={styles.container}>

                {/* ── Task Info ── */}
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <span style={styles.taskCode}>{task.taskCode}</span>
                        <span style={{
                            ...styles.badge,
                            backgroundColor: statusColor(task.status)
                        }}>
                            {task.status}
                        </span>
                    </div>
                    <h2 style={styles.taskName}>{task.taskName}</h2>
                    <p style={styles.description}>{task.taskDescription}</p>
                    <div style={styles.metaGrid}>
                        <span style={styles.meta}>Asset: <b>{task.assetName}</b></span>
                        <span style={styles.meta}>Reported by: <b>{task.ReportedBy}</b></span>
                        <span style={styles.meta}>Assigned Tech: <b>{task.AssignedTo}</b></span>
                    </div>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                {/* ── MANAGER: Assign ── */}
                {user.role === 'MANAGER' && task.status === 'REPORTED' && (
                    <div style={{ ...styles.card, flexDirection: 'row', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <h3 style={styles.sectionTitle}>Assign to Technician</h3>
                            <input
                                style={{ ...styles.input, marginBottom: '10px' }}
                                placeholder="Select or type Technician"
                                list="tech-options"
                                value={techUsername}
                                onChange={(e) => setTechUsername(e.target.value)}
                            />
                            <datalist id="tech-options">
                                {techWorkloads.map(t => (
                                    <option key={t.username} value={t.username} />
                                ))}
                            </datalist>
                            <br />
                            <button style={styles.button} onClick={handleAssign}>
                                Assign Task
                            </button>
                        </div>
                        <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #eee' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Available Technicians</h4>
                            {techWorkloads.map(t => (
                                <div key={t.username} style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>{t.username}</span>
                                    <span style={{ color: '#888' }}>{t.activeTaskCount} active tasks</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── TECHNICIAN: Pick Up ── */}
                {user.role === 'TECHNICIAN' &&
                    task.AssignedTo === user.username &&
                    task.status === 'ASSIGNED' && (
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>Pick Up Task</h3>
                            <button style={styles.button} onClick={handlePickUp}>
                                Start Working
                            </button>
                        </div>
                    )}

                {/* ── TECHNICIAN: Request Materials + Mark Done ── */}
                {user.role === 'TECHNICIAN' &&
                    task.AssignedTo === user.username &&
                    task.status === 'IN_PROGRESS' && (
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>Task Actions</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={styles.button} onClick={() => setShowMaterialForm(!showMaterialForm)}>
                                    {showMaterialForm ? 'Cancel Request' : 'Request Materials'}
                                </button>
                                <button style={styles.doneButton} onClick={handleMarkDone}>
                                    Mark as Done
                                </button>
                            </div>

                            {showMaterialForm && (
                                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                                    <h3 style={styles.sectionTitle}>Material Details</h3>
                                    <input
                                        style={styles.input}
                                        placeholder="Material name"
                                        value={materialForm.materialName}
                                        onChange={(e) => setMaterialForm({
                                            ...materialForm,
                                            materialName: e.target.value
                                        })}
                                    />
                                    <input
                                        style={styles.input}
                                        placeholder="Reason"
                                        value={materialForm.description}
                                        onChange={(e) => setMaterialForm({
                                            ...materialForm,
                                            description: e.target.value
                                        })}
                                    />
                                    <button style={styles.button} onClick={() => { handleRequestMaterial(); setShowMaterialForm(false); }}>
                                        Submit Request
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                {/* ── MANAGER: Confirm Completion ── */}
                {user.role === 'MANAGER' &&
                    task.status === 'COMPLETED_PENDING_CONFIRMATION' && (
                        <div style={styles.card}>
                            <h3 style={styles.sectionTitle}>Confirm Work Completion</h3>
                            <button style={styles.button} onClick={handleConfirm}>
                                Confirm Completed
                            </button>
                        </div>
                    )}

                {/* ── USER: Verify Completion ── */}
                {user.role === 'USER' && task.status === 'COMPLETED' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Task Completed</h3>
                        <p style={styles.description}>The technician has completed this task. Do you accept the work?</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button style={styles.doneButton} onClick={handleVerify}>
                                ✔
                            </button>
                            <button style={styles.rejectButton} onClick={handleRestart}>
                                ✖
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Material Requests List ── */}
                {user.role !== 'USER' && materialRequests.length > 0 && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Material Requests</h3>
                        {materialRequests.map((req) => (
                            <div key={req.id} style={styles.requestCard}>
                                <div style={styles.requestHeader}>
                                    <span style={styles.materialName}>
                                        {req.materialName}
                                    </span>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: req.status === 'APPROVED'
                                            ? '#10b981'
                                            : req.status === 'REJECTED'
                                                ? '#ef4444' : '#f59e0b'
                                    }}>
                                        {req.status}
                                    </span>
                                </div>
                                <p style={styles.reason}>Reason: {req.description}</p>
                                <p style={styles.reason}>
                                    Requested by: {req.techName}
                                </p>

                                {/* MANAGER approve/reject */}
                                {user.role === 'MANAGER' &&
                                    req.status === 'PENDING' && (
                                        <div style={styles.resolveButtons}>
                                            <button
                                                style={styles.approveButton}
                                                onClick={() => handleResolve(req.id, true)}>
                                                Approve
                                            </button>
                                            <button
                                                style={styles.rejectButton}
                                                onClick={() => handleResolve(req.id, false)}>
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                {/* TECHNICIAN re-apply */}
                                {user.role === 'TECHNICIAN' && req.status === 'REJECTED' && !hasPendingMaterial && (
                                    <div style={styles.resolveButtons}>
                                        <button
                                            style={{ ...styles.button, backgroundColor: '#f59e0b', padding: '6px 14px', fontSize: '13px' }}
                                            onClick={() => handleReapply(req.materialName)}>
                                            Re-apply
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
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

const styles = {
    container: {
        padding: '24px',
        maxWidth: '700px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
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
        padding: '3px 10px',
        borderRadius: '12px',
    },
    taskName: {
        margin: 0,
        fontSize: '20px',
        color: '#616F84',
    },
    description: {
        margin: 0,
        fontSize: '14px',
        color: '#555',
    },
    metaGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    meta: {
        fontSize: '13px',
        color: '#666',
    },
    sectionTitle: {
        margin: 0,
        fontSize: '16px',
        color: '#616F84',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#917E71',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    doneButton: {
        padding: '10px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    requestCard: {
        border: '1px solid #eee',
        borderRadius: '6px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    requestHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    materialName: {
        fontWeight: 'bold',
        fontSize: '14px',
    },
    reason: {
        margin: 0,
        fontSize: '13px',
        color: '#666',
    },
    resolveButtons: {
        display: 'flex',
        gap: '8px',
        marginTop: '4px',
    },
    approveButton: {
        padding: '6px 14px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
    },
    rejectButton: {
        padding: '6px 14px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
    },
    error: {
        color: 'red',
        fontSize: '13px',
    },
    loading: {
        padding: '24px',
        color: '#666',
    },
};

export default TaskDetail;