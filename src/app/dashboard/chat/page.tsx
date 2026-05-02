'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, Plus, MessageCircle, Trash2, Brain, Leaf, Bot, User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import api from '@/lib/api';

interface Message { role: 'user' | 'model'; content: string; createdAt?: string; }
interface Session { _id: string; title: string; updatedAt: string; }

const SUGGESTIONS = [
  'Comment traiter la rouille du maïs ?',
  'Quand planter le manioc en Côte d\'Ivoire ?',
  'Les meilleures pratiques pour l\'arachide',
  'Symptômes de la mosaïque du manioc',
  'Comment améliorer la fertilité de mon sol ?',
];

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load sessions
  useEffect(() => {
    api.get('/chat/sessions')
      .then(({ data }) => setSessions(data.sessions || []))
      .catch(() => {})
      .finally(() => setLoadingSessions(false));
  }, []);

  // Load messages when session changes
  useEffect(() => {
    if (!activeId) return;
    api.get(`/chat/sessions/${activeId}`)
      .then(({ data }) => setMessages(data.session.messages || []))
      .catch(() => {});
  }, [activeId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createSession = async () => {
    try {
      const { data } = await api.post('/chat/sessions', { title: 'Nouvelle conversation' });
      setSessions((prev) => [data.session, ...prev]);
      setActiveId(data.session._id);
      setMessages([]);
    } catch { toast.error('Impossible de créer une session'); }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s._id !== id));
      if (activeId === id) { setActiveId(null); setMessages([]); }
      toast.success('Session supprimée');
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || sending) return;

    // Auto-create session if none
    let sid = activeId;
    if (!sid) {
      try {
        const { data } = await api.post('/chat/sessions', { title: msg.substring(0, 60) });
        sid = data.session._id;
        setActiveId(sid);
        setSessions((prev) => [data.session, ...prev]);
      } catch { toast.error('Erreur de session'); return; }
    }

    setInput('');
    setSending(true);
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);

    try {
      const { data } = await api.post(`/chat/sessions/${sid}/message`, { message: msg });
      setMessages((prev) => [...prev, { role: 'model', content: data.aiMessage.content }]);
      // Update session title in sidebar
      setSessions((prev) => prev.map((s) => s._id === sid ? { ...s, title: msg.substring(0, 50) } : s));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur IA');
      setMessages((prev) => prev.slice(0, -1)); // Remove optimistic message
    } finally { setSending(false); }
  };

  return (
    <div className="fade-in" style={{ height: 'calc(100vh - 4rem)', display: 'flex', gap: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Sessions Sidebar ─────────────────────────── */}
      <div className="card glass" style={{ width: 260, flexShrink: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)' }}>
        <button id="new-chat-btn" className="btn btn-outline btn-sm w-full glow-pulse" onClick={createSession} style={{ justifyContent: 'center', borderColor: 'var(--green-400)', color: 'var(--green-400)' }}>
          <Plus size={14} /> Nouvelle session
        </button>

        <div className="divider" style={{ margin: '0.5rem 0' }} />

        {loadingSessions ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <span className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <MessageCircle size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
            Aucune conversation
          </div>
        ) : (
          sessions.map((s) => (
            <div key={s._id} onClick={() => { setActiveId(s._id); }}
              style={{
                padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                background: activeId === s._id ? 'rgba(34,197,94,0.1)' : 'transparent',
                border: `1px solid ${activeId === s._id ? 'rgba(34,197,94,0.2)' : 'transparent'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all var(--transition)',
              }}>
              <span style={{ fontSize: '0.85rem', color: activeId === s._id ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, fontWeight: activeId === s._id ? 600 : 400 }}>
                {s.title}
              </span>
              <button onClick={(e) => deleteSession(s._id, e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', flexShrink: 0, opacity: activeId === s._id ? 0.8 : 0.4 }}
                className="btn btn-ghost btn-icon" title="Supprimer">
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Chat Area (Claude / ChatGPT style) ───────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', height: '100%', overflow: 'hidden', background: 'transparent' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
           <div className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>
             <Brain size={12} /> Google Gemini 1.5 Pro
           </div>
           <div className="badge badge-gray" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: 'none' }}>
             <CheckCircle size={12} color="var(--green-400)" /> Modèle Agricole Actif
           </div>
        </div>

        {/* Messages List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="chat-scroll-area">
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', paddingBottom: '10vh' }}>
              <div style={{ width: 64, height: 64, borderRadius: '20px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}>
                <Bot size={32} color="#fff" />
              </div>
              <h2 style={{ marginBottom: '0.75rem', fontSize: '1.75rem', fontWeight: 800 }}>Bonjour ! Comment puis-je vous aider ?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: 500, textAlign: 'center' }}>
                Je suis AgriBot, votre expert agricole propulsé par l'IA. Posez-moi des questions sur vos cultures, les maladies ou les rendements.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 700, width: '100%' }}>
                {SUGGESTIONS.map((s) => (
                  <div key={s} onClick={() => sendMessage(s)} className="card glass" style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Leaf size={16} color="var(--green-400)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: m.role === 'user' ? '1rem 1.5rem' : '0.5rem 1.5rem', borderRadius: '16px', background: m.role === 'user' ? 'rgba(255,255,255,0.02)' : 'transparent', maxWidth: 900, margin: '0 auto', width: '100%' }}>
              {/* Avatar */}
              <div style={{ width: 36, height: 36, borderRadius: m.role === 'user' ? '50%' : '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: m.role === 'user' ? 'var(--bg-card)' : 'var(--gradient-brand)',
                border: '1px solid rgba(255,255,255,0.1)',
                marginTop: m.role === 'model' ? 4 : 0
              }}>
                {m.role === 'user' ? <User size={16} color="var(--text-muted)" /> : <Bot size={18} color="#fff" />}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-primary)', paddingTop: 6 }} className="markdown-content">
                {m.role === 'user' ? (
                  <div style={{ whiteSpace: 'pre-wrap', fontWeight: 500 }}>{m.content}</div>
                ) : (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                )}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {sending && (
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '0.5rem 1.5rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
              <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.7 }}>
                <Bot size={18} color="#fff" />
              </div>
              <div style={{ padding: '0.75rem 0', display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-400)', animation: `pulse-glow 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} style={{ height: 40 }} />
        </div>

        {/* ── Floating Input Box ───────────────────────── */}
        <div style={{ paddingTop: '1rem', background: 'linear-gradient(to top, var(--bg-base) 60%, transparent)', position: 'relative', zIndex: 10, paddingBottom: '1rem' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} 
              className="glass"
              style={{ display: 'flex', gap: '0.75rem', background: 'rgba(15, 34, 20, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '0.6rem 0.6rem 0.6rem 1.25rem', alignItems: 'flex-end', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              
              <textarea 
                id="chat-input" 
                placeholder="Posez une question sur vos cultures..." 
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
                }} 
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && !e.shiftKey) { 
                    e.preventDefault(); 
                    sendMessage(); 
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                  } 
                }}
                disabled={sending}
                rows={1}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '0.4rem 0', fontSize: '0.95rem', resize: 'none', outline: 'none', maxHeight: 150, fontFamily: 'inherit', lineHeight: 1.5, minHeight: '24px' }} 
              />
              
              <button id="chat-send" type="submit" className="btn btn-primary btn-icon glow-pulse" disabled={!input.trim() || sending}
                style={{ borderRadius: '50%', width: 40, height: 40, flexShrink: 0, padding: 0 }}>
                <Send size={16} style={{ marginLeft: -2 }} />
              </button>
            </form>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
              AgriBot peut générer des informations inexactes. Vérifiez toujours les conseils critiques.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
