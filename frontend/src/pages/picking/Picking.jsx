import { useState, useEffect } from 'react';
import { pickingAPI, bodegasAPI, productosAPI, inventarioAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdSearch, MdVisibility, MdEdit, MdClose, MdLocalShipping } from 'react-icons/md';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ESTADOS = ['', 'PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];

const estadoBadge = (e) => {
  const m = { PENDIENTE: 'badge-yellow', EN_PROCESO: 'badge-blue', COMPLETADO: 'badge-green', CANCELADO: 'badge-red' };
  return <span className={`badge ${m[e] || 'badge-gray'}`}>{e?.replace('_', ' ')}</span>;
};

const prioridadBadge = (p) => {
  const m = { BAJA: 'badge-gray', MEDIA: 'badge-yellow', ALTA: 'badge-red', URGENTE: 'badge-purple' };
  return <span className={`badge ${m[p] || 'badge-gray'}`}>{p}</span>;
};

function NuevaOrdenModal({ bodegas, productos, onClose, onSaved }) {
  const [form, setForm] = useState({ bodega_origen_id: '', bodega_destino_id: '', prioridad: 'MEDIA', notas: '', fecha_requerida: '' });
  const [items, setItems] = useState([{ producto_id: '', cantidad_solicitada: 1 }]);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems(is => [...is, { producto_id: '', cantidad_solicitada: 1 }]);
  const removeItem = (i) => setItems(is => is.filter((_, j) => j !== i));
  const updateItem = (i, k, v) => setItems(is => is.map((item, j) => j === i ? { ...item, [k]: v } : item));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.some(i => !i.producto_id)) { toast.error('Completa todos los productos'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        bodega_origen_id: +form.bodega_origen_id,
        bodega_destino_id: form.bodega_destino_id ? +form.bodega_destino_id : null,
        fecha_requerida: form.fecha_requerida || null,
        items: items.map(i => ({ producto_id: +i.producto_id, cantidad_solicitada: +i.cantidad_solicitada })),
      };
      await pickingAPI.create(payload);
      toast.success('Orden creada');
      onSaved();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <h3>Nueva Orden de Picking</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bodega Origen *</label>
                <select className="form-control" value={form.bodega_origen_id} onChange={e => set('bodega_origen_id', e.target.value)} required>
                  <option value="">Selecciona bodega</option>
                  {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bodega Destino</label>
                <select className="form-control" value={form.bodega_destino_id} onChange={e => set('bodega_destino_id', e.target.value)}>
                  <option value="">Sin destino</option>
                  {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prioridad</label>
                <select className="form-control" value={form.prioridad} onChange={e => set('prioridad', e.target.value)}>
                  {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha Requerida</label>
                <input className="form-control" type="datetime-local" value={form.fecha_requerida} onChange={e => set('fecha_requerida', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Notas</label>
              <textarea className="form-control" rows={2} value={form.notas} onChange={e => set('notas', e.target.value)} />
            </div>

            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>Ítems de la orden</strong>
              <button type="button" className="btn btn-outline btn-sm" onClick={addItem}><MdAdd /> Agregar ítem</button>
            </div>

            <div className="item-list">
              {items.map((item, i) => (
                <div key={i} className="item-row">
                  <div style={{ flex: 2 }}>
                    <select className="form-control" value={item.producto_id} onChange={e => updateItem(i, 'producto_id', e.target.value)} required>
                      <option value="">Selecciona producto</option>
                      {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>)}
                    </select>
                  </div>
                  <div style={{ width: 120 }}>
                    <input className="form-control" type="number" min="0.01" step="0.01" value={item.cantidad_solicitada}
                      onChange={e => updateItem(i, 'cantidad_solicitada', e.target.value)} placeholder="Cant." required />
                  </div>
                  {items.length > 1 && (
                    <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => removeItem(i)}><MdClose /></button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creando...' : 'Crear Orden'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetalleModal({ orden, onClose, onUpdate }) {
  const [updating, setUpdating] = useState(false);

  const changeEstado = async (estado) => {
    setUpdating(true);
    try {
      await pickingAPI.update(orden.id, { estado });
      toast.success(`Estado actualizado a ${estado}`);
      onUpdate();
    } catch { toast.error('Error al actualizar'); }
    finally { setUpdating(false); }
  };

  const progressPct = orden.items?.length
    ? Math.round((orden.items.filter(i => i.completado === 'SI').length / orden.items.length) * 100)
    : 0;

  const updateItemCompletado = async (item) => {
    const next = item.completado === 'SI' ? 'NO' : 'SI';
    try {
      await pickingAPI.updateItem(orden.id, item.id, { completado: next, cantidad_recogida: next === 'SI' ? item.cantidad_solicitada : 0 });
      toast.success('Ítem actualizado');
      onUpdate();
    } catch { toast.error('Error'); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div>
            <h3>{orden.numero_orden}</h3>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              Creada: {format(new Date(orden.created_at), "dd MMM yyyy HH:mm", { locale: es })}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { label: 'Estado', val: estadoBadge(orden.estado) },
                  { label: 'Prioridad', val: prioridadBadge(orden.prioridad) },
                  { label: 'Bodega Origen', val: orden.bodega_origen_nombre },
                  { label: 'Bodega Destino', val: orden.bodega_destino_nombre || 'N/A' },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
              </div>
              {orden.notas && <div style={{ background: '#fef3c7', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>📝 {orden.notas}</div>}
            </div>
          </div>

          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: 13 }}>Ítems de recogida ({orden.items?.filter(i => i.completado === 'SI').length}/{orden.items?.length})</strong>
            <span style={{ fontSize: 12, color: '#64748b' }}>{progressPct}% completado</span>
          </div>
          <div className="progress" style={{ marginBottom: 12 }}>
            <div className="progress-bar" style={{ width: `${progressPct}%`, background: progressPct === 100 ? '#10b981' : '#3b82f6' }} />
          </div>

          <div className="item-list">
            {orden.items?.map(item => (
              <div key={item.id} className="item-row" style={{ background: item.completado === 'SI' ? '#d1fae5' : '#f8fafc' }}>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 13 }}>{item.producto_nombre}</strong>
                  <div className="sku">{item.producto_sku}</div>
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>Loc: {item.ubicacion || '-'}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {item.cantidad_recogida}/{item.cantidad_solicitada}
                </div>
                {orden.estado === 'EN_PROCESO' && (
                  <button
                    className={`btn btn-sm ${item.completado === 'SI' ? 'btn-success' : 'btn-outline'}`}
                    onClick={() => updateItemCompletado(item)}
                  >
                    {item.completado === 'SI' ? '✓ Recogido' : 'Marcar'}
                  </button>
                )}
                {item.completado === 'SI' && orden.estado !== 'EN_PROCESO' && (
                  <span className="badge badge-green">✓ OK</span>
                )}
              </div>
            ))}
          </div>

          {orden.estado === 'PENDIENTE' && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={() => changeEstado('EN_PROCESO')} disabled={updating}>▶ Iniciar Picking</button>
              <button className="btn btn-danger btn-outline" onClick={() => changeEstado('CANCELADO')} disabled={updating}>Cancelar Orden</button>
            </div>
          )}
          {orden.estado === 'EN_PROCESO' && (
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn btn-success" onClick={() => changeEstado('COMPLETADO')} disabled={updating}>✓ Completar Orden</button>
              <button className="btn btn-danger btn-outline" onClick={() => changeEstado('CANCELADO')} disabled={updating}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Picking() {
  const [ordenes, setOrdenes] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'new' | orden_obj | 'detail:id'
  const [detalle, setDetalle] = useState(null);
  const [filterEstado, setFilterEstado] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (filterEstado) params.estado = filterEstado;
    pickingAPI.list(params).then(r => setOrdenes(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    bodegasAPI.list().then(r => setBodegas(r.data));
    productosAPI.list().then(r => setProductos(r.data));
  }, []);

  useEffect(() => { load(); }, [filterEstado]);

  const loadDetalle = (id) => {
    pickingAPI.get(id).then(r => setDetalle(r.data));
  };

  const filtered = ordenes.filter(o =>
    !search ||
    o.numero_orden.toLowerCase().includes(search.toLowerCase()) ||
    o.bodega_origen_nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="topbar">
        <div>
          <h2>🚚 Órdenes de Picking</h2>
          <p>{ordenes.length} órdenes</p>
        </div>
        <div className="topbar-actions">
          <div className="search-bar">
            <MdSearch />
            <input placeholder="Buscar orden..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 150, padding: '8px 12px' }} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            {ESTADOS.map(e => <option key={e} value={e}>{e || 'Todos los estados'}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => setModal('new')}><MdAdd /> Nueva Orden</button>
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
                      <th>Nº Orden</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Bodega Origen</th>
                      <th>Bodega Destino</th>
                      <th>Ítems</th>
                      <th>Progreso</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9}><div className="empty-state"><MdLocalShipping /><p>No hay órdenes</p></div></td></tr>
                    ) : filtered.map(o => {
                      const done = o.items?.filter(i => i.completado === 'SI').length || 0;
                      const total = o.items?.length || 0;
                      const pct = total ? Math.round((done / total) * 100) : 0;
                      return (
                        <tr key={o.id}>
                          <td><strong style={{ fontFamily: 'monospace', fontSize: 12 }}>{o.numero_orden}</strong></td>
                          <td>{estadoBadge(o.estado)}</td>
                          <td>{prioridadBadge(o.prioridad)}</td>
                          <td>{o.bodega_origen_nombre}</td>
                          <td>{o.bodega_destino_nombre || <span style={{ color: '#94a3b8' }}>-</span>}</td>
                          <td style={{ textAlign: 'center' }}><strong>{total}</strong></td>
                          <td style={{ minWidth: 120 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="progress" style={{ flex: 1 }}>
                                <div className="progress-bar" style={{ width: `${pct}%`, background: pct === 100 ? '#10b981' : '#3b82f6' }} />
                              </div>
                              <span style={{ fontSize: 11, color: '#64748b', minWidth: 28 }}>{pct}%</span>
                            </div>
                          </td>
                          <td style={{ fontSize: 11, color: '#64748b' }}>
                            {format(new Date(o.created_at), "dd/MM/yy HH:mm")}
                          </td>
                          <td>
                            <button className="btn btn-outline btn-sm btn-icon" onClick={() => { loadDetalle(o.id); }}>
                              <MdVisibility />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal === 'new' && (
        <NuevaOrdenModal
          bodegas={bodegas} productos={productos}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}

      {detalle && (
        <DetalleModal
          orden={detalle}
          onClose={() => setDetalle(null)}
          onUpdate={() => { loadDetalle(detalle.id); load(); }}
        />
      )}
    </>
  );
}
