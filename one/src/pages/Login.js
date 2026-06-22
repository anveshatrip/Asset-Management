import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
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
            setError('Invalid username or password');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Asset Maintenance</h2>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <p style={styles.error}>{error}</p>}

                <input
                    style={styles.input}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button style={styles.button} onClick={handleLogin}>
                    Login
                </button>
                <p style={styles.link}>
                    Don't have an account?{' '}
                    <span
                        style={styles.linkText}
                        onClick={() => navigate('/register')}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#DCD1C7',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    title: {
        margin: 0,
        fontSize: '24px',
        textAlign: 'center',
        color: '#616F84',
    },
    subtitle: {
        margin: 0,
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',

    },
    button: {
        padding: '10px',
        backgroundColor: '#917E71',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        cursor: 'pointer',
        marginTop: '4px',
    },

    error: {
        color: 'red',
        fontSize: '13px',
        textAlign: 'center',
        margin: 0,
    },
    link: {
        textAlign: 'center',
        fontSize: '13px',
        color: '#666',
        margin: 0,
    },
    linkText: {
        color: '#917E71',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default Login;