import { useState, useEffect } from 'react';
import { bodegasAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdDelete, MdWarehouse, MdSearch } from 'react-icons/md';

function BodegaModal({ bodega, onClose, onSaved }) {
  const [form, setForm] = useState(bodega || { nombre: '', codigo: '', direccion: '', responsable: '', telefono: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (bodega) {
        await bodegasAPI.update(bodega.id, form);
        toast.success('Bodega actualizada');
      } else {
        await bodegasAPI.create(form);
        toast.success('Bodega creada');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{bodega ? 'Editar Bodega' : 'Nueva Bodega'}</h3>
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
                <label className="form-label">Código *</label>
                <input className="form-control" value={form.codigo} onChange={e => set('codigo', e.target.value)} placeholder="BOD-001" required disabled={!!bodega} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input className="form-control" value={form.direccion} onChange={e => set('direccion', e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Responsable</label>
                <input className="form-control" value={form.responsable} onChange={e => set('responsable', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-control" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Bodegas() {
  const [bodegas, setBodegas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'new' | bodega_obj
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    bodegasAPI.list().then(r => setBodegas(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta bodega?')) return;
    try {
      await bodegasAPI.delete(id);
      toast.success('Bodega eliminada');
      load();
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const filtered = bodegas.filter(b =>
    b.nombre.toLowerCase().includes(search.toLowerCase()) ||
    b.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="topbar">
        <div>
          <h2>🏭 Bodegas</h2>
          <p>{bodegas.length} bodegas registradas</p>
        </div>
        <div className="topbar-actions">
          <div className="search-bar">
            <MdSearch />
            <input placeholder="Buscar bodega..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setModal('new')}>
            <MdAdd /> Nueva Bodega
          </button>
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
                      <th>Código</th>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Responsable</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={7}>
                        <div className="empty-state"><MdWarehouse /><p>No hay bodegas registradas</p></div>
                      </td></tr>
                    ) : filtered.map(b => (
                      <tr key={b.id}>
                        <td><code style={{ fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 6 }}>{b.codigo}</code></td>
                        <td><strong>{b.nombre}</strong></td>
                        <td style={{ color: '#64748b' }}>{b.direccion || '-'}</td>
                        <td>{b.responsable || '-'}</td>
                        <td>{b.telefono || '-'}</td>
                        <td><span className={`badge ${b.is_active ? 'badge-green' : 'badge-red'}`}>{b.is_active ? 'Activa' : 'Inactiva'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-outline btn-sm btn-icon" onClick={() => setModal(b)} title="Editar"><MdEdit /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(b.id)} title="Eliminar"><MdDelete /></button>
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
        <BodegaModal
          bodega={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); load(); }}
        />
      )}
    </>
  );
}
