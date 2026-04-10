import { useEffect, useRef, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'

export default function AuthModal({ open, onClose }) {
  const { t } = useTranslation()
  const overlayRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode]       = useState('signin') // 'signin' or 'signup'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) { setLoading(false) }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
      alert("Successfully authenticated with Google in demo mode!")
    }, 1000)
  }

  const handleGoogleError = () => {
    console.log('Google login failed')
    alert("Google authentication failed. Please try again.")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onClose()
      alert("Successfully authenticated.")
    }, 1000)
  }

  const toggleMode = () => setMode(m => m === 'signin' ? 'signup' : 'signin')

  return (
    <div
      ref={overlayRef}
      id="auth-modal-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(13,15,14,.5)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', animation: 'fadeIn .2s ease',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: 440,
        padding: '40px', position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,.18)',
        animation: 'slideUp .3s cubic-bezier(.34,1.56,.64,1)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--border)',
            background: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--ink)' }}
          onMouseOut={e  => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--ink-3)' }}
        >✕</button>

        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', width: 44, height: 44,
            background: 'linear-gradient(135deg, var(--green), var(--blue))',
            borderRadius: 12, alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 20, marginBottom: 16
          }}>▲</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>
            {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
          </h2>
          <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
            VECTRA — {t('hero.h1em')}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            shape="pill"
            theme="outline"
            text={mode === 'signin' ? "signin_with" : "signup_with"}
            size="large"
            width="100%"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{t('auth.orEmail')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{t('auth.email')}</label>
            <input type="email" required style={inputStyle} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{t('auth.password')}</label>
            <input type="password" required style={inputStyle} />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 12, padding: '14px 28px', borderRadius: 100,
              background: 'var(--ink)', color: '#fff', fontWeight: 700, fontSize: 15,
              border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1, width: '100%',
              fontFamily: 'var(--sans)',
            }}
          >
            {loading ? t('auth.signingIn') : (mode === 'signin' ? t('auth.signIn') : t('auth.signUp'))}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>
            {mode === 'signin' ? t('auth.noAccount') : t('auth.hasAccount')}
            <button
              onClick={toggleMode}
              style={{
                background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 700,
                cursor: 'pointer', marginLeft: 6, fontSize: 14, fontFamily: 'var(--sans)',
              }}
            >
              {mode === 'signin' ? t('auth.signUpLink') : t('auth.signInLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '11px 16px', borderRadius: 10, border: '1.5px solid var(--border)',
  fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)', background: 'var(--bg)', outline: 'none'
}
