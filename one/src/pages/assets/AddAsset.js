import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const AddAsset = () => {
    const [form, setForm] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setError('Asset name is required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/assets', form);
            setSuccess('Asset added successfully! Redirecting…');
            setTimeout(() => navigate('/assets'), 1500);
        } catch (err) {
            setError('Failed to add asset. Please try again.');
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
                        <h2 style={styles.title}>Add New Asset</h2>
                        <p style={styles.subtitle}>Register a new asset to the system</p>
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
                        <label style={styles.label}>Asset Name <span style={styles.required}>*</span></label>
                        <input
                            style={styles.input}
                            name="name"
                            placeholder="e.g. HVAC Unit 3, Printer A1"
                            value={form.name}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            style={{ ...styles.input, height: '110px', resize: 'vertical' }}
                            name="description"
                            placeholder="Optional description, location, model, etc."
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={styles.buttonRow}>
                        <button
                            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                            onClick={handleSubmit}
                            disabled={loading}>
                            {loading ? 'Adding…' : 'Add Asset'}
                        </button>
                        <button style={styles.cancelButton} onClick={() => navigate('/assets')}>
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
    container: { display: 'flex', justifyContent: 'center', padding: '48px 24px' },
    card: {
        backgroundColor: 'white',
        padding: '36px 40px',
        borderRadius: '16px',
        boxShadow: '0 8px 28px rgba(44,58,71,0.10), 0 2px 6px rgba(44,58,71,0.05)',
        width: '100%',
        maxWidth: '480px',
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
        padding: '11px 14px', borderRadius: '8px',
        border: '1.5px solid #E5E0DB', fontSize: '14px',
        width: '100%', boxSizing: 'border-box',
        backgroundColor: '#FAFAF9', color: '#2C3A47', fontFamily: 'inherit',
    },
    buttonRow: { display: 'flex', gap: '10px', marginTop: '4px' },
    button: {
        flex: 1, padding: '12px', backgroundColor: '#5C6B7A',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    },
    cancelButton: {
        flex: '0 0 auto', padding: '12px 20px',
        backgroundColor: 'transparent', color: '#6B7280',
        border: '1.5px solid #E5E0DB', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer',
    },
};

export default AddAsset;