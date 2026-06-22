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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            await api.post('/auth/register', form);
            setSuccess('Registered successfully! Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError('Registration failed. Username may already exist.');
            setSuccess('');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Register to get started</p>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <input
                    style={styles.input}
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                />
                <input
                    style={styles.input}
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button style={styles.button} onClick={handleRegister}>
                    Register
                </button>
                <p style={styles.link}>
                    Already have an account?{' '}
                    <span
                        style={styles.linkText}
                        onClick={() => navigate('/login')}>
                        Login
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
    success: {
        color: 'green',
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

export default Register;