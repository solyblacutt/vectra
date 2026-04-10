import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './App.css'
import DemoModal from './components/DemoModal.jsx'
import AuthModal from './components/AuthModal.jsx'

/* ══════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════ */
function Navbar({ onOpenDemo, onOpenAuth }) {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const changeLang = (l) => i18n.changeLanguage(l)

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <div className="logo-mark">▲</div>
          VECTRA
        </Link>
        <div className="nav-links">
          <a href="#problem">{t('nav.problem')}</a>
          <a href="#solution">{t('nav.solution')}</a>
          <Link to="/dashboard">{t('nav.dashboard')}</Link>
          <a href="#pricing">{t('nav.pricing')}</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="lang-switcher" style={{ display: 'flex', gap: 4 }}>
            <button 
              onClick={() => changeLang('en')} 
              style={{ background: i18n.language === 'en' ? 'var(--blue)' : 'transparent', color: i18n.language === 'en' ? '#fff' : 'var(--ink-3)', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
            >EN</button>
            <button 
              onClick={() => changeLang('es')} 
              style={{ background: i18n.language === 'es' ? 'var(--blue)' : 'transparent', color: i18n.language === 'es' ? '#fff' : 'var(--ink-3)', border: 'none', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
            >ES</button>
          </div>
          <button className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={onOpenAuth}>
            {t('nav.signIn')}
          </button>
          <button className="btn btn-dark" style={{ padding: '8px 20px', fontSize: '13px', background: 'var(--green)', borderColor: 'var(--green)' }} onClick={onOpenDemo}>
            {t('nav.requestPilot')}
          </button>
        </div>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════ */
function Hero({ onOpenDemo }) {
  const { t } = useTranslation()
  return (
    <section className="hero">
      {/* TOP BAR */}
      <div className="hero-top">
        <div className="container">
          <div className="hero-eyebrow">
            <span className="chip chip-outline">🛰 {t('hero.badge')}</span>
            <span className="hero-eyebrow-right">{t('hero.est')}</span>
          </div>
          <div className="hero-headline">
            <h1>
              {t('hero.h1line1')}<br />
              {t('hero.h1line2')} <em className="g-text">{t('hero.h1em')}</em>
            </h1>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div className="hero-mid">
        {/* Left: Video Visual instead of orbit */}
        <div className="hero-orb-wrap" style={{ padding: 0 }}>
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            <video 
               autoPlay loop muted playsInline 
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
               poster="https://images.unsplash.com/photo-1518182170546-076616fdcd80?auto=format&fit=crop&w=1200&q=80"
            >
              {/* Using a placeholder professional nature/tech video url */}
              <source src="https://cdn.pixabay.com/video/2019/04/16/22818-330650950_large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(238,239,237,0.8), rgba(238,239,237,0.2) 50%, rgba(238,239,237,0))' }} />
          </div>
        </div>

        {/* Right: copy + KPIs */}
        <div className="hero-copy-panel">
          <p className="hero-desc">{t('hero.desc')}</p>

          <div className="hero-cta">
            <button id="hero-pilot" className="btn btn-dark" style={{ width: '100%', justifyContent: 'center', background: 'var(--green)', borderColor: 'var(--green)' }} onClick={onOpenDemo}>
              {t('hero.startPilot')}
            </button>
            <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              {t('hero.seeDemo')}
            </Link>
          </div>

          <div className="hero-kpis">
            <div className="hero-kpi">
              <span className="hero-kpi-num">{t('hero.kpi1Val')} <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--green)' }}>{t('hero.kpi1Unit')}</span></span>
              <span className="hero-kpi-lbl">{t('hero.kpi1Lbl')}</span>
            </div>
            <div className="hero-kpi">
              <span className="hero-kpi-num">{t('hero.kpi2Val')}<span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--green)' }}>{t('hero.kpi2Unit')}</span></span>
              <span className="hero-kpi-lbl">{t('hero.kpi2Lbl')}</span>
            </div>
            <div className="hero-kpi">
              <span className="hero-kpi-num">{t('hero.kpi3Val')}<span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--green)' }}>{t('hero.kpi3Unit')}</span></span>
              <span className="hero-kpi-lbl">{t('hero.kpi3Lbl')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL HINT */}
      <div className="hero-scroll container">
        <span>{t('hero.scroll')}</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   PROBLEM
   ══════════════════════════════════════════════ */
function Problem() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(0)
  const items = t('problem.items', { returnObjects: true })
  
  return (
    <section id="problem" className="section problem-section">
      <div className="container">
        {/* Header */}
        <div className="problem-header">
          <div>
            <div className="section-eyebrow">{t('problem.eyebrow')}</div>
            <h2>
              {t('problem.h2line1')}<br />
              {t('problem.h2line2')}
            </h2>
          </div>
          <div className="problem-header-right">
            <p>{t('problem.intro')}</p>
          </div>
        </div>

        {/* Accordion */}
        <div className="accordion-list">
          {Array.isArray(items) && items.map((item, i) => (
            <div
              key={i}
              className={`accordion-item${open === i ? ' open' : ''}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              <button className="accordion-trigger">
                <span className="acc-num">{item.num}</span>
                <span className="acc-title">{item.title}</span>
                <span className="acc-icon">+</span>
              </button>
              <div className="accordion-body">
                <div className="accordion-body-inner">
                  <div className="accordion-body-inner-pad">
                    <p>{item.body}</p>
                    <div className="acc-stat">
                      <span className="acc-stat-num">{item.stat}</span>
                      <span className="acc-stat-lbl">{item.statLbl}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   SOLUTION
   ══════════════════════════════════════════════ */
function Solution() {
  const { t } = useTranslation()
  const sources = t('solution.sources', { returnObjects: true })
  const features = t('solution.features', { returnObjects: true })

  return (
    <section id="solution" className="section solution-section">
      <div className="container">
        <div className="section-eyebrow" style={{ marginBottom: 40 }}>{t('solution.eyebrow')}</div>
        <div className="solution-layout">
          {/* Left: data sources */}
          <div className="solution-left">
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.8rem)', whiteSpace: 'pre-line' }}>
                {t('solution.h2')}
              </h2>
              <p className="solution-intro">{t('solution.intro')}</p>
            </div>

            <div>
              {Array.isArray(sources) && sources.map((source, i) => (
                <div className="source-row" key={i}>
                  <div className="source-icon">{source.icon}</div>
                  <div className="source-txt">
                    <h4>{source.name}</h4>
                    <p>{source.desc}</p>
                  </div>
                  <span className={`source-badge ${source.badge === 'Live' || source.badge === 'En Vivo' ? 'badge-live' : 'badge-active'}`}>
                    {source.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: capabilities */}
          <div className="solution-right">
            <div style={{ paddingBottom: 36, borderBottom: '1px solid var(--border)', marginBottom: 36 }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--ink-3)', fontWeight: 500, letterSpacing: 0 }}>
                {t('solution.whatYouGet')}
              </h3>
            </div>
            <div className="feature-list">
              {Array.isArray(features) && features.map((feature, i) => (
                <div className="feature-pill" key={i}>
                  <div className="fp-icon">{feature.icon}</div>
                  <div className="fp-txt">
                    <strong>{feature.title}</strong>
                    <span>{feature.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   DASHBOARD PREVIEW
   ══════════════════════════════════════════════ */
function DashboardPreview() {
  const { t } = useTranslation()

  return (
    <section id="dashboard" className="section" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>{t('dashboard.eyebrow')}</div>
          <h2>{t('dashboard.h2')}</h2>
          <p style={{ color: 'var(--ink-3)', fontSize: '17px', marginTop: '12px' }}>{t('dashboard.desc')}</p>
        </div>

        <div style={{ 
          position: 'relative', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          boxShadow: '0 40px 120px rgba(0,0,0,0.1)',
          border: '1px solid var(--border)',
          height: '600px',
          background: 'var(--bg)'
        }}>
          {/* We embed the actual dashboard using an iframe */}
          <iframe 
            src="/dashboard" 
            title="Dashboard Preview"
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
          />
          
          <div style={{
            position: 'absolute', inset: 0, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(1px)'
          }}>
            <Link to="/dashboard" className="btn btn-dark" style={{ padding: '16px 36px', fontSize: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              {t('dashboard.openFull')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   PRICING
   ══════════════════════════════════════════════ */
function Pricing({ onOpenDemo }) {
  const { t } = useTranslation()
  const plansObj = t('pricing.plans', { returnObjects: true })
  const plans = plansObj && typeof plansObj === 'object' ? Object.values(plansObj) : []

  return (
    <section id="pricing" className="section pricing-section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div className="section-eyebrow">{t('pricing.eyebrow')}</div>
            <h2 style={{ maxWidth: 480 }}>
              {t('pricing.h2line1')}<br />{t('pricing.h2line2')}
            </h2>
          </div>
          <p style={{ maxWidth: 360, fontSize: 16 }}>
            {t('pricing.desc')}
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => {
            const isFeatured = index === 1;
            return (
              <div key={index} className={`price-card${isFeatured ? ' featured' : ''}`}>
                <div className="plan-badge">{plan.badge}</div>
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.desc}</p>
                <div className="plan-divider" />
                <div className="plan-price"><sup>$</sup>{plan.price}</div>
                <div className="plan-per">{plan.per}</div>
                <ul className="pf">
                  {Array.isArray(plan.features) && plan.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <button
                  className={isFeatured ? 'btn btn-outline' : 'btn btn-dark'}
                  style={{ width: '100%', justifyContent: 'center',
                    ...(isFeatured ? { borderColor: 'rgba(255,255,255,.3)', color: '#fff' } : {}) }}
                  onClick={onOpenDemo}
                >
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>

        <div className="roi-block">
          <div className="roi-num" style={{ color: 'var(--green)' }}>200×</div>
          <p className="roi-txt">{t('pricing.roiDesc')}</p>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════ */
function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-mark">▲</div>
              VECTRA
            </div>
            <p>{t('footer.tagline')}</p>
          </div>
          <div className="footer-col">
            <h5>{t('footer.product')}</h5>
            <Link to="/dashboard">{t('footer.links.dashboard')}</Link>
            <a href="#solution">{t('footer.links.api')}</a>
            <a href="#solution">{t('footer.links.esg')}</a>
            <a href="#pricing">{t('footer.links.pricing')}</a>
          </div>
          <div className="footer-col">
            <h5>{t('footer.dataSources')}</h5>
            <a href="https://info.dengue.mat.br" target="_blank" rel="noreferrer">InfoDengue</a>
            <a href="#solution">D-MOSS Engine</a>
            <a href="#solution">Sentinel-1 SAR</a>
            <a href="#solution">ICEYE Radar</a>
          </div>
          <div className="footer-col">
            <h5>{t('footer.company')}</h5>
            <a href="#problem">{t('footer.links.about')}</a>
            <a href="#">{t('footer.links.contact')}</a>
            <a href="#">{t('footer.links.alce')}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer.copyright')}</span>
          <span>{t('footer.mission')}</span>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════
   APP
   ══════════════════════════════════════════════ */
export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  
  return (
    <>
      <Navbar 
        onOpenDemo={() => setDemoModalOpen(true)} 
        onOpenAuth={() => setAuthModalOpen(true)} 
      />
      <Hero   onOpenDemo={() => setDemoModalOpen(true)} />
      <Problem />
      <Solution />
      <DashboardPreview />
      <Pricing onOpenDemo={() => setDemoModalOpen(true)} />
      <Footer />
      
      <DemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  )
}
