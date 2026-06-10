import { useState } from 'react'
import { EMPTY_ACTIVITY, VIEW_OPTIONS, LEVEL_OPTIONS, formatDuration, slugify } from '../schema.js'

const CARD_FEATURES = [
  { key: 'timer',       label: '⏱ Timer',       desc: 'Visar en nedräkningstimer baserad på durationSeconds' },
  { key: 'guidedSteps', label: '📋 Guidad',      desc: 'Visar stegen ett i taget med Nästa-knapp' },
  { key: 'speech',      label: '🔊 Uppläsning',  desc: 'Läser upp aktivitetens innehåll via TTS' },
  { key: 'share',       label: '📤 Dela',        desc: 'Visar dela-knapp på detta kort' },
  { key: 'printView',   label: '🖨️ Skriv ut',    desc: 'Visar utskriftsknapp på detta kort' },
]

function ActivityCard({ activity, index, onEdit, onDelete }) {
  const durStr = formatDuration(activity.durationSeconds)
  const levelOpt = LEVEL_OPTIONS.find(l => l.value === activity.level)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 14px', background: 'var(--bg-card)',
      border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'var(--transition)',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-light)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <span style={{ fontSize: 12, color: 'var(--text-3)', width: 32, flexShrink: 0 }}>#{index + 1}</span>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{activity.emoji || '📌'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activity.title || <span style={{ color: 'var(--text-3)' }}>Utan titel</span>}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
          {[activity.category, durStr, levelOpt?.label].filter(Boolean).join(' · ')}
          {activity.steps?.length > 0 && <span style={{ marginLeft: 6, color: 'var(--green)' }}>✓ {activity.steps.length} steg</span>}
          {activity._aiGenerated && <span style={{ marginLeft: 6, color: 'var(--accent)', fontSize: 10 }}>AI</span>}
        </div>
      </div>
      {Object.keys(activity.cardFeatures || {}).length > 0 && (
        <span className="tag" style={{ background: 'var(--blue-dim)', color: 'var(--blue)', fontSize: 10 }}>
          {Object.keys(activity.cardFeatures).length} overrides
        </span>
      )}
      <button onClick={() => onEdit(index)} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12, flexShrink: 0 }}>
        Redigera
      </button>
      <button onClick={() => onDelete(index)} style={{
        width: 28, height: 28, borderRadius: 6, background: 'transparent', border: 'none',
        color: 'var(--text-3)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>×</button>
    </div>
  )
}

function ActivityEditor({ activity, categories, onSave, onClose }) {
  const [local, setLocal] = useState({ ...EMPTY_ACTIVITY, ...activity })
  const upd    = (patch) => setLocal(prev => ({ ...prev, ...patch }))
  const updCF  = (key, val) => setLocal(prev => ({ ...prev, cardFeatures: { ...prev.cardFeatures, [key]: val } }))

  const cats = (categories || []).map(c => typeof c === 'string' ? { id: slugify(c), label: c } : c)

  // Duration helpers
  const durMin = Math.round((local.durationSeconds || 600) / 60)
  const setDurMin = (m) => upd({ durationSeconds: parseInt(m || 10) * 60 })

  const addStep = () => upd({ steps: [...(local.steps || []), ''] })
  const setStep = (i, val) => {
    const steps = [...(local.steps || [])]
    steps[i] = val
    upd({ steps })
  }
  const removeStep = (i) => upd({ steps: (local.steps || []).filter((_, idx) => idx !== i) })

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 600, background: 'var(--bg-panel)',
        border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)',
        maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)',
        animation: 'fadeIn 0.18s ease',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontSize: 16 }}>{local.title ? `Redigera: ${local.title}` : 'Ny aktivitet'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 20, cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

          {/* Emoji + Titel */}
          <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label className="label">Emoji</label>
              <input className="input-base" value={local.emoji} onChange={e => upd({ emoji: e.target.value })}
                style={{ fontSize: 20, textAlign: 'center', padding: '7px 4px' }} maxLength={2} />
            </div>
            <div>
              <label className="label">Titel</label>
              <input className="input-base" value={local.title} onChange={e => upd({ title: e.target.value })} placeholder="Aktivitetens namn" />
            </div>
          </div>

          {/* Beskrivning */}
          <div style={{ marginBottom: 14 }}>
            <label className="label">Beskrivning</label>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>
              1–3 meningar som motiverar och förklarar aktiviteten. Visas i kortets förhandsvisning.
            </p>
            <textarea className="input-base" value={local.description} rows={3}
              onChange={e => upd({ description: e.target.value })}
              placeholder="Beskriv vad aktiviteten innebär och varför man ska göra den."
              style={{ resize: 'vertical' }} />
          </div>

          {/* Kategori + Tid + Nivå */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 140px', gap: 10, marginBottom: 14 }}>
            <div>
              <label className="label">Kategori</label>
              {cats.length > 0 ? (
                <select className="input-base" value={local.category} onChange={e => upd({ category: e.target.value })}>
                  <option value="">Välj...</option>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.label || c.id}</option>)}
                </select>
              ) : (
                <input className="input-base" value={local.category} onChange={e => upd({ category: e.target.value })} placeholder="t.ex. utomhus" />
              )}
            </div>
            <div>
              <label className="label">Tid (min)</label>
              <p style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>Lagras som sekunder i JSON.</p>
              <input className="input-base" type="number" min={1} max={480}
                value={durMin} onChange={e => setDurMin(e.target.value)} />
            </div>
            <div>
              <label className="label">Nivå</label>
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                {LEVEL_OPTIONS.map(l => (
                  <button key={l.value} onClick={() => upd({ level: l.value })} title={l.desc}
                    style={{
                      flex: 1, padding: '5px 2px', borderRadius: 6, fontSize: 11,
                      border: local.level === l.value ? `1px solid ${l.color}` : '1px solid var(--border)',
                      background: local.level === l.value ? `${l.color}20` : 'var(--bg-input)',
                      color: local.level === l.value ? l.color : 'var(--text-3)', cursor: 'pointer',
                    }}>{l.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Förberedelsetid + Rekvisita */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label className="label">Förberedelsetid (min)</label>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 4 }}>
                Hur lång tid tar det att förbereda? 0 = kan göras direkt. Används av "Redo nu"-filtret.
              </p>
              <input className="input-base" type="number" min={0} max={120}
                value={local.prepTimeMinutes || 0}
                onChange={e => upd({ prepTimeMinutes: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">Kräver rekvisita / material?</label>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>
                Kräver aktiviteten saker som inte alla har hemma?
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ val: false, label: 'Nej' }, { val: true, label: 'Ja' }].map(opt => (
                  <button key={String(opt.val)} onClick={() => upd({ requiresProps: opt.val })} style={{
                    flex: 1, padding: '7px', borderRadius: 'var(--radius-sm)', fontSize: 13,
                    border: local.requiresProps === opt.val ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: local.requiresProps === opt.val ? 'var(--accent-dim)' : 'var(--bg-input)',
                    color: local.requiresProps === opt.val ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer',
                  }}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Props list */}
          {local.requiresProps && (
            <div style={{ marginBottom: 14 }}>
              <label className="label">Material / rekvisita</label>
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>
                Lista vad som behövs. Visas på aktivitetskortet under en "Du behöver:"-rubrik.
              </p>
              <textarea className="input-base" rows={2}
                value={(local.props || []).join('\n')}
                onChange={e => upd({ props: e.target.value.split('\n').filter(Boolean) })}
                placeholder={"En sak per rad, t.ex.:\nPapper\nPennor\nSax"}
                style={{ resize: 'vertical', fontFamily: 'DM Mono, monospace', fontSize: 12 }} />
            </div>
          )}

          {/* Steps */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <label className="label" style={{ margin: 0 }}>Steg</label>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                  3–6 steg som förklarar hur aktiviteten görs. Visas i guidad visning och TTS. <strong style={{ color: local.steps?.length === 0 ? 'var(--red)' : 'var(--text-3)' }}>Obligatoriskt för fullständig Playtypus-kompatibilitet.</strong>
                </p>
              </div>
              <button className="btn btn-secondary" onClick={addStep} style={{ fontSize: 12, flexShrink: 0 }}>
                + Steg
              </button>
            </div>
            {(local.steps || []).length === 0 && (
              <div style={{
                padding: '10px 14px', background: 'var(--red-dim)', border: '1px solid var(--red)',
                borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-2)',
              }}>
                ⚠️ Inga steg tillagda. Lägg till minst 3 steg för att aktiviteten ska fungera med Guidad visning och TTS.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(local.steps || []).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: 12, color: 'var(--text-3)', width: 24, height: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{i + 1}.</span>
                  <input className="input-base" value={step}
                    onChange={e => setStep(i, e.target.value)}
                    placeholder={`Steg ${i + 1}...`}
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => removeStep(i)} style={{
                    width: 28, height: 32, background: 'transparent', border: 'none',
                    color: 'var(--text-3)', cursor: 'pointer', fontSize: 14, flexShrink: 0,
                  }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: 14 }}>
            <label className="label">Taggar</label>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6 }}>
              Nyckelord separerade med komma. Används för sökning och filterValues i Playtypus.
            </p>
            <input className="input-base"
              value={(local.tags || []).join(', ')}
              onChange={e => upd({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
              placeholder="t.ex. utomhus, rörelse, familj" />
          </div>

          {/* Preferred view */}
          <div style={{ marginBottom: 14 }}>
            <label className="label">Vy för detta kort</label>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
              Override för just denna aktivitet. Tom = använder kategorins eller appens standardvy.
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => upd({ preferredView: null })} style={{
                padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                border: !local.preferredView ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: !local.preferredView ? 'var(--accent-dim)' : 'var(--bg-input)',
                color: !local.preferredView ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer',
              }}>Standard</button>
              {VIEW_OPTIONS.map(v => (
                <button key={v.value} onClick={() => upd({ preferredView: v.value })} style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                  border: local.preferredView === v.value ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: local.preferredView === v.value ? 'var(--accent-dim)' : 'var(--bg-input)',
                  color: local.preferredView === v.value ? 'var(--accent)' : 'var(--text-2)', cursor: 'pointer',
                }}>{v.icon} {v.label}</button>
              ))}
            </div>
          </div>

          {/* Card feature overrides */}
          <div>
            <label className="label">Funktions-overrides</label>
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8, lineHeight: 1.5 }}>
              Aktivera eller inaktivera specifika funktioner för just detta kort.
              Tomt = ärver från app-inställningarna. Grönt = tvinga PÅ. Rött = tvinga AV.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CARD_FEATURES.map(cf => {
                const val = local.cardFeatures?.[cf.key]
                const isSet = val !== undefined
                return (
                  <div key={cf.key} title={cf.desc} style={{ display: 'flex', gap: 0 }}>
                    <button onClick={() => { if (val === true) updCF(cf.key, false); else updCF(cf.key, true) }}
                      style={{
                        padding: '5px 10px', fontSize: 11,
                        borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                        border: `1px solid ${val === true ? 'var(--green)' : val === false ? 'var(--red)' : 'var(--border)'}`,
                        background: val === true ? 'var(--green-dim)' : val === false ? 'var(--red-dim)' : 'var(--bg-input)',
                        color: val === true ? 'var(--green)' : val === false ? 'var(--red)' : 'var(--text-2)', cursor: 'pointer',
                      }}>
                      {val === true ? '✓ ' : val === false ? '✗ ' : ''}{cf.label}
                    </button>
                    {isSet && (
                      <button onClick={() => { const cf2 = { ...local.cardFeatures }; delete cf2[cf.key]; upd({ cardFeatures: cf2 }) }}
                        style={{
                          padding: '5px 6px', fontSize: 11,
                          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                          border: '1px solid var(--border)', borderLeft: 'none',
                          background: 'var(--bg-input)', color: 'var(--text-3)', cursor: 'pointer',
                        }}>×</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div style={{
          padding: '14px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'flex-end', gap: 10,
        }}>
          <button className="btn btn-secondary" onClick={onClose}>Avbryt</button>
          <button className="btn btn-primary" onClick={() => {
            if (!local.id) local.id = `act-${String(Date.now()).slice(-6)}`
            onSave(local)
          }}>Spara aktivitet</button>
        </div>
      </div>
    </div>
  )
}

export default function StepActivities({ ctx }) {
  const { state, update } = ctx
  const { activities, packMeta, features, aiFields } = state
  const [editingIndex, setEditingIndex]     = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)

  const toggleAiActivities = () => {
    const cur  = aiFields || []
    const next = cur.includes('activities') ? cur.filter(f => f !== 'activities') : [...cur, 'activities']
    update({ aiFields: next })
  }

  const openNew = () => { setEditingIndex(null); setEditingActivity({ ...EMPTY_ACTIVITY }) }
  const openEdit = (i) => { setEditingIndex(i); setEditingActivity({ ...activities[i] }) }

  const handleSave = (act) => {
    const next = [...(activities || [])]
    if (editingIndex !== null) next[editingIndex] = act
    else next.push(act)
    update({ activities: next })
    setEditingActivity(null)
  }

  const handleDelete = (i) => {
    if (!confirm('Ta bort aktiviteten?')) return
    const next = [...activities]
    next.splice(i, 1)
    update({ activities: next })
  }

  const aiActive = (aiFields || []).includes('activities')
  const missingSteps = (activities || []).filter(a => !a.steps?.length).length
  const aiCount = (activities || []).filter(a => a._aiGenerated).length
  const manualCount = (activities || []).filter(a => !a._aiGenerated).length

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
        <div>
          <h2 style={{ marginBottom: 6 }}>Aktiviteter</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6, fontSize: 14 }}>
            Lägg till aktiviteter manuellt, låt AI generera dem, eller kombinera båda.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={toggleAiActivities} className="btn" style={{
            background: aiActive ? 'var(--accent-dim)' : 'var(--bg-card)',
            border: aiActive ? '1px solid var(--accent)' : '1px solid var(--border-light)',
            color: aiActive ? 'var(--accent)' : 'var(--text-2)',
          }}>
            🤖 {aiActive ? 'AI genererar' : 'Låt AI generera'}
          </button>
          <button className="btn btn-primary" onClick={openNew}>+ Ny aktivitet</button>
        </div>
      </div>

      {aiActive && (
        <div style={{
          marginBottom: 16, padding: '12px 16px',
          background: 'var(--accent-glow)', border: '1px dashed var(--accent)',
          borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--accent)',
        }}>
          🤖 AI genererar {state.aiStrategy?.totalActivities || packMeta.activityCount || 20} aktiviteter —
          inkluderas i prompten på AI-steget. Aktiviteterna kommer ha steg, durationSeconds, level m.m.
        </div>
      )}

      {/* Warnings */}
      {missingSteps > 0 && (
        <div style={{
          marginBottom: 12, padding: '10px 14px',
          background: 'var(--red-dim)', border: '1px solid var(--red)',
          borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-2)',
        }}>
          ⚠️ <strong>{missingSteps} aktiviteter saknar steg</strong> — öppna och redigera dem för att lägga till steps.
          Steg är obligatoriska för guidad visning och TTS.
        </div>
      )}

      {/* Stats */}
      {(activities?.length || 0) > 0 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{activities.length} totalt</span>
          {manualCount > 0 && <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{manualCount} manuellt</span>}
          {aiCount > 0 && <span style={{ fontSize: 12, color: 'var(--accent)' }}>🤖 {aiCount} AI-genererade</span>}
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {[...new Set((activities || []).map(a => a.category).filter(Boolean))].length} kategorier
          </span>
        </div>
      )}

      {/* Activity list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(activities || []).map((act, i) => (
          <ActivityCard key={act.id || i} activity={act} index={i} onEdit={openEdit} onDelete={handleDelete} />
        ))}
      </div>

      {(!activities || activities.length === 0) && !aiActive && (
        <div style={{
          padding: 32, textAlign: 'center', color: 'var(--text-3)',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius)', fontSize: 13,
        }}>
          Inga aktiviteter ännu.
          <br />
          <button className="btn btn-secondary" onClick={openNew} style={{ marginTop: 12 }}>
            + Lägg till din första aktivitet
          </button>
        </div>
      )}

      {editingActivity !== null && (
        <ActivityEditor
          activity={editingActivity}
          categories={packMeta.categories}
          onSave={handleSave}
          onClose={() => setEditingActivity(null)}
        />
      )}
    </div>
  )
}
