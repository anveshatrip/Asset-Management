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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.pageHeader}>
                    <div>
                        <h2 style={styles.heading}>Assets</h2>
                        <p style={styles.subheading}>{assets.length} asset{assets.length !== 1 ? 's' : ''} registered</p>
                    </div>
                    {user.role === 'MANAGER' && (
                        <button style={styles.addButton} onClick={() => navigate('/assets/add')}>
                            + Add Asset
                        </button>
                    )}
                </div>

                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>⌕</span>
                    <input
                        style={styles.searchInput}
                        placeholder="Search assets…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {assets.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>🔧</div>
                        <p style={styles.emptyText}>No assets found</p>
                        <p style={styles.emptySubtext}>
                            {search ? 'Try a different search term' : 'No assets have been registered yet'}
                        </p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {assets.map(asset => (
                            <div key={asset.id} style={styles.card}>
                                <div style={styles.cardIcon}>
                                    {asset.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={styles.cardBody}>
                                    <h3 style={styles.assetName}>{asset.name}</h3>
                                    <p style={styles.description}>
                                        {asset.description || 'No description provided.'}
                                    </p>
                                    <span style={styles.idBadge}>ID #{asset.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { backgroundColor: '#F0EBE5', minHeight: '100vh' },
    container: { padding: '32px 36px', maxWidth: '1060px', margin: '0 auto' },
    pageHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '24px',
    },
    heading: { margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#2C3A47', letterSpacing: '-0.4px' },
    subheading: { margin: 0, fontSize: '13px', color: '#9CA3AF' },
    addButton: {
        padding: '10px 18px',
        backgroundColor: '#8C7B6E',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(140,123,110,0.25)',
    },
    searchWrapper: { position: 'relative', maxWidth: '360px', marginBottom: '28px' },
    searchIcon: {
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        color: '#9CA3AF', fontSize: '18px', lineHeight: 1,
    },
    searchInput: {
        paddingLeft: '38px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px',
        borderRadius: '8px', border: '1.5px solid #E5E0DB',
        fontSize: '14px', backgroundColor: 'white', color: '#2C3A47',
        width: '100%', boxSizing: 'border-box',
    },
    emptyState: {
        textAlign: 'center', padding: '60px 20px',
        backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
    },
    emptyIcon: { fontSize: '40px', marginBottom: '12px' },
    emptyText: { margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#374151' },
    emptySubtext: { margin: 0, fontSize: '13px', color: '#9CA3AF' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(44,58,71,0.07)',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        border: '1px solid rgba(229,224,219,0.5)',
        transition: 'all 0.15s ease',
    },
    cardIcon: {
        width: '44px',
        height: '44px',
        borderRadius: '10px',
        backgroundColor: '#F0EBE5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700',
        color: '#5C6B7A',
        flexShrink: 0,
    },
    cardBody: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 },
    assetName: { margin: 0, fontSize: '15px', fontWeight: '700', color: '#2C3A47' },
    description: { margin: 0, fontSize: '13px', color: '#6B7280', lineHeight: '1.5' },
    idBadge: {
        fontSize: '11px', color: '#9CA3AF',
        fontFamily: 'monospace', fontWeight: '500', letterSpacing: '0.4px',
    },
};

export default AssetList;