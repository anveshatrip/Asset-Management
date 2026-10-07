import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const CreateTask = () => {
    const [form, setForm] = useState({
        taskName: '',
        description: '',
        assetName: '',
    });
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/assets').then(res => setAssets(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.taskName.trim() || !form.assetName.trim()) {
            setError('Issue title and asset are required.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/tasks', form);
            setSuccess(`Ticket ${response.data.taskCode} created successfully!`);
            setTimeout(() => navigate('/tasks'), 1500);
        } catch (err) {
            setError('Failed to create task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.title}>Report an Issue</h2>
                        <p style={styles.subtitle}>Submit a new maintenance ticket</p>
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

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Issue Title <span style={styles.required}>*</span></label>
                        <input
                            style={styles.input}
                            name="taskName"
                            placeholder="Briefly describe the issue"
                            value={form.taskName}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            style={{ ...styles.input, height: '110px', resize: 'vertical' }}
                            name="description"
                            placeholder="Provide more details about the issue…"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Asset <span style={styles.required}>*</span></label>
                        <input
                            style={styles.input}
                            name="assetName"
                            list="asset-options"
                            placeholder="Select or enter asset name"
                            value={form.assetName}
                            onChange={handleChange}
                        />
                        <datalist id="asset-options">
                            {assets.map(m => (
                                <option key={m.id} value={m.name} />
                            ))}
                        </datalist>
                    </div>

                    <div style={styles.buttonRow}>
                        <button
                            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                            onClick={handleSubmit}
                            disabled={loading}>
                            {loading ? 'Submitting…' : 'Submit Issue'}
                        </button>
                        <button style={styles.cancelButton} onClick={() => navigate('/tasks')}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F0EBE5', minHeight: '100vh' },
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 24px',
    },
    card: {
        backgroundColor: 'white',
        padding: '36px 40px',
        borderRadius: '16px',
        boxShadow: '0 8px 28px rgba(44,58,71,0.10), 0 2px 6px rgba(44,58,71,0.05)',
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: 'fit-content',
        border: '1px solid rgba(229,224,219,0.4)',
    },
    cardHeader: { marginBottom: '4px' },
    title: { margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700', color: '#2C3A47', letterSpacing: '-0.3px' },
    subtitle: { margin: 0, color: '#6B7280', fontSize: '13.5px' },
    errorBox: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px', backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA', borderRadius: '8px',
        color: '#B91C1C', fontSize: '13px',
    },
    successBox: {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 14px', backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0', borderRadius: '8px',
        color: '#166534', fontSize: '13px',
    },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    required: { color: '#C0392B' },
    input: {
        padding: '11px 14px',
        borderRadius: '8px',
        border: '1.5px solid #E5E0DB',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#FAFAF9',
        color: '#2C3A47',
        fontFamily: 'inherit',
    },
    buttonRow: { display: 'flex', gap: '10px', marginTop: '4px' },
    button: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#5C6B7A',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    cancelButton: {
        flex: '0 0 auto',
        padding: '12px 20px',
        backgroundColor: 'transparent',
        color: '#6B7280',
        border: '1.5px solid #E5E0DB',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
    },
};

export default CreateTask;