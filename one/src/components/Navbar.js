import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.navbar}>
            <span style={styles.brand} onClick={() => navigate('/tasks')}>
                Asset Maintenance
            </span>
            <div style={styles.links}>
                <span style={styles.link} onClick={() => navigate(`/dashboard/${user?.role.toLowerCase()}`)}>
                    Dashboard
                </span>
                <span style={styles.link} onClick={() => navigate('/tasks')}>
                    Tasks
                </span>
                <span style={styles.link} onClick={() => navigate('/assets')}>
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
                <span style={styles.username}>{user?.username}</span>
                <button style={styles.logout} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#616F84',
        color: 'white',
    },
    brand: {
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        cursor: 'pointer',
        fontSize: '14px',
        color: '#ccc',
    },
    username: {
        fontSize: '14px',
        color: '#917E71',
        fontWeight: 'bold',
    },
    logout: {
        padding: '6px 14px',
        backgroundColor: '#e53e3e',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
    },
};

export default Navbar;