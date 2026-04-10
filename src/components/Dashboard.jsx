import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './Dashboard.css'
import { fetchAllSiteAlerts, MOCK_SITES, RISK_CONFIG } from '../services/infodengue'
import { MINING_SITES } from '../data/mockSites'

// Merge both data sets: real epi alerts + industrial site data
function mergeData(epiSites, mineData) {
  const byId = Object.fromEntries(epiSites.map(s => [s.id, s]))
  const merged = []
  // industrial sites (priority)
  mineData.forEach(site => merged.push({ ...site, layer: 'industrial' }))
  // epi cities not duplicated
  epiSites.forEach(site => {
    if (!merged.some(m => m.id === site.id)) {
      merged.push({ ...site, layer: 'epi' })
    }
  })
  return merged
}

// Risk color helper
const rc = (risk) => RISK_CONFIG[risk] ?? RISK_CONFIG.unknown

// Fit map to all markers
function FitBounds({ sites }) {
  const map = useMap()
  useEffect(() => {
    if (!sites || sites.length === 0) return
    const bounds = sites.map(s => [s.lat, s.lng])
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 })
  }, [sites, map])
  return null
}

// ── Metric box ──────────────────────────────────────────────────────────────
function MetricBox({ lbl, val, sub, colorClass }) {
  return (
    <div className="db-metric">
      <div className="db-metric-lbl">{lbl}</div>
      <div className={`db-metric-val ${colorClass ?? ''}`}>{val}</div>
      {sub && <div className="db-metric-sub">{sub}</div>}
    </div>
  )
}

// ── Trend label ─────────────────────────────────────────────────────────────
function TrendChip({ trend }) {
  if (trend === 'rising' || trend === 'critical') return <span className="trend-up">↑ Rising</span>
  if (trend === 'falling') return <span className="trend-down">↓ Falling</span>
  return <span className="trend-stab">→ Stable</span>
}

// ── Dashboard page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [sites,     setSites]     = useState([])
  const [selected,  setSelected]  = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [disease,   setDisease]   = useState('dengue')
  const [dataSource, setDataSource] = useState('live')

  const loadData = useCallback(async (d) => {
    setLoading(true)
    try {
      const epi = await fetchAllSiteAlerts(d)
      const all = mergeData(epi, MINING_SITES)
      setSites(all)
      setSelected(all.find(s => s.risk === 'critical') ?? all[0] ?? null)
      setDataSource(epi.some(s => s.source === 'infodengue') ? 'live' : 'demo')
    } catch {
      const all = mergeData(MOCK_SITES, MINING_SITES)
      setSites(all)
      setSelected(all[0])
      setDataSource('demo')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData(disease) }, [disease, loadData])

  // KPI summaries
  const criticalCount = sites.filter(s => s.risk === 'critical' || s.alertLevel >= 2).length
  const alertCount    = sites.filter(s => s.alertLevel >= 1).length
  const clearedCount  = sites.filter(s => s.alertLevel === 0).length
  const avgDays       = 24 // always our "VECTRA lead time" KPI

  const diseases = ['dengue', 'chikungunya', 'zika']

  return (
    <div className="db-shell">
      {/* ── TOPBAR ── */}
      <header className="db-topbar">
        <div className="db-topbar-left">
          <Link to="/" className="db-logo">
            <div className="db-logo-mark">▲</div>
            VECTRA
          </Link>

          <div className="db-disease-tabs">
            {diseases.map(d => (
              <button
                key={d}
                id={`disease-${d}`}
                className={`db-dtab${disease === d ? ' active' : ''}`}
                onClick={() => setDisease(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="db-topbar-right">
          <div className="live-badge">
            <div className="live-pip" />
            {dataSource === 'live' ? 'InfoDengue Live' : 'Demo Mode'}
          </div>
          <button
            id="refresh-btn"
            className="db-back"
            onClick={() => loadData(disease)}
          >
            ↻ Refresh
          </button>
          <div className="db-user">V</div>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      <aside className="db-sidebar">
        {/* KPI Summary */}
        <div className="db-sidebar-section">
          <div className="db-section-lbl">Summary</div>
          <div className="db-kpis">
            <div className="db-kpi">
              <div className={`db-kpi-val ${criticalCount > 0 ? 'red' : 'green'}`}>
                {loading ? '—' : criticalCount}
              </div>
              <div className="db-kpi-lbl">Critical sites</div>
            </div>
            <div className="db-kpi">
              <div className={`db-kpi-val ${alertCount > 0 ? 'orange' : 'green'}`}>
                {loading ? '—' : alertCount}
              </div>
              <div className="db-kpi-lbl">Active alerts</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-val green">{loading ? '—' : clearedCount}</div>
              <div className="db-kpi-lbl">Clear sites</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-val blue">{avgDays}d</div>
              <div className="db-kpi-lbl">Avg lead time</div>
            </div>
          </div>
        </div>

        {/* Site list */}
        <div className="db-sidebar-section">
          <div className="db-section-lbl">Monitored Sites ({sites.length})</div>
          <div className="site-list">
            {loading
              ? <div className="db-loading" style={{ height: 200 }}><div className="spinner" /></div>
              : sites.map(site => (
                <div
                  key={site.id}
                  id={`site-${site.id}`}
                  className={`site-row${selected?.id === site.id ? ' selected' : ''}`}
                  onClick={() => setSelected(site)}
                >
                  <div
                    className="site-risk-dot"
                    style={{ background: rc(site.risk).color }}
                  />
                  <div>
                    <div className="site-name">{site.name}</div>
                    <div className="site-region">{site.region ?? site.state}</div>
                  </div>
                  {site.warningDays && (
                    <div className="site-warn-days">T−{site.warningDays}d</div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </aside>

      {/* ── MAP + DETAIL ── */}
      <main className="db-main">
        {/* Leaflet Map */}
        <div className="db-map-wrap">
          {loading ? (
            <div className="db-loading">
              <div className="spinner" />
              <span>Loading {disease} alert data…</span>
            </div>
          ) : (
            <MapContainer
              center={[-15, -55]}
              zoom={4}
              style={{ width: '100%', height: '100%' }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
              />
              <FitBounds sites={sites} />

              {sites.map(site => (
                <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={site.alertLevel >= 2 ? 18 : site.alertLevel === 1 ? 13 : 9}
                  pathOptions={{
                    color:       rc(site.risk).color,
                    fillColor:   rc(site.risk).color,
                    fillOpacity: 0.35,
                    weight:      2,
                    opacity:     0.9,
                  }}
                  eventHandlers={{ click: () => setSelected(site) }}
                >
                  <Popup className="vectra-popup">
                    <div className="popup-inner">
                      <div className="popup-name">{site.name}</div>
                      <div className="popup-region">{site.region ?? `${site.state}, Brazil`}</div>
                      <div className="popup-row">
                        <span className="popup-row-lbl">Risk level</span>
                        <span className="popup-row-val" style={{ color: rc(site.risk).color }}>
                          {rc(site.risk).icon} {rc(site.risk).label}
                        </span>
                      </div>
                      {site.cases !== undefined && (
                        <div className="popup-row">
                          <span className="popup-row-lbl">Cases (epi. week)</span>
                          <span className="popup-row-val">{site.cases.toLocaleString()}</span>
                        </div>
                      )}
                      {site.warningDays && (
                        <div className="popup-row">
                          <span className="popup-row-lbl">Warning window</span>
                          <span className="popup-row-val" style={{ color: 'var(--orange)' }}>T−{site.warningDays} days</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Detail strip */}
        <div className="db-bottom">
          {selected ? (
            <div className="db-site-detail">
              <div className="db-detail-header">
                <span
                  className="risk-badge"
                  style={{
                    background: rc(selected.risk).bg,
                    color:      rc(selected.risk).color,
                    border:     `1px solid ${rc(selected.risk).color}40`,
                  }}
                >
                  {rc(selected.risk).icon} {rc(selected.risk).label}
                </span>
                <h4>{selected.name}</h4>
                <span>{selected.region ?? `${selected.state}, Brazil`}</span>
                {selected.trend && <TrendChip trend={selected.trend} />}
              </div>

              <div className="db-metrics">
                {selected.warningDays != null && (
                  <MetricBox
                    lbl="Warning window"
                    val={`T−${selected.warningDays}d`}
                    sub="Days until projected impact"
                    colorClass="orange"
                  />
                )}
                {selected.cases !== undefined && (
                  <MetricBox
                    lbl="Cases (epi. week)"
                    val={selected.cases.toLocaleString()}
                    sub={`Incidence: ${selected.incidence} /100k`}
                    colorClass={selected.alertLevel >= 2 ? 'red' : selected.alertLevel === 1 ? 'orange' : 'green'}
                  />
                )}
                {selected.soilMoisture !== undefined && (
                  <MetricBox
                    lbl="Soil Moisture (SAR)"
                    val={`${selected.soilMoisture}%`}
                    sub={selected.soilMoisture > 75 ? '⚠ Breeding risk elevated' : 'Within normal range'}
                    colorClass={selected.soilMoisture > 75 ? 'orange' : 'green'}
                  />
                )}
                {selected.standingWaterKm2 !== undefined && (
                  <MetricBox
                    lbl="Standing Water (km²)"
                    val={`${selected.standingWaterKm2}`}
                    sub="D-MOSS surface model"
                    colorClass={selected.standingWaterKm2 > 5 ? 'red' : 'green'}
                  />
                )}
                {selected.temperature !== undefined && (
                  <MetricBox
                    lbl="Surface Temp."
                    val={`${selected.temperature}°C`}
                    sub="Thermal imagery avg."
                  />
                )}
                <MetricBox
                  lbl="Alert Level"
                  val={`${selected.alertLevel} / 3`}
                  sub="InfoDengue scale"
                  colorClass={selected.alertLevel >= 2 ? 'red' : selected.alertLevel === 1 ? 'orange' : 'green'}
                />
                <MetricBox
                  lbl="Data source"
                  val={selected.source === 'infodengue' ? '🔴 Live' : '🔵 Demo'}
                  sub={selected.source === 'infodengue' ? 'InfoDengue API' : 'Mock data'}
                />
              </div>
            </div>
          ) : (
            <div className="db-loading" style={{ flex: 1 }}>
              <span>← Select a site</span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
