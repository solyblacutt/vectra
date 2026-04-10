import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  StatusBar, RefreshControl, Animated,
} from 'react-native'
import { useState, useRef, useCallback } from 'react'
import { COLORS, RISK, SITES } from '../theme'

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false)
  const [sites, setSites] = useState(SITES)
  const fadeAnim = useRef(new Animated.Value(0)).current

  Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start()

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }, [])

  const criticalSites = sites.filter(s => s.alertLevel >= 2)
  const alertSites    = sites.filter(s => s.alertLevel === 1)
  const clearSites    = sites.filter(s => s.alertLevel === 0)

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.blue} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.subtitle}>Here's your operational risk overview</Text>
          </View>
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* KPI Row */}
        <Animated.View style={[styles.kpiRow, { opacity: fadeAnim }]}>
          <View style={[styles.kpiCard, { borderTopColor: COLORS.red }]}>
            <Text style={[styles.kpiNum, { color: COLORS.red }]}>{criticalSites.length}</Text>
            <Text style={styles.kpiLbl}>Critical{'\n'}Sites</Text>
          </View>
          <View style={[styles.kpiCard, { borderTopColor: COLORS.orange }]}>
            <Text style={[styles.kpiNum, { color: COLORS.orange }]}>{alertSites.length}</Text>
            <Text style={styles.kpiLbl}>Active{'\n'}Alerts</Text>
          </View>
          <View style={[styles.kpiCard, { borderTopColor: COLORS.green }]}>
            <Text style={[styles.kpiNum, { color: COLORS.green }]}>{clearSites.length}</Text>
            <Text style={styles.kpiLbl}>Clear{'\n'}Sites</Text>
          </View>
          <View style={[styles.kpiCard, { borderTopColor: COLORS.blue }]}>
            <Text style={[styles.kpiNum, { color: COLORS.blue }]}>24d</Text>
            <Text style={styles.kpiLbl}>Avg{'\n'}Lead Time</Text>
          </View>
        </Animated.View>

        {/* Critical alerts banner */}
        {criticalSites.length > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertBannerIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertBannerTitle}>Action Required</Text>
              <Text style={styles.alertBannerBody}>
                {criticalSites.length} site{criticalSites.length > 1 ? 's' : ''} at critical risk level.
                Immediate preventive action recommended.
              </Text>
            </View>
          </View>
        )}

        {/* Site list */}
        <Text style={styles.sectionTitle}>Monitored Sites</Text>

        {sites.map(site => {
          const rc = RISK[site.risk] ?? RISK.unknown
          return (
            <TouchableOpacity
              key={site.id}
              id={`site-card-${site.id}`}
              style={styles.siteCard}
              onPress={() => navigation.navigate('SiteDetail', { site })}
              activeOpacity={0.75}
            >
              <View style={[styles.siteRiskBar, { backgroundColor: rc.color }]} />
              <View style={styles.siteBody}>
                <View style={styles.siteTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.siteName}>{site.name}</Text>
                    <Text style={styles.siteRegion}>{site.region}</Text>
                  </View>
                  <View style={[styles.riskBadge, { backgroundColor: rc.bg }]}>
                    <Text style={[styles.riskBadgeTxt, { color: rc.color }]}>
                      {rc.icon} {rc.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.siteMetrics}>
                  {site.warningDays && (
                    <View style={styles.metricPill}>
                      <Text style={[styles.metricVal, { color: COLORS.orange }]}>T−{site.warningDays}d</Text>
                      <Text style={styles.metricLbl}>Warning</Text>
                    </View>
                  )}
                  <View style={styles.metricPill}>
                    <Text style={styles.metricVal}>{site.soilMoisture}%</Text>
                    <Text style={styles.metricLbl}>Moisture</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricVal}>{site.cases}</Text>
                    <Text style={styles.metricLbl}>Cases</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={[styles.metricVal,
                      site.trend === 'rising' || site.trend === 'critical' ? { color: COLORS.red }
                        : site.trend === 'stable' ? { color: COLORS.ink3 }
                        : { color: COLORS.green }
                    ]}>
                      {site.trend === 'rising' || site.trend === 'critical' ? '↑' : '→'}
                    </Text>
                    <Text style={styles.metricLbl}>Trend</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}

        {/* Data source note */}
        <Text style={styles.dataNote}>
          🛰 Data: InfoDengue API · Sentinel-1 SAR · D-MOSS{'\n'}
          Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: COLORS.bg },
  scroll:  { padding: 20, paddingBottom: 40 },

  header:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting:{ fontSize: 22, fontWeight: '800', color: COLORS.ink, letterSpacing: -0.5 },
  subtitle:{ fontSize: 13, color: COLORS.ink3, marginTop: 2 },
  livePill:{ flexDirection: 'row', alignItems: 'center', gap: 6,
             backgroundColor: '#d4f8e8', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
             borderWidth: 1, borderColor: '#86efac' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
  liveText:{ fontSize: 10, fontWeight: '700', color: '#166534', letterSpacing: 0.8 },

  kpiRow:  { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 14, padding: 12,
             borderTopWidth: 3, alignItems: 'center',
             shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  kpiNum:  { fontSize: 22, fontWeight: '900', letterSpacing: -1 },
  kpiLbl:  { fontSize: 10, color: COLORS.ink3, textAlign: 'center', marginTop: 4, lineHeight: 14 },

  alertBanner: { backgroundColor: '#fee2e2', borderRadius: 14, padding: 16,
                 flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 24,
                 borderWidth: 1, borderColor: '#fca5a5' },
  alertBannerIcon:  { fontSize: 22 },
  alertBannerTitle: { fontSize: 14, fontWeight: '700', color: '#991b1b', marginBottom: 2 },
  alertBannerBody:  { fontSize: 13, color: '#7f1d1d', lineHeight: 18 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.ink, marginBottom: 12, letterSpacing: -0.3 },

  siteCard: { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 12, overflow: 'hidden',
              flexDirection: 'row',
              shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  siteRiskBar: { width: 5 },
  siteBody:    { flex: 1, padding: 16 },
  siteTop:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  siteName:    { fontSize: 15, fontWeight: '700', color: COLORS.ink, letterSpacing: -0.3 },
  siteRegion:  { fontSize: 12, color: COLORS.ink3, marginTop: 2 },

  riskBadge:    { borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  riskBadgeTxt: { fontSize: 11, fontWeight: '700' },

  siteMetrics: { flexDirection: 'row', gap: 12 },
  metricPill:  { alignItems: 'center' },
  metricVal:   { fontSize: 14, fontWeight: '800', color: COLORS.ink, letterSpacing: -0.5 },
  metricLbl:   { fontSize: 10, color: COLORS.ink3, marginTop: 2 },

  dataNote: { fontSize: 11, color: COLORS.ink3, textAlign: 'center', lineHeight: 18, marginTop: 8 },
})
