import { useState, useEffect } from 'react';
import { productosAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { FaBoxOpen } from 'react-icons/fa';

const CATEGORIAS = ['ELECTRONICO', 'ROPA', 'ALIMENTOS', 'HERRAMIENTAS', 'OTROS'];
const UNIDADES = ['UNIDAD', 'KG', 'LITRO', 'CAJA', 'SACO', 'PAR', 'METRO'];

const catColors = {
  ELECTRONICO: 'badge-blue', ROPA: 'badge-purple', ALIMENTOS: 'badge-green',
  HERRAMIENTAS: 'badge-yellow', OTROS: 'badge-gray'
};

function ProductoModal({ producto, onClose, onSaved }) {
  const [form, setForm] = useState(producto || {
    nombre: '', sku: '', descripcion: '', categoria: 'OTROS',
    precio_unitario: 0, unidad_medida: 'UNIDAD', peso_kg: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, precio_unitario: +form.precio_unitario, peso_kg: +form.peso_kg };
      if (producto) { await productosAPI.update(producto.id, payload); toast.success('Producto actualizado'); }
      else { await productosAPI.create(payload); toast.success('Producto creado'); }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error al guardar'); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input className="form-control" value={form.nombre} onChange={e => set('nombre', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">SKU *</label>
                <input className="form-control" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="TECH-001" required disabled={!!producto} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-control" value={form.categoria} onChange={e => set('categoria', e.target.value)}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unidad de Medida</label>
                <select className="form-control" value={form.unidad_medida} onChange={e => set('unidad_medida', e.target.value)}>
                  {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input className="form-control" type="number" step="0.01" min="0" value={form.peso_kg} onChange={e => set('peso_kg', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Precio Unitario ($)</label>
              <input className="form-control" type="number" step="0.01" min="0" value={form.precio_unitario} onChange={e => set('precio_unitario', e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');

  const load = (q = '') => {
    setLoading(true);
    productosAPI.list(q).then(r => setProductos(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try { await productosAPI.delete(id); toast.success('Producto eliminado'); load(search); }
    catch { toast.error('No se pudo eliminar'); }
  };

  return (
    <>
      <div className="topbar">
        <div>
          <h2>📦 Productos</h2>
          <p>{productos.length} productos en catálogo</p>
        </div>
        <div className="topbar-actions">
          <div className="search-bar">
            <MdSearch />
            <input placeholder="Buscar por nombre o SKU..." value={search}
              onChange={e => { setSearch(e.target.value); load(e.target.value); }} />
          </div>
          <button className="btn btn-primary" onClick={() => setModal('new')}><MdAdd /> Nuevo Producto</button>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? <div className="spinner" /> : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Unidad</th>
                      <th>Peso</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr><td colSpan={8}>
                        <div className="empty-state"><FaBoxOpen /><p>No hay productos</p></div>
                      </td></tr>
                    ) : productos.map(p => (
                      <tr key={p.id}>
                        <td><code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{p.sku}</code></td>
                        <td><strong>{p.nombre}</strong><div style={{ fontSize: 11, color: '#94a3b8' }}>{p.descripcion?.slice(0, 40)}</div></td>
                        <td><span className={`badge ${catColors[p.categoria] || 'badge-gray'}`}>{p.categoria}</span></td>
                        <td><strong style={{ color: '#065f46' }}>${p.precio_unitario.toFixed(2)}</strong></td>
                        <td>{p.unidad_medida}</td>
                        <td>{p.peso_kg} kg</td>
                        <td><span className={`badge ${p.is_active ? 'badge-green' : 'badge-red'}`}>{p.is_active ? 'Activo' : 'Inactivo'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-outline btn-sm btn-icon" onClick={() => setModal(p)}><MdEdit /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(p.id)}><MdDelete /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && (
        <ProductoModal
          producto={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(search); }}
        />
      )}
    </>
  );
}
