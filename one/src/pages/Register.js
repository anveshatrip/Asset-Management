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
            setSuccess('Account created successfully! Redirecting to sign in…');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            if (err.response) {
                setError('Registration failed. Username may already exist.');
            } else if (err.request) {
                setError('Server is unreachable. Please try again later.');
            } else {
                setError('Something went wrong. Please try again.');
            }
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleRegister();
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.logoMark}>AM</div>
                    <h1 style={styles.brandTitle}>Asset Management</h1>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Create account</h2>
                    <p style={styles.subtitle}>Enter your details to create an account</p>

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
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            placeholder="Choose a password"
                            value={form.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                        onClick={handleRegister}
                        disabled={loading}>
                        {loading ? 'Creating account…' : 'Create account'}
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
    },
    container: {
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoMark: {
        width: '36px',
        height: '36px',
        backgroundColor: '#2C3A47',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '700',
        color: 'white',
        letterSpacing: '0.5px',
    },
    brandTitle: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#2C3A47',
        letterSpacing: '-0.3px',
    },
    card: {
        backgroundColor: 'white',
        padding: '36px 32px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(44,58,71,0.08), 0 1px 4px rgba(44,58,71,0.04)',
        border: '1px solid rgba(229,224,219,0.6)',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '700',
        color: '#2C3A47',
        letterSpacing: '-0.3px',
    },
    subtitle: {
        margin: '-10px 0 0 0',
        color: '#6B7280',
        fontSize: '13.5px',
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
        fontWeight: '600',
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
        padding: '11px',
        backgroundColor: '#5C6B7A',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '4px',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#6B7280',
        margin: '2px 0 0 0',
    },
    linkText: {
        color: '#8C7B6E',
        cursor: 'pointer',
        fontWeight: '600',
    },
};

export default Register;