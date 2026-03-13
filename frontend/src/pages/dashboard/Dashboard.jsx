import { useState, useEffect } from 'react';
import { pickingAPI, inventarioAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MdLocalShipping, MdWarehouse, MdInventory, MdCheckCircle, MdPending, MdRunCircle, MdCancel } from 'react-icons/md';
import { FaBoxes } from 'react-icons/fa';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bajoStock, setBajoStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      pickingAPI.stats(),
      inventarioAPI.list({ bajo_stock: true }),
    ]).then(([statsRes, stockRes]) => {
      setStats(statsRes.data);
      setBajoStock(stockRes.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-content"><div className="spinner" /></div>;

  const pieData = stats ? [
    { name: 'Pendientes', value: stats.ordenes.pendientes },
    { name: 'En Proceso', value: stats.ordenes.en_proceso },
    { name: 'Completados', value: stats.ordenes.completados },
    { name: 'Cancelados', value: stats.ordenes.cancelados },
  ].filter(d => d.value > 0) : [];

  const barData = stats ? [
    { name: 'Pendiente', value: stats.ordenes.pendientes, fill: '#f59e0b' },
    { name: 'En Proceso', value: stats.ordenes.en_proceso, fill: '#3b82f6' },
    { name: 'Completado', value: stats.ordenes.completados, fill: '#10b981' },
    { name: 'Cancelado', value: stats.ordenes.cancelados, fill: '#ef4444' },
  ] : [];

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <>
      <div className="topbar">
        <div>
          <h2>{saludo}, {user?.full_name?.split(' ')[0] || user?.username} 👋</h2>
          <p>Resumen operativo del sistema de picking</p>
        </div>
        <div className="topbar-actions">
          <span style={{ fontSize: 12, color: '#64748b' }}>{new Date().toLocaleDateString('es-EC', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="page-content">
        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Órdenes', value: stats?.ordenes.total ?? 0, icon: <MdLocalShipping />, bg: '#dbeafe', color: '#1e40af' },
            { label: 'Pendientes', value: stats?.ordenes.pendientes ?? 0, icon: <MdPending />, bg: '#fef3c7', color: '#92400e' },
            { label: 'En Proceso', value: stats?.ordenes.en_proceso ?? 0, icon: <MdRunCircle />, bg: '#e0e7ff', color: '#4338ca' },
            { label: 'Completadas', value: stats?.ordenes.completados ?? 0, icon: <MdCheckCircle />, bg: '#d1fae5', color: '#065f46' },
            { label: 'Bodegas', value: stats?.bodegas ?? 0, icon: <MdWarehouse />, bg: '#fce7f3', color: '#9d174d' },
            { label: 'Productos', value: stats?.productos ?? 0, icon: <FaBoxes />, bg: '#cffafe', color: '#155e75' },
          ].map(({ label, value, icon, bg, color }) => (
            <div className="stat-card" key={label}>
              <div className="stat-icon" style={{ background: bg, color }}>{icon}</div>
              <div className="stat-info">
                <h3 style={{ color }}>{value}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Bar chart */}
          <div className="card">
            <div className="card-header" style={{ paddingBottom: 0 }}>
              <div>
                <div className="card-title">Estado de Órdenes</div>
                <div className="card-subtitle">Distribución por estado</div>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6,6,0,0]}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Proporción de Estados</div>
                <div className="card-subtitle">Vista circular</div>
              </div>
            </div>
            <div className="card-body">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <p>Sin datos de órdenes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bajo stock */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">⚠️ Productos con Bajo Stock</div>
              <div className="card-subtitle">Requieren reabastecimiento inmediato</div>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 12 }}>
            {bajoStock.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>✅ Todos los productos tienen stock suficiente</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>SKU</th>
                      <th>Bodega</th>
                      <th>Stock Actual</th>
                      <th>Stock Mínimo</th>
                      <th>Estante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bajoStock.map(item => (
                      <tr key={item.id}>
                        <td><strong>{item.producto_nombre}</strong></td>
                        <td><code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{item.producto_sku}</code></td>
                        <td>{item.bodega_nombre}</td>
                        <td>
                          <span style={{ color: '#ef4444', fontWeight: 700 }}>{item.cantidad_disponible}</span>
                        </td>
                        <td>{item.stock_minimo}</td>
                        <td>{item.ubicacion_estante || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
