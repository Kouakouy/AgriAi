'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, User, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const LANGUAGES = [
  { value: 'fr', label: '🇫🇷 Français' },
  { value: 'en', label: '🇬🇧 English' },
  { value: 'sw', label: '🇰🇪 Kiswahili' },
  { value: 'ha', label: '🇳🇬 Hausa' },
];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', language: 'fr', location: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Remplissez les champs obligatoires'); return; }
    if (form.password.length < 6) { toast.error('Mot de passe trop court (6 caractères minimum)'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.user, data.token);
      toast.success(`Bienvenue sur AgriAI Africa, ${data.user.name} ! 🌱`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally { setLoading(false); }
  };

  const inputStyle = (icon = true) => ({ paddingLeft: icon ? '2.5rem' : '1rem' });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(34,197,94,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={22} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              AgriAI <span style={{ color: 'var(--green-400)' }}>Africa</span>
            </span>
          </Link>
          <h2 style={{ marginTop: '1.25rem', marginBottom: '0.35rem' }}>Créer un compte</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rejoignez des milliers d&apos;agriculteurs africains</p>
        </div>

        <div className="card glass fade-in" style={{ padding: '2.5rem', animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-name" className="form-input" type="text" placeholder="Votre nom" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle()} />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-email" className="form-input" type="email" placeholder="vous@exemple.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle()} />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-password" className="form-input" type={showPwd ? 'text' : 'password'} placeholder="Min. 6 caractères" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="form-group">
              <label className="form-label">Langue préférée</label>
              <select id="reg-language" className="form-input" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                style={{ paddingLeft: '1rem', appearance: 'auto', background: 'var(--bg-input)' }}>
                {LANGUAGES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">Localisation <span style={{ color: 'var(--text-muted)' }}>(optionnel)</span></label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input id="reg-location" className="form-input" type="text" placeholder="Ex: Abidjan, Côte d'Ivoire" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} style={inputStyle()} />
              </div>
            </div>

            <button id="reg-submit" type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? <span className="spinner" /> : <><ArrowRight size={16} /> Créer mon compte</>}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/login" style={{ color: 'var(--green-400)', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
