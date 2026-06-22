import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';

const AddAsset = () => {
    const [form, setForm] = useState({ name: '', description: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setError('Asset name is required');
            return;
        }
        try {
            await api.post('/assets', form);
            setSuccess('Asset added successfully! Redirecting...');
            setError('');
            setTimeout(() => navigate('/assets'), 1500);
        } catch (err) {
            setError('Failed to add asset');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Add New Asset</h2>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <input
                        style={styles.input}
                        name="name"
                        placeholder="Asset name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <textarea
                        style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                        name="description"
                        placeholder="Description (optional)"
                        value={form.description}
                        onChange={handleChange}
                    />
                    <button style={styles.button} onClick={handleSubmit}>
                        Add Asset
                    </button>
                    <button
                        style={styles.cancel}
                        onClick={() => navigate('/assets')}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 24px',
        backgroundColor: '#DCD1C7',
        minHeight: '100vh',
    },
    card: {
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: 'fit-content',
    },
    title: {
        margin: 0,
        fontSize: '20px',
        color: '#616F84',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px',
        backgroundColor: '#917E71',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        cursor: 'pointer',
    },
    cancel: {
        padding: '10px',
        backgroundColor: '#685C54',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        cursor: 'pointer',
    },
    error: { color: 'red', fontSize: '13px', margin: 0 },
    success: { color: 'green', fontSize: '13px', margin: 0 },
};

export default AddAsset;