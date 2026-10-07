import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { username, password });
            console.log(response.data);
            login(response.data);

            // redirect based on role
            const role = response.data.role;
            if (role === 'USER') navigate('/dashboard/user');
            else if (role === 'MANAGER') navigate('/dashboard/manager');
            else if (role === 'TECHNICIAN') navigate('/dashboard/technician');
            else if (role === 'AUTH') navigate('/dashboard/auth');

        } catch (err) {
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div style={styles.page}>
            <div style={styles.leftPanel}>
                <div style={styles.brandArea}>
                    <div style={styles.logoMark}>AM</div>
                    <h1 style={styles.appName}>Asset Maintenance</h1>
                    <p style={styles.tagline}>Streamlined asset tracking & maintenance management</p>
                </div>
                <div style={styles.featureList}>
                    {['Track assets across your organization', 'Assign & manage maintenance tasks', 'Role-based access control', 'Real-time status updates'].map(f => (
                        <div key={f} style={styles.featureItem}>
                            <span style={styles.featureDot}>✦</span>
                            <span>{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.rightPanel}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.title}>Welcome back</h2>
                        <p style={styles.subtitle}>Sign in to your account</p>
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <span style={styles.errorIcon}>⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button
                        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                        onClick={handleLogin}
                        disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>

                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <span style={styles.linkText} onClick={() => navigate('/register')}>
                            Create one
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
        gap: '48px',
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
        lineHeight: '1.6',
        maxWidth: '340px',
    },
    featureList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        color: '#B0BEC5',
    },
    featureDot: {
        color: '#8C7B6E',
        fontSize: '10px',
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
    errorIcon: {
        fontSize: '14px',
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

export default Login;