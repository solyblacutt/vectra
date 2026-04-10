// Shared VECTRA design tokens — mirrors web palette
export const COLORS = {
  blue:    '#1d56b2',
  cyan:    '#34d6de',
  mid:     '#247bce',
  bg:      '#eeefed',
  white:   '#ffffff',
  ink:     '#0d0f0e',
  ink2:    '#3a3d3b',
  ink3:    '#7a7d7b',
  border:  'rgba(13,15,14,0.1)',
  red:     '#e84040',
  orange:  '#f59e0b',
  green:   '#22c55e',
  surface: '#e6e8e5',
}

export const RISK = {
  low:      { color: '#22c55e', label: 'Clear',    bg: '#d4f8e8', icon: '🟢' },
  medium:   { color: '#f59e0b', label: 'Medium',   bg: '#fef3c7', icon: '🟡' },
  high:     { color: '#ef4444', label: 'High',     bg: '#fee2e2', icon: '🔴' },
  critical: { color: '#991b1b', label: 'Critical', bg: '#fca5a5', icon: '🚨' },
  unknown:  { color: '#6b7280', label: 'Unknown',  bg: '#f3f4f6', icon: '⚪' },
}

// Mock sites (shared with web)
export const SITES = [
  {
    id: 'vale-carajas',
    name: 'Vale — Carajás',
    region: 'Pará, Brazil',
    type: 'mining',
    risk: 'high', alertLevel: 2, warningDays: 18,
    soilMoisture: 87, standingWaterKm2: 4.2, temperature: 31,
    cases: 142, incidence: 83.2, trend: 'rising',
  },
  {
    id: 'petrobras-urucu',
    name: 'Petrobras — Urucu',
    region: 'Amazonas, Brazil',
    type: 'energy',
    risk: 'critical', alertLevel: 3, warningDays: 7,
    soilMoisture: 94, standingWaterKm2: 11.7, temperature: 34,
    cases: 380, incidence: 127.3, trend: 'critical',
  },
  {
    id: 'anglo-minas',
    name: 'Anglo American',
    region: 'Minas Gerais, Brazil',
    type: 'mining',
    risk: 'medium', alertLevel: 1, warningDays: 24,
    soilMoisture: 62, standingWaterKm2: 1.8, temperature: 26,
    cases: 78, incidence: 34.5, trend: 'rising',
  },
  {
    id: 'codelco-norte',
    name: 'Codelco — Norte',
    region: 'Atacama, Chile',
    type: 'mining',
    risk: 'low', alertLevel: 0, warningDays: null,
    soilMoisture: 12, standingWaterKm2: 0, temperature: 18,
    cases: 0, incidence: 0, trend: 'stable',
  },
  {
    id: 'ypf-neuquen',
    name: 'YPF — Neuquén',
    region: 'Neuquén, Argentina',
    type: 'energy',
    risk: 'low', alertLevel: 0, warningDays: null,
    soilMoisture: 28, standingWaterKm2: 0.1, temperature: 22,
    cases: 2, incidence: 1.1, trend: 'stable',
  },
]
