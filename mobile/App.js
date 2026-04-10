import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { View, Text, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'

import HomeScreen      from './src/screens/HomeScreen'
import SiteDetailScreen from './src/screens/SiteDetailScreen'
import ReportsScreen   from './src/screens/ReportsScreen'
import { COLORS }      from './src/theme'

const Tab   = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Icons as emoji (no extra native module needed)
function TabIcon({ name, focused }) {
  const icons = { Home: '🗺', Reports: '📋', Settings: '⚙️' }
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{icons[name]}</Text>
    </View>
  )
}

// Home stack (Home + Site Detail)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home"       component={HomeScreen} />
      <Stack.Screen name="SiteDetail" component={SiteDetailScreen} />
    </Stack.Navigator>
  )
}

// Placeholder for Settings tab
function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>⚙️</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.ink }}>Settings</Text>
      <Text style={{ fontSize: 13, color: COLORS.ink3, marginTop: 8 }}>Coming soon</Text>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor:   COLORS.blue,
          tabBarInactiveTintColor: COLORS.ink3,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopColor:  COLORS.border,
            borderTopWidth:  1,
            paddingBottom:   Platform.OS === 'ios' ? 20 : 8,
            paddingTop:      8,
            height:          Platform.OS === 'ios' ? 80 : 64,
          },
          tabBarLabelStyle: {
            fontSize:   11,
            fontWeight: '600',
            marginTop:  2,
          },
        })}
      >
        <Tab.Screen name="Home"     component={HomeStack}      options={{ title: 'Sites' }} />
        <Tab.Screen name="Reports"  component={ReportsScreen}  options={{ title: 'Reports' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
