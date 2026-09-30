'use client'

import { useEffect, useMemo, useState } from 'react'

const models = [
  ['gpt-4o-mini', 'Rapide · économique'], ['gpt-4o', 'Polyvalent'], ['gpt-4.1', 'Précis'], ['gpt-4.1-mini', 'Rapide · précis'], ['o3-mini', 'Raisonnement'], ['o1', 'Raisonnement avancé']
]
const starter = [{ role: 'assistant', content: 'Salut ! Je suis prêt à t’aider à travailler. Pose-moi une question, colle un texte ou demande-moi de t’expliquer quelque chose.' }]

export default function Home() {
  const [messages, setMessages] = useState(starter)
  const [input, setInput] = useState('')
  const [model, setModel] = useState('gpt-4o-mini')
  const [busy, setBusy] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem('tor-chat') || 'null'); if (saved?.messages) setMessages(saved.messages); setUnlocked(localStorage.getItem('tor-unlocked') === 'true') } catch {} }, [])
  useEffect(() => { localStorage.setItem('tor-chat', JSON.stringify({ messages, model })) }, [messages, model])
  const label = useMemo(() => models.find(([id]) => id === model)?.[1], [model])

  function unlock() {
    if (code.trim() && code.trim() === (process.env.NEXT_PUBLIC_RICH_CODE || 'riche')) { setUnlocked(true); localStorage.setItem('tor-unlocked', 'true'); setCode(''); setError('') }
    else setError('Code incorrect.')
  }
  async function send(e) {
    e?.preventDefault(); if (!input.trim() || busy || !unlocked) return
    const next = [...messages, { role: 'user', content: input.trim() }]; setMessages(next); setInput(''); setBusy(true); setError('')
    try { const r = await fetch('/api/chat', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ messages: next.filter((m, i) => i > 0), model }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); setMessages([...next, { role: 'assistant', content: data.content }]) } catch (e) { setError(e.message); setMessages(next) } finally { setBusy(false) }
  }
  function clear() { setMessages(starter); localStorage.removeItem('tor-chat') }

  return <main className="shell">
    <header><div className="brand"><span className="mark">t</span><div><strong>tor.net</strong><small>ton espace de travail IA</small></div></div><button className="ghost" onClick={clear}>Effacer</button></header>
    <section className="workspace">
      <aside><div className="eyebrow">MODÈLE</div><select value={model} onChange={e => setModel(e.target.value)}>{models.map(([id, desc]) => <option key={id} value={id}>{id} — {desc}</option>)}</select><div className="model-note">{label}</div><div className="rule"/><div className="eyebrow">ACCÈS</div>{unlocked ? <div className="access"><span/>Déverrouillé</div> : <><p className="hint">Entre ton code riche pour commencer à discuter.</p><div className="unlock"><input value={code} onChange={e => setCode(e.target.value)} placeholder="Code riche" type="password" onKeyDown={e => e.key === 'Enter' && unlock()}/><button onClick={unlock}>OK</button></div></>}<p className="local">Tes conversations restent dans ce navigateur.</p></aside>
      <section className="chat"><div className="chat-head"><div><div className="eyebrow">SESSION LOCALE</div><h1>On travaille ?</h1></div><span className="pill">{model}</span></div><div className="messages">{messages.map((m, i) => <div className={'message ' + m.role} key={i}><div className="avatar">{m.role === 'assistant' ? 't' : 'toi'}</div><div className="bubble">{m.content}</div></div>)}{busy && <div className="message assistant"><div className="avatar">t</div><div className="bubble typing"><i/><i/><i/></div></div>}</div>{error && <div className="error">{error}</div>}<form onSubmit={send}><textarea value={input} onChange={e => setInput(e.target.value)} disabled={!unlocked || busy} placeholder={unlocked ? 'Écris ton message…' : 'Déverrouille l’accès pour commencer'} rows="1"/><button className="send" disabled={!unlocked || busy || !input.trim()} aria-label="Envoyer">↗</button></form><div className="foot">Utilise l’IA comme un copilote : vérifie toujours les réponses importantes.</div></section>
    </section>
  </main>
}
