import { useState } from 'react'
import Field from '../components/Field.jsx'
import { TYPOGRAPHY_OPTIONS, ACCENT_PRESETS } from '../schema.js'

// ── Panikknapp-konfigurator ────────────────────────────────────────────────────
// Panikknappen är en stor, synlig knapp i appen som plockar fram en aktivitet
// baserat på krav — t.ex. "jag har 5 minuter och inget material".
// Playtypus filtrerar aktiviteter mot dessa krav och presenterar en slumpmässig matchning.

function PanicButtonConfig({ packMeta, updateMeta }) {
  const pb = packMeta.panicButton || {}
  const enabled = pb.enabled

  const upd = (patch) => updateMeta({ panicButton: { ...pb, ...patch } })

  return (
    <div style={{
      background: enabled ? 'var(--accent-dim)' : 'var(--bg-card)',
      border: `1px solid ${enabled ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)', padding: '16px 20px',
      transition: 'var(--transition)',
    }}>

      {/* Toggle row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: enabled ? 20 : 0 }}>
        <button
          onClick={() => upd({ enabled: !enabled })}
          style={{
            width: 44, height: 24, borderRadius: 12,
            background: enabled ? 'var(--accent)' : 'var(--border)',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'var(--transition)', flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', top: 3, left: enabled ? 22 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff', transition: 'var(--transition)',
          }} />
        </button>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
            Panikknapp aktiv
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
            En stor knapp som direkt plockar fram en aktivitet som uppfyller kraven
          </div>
        </div>
      </div>

      {enabled && (
        <>
          <div style={{
            padding: '10px 14px', marginBottom: 20,
            background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)',
            borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6,
          }}>
            <strong style={{ color: 'var(--accent)' }}>Så här fungerar det:</strong> Playtypus filtrerar
            aktiviteter i realtid mot kraven du anger nedan och presenterar en slumpmässig matchning
            med en animerad "nu kör vi"-vy. Inga matchningar → knappen visar ett felmeddelande.
          </div>

          {/* Knapptext och emoji */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12, marginBottom: 12 }}>
            <div>
              <label className="label">Knapptext <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(→ panic.button)</span></label>
              <input
                className="input-base"
                placeholder="t.ex. Vad kan vi göra nu?"
                value={pb.label || ''}
                onChange={e => upd({ label: e.target.value })}
                style={{ marginTop: 6 }}
              />
              <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                Visas på knappen i appen. Sparas i translations.json under <code style={{ fontFamily: 'DM Mono', fontSize: 10 }}>panic.button</code>.
              </p>
            </div>
            <div>
              <label className="label">Emoji</label>
              <input
                className="input-base"
                placeholder="🎲"
                value={pb.emoji || ''}
                onChange={e => upd({ emoji: e.target.value })}
                maxLength={2}
                style={{ marginTop: 6, textAlign: 'center', fontSize: 20 }}
              />
            </div>
          </div>

          {/* Undertext */}
          <div style={{ marginBottom: 20 }}>
            <label className="label">Undertext <span style={{ fontWeight: 400, color: 'var(--text-3)' }}>(→ panic.subtitle)</span></label>
            <input
              className="input-base"
              placeholder="t.ex. Slumpa en aktivitet"
              value={pb.subtitle || ''}
              onChange={e => upd({ subtitle: e.target.value })}
              style={{ marginTop: 6 }}
            />
            <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
              Visas som subtitel under knappen. Sparas under <code style={{ fontFamily: 'DM Mono', fontSize: 10 }}>panic.subtitle</code>.
            </p>
          </div>

          {/* Krav-sektion */}
          <div style={{ marginBottom: 4 }}>
            <label className="label">Filterkrav</label>
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 14, lineHeight: 1.5 }}>
              Panikknappen slumpar bland aktiviteter som uppfyller <em>alla</em> aktiva krav.
              Lämna ett krav tomt för att inte filtrera på det.
            </p>
          </div>

          {/* Max förberedelsetid */}
          <div style={{ marginBottom: 16, padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: pb.maxPrepMinutes != null ? 10 : 0 }}>
              <button
                onClick={() => upd({ maxPrepMinutes: pb.maxPrepMinutes != null ? null : 0 })}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: pb.maxPrepMinutes != null ? 'var(--accent)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'var(--transition)', flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: pb.maxPrepMinutes != null ? 19 : 2,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition)',
                }} />
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Max förberedelsetid</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Kräver att aktiviteten kan startas snabbt</div>
              </div>
            </div>
            {pb.maxPrepMinutes != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  min={0}
                  max={60}
                  className="input-base"
                  value={pb.maxPrepMinutes}
                  onChange={e => upd({ maxPrepMinutes: parseInt(e.target.value) || 0 })}
                  style={{ width: 80 }}
                />
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>minuter</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  (0 = kan göras direkt utan förberedelse)
                </span>
              </div>
            )}
          </div>

          {/* Kräver ingen rekvisita */}
          <div style={{ marginBottom: 16, padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={() => upd({ requireNoProps: !pb.requireNoProps })}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: pb.requireNoProps ? 'var(--accent)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'var(--transition)', flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: pb.requireNoProps ? 19 : 2,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition)',
                }} />
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Ingen rekvisita</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  Filtrerar bort aktiviteter som kräver material (<code style={{ fontFamily: 'DM Mono', fontSize: 10 }}>requiresProps: true</code>)
                </div>
              </div>
            </div>
          </div>

          {/* Max varaktighet */}
          <div style={{ marginBottom: 16, padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: pb.maxDurationSeconds != null ? 10 : 0 }}>
              <button
                onClick={() => upd({ maxDurationSeconds: pb.maxDurationSeconds != null ? null : 1800 })}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: pb.maxDurationSeconds != null ? 'var(--accent)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'var(--transition)', flexShrink: 0,
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: pb.maxDurationSeconds != null ? 19 : 2,
                  width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'var(--transition)',
                }} />
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Max varaktighet</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Filtrerar bort långa aktiviteter</div>
              </div>
            </div>
            {pb.maxDurationSeconds != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="number"
                  min={5}
                  max={480}
                  className="input-base"
                  value={Math.round(pb.maxDurationSeconds / 60)}
                  onChange={e => upd({ maxDurationSeconds: (parseInt(e.target.value) || 30) * 60 })}
                  style={{ width: 80 }}
                />
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>minuter max</span>
              </div>
            )}
          </div>

          {/* Svårighetsnivå */}
          <div style={{ padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Max svårighetsgrad</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                Begränsa till aktiviteter av viss svårighetsgrad eller enklare
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { v: null, l: 'Alla', desc: 'Ingen begränsning' },
                { v: 1, l: '1 — Enkel', desc: 'Bara enkla' },
                { v: 2, l: '2 — Medel', desc: 'Enkel & medel' },
                { v: 3, l: '3 — Svår', desc: 'Alla nivåer' },
              ].map(opt => (
                <button
                  key={String(opt.v)}
                  onClick={() => upd({ maxLevel: opt.v })}
                  title={opt.desc}
                  style={{
                    flex: 1, padding: '8px 6px', borderRadius: 'var(--radius-sm)', fontSize: 12,
                    border: pb.maxLevel === opt.v ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: pb.maxLevel === opt.v ? 'var(--accent-dim)' : 'var(--bg-card)',
                    color: pb.maxLevel === opt.v ? 'var(--accent)' : 'var(--text-2)',
                    cursor: 'pointer', transition: 'var(--transition)',
                  }}
                >
                  {opt.l}
                </button>
              ))}
            </div>
          </div>

          {/* Förhandsvisning av krav */}
          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-2)',
          }}>
            <strong style={{ color: 'var(--text)' }}>filterOverride i appen:</strong>{' '}
            {[
              pb.maxPrepMinutes    != null && `förberedelsetid ≤ ${pb.maxPrepMinutes} min`,
              pb.requireNoProps             && 'ingen rekvisita',
              pb.maxDurationSeconds != null && `varaktighet ≤ ${Math.round(pb.maxDurationSeconds/60)} min`,
              pb.maxLevel           != null && `nivå ≤ ${pb.maxLevel}`,
            ].filter(Boolean).join(' + ') || 'Ingen filtrering — slumpar bland alla aktiviteter'}
          </div>
        </>
      )}
    </div>
  )
}

export default function StepVisual({ ctx }) {
  const { state, updateMeta, update } = ctx
  const { packMeta, aiFields } = state

  const toggleAi = (field) => {
    const current = state.aiFields || []
    const next = current.includes(field)
      ? current.filter(f => f !== field)
      : [...current, field]
    update({ aiFields: next })
  }

  return (
    <div className="animate-fade">
      <h2 style={{ marginBottom: 6 }}>Utseende</h2>
      <p style={{ color: 'var(--text-2)', marginBottom: 32, lineHeight: 1.6 }}>
        Välj färg och typografi. Förhandsvisningen till höger uppdateras direkt.
      </p>

      {/* Accentfärg */}
      <Field
        label="Accentfärg"
        fieldKey="accentColor"
        aiFields={aiFields}
        onToggleAi={toggleAi}
        consequence="Används i appens header, knappar, ikoner och kortaccenter."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ACCENT_PRESETS.map(c => (
              <button
                key={c}
                onClick={() => updateMeta({ accentColor: c })}
                title={c}
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c,
                  border: packMeta.accentColor === c ? '3px solid var(--text)' : '3px solid transparent',
                  cursor: 'pointer', transition: 'var(--transition)',
                  boxShadow: packMeta.accentColor === c ? `0 0 0 2px ${c}40` : 'none',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="color"
              value={packMeta.accentColor || '#E8845A'}
              onChange={e => updateMeta({ accentColor: e.target.value })}
              style={{
                width: 40, height: 36, border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)',
                cursor: 'pointer', padding: 2,
              }}
            />
            <input
              className="input-base"
              value={packMeta.accentColor || '#E8845A'}
              onChange={e => updateMeta({ accentColor: e.target.value })}
              style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, width: 120 }}
              maxLength={7}
            />
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>hex-värde</span>
          </div>
        </div>
      </Field>

      {/* Typografi */}
      <div style={{ marginBottom: 24 }}>
        <label className="label">Typografi</label>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 12 }}>
          ℹ️ Styr vilket typsnittpar som används i hela appen. Exporteras som{' '}
          <code style={{ fontFamily: 'DM Mono', fontSize: 11 }}>typography.preset</code>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {TYPOGRAPHY_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => updateMeta({ typography: t.value })}
              style={{
                padding: '12px 14px', borderRadius: 'var(--radius)',
                border: packMeta.typography === t.value
                  ? '1px solid var(--accent)' : '1px solid var(--border)',
                background: packMeta.typography === t.value
                  ? 'var(--accent-dim)' : 'var(--bg-input)',
                cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)',
              }}
            >
              <div style={{
                fontSize: 13, fontWeight: 600, marginBottom: 3,
                color: packMeta.typography === t.value ? 'var(--accent)' : 'var(--text)',
              }}>{t.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.preview}</div>
              {t.desc && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.4 }}>{t.desc}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Panikknapp */}
      <div style={{ marginBottom: 24 }}>
        <label className="label">Panikknapp</label>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5 }}>
          ℹ️ En stor, framträdande knapp som direkt plockar fram en slumpad aktivitet
          baserat på krav du anger — t.ex. "max 5 min förberedelse och ingen rekvisita".
          Exporteras som <code style={{ fontFamily: 'DM Mono', fontSize: 11 }}>panicButton</code> i pack.config.
        </p>
        <PanicButtonConfig packMeta={packMeta} updateMeta={updateMeta} />
      </div>

      {/* Redo nu-läge */}
      <div>
        <label className="label">Redo nu-läge</label>
        <p style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5 }}>
          ℹ️ Aktiverar ett "Redo nu"-filter som visar aktiviteter utan förberedelsetid
          (<code style={{ fontFamily: 'DM Mono', fontSize: 11 }}>prepTimeMinutes: 0</code>) på startsidan.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => updateMeta({ readyNow: !packMeta.readyNow })}
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: packMeta.readyNow ? 'var(--accent)' : 'var(--border)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'var(--transition)', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3, left: packMeta.readyNow ? 22 : 3,
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff', transition: 'var(--transition)',
            }} />
          </button>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>
            {packMeta.readyNow ? 'Aktiverat' : 'Inaktiverat'}
          </span>
        </div>
      </div>
    </div>
  )
}
