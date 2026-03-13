import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { MdLock, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FaWarehouse, FaBoxes, FaClipboardList, FaChartBar } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <h1>Sistema de<br />Picking de<br />Bodegas</h1>
        <p>Gestión eficiente de inventarios, órdenes de picking y control de stock multi-bodega.</p>

        <div className="auth-features">
          {[
            { icon: <FaWarehouse />, text: 'Gestión multi-bodega' },
            { icon: <FaClipboardList />, text: 'Órdenes de picking en tiempo real' },
            { icon: <FaBoxes />, text: 'Control de inventario preciso' },
            { icon: <FaChartBar />, text: 'Dashboard con estadísticas' },
          ].map(({ icon, text }) => (
            <div className="auth-feature" key={text}>
              <div className="auth-feature-icon">{icon}</div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form">
          <div className="logo">
            <div className="logo-box">🏭</div>
            <h2>PickingPro</h2>
          </div>

          <h3>Iniciar Sesión</h3>
          <p className="subtitle">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <div style={{ position: 'relative' }}>
                <MdPerson style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 18 }} />
                <input
                  className="form-control"
                  style={{ paddingLeft: 36 }}
                  placeholder="admin"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <MdLock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 18 }} />
                <input
                  className="form-control"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, display: 'flex' }}>
                  {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: 14, marginTop: 8 }} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 10, fontSize: 12, color: '#64748b' }}>
            <strong style={{ display: 'block', marginBottom: 6 }}>Credenciales de prueba:</strong>
            Admin: <code>admin / admin123</code><br />
            Operador: <code>operador1 / op123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
