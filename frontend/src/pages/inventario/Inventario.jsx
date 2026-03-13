import { useState, useEffect } from 'react';
import { inventarioAPI, bodegasAPI, productosAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdSearch, MdTrendingUp, MdTrendingDown, MdSwapVert } from 'react-icons/md';

function AjusteModal({ inv, onClose, onSaved }) {
  const [nuevaCant, setNuevaCant] = useState(inv.cantidad_disponible);
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) { toast.error('El motivo es requerido'); return; }
    setLoading(true);
    try {
      await inventarioAPI.ajustar({ bodega_id: inv.bodega_id, producto_id: inv.producto_id, nueva_cantidad: +nuevaCant, motivo });
      toast.success('Stock ajustado');
      onSaved();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); }
    finally { setLoading(false); }
  };

  const diff = nuevaCant - inv.cantidad_disponible;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Ajustar Stock</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <strong>{inv.producto_nombre}</strong>
              <div style={{ fontSize: 12, color: '#64748b' }}>{inv.producto_sku} — {inv.bodega_nombre}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 20 }}>
                <span style={{ fontSize: 13 }}>Stock actual: <strong>{inv.cantidad_disponible}</strong></span>
                {diff !== 0 && (
                  <span style={{ fontSize: 13, color: diff > 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {diff > 0 ? <MdTrendingUp /> : <MdTrendingDown />}
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Nueva Cantidad</label>
              <input className="form-control" type="number" step="0.01" min="0" value={nuevaCant} onChange={e => setNuevaCant(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Motivo del ajuste *</label>
              <input className="form-control" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ej: Conteo físico, Merma, Ingreso de mercadería..." required />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Ajustando...' : 'Aplicar Ajuste'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NuevoRegistroModal({ bodegas, productos, onClose, onSaved }) {
  const [form, setForm] = useState({ bodega_id: '', producto_id: '', cantidad_disponible: 0, stock_minimo: 0, ubicacion_estante: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inventarioAPI.create({ ...form, bodega_id: +form.bodega_id, producto_id: +form.producto_id, cantidad_disponible: +form.cantidad_disponible, stock_minimo: +form.stock_minimo });
      toast.success('Registro creado');
      onSaved();
    } catch (err) { toast.error(err.response?.data?.detail || 'Error'); }
    finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>Nuevo Registro de Inventario</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Bodega *</label>
              <select className="form-control" value={form.bodega_id} onChange={e => set('bodega_id', e.target.value)} required>
                <option value="">Selecciona bodega</option>
                {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Producto *</label>
              <select className="form-control" value={form.producto_id} onChange={e => set('producto_id', e.target.value)} required>
                <option value="">Selecciona producto</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.sku})</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Cantidad Inicial</label>
                <input className="form-control" type="number" min="0" step="0.01" value={form.cantidad_disponible} onChange={e => set('cantidad_disponible', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Mínimo</label>
                <input className="form-control" type="number" min="0" step="0.01" value={form.stock_minimo} onChange={e => set('stock_minimo', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Ubicación en Estante</label>
              <input className="form-control" value={form.ubicacion_estante} onChange={e => set('ubicacion_estante', e.target.value)} placeholder="A-01-01" />
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

export default function Inventario() {
  const [inv, setInv] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filterBodega, setFilterBodega] = useState('');
  const [bajoStockOnly, setBajoStockOnly] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (filterBodega) params.bodega_id = filterBodega;
    if (bajoStockOnly) params.bajo_stock = true;
    inventarioAPI.list(params).then(r => setInv(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    bodegasAPI.list().then(r => setBodegas(r.data));
    productosAPI.list().then(r => setProductos(r.data));
  }, []);

  useEffect(() => { load(); }, [filterBodega, bajoStockOnly]);

  const filtered = inv.filter(i =>
    !search || i.producto_nombre?.toLowerCase().includes(search.toLowerCase()) ||
    i.producto_sku?.toLowerCase().includes(search.toLowerCase()) ||
    i.bodega_nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="topbar">
        <div>
          <h2>📊 Inventario</h2>
          <p>{inv.length} registros</p>
        </div>
        <div className="topbar-actions">
          <div className="search-bar">
            <MdSearch />
            <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 160, padding: '8px 12px' }} value={filterBodega} onChange={e => setFilterBodega(e.target.value)}>
            <option value="">Todas las bodegas</option>
            {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
          </select>
          <button className={`btn ${bajoStockOnly ? 'btn-warning' : 'btn-outline'}`} onClick={() => setBajoStockOnly(!bajoStockOnly)}>
            ⚠️ {bajoStockOnly ? 'Ver todos' : 'Bajo stock'}
          </button>
          <button className="btn btn-primary" onClick={() => setModal('new')}><MdAdd /> Nuevo Registro</button>
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
                      <th>Producto</th>
                      <th>SKU</th>
                      <th>Bodega</th>
                      <th>Estante</th>
                      <th>Disponible</th>
                      <th>Reservado</th>
                      <th>Stock Mín.</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={9}><div className="empty-state"><MdSwapVert /><p>Sin registros</p></div></td></tr>
                    ) : filtered.map(i => {
                      const bajoCant = i.cantidad_disponible <= i.stock_minimo;
                      return (
                        <tr key={i.id}>
                          <td><strong>{i.producto_nombre}</strong></td>
                          <td><code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{i.producto_sku}</code></td>
                          <td>{i.bodega_nombre}</td>
                          <td>{i.ubicacion_estante || '-'}</td>
                          <td>
                            <strong style={{ color: bajoCant ? '#ef4444' : '#065f46', fontSize: 15 }}>{i.cantidad_disponible}</strong>
                          </td>
                          <td style={{ color: '#64748b' }}>{i.cantidad_reservada}</td>
                          <td style={{ color: '#64748b' }}>{i.stock_minimo}</td>
                          <td>
                            <span className={`badge ${bajoCant ? 'badge-red' : 'badge-green'}`}>
                              {bajoCant ? '⚠️ Bajo' : 'OK'}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-outline btn-sm" onClick={() => setModal(i)}>
                              <MdEdit /> Ajustar
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
        <NuevoRegistroModal bodegas={bodegas} productos={productos} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />
      )}
      {modal && modal !== 'new' && (
        <AjusteModal inv={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />
      )}
    </>
  );
}
