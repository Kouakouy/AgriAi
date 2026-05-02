'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Sprout, Plus, Calendar, MapPin, CheckCircle, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Crop { _id: string; name: string; type: string; plantedAt: string; location?: string; status: string; notes?: string; }

const STATUS_MAP: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  healthy:   { label: 'Saine',    cls: 'badge-green', icon: <CheckCircle size={12} /> },
  at_risk:   { label: 'À risque', cls: 'badge-amber',  icon: <AlertTriangle size={12} /> },
  diseased:  { label: 'Malade',   cls: 'badge-red',    icon: <AlertTriangle size={12} /> },
  harvested: { label: 'Récoltée', cls: 'badge-gray',   icon: <CheckCircle size={12} /> },
};

const CROP_TYPES = ['Maïs', 'Manioc', 'Riz', 'Arachide', 'Café', 'Cacao', 'Mil', 'Sorgho', 'Igname', 'Plantain', 'Tomate', 'Autre'];

export default function CropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', plantedAt: '', location: '', notes: '', status: 'healthy' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/crops').then(({ data }) => setCrops(data.crops || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.plantedAt) { toast.error('Remplissez les champs obligatoires'); return; }
    setSaving(true);
    try {
      const { data } = await api.post('/crops', form);
      setCrops((prev) => [data.crop, ...prev]);
      setShowModal(false);
      setForm({ name: '', type: '', plantedAt: '', location: '', notes: '', status: 'healthy' });
      toast.success('Culture ajoutée !');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette culture ?')) return;
    try {
      await api.delete(`/crops/${id}`);
      setCrops((prev) => prev.filter((c) => c._id !== id));
      toast.success('Culture supprimée');
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-green" style={{ marginBottom: '0.75rem', fontSize: '0.75rem' }}>
            <Sprout size={12} /> Suivi des cultures
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Mes Cultures</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Gérez et suivez l&apos;état de santé de vos plantations</p>
        </div>
        <button id="add-crop-btn" className="btn btn-primary glow-pulse" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Ajouter une culture
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {Object.entries(STATUS_MAP).map(([key, { label, cls }]) => {
          const count = crops.filter((c) => c.status === key).length;
          return (
            <div key={key} className="card glass" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Outfit' }}>{count}</div>
              <span className={`badge ${cls}`} style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Crops Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><span className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : crops.length === 0 ? (
        <div className="card glass fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <Sprout size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Aucune culture enregistrée</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Ajouter ma première culture</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {crops.map((crop) => {
            const s = STATUS_MAP[crop.status] || STATUS_MAP.healthy;
            return (
              <div key={crop._id} className="card glass" style={{ padding: '1.25rem', position: 'relative' }}>
                <button onClick={() => handleDelete(crop._id)}
                  style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.5 }}>
                  <X size={14} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--green-400)' }}>
                    <Sprout size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{crop.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{crop.type}</div>
                  </div>
                </div>
                <span className={`badge ${s.cls}`} style={{ fontSize: '0.7rem', display: 'inline-flex', marginBottom: '0.75rem' }}>
                  {s.icon} {s.label}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Calendar size={12} /> Planté le {new Date(crop.plantedAt).toLocaleDateString('fr-FR')}
                  </div>
                  {crop.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <MapPin size={12} /> {crop.location}
                    </div>
                  )}
                </div>
                {crop.notes && <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>{crop.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Crop Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="fade-in" style={{ width: '100%', maxWidth: 520, background: '#ffffff', borderRadius: '24px', padding: '2.5rem', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <X size={16} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-600)' }}>
                <Sprout size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: 'var(--text-primary)' }}>Ajouter une culture</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Remplissez les détails pour suivre votre parcelle.</p>
              </div>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nom de la parcelle *</label>
                <input className="form-input" placeholder="Ex: Champ Nord (Section A)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ height: '3rem', borderRadius: '12px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Type de culture *</label>
                  <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ height: '3rem', borderRadius: '12px', paddingLeft: '1rem', appearance: 'auto', background: 'var(--bg-input)' }}>
                    <option value="">Sélectionner...</option>
                    {CROP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date de semis *</label>
                  <input className="form-input" type="date" value={form.plantedAt} onChange={(e) => setForm({ ...form, plantedAt: e.target.value })} style={{ height: '3rem', borderRadius: '12px', color: form.plantedAt ? 'inherit' : 'var(--text-muted)' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Localisation</label>
                  <div style={{ position: 'relative' }}>
                     <MapPin size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     <input className="form-input" placeholder="Ex: Divo, CI" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={{ height: '3rem', borderRadius: '12px', paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ height: '3rem', borderRadius: '12px', paddingLeft: '1rem', appearance: 'auto', background: 'var(--bg-input)' }}>
                    <option value="healthy">Saine</option>
                    <option value="at_risk">À risque</option>
                    <option value="diseased">Malade</option>
                    <option value="harvested">Récoltée</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Observations (optionnel)</label>
                <textarea className="form-input" placeholder="Détails sur la terre, les engrais utilisés..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical', minHeight: '80px', borderRadius: '12px', padding: '1rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1, height: '3rem', borderRadius: '12px', fontWeight: 600 }} onClick={() => setShowModal(false)}>Annuler</button>
                <button id="save-crop-btn" type="submit" className="btn btn-primary" style={{ flex: 1, height: '3rem', borderRadius: '12px', fontWeight: 600 }} disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Enregistrer la culture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
