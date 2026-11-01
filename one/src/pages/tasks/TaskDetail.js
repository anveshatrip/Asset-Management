import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const materialStatusColor = (s) =>
    s === 'APPROVED' ? '#147A5E' : s === 'REJECTED' ? '#C0392B' : '#D97706';

const TaskDetail = () => {
    const { taskCode } = useParams();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [materialRequests, setMaterials] = useState([]);
    const [error, setError] = useState('');
    const [techUsername, setTechUsername] = useState('');
    const [techWorkloads, setTechWorkloads] = useState([]);
    const [showMaterialForm, setShowMaterialForm] = useState(false);
    const [materialForm, setMaterialForm] = useState({ materialName: '', description: '' });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskCode]);

    const handleAssign = async () => {
        try {
            await api.put(`/tasks/${taskCode}/assign?technicianUsername=${techUsername}`);
            fetchTask();
        } catch (err) { setError('Failed to assign task'); }
    };

    const handlePickUp = async () => {
        try {
            await api.put(`/tasks/${taskCode}/pickup`);
            fetchTask();
        } catch (err) { setError('Failed to pick up task'); }
    };

    const handleMarkDone = async () => {
        try {
            await api.put(`/tasks/${taskCode}/done`);
            fetchTask();
        } catch (err) { setError('Failed to mark task done'); }
    };

    const handleConfirm = async () => {
        try {
            await api.put(`/tasks/${taskCode}/confirm`);
            fetchTask();
        } catch (err) { setError('Failed to confirm completion'); }
    };

    const handleVerify = async () => {
        try {
            await api.put(`/tasks/${taskCode}/verify`);
            fetchTask();
        } catch (err) { setError('Failed to verify completion'); }
    };

    const handleRestart = async () => {
        try {
            await api.put(`/tasks/${taskCode}/restart`);
            fetchTask();
        } catch (err) { setError('Failed to restart task'); }
    };

    const handleRequestMaterial = async () => {
        try {
            await api.post(`/materials/${taskCode}/request`, materialForm);
            setMaterialForm({ materialName: '', description: '' });
            fetchTask();
            fetchMaterialRequests();
        } catch (err) { setError('Failed to request material'); }
    };

    const handleResolve = async (requestId, approve) => {
        try {
            await api.put(`/materials/${requestId}/respond?approve=${approve}`);
            fetchTask();
            fetchMaterialRequests();
        } catch (err) { setError('Failed to resolve material request'); }
    };

    const handleReapply = (materialName) => {
        setMaterialForm({ materialName, description: '' });
        setShowMaterialForm(true);
    };

    const hasPendingMaterial = materialRequests.some(r => r.status === 'PENDING');

    if (error && !task) return (
        <div style={styles.page}><Navbar />
            <div style={styles.errorFull}>⚠ {error}</div>
        </div>
    );
    if (!task) return (
        <div style={styles.page}><Navbar />
            <div style={styles.loading}>Loading task…</div>
        </div>
    );

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>

                {/* ── Task Info Card ── */}
                <div style={styles.card}>
                    <div style={styles.cardTop}>
                        <span style={styles.taskCode}>{task.taskCode}</span>
                        <span style={{ ...styles.badge, backgroundColor: statusColor(task.status) }}>
                            {task.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <h2 style={styles.taskName}>{task.taskName}</h2>
                    <p style={styles.description}>{task.taskDescription}</p>
                    <div style={styles.metaRow}>
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Asset</span>
                            <span style={styles.metaValue}>{task.assetName}</span>
                        </div>
                        <div style={styles.metaDivider} />
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Reported by</span>
                            <span style={styles.metaValue}>{task.ReportedBy}</span>
                        </div>
                        <div style={styles.metaDivider} />
                        <div style={styles.metaItem}>
                            <span style={styles.metaLabel}>Assigned Tech</span>
                            <span style={styles.metaValue}>{task.AssignedTo || '—'}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={styles.errorBox}>⚠ {error}</div>
                )}

                {/* ── MANAGER: Assign ── */}
                {user.role === 'MANAGER' && task.status === 'REPORTED' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Assign to Technician</h3>
                        <div style={styles.assignLayout}>
                            <div style={styles.assignLeft}>
                                <input
                                    style={styles.input}
                                    placeholder="Select or type technician username"
                                    list="tech-options"
                                    value={techUsername}
                                    onChange={(e) => setTechUsername(e.target.value)}
                                />
                                <datalist id="tech-options">
                                    {techWorkloads.map(t => (
                                        <option key={t.username} value={t.username} />
                                    ))}
                                </datalist>
                                <button style={styles.primaryButton} onClick={handleAssign}>
                                    Assign Task
                                </button>
                            </div>
                            <div style={styles.assignRight}>
                                <p style={styles.techListTitle}>Available Technicians</p>
                                {techWorkloads.map(t => (
                                    <div key={t.username} style={styles.techRow}>
                                        <span>{t.username}</span>
                                        <span style={styles.techTasks}>{t.activeTaskCount} tasks</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── TECHNICIAN: Pick Up ── */}
                {user.role === 'TECHNICIAN' && task.AssignedTo === user.username && task.status === 'ASSIGNED' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Pick Up Task</h3>
                        <p style={styles.description}>This task is assigned to you. Click below to start working.</p>
                        <button style={styles.primaryButton} onClick={handlePickUp}>
                            Start Working
                        </button>
                    </div>
                )}

                {/* ── TECHNICIAN: In Progress Actions ── */}
                {user.role === 'TECHNICIAN' && task.AssignedTo === user.username && task.status === 'IN_PROGRESS' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Task Actions</h3>
                        <div style={styles.buttonRow}>
                            <button style={styles.primaryButton} onClick={() => setShowMaterialForm(!showMaterialForm)}>
                                {showMaterialForm ? 'Cancel Request' : 'Request Materials'}
                            </button>
                            <button style={styles.successButton} onClick={handleMarkDone}>
                                Mark as Done
                            </button>
                        </div>

                        {showMaterialForm && (
                            <div style={styles.materialForm}>
                                <h4 style={styles.subTitle}>Material Request</h4>
                                <input
                                    style={styles.input}
                                    placeholder="Material name"
                                    value={materialForm.materialName}
                                    onChange={(e) => setMaterialForm({ ...materialForm, materialName: e.target.value })}
                                />
                                <input
                                    style={styles.input}
                                    placeholder="Reason / description"
                                    value={materialForm.description}
                                    onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                                />
                                <button style={styles.primaryButton} onClick={() => { handleRequestMaterial(); setShowMaterialForm(false); }}>
                                    Submit Request
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── MANAGER: Confirm Completion ── */}
                {user.role === 'MANAGER' && task.status === 'COMPLETED_PENDING_CONFIRMATION' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Confirm Work Completion</h3>
                        <p style={styles.description}>The technician has marked this task as done. Please verify the work and confirm.</p>
                        <button style={styles.successButton} onClick={handleConfirm}>
                            Confirm Completed
                        </button>
                    </div>
                )}

                {/* ── USER: Verify Completion ── */}
                {user.role === 'USER' && task.status === 'COMPLETED' && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Work Completed</h3>
                        <p style={styles.description}>The maintenance team has completed this task. Do you accept the work?</p>
                        <div style={styles.verifyButtons}>
                            <button style={styles.successButton} onClick={handleVerify}>
                                ✔ Accept Work
                            </button>
                            <button style={styles.dangerButton} onClick={handleRestart}>
                                ✖ Reject &amp; Reopen
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Material Requests ── */}
                {user.role !== 'USER' && materialRequests.length > 0 && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Material Requests</h3>
                        <div style={styles.requestList}>
                            {materialRequests.map((req) => (
                                <div key={req.id} style={styles.requestCard}>
                                    <div style={styles.requestTop}>
                                        <span style={styles.materialName}>{req.materialName}</span>
                                        <span style={{ ...styles.badge, backgroundColor: materialStatusColor(req.status) }}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p style={styles.reason}>Reason: {req.description}</p>
                                    <p style={styles.reason}>Requested by: <strong>{req.techName}</strong></p>

                                    {user.role === 'MANAGER' && req.status === 'PENDING' && (
                                        <div style={styles.actionButtons}>
                                            <button style={styles.approveButton} onClick={() => handleResolve(req.id, true)}>
                                                Approve
                                            </button>
                                            <button style={styles.rejectButton} onClick={() => handleResolve(req.id, false)}>
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {user.role === 'TECHNICIAN' && req.status === 'REJECTED' && !hasPendingMaterial && (
                                        <div style={styles.actionButtons}>
                                            <button
                                                style={{ ...styles.primaryButton, padding: '7px 16px', fontSize: '13px' }}
                                                onClick={() => handleReapply(req.materialName)}>
                                                Re-apply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F0EBE5', minHeight: '100vh' },
    container: {
        padding: '32px 36px', maxWidth: '760px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '22px 24px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid rgba(229,224,219,0.5)',
    },
    cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    taskCode: { fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace', fontWeight: '500', letterSpacing: '0.5px' },
    badge: {
        fontSize: '11px', color: 'white',
        padding: '4px 11px', borderRadius: '20px',
        fontWeight: '600', letterSpacing: '0.3px', whiteSpace: 'nowrap',
    },
    taskName: { margin: 0, fontSize: '22px', fontWeight: '700', color: '#2C3A47', letterSpacing: '-0.4px' },
    description: { margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.6' },
    metaRow: {
        display: 'flex',
        gap: '0',
        marginTop: '4px',
        borderTop: '1px solid #F0EBE5',
        paddingTop: '14px',
    },
    metaItem: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },
    metaDivider: { width: '1px', backgroundColor: '#F0EBE5', margin: '0 20px' },
    metaLabel: { fontSize: '11px', color: '#9CA3AF', fontWeight: '600', letterSpacing: '0.4px', textTransform: 'uppercase' },
    metaValue: { fontSize: '14px', color: '#2C3A47', fontWeight: '500' },
    errorBox: {
        padding: '10px 16px', backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA', borderRadius: '8px',
        color: '#B91C1C', fontSize: '13px',
    },
    errorFull: { padding: '40px 36px', color: '#B91C1C', fontSize: '14px' },
    loading: { padding: '40px 36px', color: '#6B7280', fontSize: '14px' },
    sectionTitle: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#2C3A47' },
    subTitle: { margin: 0, fontSize: '14px', fontWeight: '600', color: '#2C3A47' },
    input: {
        padding: '10px 14px', borderRadius: '8px',
        border: '1.5px solid #E5E0DB', fontSize: '14px',
        backgroundColor: '#FAFAF9', color: '#2C3A47', fontFamily: 'inherit',
    },
    buttonRow: { display: 'flex', gap: '10px' },
    verifyButtons: { display: 'flex', gap: '10px' },
    actionButtons: { display: 'flex', gap: '8px', marginTop: '4px' },
    primaryButton: {
        padding: '10px 18px', backgroundColor: '#5C6B7A',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    },
    successButton: {
        padding: '10px 18px', backgroundColor: '#147A5E',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    },
    dangerButton: {
        padding: '10px 18px', backgroundColor: '#C0392B',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    },
    approveButton: {
        padding: '7px 16px', backgroundColor: '#147A5E',
        color: 'white', border: 'none', borderRadius: '6px',
        cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    },
    rejectButton: {
        padding: '7px 16px', backgroundColor: '#C0392B',
        color: 'white', border: 'none', borderRadius: '6px',
        cursor: 'pointer', fontSize: '13px', fontWeight: '600',
    },
    assignLayout: { display: 'flex', gap: '24px' },
    assignLeft: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
    assignRight: {
        flex: '0 0 220px', paddingLeft: '24px',
        borderLeft: '1px solid #F0EBE5',
    },
    techListTitle: { margin: '0 0 10px 0', fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.4px' },
    techRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 0', borderBottom: '1px solid #F5F3F0', fontSize: '13px', color: '#2C3A47',
    },
    techTasks: { fontSize: '12px', color: '#9CA3AF' },
    materialForm: {
        marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '10px',
        borderTop: '1px solid #F0EBE5', paddingTop: '16px',
    },
    requestList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    requestCard: {
        border: '1.5px solid #F0EBE5', borderRadius: '8px',
        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px',
        backgroundColor: '#FAFAF9',
    },
    requestTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    materialName: { fontWeight: '600', fontSize: '14px', color: '#2C3A47' },
    reason: { margin: 0, fontSize: '13px', color: '#6B7280' },
};

export default TaskDetail;