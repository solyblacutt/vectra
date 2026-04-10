import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar,
} from 'react-native'
import { COLORS, RISK } from '../theme'

export default function SiteDetailScreen({ route, navigation }) {
  const { site } = route.params
  const rc = RISK[site.risk] ?? RISK.unknown

  const metrics = [
    { lbl: 'Risk Level',        val: `${rc.icon} ${rc.label}`, color: rc.color, sub: `Alert level ${site.alertLevel}/3` },
    { lbl: 'Warning Window',    val: site.warningDays ? `T−${site.warningDays} days` : 'None',
      color: site.warningDays ? COLORS.orange : COLORS.green, sub: 'Days until projected impact' },
    { lbl: 'Soil Moisture',     val: `${site.soilMoisture}%`,
      color: site.soilMoisture > 75 ? COLORS.orange : COLORS.ink, sub: 'SAR satellite telemetry' },
    { lbl: 'Standing Water',    val: `${site.standingWaterKm2} km²`,
      color: site.standingWaterKm2 > 5 ? COLORS.red : COLORS.ink, sub: 'D-MOSS surface model' },
    { lbl: 'Surface Temp.',     val: `${site.temperature}°C`, color: COLORS.ink, sub: 'Thermal imagery avg.' },
    { lbl: 'Dengue Cases',      val: site.cases.toLocaleString(), color: site.cases > 100 ? COLORS.red : COLORS.ink,
      sub: `Incidence: ${site.incidence}/100k` },
  ]

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Top bar */}
      <View style={styles.topbar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <View style={[styles.riskBadge, { backgroundColor: rc.bg }]}>
          <Text style={[styles.riskBadgeTxt, { color: rc.color }]}>{rc.icon} {rc.label}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Site header */}
        <View style={[styles.siteHeader, { borderLeftColor: rc.color }]}>
          <Text style={styles.siteName}>{site.name}</Text>
          <Text style={styles.siteRegion}>{site.region}</Text>
          <View style={styles.typePill}>
            <Text style={styles.typePillTxt}>{site.type === 'mining' ? '⛏ Mining' : '⚡ Energy'}</Text>
          </View>
        </View>

        {/* Critical alert if needed */}
        {(site.alertLevel >= 2) && (
          <View style={styles.criticalBanner}>
            <Text style={styles.criticalTitle}>
              {site.alertLevel === 3 ? '🚨 CRITICAL — Immediate Action Required' : '⚠️ HIGH — Preventive Action Recommended'}
            </Text>
            <Text style={styles.criticalBody}>
              {site.warningDays
                ? `Outbreak conditions projected in ${site.warningDays} days. Begin preventive fumigation protocol immediately.`
                : 'Active outbreak conditions detected. Workforce protection measures should be activated.'}
            </Text>
          </View>
        )}

        {/* Metrics grid */}
        <Text style={styles.sectionLbl}>Site Metrics</Text>
        <View style={styles.metricsGrid}>
          {metrics.map(m => (
            <View key={m.lbl} style={styles.metricCard}>
              <Text style={styles.metricLbl}>{m.lbl}</Text>
              <Text style={[styles.metricVal, { color: m.color }]}>{m.val}</Text>
              <Text style={styles.metricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>

        {/* Data sources */}
        <Text style={styles.sectionLbl}>Data Sources</Text>
        {[
          { icon: '🛰', name: 'Sentinel-1 SAR Radar', desc: 'Soil moisture & standing water mapping' },
          { icon: '🦟', name: 'InfoDengue API',        desc: 'Live epidemiological alert feed' },
          { icon: '💧', name: 'D-MOSS Engine',         desc: 'Hydrological surface water model' },
        ].map(ds => (
          <View key={ds.name} style={styles.dsCard}>
            <Text style={styles.dsIcon}>{ds.icon}</Text>
            <View>
              <Text style={styles.dsName}>{ds.name}</Text>
              <Text style={styles.dsDesc}>{ds.desc}</Text>
            </View>
          </View>
        ))}

        {/* Trend */}
        <Text style={styles.sectionLbl}>Trend</Text>
        <View style={styles.trendCard}>
          <Text style={[styles.trendVal, {
            color: site.trend === 'rising' || site.trend === 'critical' ? COLORS.red
              : site.trend === 'stable' ? COLORS.ink3 : COLORS.green
          }]}>
            {site.trend === 'rising' || site.trend === 'critical' ? '↑ Rising'
              : site.trend === 'stable' ? '→ Stable' : '↓ Falling'}
          </Text>
          <Text style={styles.trendSub}>
            {site.trend === 'rising' || site.trend === 'critical'
              ? 'Vector breeding conditions are worsening. Elevated vigilance required.'
              : 'Conditions are stable. Continue standard monitoring protocol.'}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20 },

  topbar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
             padding: 16, paddingTop: 48, backgroundColor: COLORS.white,
             borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backBtn: { padding: 4 },
  backTxt: { fontSize: 15, color: COLORS.blue, fontWeight: '600' },

  riskBadge:    { borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5 },
  riskBadgeTxt: { fontSize: 12, fontWeight: '700' },

  siteHeader:  { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 16,
                 borderLeftWidth: 4,
                 shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  siteName:    { fontSize: 22, fontWeight: '800', color: COLORS.ink, letterSpacing: -0.5 },
  siteRegion:  { fontSize: 13, color: COLORS.ink3, marginTop: 4 },
  typePill:    { marginTop: 12, alignSelf: 'flex-start', backgroundColor: COLORS.bg, borderRadius: 100,
                 paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: COLORS.border },
  typePillTxt: { fontSize: 12, fontWeight: '600', color: COLORS.ink2 },

  criticalBanner: { borderRadius: 14, padding: 16, marginBottom: 20,
                    borderWidth: 1, borderColor: '#fca5a5', backgroundColor: '#fee2e2' },
  criticalTitle:  { fontSize: 14, fontWeight: '700', color: '#991b1b', marginBottom: 6 },
  criticalBody:   { fontSize: 13, color: '#7f1d1d', lineHeight: 18 },

  sectionLbl: { fontSize: 11, fontWeight: '700', letterSpacing: 0.9, textTransform: 'uppercase',
                color: COLORS.ink3, marginBottom: 10, marginTop: 20 },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard:  { width: '47%', backgroundColor: COLORS.white, borderRadius: 14, padding: 14,
                 shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  metricLbl:   { fontSize: 10, fontWeight: '600', color: COLORS.ink3, letterSpacing: 0.5, textTransform: 'uppercase' },
  metricVal:   { fontSize: 20, fontWeight: '800', letterSpacing: -0.5, marginTop: 4 },
  metricSub:   { fontSize: 11, color: COLORS.ink3, marginTop: 2 },

  dsCard: { flexDirection: 'row', gap: 14, alignItems: 'center',
            backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8,
            borderWidth: 1, borderColor: COLORS.border },
  dsIcon: { fontSize: 22 },
  dsName: { fontSize: 14, fontWeight: '600', color: COLORS.ink },
  dsDesc: { fontSize: 12, color: COLORS.ink3, marginTop: 2 },

  trendCard: { backgroundColor: COLORS.white, borderRadius: 14, padding: 18,
               borderWidth: 1, borderColor: COLORS.border },
  trendVal:  { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  trendSub:  { fontSize: 13, color: COLORS.ink3, marginTop: 8, lineHeight: 18 },
})
