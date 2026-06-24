import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Session } from '@supabase/supabase-js';

import HomeScreen from './src/screens/HomeScreen';
import DailyLogScreen from './src/screens/DailyLogScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import FoodDetailScreen from './src/screens/FoodDetailScreen';
import MealsScreen from './src/screens/MealsScreen';
import AboutScreen from './src/screens/AboutScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import BarcodeScannerScreen from './src/screens/BarcodeScannerScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import RecipeScreen from './src/screens/RecipeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FoodCameraScreen from './src/screens/FoodCameraScreen';
import PremiumScreen from './src/screens/PremiumScreen';
import MealTimePopup from './src/components/ui/MealTimePopup';
import { supabase } from './src/lib/supabase';
import { useAppStore } from './src/store/useAppStore';
import { useUserStore } from './src/store/useUserStore';

// ─────────────────────────────────────────────────────────────
// ÖZEL TAB BAR
// ─────────────────────────────────────────────────────────────

const TAB_CONFIG: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: 'Home',    label: 'Ana Sayfa', icon: 'home-outline',       activeIcon: 'home' },
  { name: 'Meals',   label: 'Öğünler',  icon: 'restaurant-outline', activeIcon: 'restaurant' },
  { name: 'DailyLog',label: 'Günlük',   icon: 'journal-outline',    activeIcon: 'journal' },
  { name: 'Profile', label: 'Profil',   icon: 'person-outline',     activeIcon: 'person' },
];

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarOuter, { bottom: Math.max(insets.bottom, 10) + 4 }]}>
      {/* Glass katmanı: ince üst kenar + iç parıltı */}
      <View style={styles.glassTopEdge} />

      {/* Ana glass arka plan */}
      <LinearGradient
        colors={['rgba(255,255,255,0.96)', 'rgba(248,250,252,0.94)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.tabBarInner}
      >
        {/* İç yansıma şeridi */}
        <View style={styles.glassSheen} />

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const tab     = TAB_CONFIG.find(t => t.name === route.name);
          if (!tab) return null;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.8}
              style={styles.tabItem}
              accessibilityLabel={tab.label}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
            >
              {/* İkon arka planı */}
              {focused ? (
                <LinearGradient
                  colors={['#0A6358', '#0D7A6B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconWrapActive}
                >
                  <Ionicons name={tab.activeIcon} size={22} color="#FFFFFF" />
                  {/* Aktif iç parıltı */}
                  <View style={styles.iconSheen} />
                </LinearGradient>
              ) : (
                <View style={styles.iconWrap}>
                  <Ionicons name={tab.icon} size={22} color="#94A3B8" />
                </View>
              )}

              <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {tab.label}
              </Text>

              {/* Aktif nokta göstergesi */}
              {focused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    left: 14,
    right: 14,
  },

  // Üst cam kenarı (ince parlak çizgi)
  glassTopEdge: {
    position: 'absolute',
    top: 0, left: 20, right: 20,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 1,
    zIndex: 2,
  },

  tabBarInner: {
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignItems: 'center',
    // Glass gölge
    shadowColor: '#0A3D37',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 20,
    // Cam kenarı
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    overflow: 'hidden',
  },

  // İç parıltı şeridi
  glassSheen: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 58,
    gap: 3,
  },

  iconWrap: {
    width: 46,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  // Aktif gradient pill
  iconWrapActive: {
    width: 54,
    height: 34,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // iOS gölge
    shadowColor: '#0D7A6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  // Aktif icon iç parıltı
  iconSheen: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: '#0D7A6B',
    fontWeight: '800',
    fontSize: 10,
  },

  // Aktif sekme nokta göstergesi
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0D7A6B',
    marginTop: 1,
  },
});

// ─────────────────────────────────────────────────────────────
// MAIN TABS
// ─────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeScreen}    options={{ tabBarLabel: 'Ana Sayfa' }} />
      <Tab.Screen name="Meals"    component={MealsScreen}   options={{ tabBarLabel: 'Öğünler' }} />
      <Tab.Screen name="DailyLog" component={DailyLogScreen}options={{ tabBarLabel: 'Günlük' }} />
      <Tab.Screen name="Profile"  component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────────────────────
// STACK & APP ROOT
// ─────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator();

export default function App() {
  const setIsPremium  = useAppStore((state) => state.setIsPremium);
  const isOnboarded   = useUserStore((state) => state.isOnboarded);
  const [session, setSession]          = useState<Session | null>(null);
  const [isLoadingSession, setLoading] = useState(true);
  const [showPopup, setShowPopup]      = useState(false);
  const navRef = useRef<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        if (s?.user) {
          const { data } = await supabase
            .from('users')
            .select('is_premium')
            .eq('id', s.user.id)
            .single();
          setIsPremium((data as any)?.is_premium ?? false);
        } else {
          setIsPremium(false);
        }
      }
    );

    return () => { subscription.unsubscribe(); };
  }, []);

  // Popup — oturum açıldıktan ve onboarding bittikten sonra göster
  useEffect(() => {
    if (session && isOnboarded && !isLoadingSession) {
      const hour = new Date().getHours();
      // Sadece gündüz saatlerinde popup göster
      if (hour >= 6 && hour < 23) {
        const timer = setTimeout(() => setShowPopup(true), 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [session, isOnboarded, isLoadingSession]);

  if (isLoadingSession) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FA' }}>
          <ActivityIndicator size="large" color="#0D7A6B" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F5F7FA' },
            animation: 'fade_from_bottom',
          }}
        >
          {!session ? (
            <Stack.Screen name="Login"      component={LoginScreen} />
          ) : !isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="MainTabs"       component={MainTabs} />
              <Stack.Screen name="FoodDetail"     component={FoodDetailScreen} />
              <Stack.Screen name="About"          component={AboutScreen} />
              <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
              <Stack.Screen name="Exercise"       component={ExerciseScreen} />
              <Stack.Screen name="Recipes"        component={RecipeScreen} />
              <Stack.Screen name="Settings"       component={SettingsScreen} />
              <Stack.Screen name="FoodCamera"     component={FoodCameraScreen} />
              <Stack.Screen name="Premium"        component={PremiumScreen} />
            </>
          )}
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>

      {/* Öğün Vakti Popup */}
      <MealTimePopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onNavigate={() => {
          setShowPopup(false);
          navRef.current?.navigate('MainTabs', { screen: 'Meals' });
        }}
      />
    </SafeAreaProvider>
  );
}
