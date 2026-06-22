import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchAssets = async () => {
        try {
            let url = search ? `/assets/search?name=${search}` : '/assets';
            const res = await api.get(url);
            setAssets(res.data);
        } catch (err) {
            console.error('Failed to load assets');
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [search]);

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.heading}>Assets</h2>
                    {user.role === 'MANAGER' && (
                        <button
                            style={styles.addButton}
                            onClick={() => navigate('/assets/add')}>
                            + Add Asset
                        </button>
                    )}
                </div>

                <input
                    style={styles.input}
                    placeholder="Search assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {assets.length === 0 ? (
                    <p style={styles.empty}>No assets found.</p>
                ) : (
                    <div style={styles.grid}>
                        {assets.map(asset => (
                            <div key={asset.id} style={styles.card}>
                                <h3 style={styles.assetName}>{asset.name}</h3>
                                <p style={styles.description}>
                                    {asset.description || 'No description provided.'}
                                </p>
                                <span style={styles.idBadge}>ID: {asset.id}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    heading: {
        fontSize: '22px',
        color: '#616F84',
        margin: 0,
    },
    addButton: {
        padding: '8px 16px',
        backgroundColor: '#917E71',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    input: {
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '14px',
        width: '300px',
        marginBottom: '20px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    assetName: {
        margin: 0,
        fontSize: '16px',
        color: '#616F84',
    },
    description: {
        margin: 0,
        fontSize: '13px',
        color: '#666',
    },
    idBadge: {
        fontSize: '11px',
        color: '#999',
        fontFamily: 'monospace',
    },
    empty: {
        color: '#666',
        fontSize: '14px',
    },
};

export default AssetList;