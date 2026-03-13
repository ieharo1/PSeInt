import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  MdDashboard, MdWarehouse, MdInventory, MdLocalShipping,
  MdInventory2, MdLogout, MdPeople
} from 'react-icons/md';
import { FaBoxOpen } from 'react-icons/fa';
import toast from 'react-hot-toast';

const navItems = [
  { section: 'Principal', items: [
    { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
  ]},
  { section: 'Operaciones', items: [
    { to: '/picking', label: 'Órdenes de Picking', icon: <MdLocalShipping /> },
    { to: '/inventario', label: 'Inventario', icon: <MdInventory /> },
  ]},
  { section: 'Catálogos', items: [
    { to: '/bodegas', label: 'Bodegas', icon: <MdWarehouse /> },
    { to: '/productos', label: 'Productos', icon: <FaBoxOpen /> },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>
          <span className="logo-icon">🏭</span>
          PickingPro
        </h1>
        <p>Sistema de Bodegas</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-section-title">{section}</div>
            {items.map(({ to, label, icon }) => (
              <NavLink
                key={to} to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div className="user-details">
            <strong>{user?.full_name || user?.username}</strong>
            <span>{user?.rol}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <MdLogout />
          </button>
        </div>
      </div>
    </aside>
  );
}
