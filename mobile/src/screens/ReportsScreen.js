import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, StatusBar } from 'react-native'
import { COLORS } from '../theme'

const REPORTS = [
  {
    id: 'esg-q1',
    title: 'ESG Compliance Report Q1 2026',
    sites: 5,
    date: '2026-04-01',
    status: 'ready',
    reduction: 32,
  },
  {
    id: 'weekly-14',
    title: 'Weekly Risk Brief — W14',
    sites: 5,
    date: '2026-04-07',
    status: 'ready',
    reduction: null,
  },
  {
    id: 'weekly-15',
    title: 'Weekly Risk Brief — W15',
    sites: 5,
    date: '2026-04-10',
    status: 'processing',
    reduction: null,
  },
]

export default function ReportsScreen() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={styles.scroll}>

        <Text style={styles.pageTitle}>Reports</Text>

        {/* ESG summary */}
        <View style={styles.esgCard}>
          <Text style={styles.esgIcon}>🌱</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.esgTitle}>ESG Performance</Text>
            <Text style={styles.esgBody}>
              Your sites have reduced chemical usage by <Text style={styles.esgBold}>32% on average</Text>{' '}
              through targeted fumigation guided by VECTRA alerts.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLbl}>Recent Reports</Text>

        {REPORTS.map(r => (
          <View key={r.id} style={styles.reportCard}>
            <View style={styles.reportLeft}>
              <Text style={styles.reportTitle}>{r.title}</Text>
              <Text style={styles.reportMeta}>
                {r.sites} sites · {new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
              {r.reduction && (
                <View style={styles.reportTag}>
                  <Text style={styles.reportTagTxt}>🌱 {r.reduction}% chemical reduction</Text>
                </View>
              )}
            </View>
            <View>
              {r.status === 'ready' ? (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => {/* open PDF */}}
                >
                  <Text style={styles.downloadTxt}>↓ PDF</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.processingBadge}>
                  <Text style={styles.processingTxt}>⏳</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <Text style={styles.sectionLbl}>Data Sources &amp; Methodology</Text>

        {[
          {
            icon: '🦟',
            name: 'InfoDengue',
            href: 'https://info.dengue.mat.br',
            desc: 'Brazilian epidemiological surveillance. Published in The Lancet. Free public API.',
          },
          {
            icon: '🛰',
            name: 'Sentinel-1 (ESA)',
            href: 'https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1',
            desc: 'C-Band SAR radar. Free access via Copernicus programme.',
          },
          {
            icon: '💧',
            name: 'D-MOSS',
            href: 'https://www.nasa.gov',
            desc: 'NASA-originated hydrological model for tropical water availability.',
          },
        ].map(ds => (
          <TouchableOpacity
            key={ds.name}
            style={styles.dsRow}
            onPress={() => Linking.openURL(ds.href)}
          >
            <Text style={styles.dsIcon}>{ds.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.dsName}>{ds.name} ↗</Text>
              <Text style={styles.dsDesc}>{ds.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: COLORS.bg },
  scroll:    { padding: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.ink, letterSpacing: -0.8, marginBottom: 24 },

  esgCard: { backgroundColor: '#d4f8e8', borderRadius: 16, padding: 18, flexDirection: 'row',
             gap: 14, alignItems: 'flex-start', marginBottom: 28,
             borderWidth: 1, borderColor: '#86efac' },
  esgIcon:  { fontSize: 26 },
  esgTitle: { fontSize: 15, fontWeight: '700', color: '#166534', marginBottom: 6 },
  esgBody:  { fontSize: 13, color: '#14532d', lineHeight: 18 },
  esgBold:  { fontWeight: '700' },

  sectionLbl: { fontSize: 11, fontWeight: '700', letterSpacing: 0.9, textTransform: 'uppercase',
                color: COLORS.ink3, marginBottom: 10, marginTop: 4 },

  reportCard:  { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 10,
                 flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                 shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  reportLeft:  { flex: 1 },
  reportTitle: { fontSize: 14, fontWeight: '700', color: COLORS.ink, letterSpacing: -0.2 },
  reportMeta:  { fontSize: 12, color: COLORS.ink3, marginTop: 3 },
  reportTag:   { marginTop: 8, alignSelf: 'flex-start', backgroundColor: '#d4f8e8',
                 borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3 },
  reportTagTxt:{ fontSize: 11, color: '#166534', fontWeight: '600' },

  downloadBtn:    { backgroundColor: COLORS.blue, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  downloadTxt:    { color: '#fff', fontWeight: '700', fontSize: 12 },
  processingBadge:{ borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: COLORS.surface },
  processingTxt:  { fontSize: 18 },

  dsRow:  { flexDirection: 'row', gap: 14, alignItems: 'flex-start',
            backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 8,
            borderWidth: 1, borderColor: COLORS.border },
  dsIcon: { fontSize: 22 },
  dsName: { fontSize: 14, fontWeight: '600', color: COLORS.blue },
  dsDesc: { fontSize: 12, color: COLORS.ink3, marginTop: 2, lineHeight: 16 },
})
