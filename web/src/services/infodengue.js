/**
 * VECTRA — InfoDengue API Integration
 * Docs: https://info.dengue.mat.br/api/alertcity
 *
 * Free public API — no key required.
 * Endpoint: GET /api/alertcity?geocode={ibge}&disease={disease}&format=json&ew_start={week}&ew_end={week}&ey_start={year}&ey_end={year}
 */

const BASE_URL = 'https://info.dengue.mat.br'

// Key Brazilian cities in operational/mining/energy zones
// IBGE geocodes
export const MONITORED_CITIES = [
  { id: 3550308, name: 'São Paulo',        state: 'SP', lat: -23.55, lng: -46.63 },
  { id: 3304557, name: 'Rio de Janeiro',   state: 'RJ', lat: -22.91, lng: -43.17 },
  { id: 1302603, name: 'Manaus',           state: 'AM', lat: -3.10,  lng: -60.02 },
  { id: 1501402, name: 'Belém',            state: 'PA', lat: -1.46,  lng: -48.50 },
  { id: 5103403, name: 'Cuiabá',           state: 'MT', lat: -15.60, lng: -56.10 },
  { id: 5300108, name: 'Brasília',         state: 'DF', lat: -15.78, lng: -47.93 },
  { id: 3106200, name: 'Belo Horizonte',   state: 'MG', lat: -19.92, lng: -43.94 },
  { id: 4106902, name: 'Curitiba',         state: 'PR', lat: -25.43, lng: -49.27 },
]

export const DISEASES = {
  dengue:      'dengue',
  chikungunya: 'chikungunya',
  zika:        'zika',
}

/**
 * Returns the ISO epidemiological week number for a given date.
 */
function getEpiWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

/**
 * Fetches the last N weeks of alert data from InfoDengue for a given city.
 * Returns an array of weekly alert objects.
 */
export async function fetchCityAlerts(geocode, disease = 'dengue', weeksBack = 4) {
  const now  = new Date()
  const year = now.getFullYear()
  const ewEnd   = getEpiWeek(now)
  const ewStart = Math.max(1, ewEnd - weeksBack)

  const url = `${BASE_URL}/api/alertcity?` +
    `geocode=${geocode}&disease=${disease}&format=json` +
    `&ew_start=${ewStart}&ew_end=${ewEnd}` +
    `&ey_start=${year}&ey_end=${year}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`InfoDengue error ${res.status}`)
  return res.json()
}

/**
 * Classifies InfoDengue alert level (0–3) into VECTRA risk label.
 * Level 0 = green, 1 = yellow, 2 = orange, 3 = red
 */
export function classifyRisk(level) {
  const map = { 0: 'low', 1: 'medium', 2: 'high', 3: 'critical' }
  return map[level] ?? 'unknown'
}

/**
 * Fetches alerts for ALL monitored cities and returns enriched site objects.
 * Falls back to MOCK_SITES if the API is unreachable (CORS/network).
 */
export async function fetchAllSiteAlerts(disease = 'dengue') {
  const results = await Promise.allSettled(
    MONITORED_CITIES.map(async (city) => {
      const data = await fetchCityAlerts(city.id, disease, 1)
      const latest = data?.[0] ?? null
      return {
        ...city,
        disease,
        alertLevel: latest?.level_alert ?? 0,
        risk:       classifyRisk(latest?.level_alert ?? 0),
        cases:      latest?.casos ?? 0,
        incidence:  latest?.inc_100k ?? 0,
        week:       latest?.SE ?? null,
        receptivity: latest?.receptivo ?? 0,
        transmission: latest?.transmissao ?? 0,
        lastUpdated: new Date().toISOString(),
        source: 'infodengue',
      }
    })
  )

  // Use result if fulfilled, fallback mock if rejected
  return results.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    console.warn(`InfoDengue fetch failed for ${MONITORED_CITIES[i].name}, using mock`)
    return MOCK_SITES[i] ?? MOCK_SITES[0]
  })
}

// ─── MOCK DATA (always available offline / for demo) ───────────────────────
export const MOCK_SITES = [
  {
    id: 3550308, name: 'São Paulo', state: 'SP',
    lat: -23.55, lng: -46.63,
    risk: 'medium', alertLevel: 1, cases: 1240, incidence: 10.8,
    week: 15, receptivity: 1, transmission: 0,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 3304557, name: 'Rio de Janeiro', state: 'RJ',
    lat: -22.91, lng: -43.17,
    risk: 'critical', alertLevel: 3, cases: 8542, incidence: 127.3,
    week: 15, receptivity: 1, transmission: 1,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 1302603, name: 'Manaus', state: 'AM',
    lat: -3.10, lng: -60.02,
    risk: 'high', alertLevel: 2, cases: 3200, incidence: 83.2,
    week: 15, receptivity: 1, transmission: 1,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 1501402, name: 'Belém', state: 'PA',
    lat: -1.46, lng: -48.50,
    risk: 'high', alertLevel: 2, cases: 2100, incidence: 94.7,
    week: 15, receptivity: 1, transmission: 0,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 5103403, name: 'Cuiabá', state: 'MT',
    lat: -15.60, lng: -56.10,
    risk: 'low', alertLevel: 0, cases: 320, incidence: 5.1,
    week: 15, receptivity: 0, transmission: 0,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 5300108, name: 'Brasília', state: 'DF',
    lat: -15.78, lng: -47.93,
    risk: 'low', alertLevel: 0, cases: 180, incidence: 6.2,
    week: 15, receptivity: 0, transmission: 0,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 3106200, name: 'Belo Horizonte', state: 'MG',
    lat: -19.92, lng: -43.94,
    risk: 'medium', alertLevel: 1, cases: 920, incidence: 34.5,
    week: 15, receptivity: 1, transmission: 0,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
  {
    id: 4106902, name: 'Curitiba', state: 'PR',
    lat: -25.43, lng: -49.27,
    risk: 'low', alertLevel: 0, cases: 45, incidence: 2.4,
    week: 15, receptivity: 0, transmission: 0,
    lastUpdated: new Date().toISOString(), source: 'mock',
  },
]

export const RISK_CONFIG = {
  low:      { color: '#22c55e', label: 'Clear',    bg: '#d4f8e8', icon: '🟢' },
  medium:   { color: '#f59e0b', label: 'Medium',   bg: '#fef3c7', icon: '🟡' },
  high:     { color: '#ef4444', label: 'High',     bg: '#fee2e2', icon: '🔴' },
  critical: { color: '#991b1b', label: 'Critical', bg: '#fca5a5', icon: '🚨' },
  unknown:  { color: '#6b7280', label: 'Unknown',  bg: '#f3f4f6', icon: '⚪' },
}
