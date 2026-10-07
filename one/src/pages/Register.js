import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'USER',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        if (!form.username || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', form);
            setSuccess('Account created! Redirecting to login…');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError('Registration failed. Username may already exist.');
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.leftPanel}>
                <div style={styles.brandArea}>
                    <div style={styles.logoMark}>AM</div>
                    <h1 style={styles.appName}>Asset Maintenance</h1>
                    <p style={styles.tagline}>Create your account to get started with asset tracking and maintenance management.</p>
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.title}>Create account</h2>
                        <p style={styles.subtitle}>Register to get started</p>
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <span>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div style={styles.successBox}>
                            <span>✓</span>
                            <span>{success}</span>
                        </div>
                    )}

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            value={form.username}
                            onChange={handleChange}
                            autoFocus
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                        onClick={handleRegister}
                        disabled={loading}>
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>

                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <span style={styles.linkText} onClick={() => navigate('/login')}>
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F0EBE5',
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#2C3A47',
        padding: '60px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    brandArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    logoMark: {
        width: '52px',
        height: '52px',
        backgroundColor: '#8C7B6E',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
        color: 'white',
        letterSpacing: '1px',
    },
    appName: {
        margin: 0,
        fontSize: '28px',
        fontWeight: '700',
        color: '#F0EBE5',
        letterSpacing: '-0.5px',
    },
    tagline: {
        margin: 0,
        fontSize: '15px',
        color: '#8C9EAD',
        lineHeight: '1.7',
        maxWidth: '340px',
    },
    rightPanel: {
        flex: '0 0 460px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
    },
    card: {
        backgroundColor: 'white',
        padding: '44px 40px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(44,58,71,0.12), 0 2px 8px rgba(44,58,71,0.06)',
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    cardHeader: {
        marginBottom: '4px',
    },
    title: {
        margin: '0 0 6px 0',
        fontSize: '22px',
        fontWeight: '700',
        color: '#2C3A47',
        letterSpacing: '-0.3px',
    },
    subtitle: {
        margin: 0,
        color: '#6B7280',
        fontSize: '14px',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '8px',
        color: '#B91C1C',
        fontSize: '13px',
    },
    successBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        backgroundColor: '#F0FDF4',
        border: '1px solid #BBF7D0',
        borderRadius: '8px',
        color: '#166534',
        fontSize: '13px',
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        padding: '11px 14px',
        borderRadius: '8px',
        border: '1.5px solid #E5E0DB',
        fontSize: '14px',
        backgroundColor: '#FAFAF9',
        color: '#2C3A47',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        backgroundColor: '#5C6B7A',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '0.2px',
        marginTop: '4px',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#6B7280',
        margin: '4px 0 0 0',
    },
    linkText: {
        color: '#8C7B6E',
        cursor: 'pointer',
        fontWeight: '600',
    },
};

export default Register;