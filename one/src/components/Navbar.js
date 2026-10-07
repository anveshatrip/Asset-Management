import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav style={styles.navbar}>
            <div style={styles.brand} onClick={() => navigate('/tasks')}>
                <div style={styles.brandIcon}>AM</div>
                <span style={styles.brandText}>Asset Maintenance</span>
            </div>
            <div style={styles.links}>
                <span
                    style={{ ...styles.link, ...(isActive('/dashboard') ? styles.linkActive : {}) }}
                    onClick={() => navigate(`/dashboard/${user?.role.toLowerCase()}`)}>
                    Dashboard
                </span>
                <span
                    style={{ ...styles.link, ...(isActive('/tasks') ? styles.linkActive : {}) }}
                    onClick={() => navigate('/tasks')}>
                    Tasks
                </span>
                <span
                    style={{ ...styles.link, ...(isActive('/assets') ? styles.linkActive : {}) }}
                    onClick={() => navigate('/assets')}>
                    Assets
                </span>
                {user?.role === 'USER' && (
                    <span style={styles.link} onClick={() => navigate('/tasks/create')}>
                        Report Issue
                    </span>
                )}
                {user?.role === 'MANAGER' && (
                    <span style={styles.link} onClick={() => navigate('/assets/add')}>
                        Add Asset
                    </span>
                )}
                <div style={styles.userSection}>
                    <div style={styles.avatar}>{user?.username?.charAt(0).toUpperCase()}</div>
                    <span style={styles.username}>{user?.username}</span>
                    <span style={styles.roleBadge}>{user?.role}</span>
                </div>
                <button style={styles.logout} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 28px',
        height: '60px',
        backgroundColor: '#2C3A47',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    brandIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        backgroundColor: '#8C7B6E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        color: 'white',
    },
    brandText: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#F0EBE5',
        letterSpacing: '-0.2px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    link: {
        cursor: 'pointer',
        fontSize: '13.5px',
        color: '#B0BEC5',
        padding: '6px 12px',
        borderRadius: '6px',
        fontWeight: '500',
        transition: 'all 0.15s ease',
        letterSpacing: '0.1px',
    },
    linkActive: {
        color: '#F0EBE5',
        backgroundColor: 'rgba(140,123,110,0.25)',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginLeft: '12px',
        paddingLeft: '12px',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
    },
    avatar: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: '#8C7B6E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: 'white',
    },
    username: {
        fontSize: '13px',
        color: '#E0D8D0',
        fontWeight: '500',
    },
    roleBadge: {
        fontSize: '10px',
        color: '#8C7B6E',
        backgroundColor: 'rgba(140,123,110,0.18)',
        padding: '2px 7px',
        borderRadius: '10px',
        fontWeight: '600',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    logout: {
        marginLeft: '8px',
        padding: '7px 16px',
        backgroundColor: 'transparent',
        color: '#B0BEC5',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        transition: 'all 0.15s ease',
    },
};

export default Navbar;