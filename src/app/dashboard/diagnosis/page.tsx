'use client';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Microscope, Image as ImageIcon, CheckCircle, AlertTriangle, Clock, X, Leaf, RotateCcw, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Diagnosis {
  _id: string;
  imageUrl: string;
  disease?: string;
  severity?: string;
  confidence?: number;
  causes?: string[];
  recommendations: string[];
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

const SEVERITY_STYLES: Record<string, { cls: string; label: string; iconColor: string }> = {
  low:      { cls: 'severity-low',      label: 'Faible',   iconColor: 'var(--green-400)' },
  medium:   { cls: 'severity-medium',   label: 'Moyen',    iconColor: 'var(--amber-400)' },
  high:     { cls: 'severity-high',     label: 'Élevé',    iconColor: '#fb923c' },
  critical: { cls: 'severity-critical', label: 'Critique', iconColor: '#f87171' },
};

export default function DiagnosisPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [history, setHistory] = useState<Diagnosis[]>([]);
  const [polling, setPolling] = useState(false);

  // Load history
  useEffect(() => {
    api.get('/diagnosis').then(({ data }) => setHistory(data.diagnoses || [])).catch(() => {});
  }, []);

  // Poll for result
  useEffect(() => {
    if (!currentId || !polling) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/diagnosis/${currentId}`);
        if (data.diagnosis.status !== 'pending') {
          setResult(data.diagnosis);
          setPolling(false);
          setHistory((prev) => [data.diagnosis, ...prev.filter((d) => d._id !== currentId)]);
          clearInterval(interval);
          if (data.diagnosis.status === 'completed') toast.success('Diagnostic terminé !');
          else toast.error('Échec du diagnostic');
        }
      } catch { clearInterval(interval); setPolling(false); }
    }, 2500);
    return () => clearInterval(interval);
  }, [currentId, polling]);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024, multiple: false,
  });

  const handleAnalyze = async () => {
    if (!file) { toast.error('Sélectionnez une image'); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const { data } = await api.post('/diagnosis', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s — L'IA peut prendre du temps
      });
      // Réponse synchrone : diagnostic déjà complété
      setResult(data.diagnosis);
      setHistory((prev) => [data.diagnosis, ...prev]);
      toast.success('Diagnostic terminé !');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'analyse';
      toast.error(msg);
      console.error('Diagnosis error:', err.response?.data);
    } finally { setUploading(false); }
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); setCurrentId(null); setPolling(false); };

  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-green" style={{ marginBottom: '0.75rem', fontSize: '0.75rem' }}>
          <Microscope size={12} /> AgriBot Vision
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Diagnostic des Cultures</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Photographiez votre plante — AgriBot identifie la maladie et vous donne des recommandations
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dropzone */}
          <div {...getRootProps()} style={{
            border: `2px dashed ${isDragActive ? 'var(--green-400)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', cursor: 'pointer',
            background: isDragActive ? 'rgba(34,197,94,0.05)' : 'var(--bg-card)',
            transition: 'all var(--transition)', minHeight: 220,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <input {...getInputProps()} id="diagnosis-upload" />
            {preview ? (
              <div style={{ position: 'relative', width: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{file?.name}</div>
              </div>
            ) : (
              <>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {isDragActive ? <Upload size={24} color="var(--green-400)" /> : <ImageIcon size={24} color="var(--text-muted)" />}
                </div>
                <p style={{ color: isDragActive ? 'var(--green-400)' : 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {isDragActive ? 'Relâchez pour analyser' : 'Glissez une photo ici'}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ou cliquez pour sélectionner · JPG, PNG, WebP · 10MB max</p>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button id="analyze-btn" className="btn btn-primary" style={{ flex: 1 }}
              onClick={handleAnalyze} disabled={!file || uploading}>
              {uploading
                ? <><span className="spinner" /> Analyse en cours...</>
                : <><Microscope size={16} /> Analyser la plante</>}
            </button>
            {preview && (
              <button className="btn btn-outline btn-icon" onClick={reset} title="Réinitialiser">
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right: Result */}
        <div>
          {polling && !result && (
            <div className="card glass" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div className="spinner glow-pulse" style={{ width: 40, height: 40, margin: '0 auto 1rem', borderWidth: 3 }} />
              <p style={{ color: 'var(--green-400)', fontWeight: 600, marginBottom: '0.5rem' }}>AgriBot analyse votre plante...</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Identification de la maladie en cours</p>
            </div>
          )}

          {result?.status === 'completed' && (
            <div className="card glass fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <CheckCircle size={18} color="var(--green-400)" />
                <h3 style={{ fontSize: '1rem', margin: 0 }}>Résultat du diagnostic</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Maladie détectée</div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{result.disease}</div>
                  </div>
                  {result.severity && (
                    <span className={`badge ${SEVERITY_STYLES[result.severity]?.cls}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Activity size={12} color={SEVERITY_STYLES[result.severity]?.iconColor} />
                      {SEVERITY_STYLES[result.severity]?.label}
                    </span>
                  )}
                </div>

                {result.confidence != null && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Confiance IA</div>
                    <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${result.confidence}%`, background: 'var(--gradient-brand)', borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--green-400)', marginTop: '0.25rem', textAlign: 'right' }}>{result.confidence}%</div>
                  </div>
                )}

                {result.causes && result.causes.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Causes probables</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {result.causes.map((c, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <AlertTriangle size={12} color="var(--amber-400)" style={{ flexShrink: 0, marginTop: 3 }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Recommandations</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {result.recommendations.map((r, i) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <Leaf size={12} color="var(--green-400)" style={{ flexShrink: 0, marginTop: 3 }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {result?.status === 'failed' && (
            <div className="card glass fade-in" style={{ padding: '1.5rem', borderColor: 'rgba(220,38,38,0.3)', textAlign: 'center' }}>
              <AlertTriangle size={32} color="#f87171" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: '#f87171', fontWeight: 600 }}>Échec de l&apos;analyse</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Réessayez avec une image plus claire</p>
            </div>
          )}

          {!polling && !result && (
            <div className="card glass" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(15, 34, 20, 0.3)', border: '1px dashed var(--border)' }}>
              <Microscope size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Le résultat du diagnostic apparaîtra ici</p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Historique des analyses</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {history.slice(0, 8).map((d) => (
              <div key={d._id} className="card glass" style={{ padding: '1rem', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setResult(d)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  {d.status === 'completed' ? <CheckCircle size={14} color="var(--green-400)" />
                    : d.status === 'pending' ? <Clock size={14} color="var(--amber-400)" />
                    : <AlertTriangle size={14} color="#f87171" />}
                  {d.severity && (
                    <span className={`badge ${SEVERITY_STYLES[d.severity]?.cls}`} style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Activity size={10} color={SEVERITY_STYLES[d.severity]?.iconColor} />
                      {SEVERITY_STYLES[d.severity]?.label}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.disease || 'Analyse...'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
