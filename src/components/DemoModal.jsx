import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ROLES = [
  'COO / Operations Director',
  'Site Manager',
  'ESG / Sustainability Officer',
  'Health & Safety Manager',
  'Risk / Insurance Manager',
  'Other',
]

const INDUSTRIES = ['Mining', 'Oil & Gas', 'Energy', 'Agriculture', 'Other']

export default function DemoModal({ open, onClose }) {
  const { t } = useTranslation()
  const overlayRef = useRef(null)
  const [step, setStep]       = useState(1)   // 1 = form, 2 = success
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({
    name: '', email: '', company: '', role: '', industry: '', sites: '',
  })

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) { setStep(1); setLoading(false) }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // Simulate API call (replace with actual endpoint)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setStep(2)
  }

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      id="demo-modal-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(13,15,14,.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn .2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>

      <div style={{
        background: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 560,
        padding: '40px',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,.18)',
        animation: 'slideUp .3s cubic-bezier(.34,1.56,.64,1)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close */}
        <button
          id="modal-close"
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 36, height: 36, borderRadius: '50%',
            border: '1.5px solid var(--border)',
            background: 'none', cursor: 'pointer',
            fontSize: 18, color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--sans)', transition: 'all .2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--ink)' }}
          onMouseOut={e  => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-3)' }}
        >✕</button>

        {step === 1 ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 14px', borderRadius: 100,
                background: 'var(--accent-pill)',
                border: '1px solid rgba(29,86,178,.15)',
                fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
                textTransform: 'uppercase', color: 'var(--blue)',
                marginBottom: 16,
              }}>🛰 {t('modal.badge')}</div>

              <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', marginBottom: 8, lineHeight: 1.15, whiteSpace: 'pre-line' }}>
                {t('modal.h2')}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                {t('modal.desc')}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Row: Name + Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label={t('modal.fields.name')} id="f-name" required
                  value={form.name} onChange={v => set('name', v)}
                  placeholder="Ana Souza" />
                <Field label={t('modal.fields.email')} id="f-email" type="email" required
                  value={form.email} onChange={v => set('email', v)}
                  placeholder="ana@vale.com" />
              </div>

              <Field label={t('modal.fields.company')} id="f-company" required
                value={form.company} onChange={v => set('company', v)}
                placeholder="Vale S.A." />

              {/* Row: Role + Industry */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <SelectField label={t('modal.fields.role')} id="f-role" required
                  value={form.role} onChange={v => set('role', v)} options={ROLES} />
                <SelectField label={t('modal.fields.industry')} id="f-industry" required
                  value={form.industry} onChange={v => set('industry', v)} options={INDUSTRIES} />
              </div>

              <Field label={t('modal.fields.sites')} id="f-sites" type="number"
                value={form.sites} onChange={v => set('sites', v)}
                placeholder="e.g. 3" />

              <button
                id="modal-submit"
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 8,
                  padding: '15px 32px',
                  borderRadius: 100,
                  background: 'var(--ink)',
                  color: '#fff',
                  fontFamily: 'var(--sans)',
                  fontWeight: 700,
                  fontSize: 16,
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? .7 : 1,
                  transition: 'all .2s',
                  width: '100%',
                }}
              >
                {loading ? t('modal.submitting') : t('modal.submit')}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                {t('modal.note')}
              </p>
            </form>
          </>
        ) : (
          /* Success state */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 12 }}>{t('modal.successTitle')}</h2>
            <p style={{ fontSize: 16, color: 'var(--ink-2)', maxWidth: 360, margin: '0 auto 28px' }}>
              {t('modal.successDesc')}
            </p>
            <button
              id="modal-close-success"
              onClick={onClose}
              style={{
                padding: '13px 32px', borderRadius: 100,
                background: 'var(--ink)', color: '#fff',
                fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 15,
                border: 'none', cursor: 'pointer',
              }}
            >{t('modal.close')}</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── sub-components ── */
function Field({ label, id, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
        {label}{required && <span style={{ color: 'var(--blue)', marginLeft: 3 }}>*</span>}
      </label>
      <input
        id={id} type={type} value={value} required={required}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '11px 16px',
          borderRadius: 10,
          border: '1.5px solid var(--border)',
          fontFamily: 'var(--sans)',
          fontSize: 14,
          color: 'var(--ink)',
          background: 'var(--bg)',
          outline: 'none',
          transition: 'border-color .2s',
        }}
        onFocus={e  => { e.target.style.borderColor = 'var(--blue)' }}
        onBlur={e   => { e.target.style.borderColor = 'var(--border)' }}
      />
    </div>
  )
}

function SelectField({ label, id, value, onChange, options, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
        {label}{required && <span style={{ color: 'var(--blue)', marginLeft: 3 }}>*</span>}
      </label>
      <select
        id={id} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '11px 16px',
          borderRadius: 10,
          border: '1.5px solid var(--border)',
          fontFamily: 'var(--sans)',
          fontSize: 14,
          color: value ? 'var(--ink)' : 'var(--ink-3)',
          background: 'var(--bg)',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
        }}
        onFocus={e  => { e.target.style.borderColor = 'var(--blue)' }}
        onBlur={e   => { e.target.style.borderColor = 'var(--border)' }}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
