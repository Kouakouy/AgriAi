'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.email) newErrors.email = 'L\'adresse email est requise';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Format d\'email invalide';
    if (!form.password) newErrors.password = 'Le mot de passe est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.token);
      toast.success(`Bienvenue, ${data.user.name} !`);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Identifiants incorrects ou serveur injoignable.';
      setErrors({ form: msg });
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-layout">
      {/* Left Column: Form */}
      <div className="auth-left">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>
            <ArrowLeft size={18} /> Retour
          </Link>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={16} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              AgriAI <span style={{ color: 'var(--green-600)' }}>Africa</span>
            </span>
          </Link>
        </div>

        <div className="auth-form-container fade-in" style={{ margin: 'auto', width: '100%' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Bon retour ! 👋</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Saisissez vos identifiants pour accéder à votre espace.</p>
          </div>

          {errors.form && (
            <div className="fade-in" style={{ padding: '0.85rem', background: '#fef2f2', border: '1px solid #f87171', borderRadius: '12px', color: '#b91c1c', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-email"
                  className="form-input"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors(prev => ({...prev, email: ''})); }}
                  style={{ paddingLeft: '2.75rem', height: '3rem', borderRadius: '12px', borderColor: errors.email ? '#ef4444' : undefined }}
                />
              </div>
              {errors.email && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={14}/> {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  id="login-password"
                  className="form-input"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors(prev => ({...prev, password: ''})); }}
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem', height: '3rem', borderRadius: '12px', borderColor: errors.password ? '#ef4444' : undefined }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={14}/> {errors.password}</span>}
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem', height: '3rem', borderRadius: '12px', fontSize: '1rem' }}>
              {loading ? <span className="spinner" /> : <><ArrowRight size={18} /> Se connecter</>}
            </button>
          </form>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Pas encore de compte ?{' '}
            <Link href="/auth/register" style={{ color: 'var(--green-600)', fontWeight: 600, textDecoration: 'none' }}>Créer un compte gratuit</Link>
          </div>
        </div>
      </div>

      {/* Right Column: Image */}
      <div className="auth-right">
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/auth-cover.png" alt="Champ agricole au lever du soleil" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)' }} />
          <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem', color: '#fff' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem', fontFamily: 'Outfit', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              L'IA au service de la terre.
            </h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, maxWidth: 500 }}>
              Rejoignez une communauté grandissante d'agriculteurs modernes qui sécurisent et maximisent leurs rendements chaque jour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
