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
    const navigate = useNavigate();

    useEffect(() => {
        // load assets for dropdown
        api.get('/assets').then(res => setAssets(res.data));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/tasks', form);
            setSuccess(`Task ${response.data.taskCode} created successfully!`);
            setError('');
            setTimeout(() => navigate('/tasks'), 1500);
        } catch (err) {
            setError('Failed to create task');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Report an Issue</h2>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <input
                        style={styles.input}
                        name="taskName"
                        placeholder="Issue title"
                        value={form.taskName}
                        onChange={handleChange}
                    />
                    <textarea
                        style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                        name="description"
                        placeholder="Describe the issue..."
                        value={form.description}
                        onChange={handleChange}
                    />
                    <input
                        style={styles.input}
                        name="assetName"
                        list="asset-options"
                        placeholder="Select or enter new Asset"
                        value={form.assetName}
                        onChange={handleChange}
                    />
                    <datalist id="asset-options">
                        {assets.map(m => (
                            <option key={m.id} value={m.name} />
                        ))}
                    </datalist>

                    <button style={styles.button} onClick={handleSubmit}>
                        Submit Issue
                    </button>
                    <button style={styles.cancel} onClick={() => navigate('/tasks')}>
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
        maxWidth: '480px',
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

export default CreateTask;