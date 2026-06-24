# GlikoFit — Mimari Referans

## Proje Özeti
Diyabet ve kan şekeri yönetimi için React Native mobil uygulama. Kullanıcı sağlık profiline göre kişiselleştirilmiş Glisemik Yük (GL) hesaplama, yapay zeka destekli beslenme koçluğu ve kapsamlı sağlık takibi sunar.

---

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|---------|
| Framework | React Native (Expo) | SDK 54 |
| Dil | TypeScript | 5.7 (strict) |
| State | Zustand + AsyncStorage | 5.0.0 |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) | — |
| Stil | NativeWind (Tailwind CSS) | 2.0.11 |
| Navigasyon | React Navigation (Bottom Tabs + Native Stack) | — |
| Grafikler | react-native-chart-kit | 6.12.0 |

## Harici API'lar

| API | Kullanım | Auth |
|-----|---------|------|
| FatSecret | Yiyecek DB, barkod, tarifler, egzersiz | OAuth 2.0 Client Credentials |
| Google Gemini | AI koç tavsiyeleri | API Key (Edge Function üzerinden) |
| Pixabay | Yiyecek görselleri | API Key |
| Supabase | Auth, veritabanı, Edge Functions | Anon Key + JWT |
| RevenueCat | Premium abonelik | Henüz aktif değil |

---

## Klasör Yapısı

```
src/
├── screens/           # 12 ekran (LoginScreen → AboutScreen)
├── components/ui/     # CoachAdviceCard, GlTrendChart
├── store/             # 3 Zustand store
│   ├── useAppStore.ts      # Yiyecek seçimi, günlük log, GL hesaplama
│   ├── useUserStore.ts     # Sağlık profili (persisted)
│   └── useHealthStore.ts   # Mood/uyku/su/egzersiz/sağlık skoru
├── services/          # ai.ts (Gemini), notification.ts
├── lib/               # fatsecret.ts (OAuth + tüm endpoints)
├── hooks/             # useGlycemicLoad.ts
├── types/             # database.ts (Supabase tüm tablo tipleri)
├── utils/             # healthCalculations.ts, healthScore.ts, helpers.ts, images.ts
├── constants/         # Renk paleti, temalar
└── navigation/        # NavigationTypes

supabase/
├── migrations/        # migration_v2.sql, migration_v3.sql
├── functions/         # 4 Edge Function
│   ├── smart-coach/        # AI koç (Gemini)
│   ├── analyze-food-photo/ # Fotoğraftan yiyecek tespiti
│   ├── food-search/        # FatSecret wrapper
│   └── populate-food-macros/ # Admin: foods tablosunu zenginleştir
└── seed_macros.sql    # Başlangıç yiyecek verisi
```

---

## Navigasyon Ağacı

```
App.tsx
├── [Session yok]          → LoginScreen
├── [Session + Onboard değil] → OnboardingScreen (4 adım)
└── [Session + Onboarded]
    ├── MainTabs (Bottom Navigation)
    │   ├── Ana Sayfa     → HomeScreen
    │   ├── Tabağım       → MealBuilderScreen
    │   ├── Günlük        → DailyLogScreen
    │   └── Profil        → ProfileScreen
    └── Modal Stack
        ├── FoodDetail
        ├── About
        ├── BarcodeScanner
        ├── Exercise
        └── Recipes
```

Tab renkleri: Aktif=#10B981, Pasif=#A0A0A0

---

## Zustand Store Mimarisi

### useAppStore
```typescript
selectedFood: FoodItem | null    // Seçili yiyecek (FoodDetail için)
currentPortion: number           // Gram cinsinden porsiyon
calculateGlycemicLoad()         // GL = (GI × carbs/100g × gram) / 10000
dailyLog: DailyLogEntry[]       // Günlük yiyecek kaydı
coachSuggestion: CoachSuggestion // AI koç önerisi
isPremium: boolean
```

### useUserStore (AsyncStorage persisted)
```typescript
profile: UserHealthProfile | null
isOnboarded: boolean
bmi: number                      // Hesaplanmış
dailyCarbLimit: number           // Diyabet tipine göre kişiselleştirilmiş
glThresholds: { yellowThreshold, redThreshold }  // Diyabet tipine göre
```

### useHealthStore (AsyncStorage persisted)
```typescript
// Günlük (her gün sıfırlanır):
todayMoodEntries, todaySleepLog, todayWaterMl
todayCaffeineMg, todayExerciseLogs, totalCaloriesBurned

// Hesaplanmış:
healthScore: HealthScoreResult | null  // 5 bileşen, 0-100
```

---

## Veritabanı Şeması (Supabase)

### Ana Tablolar
| Tablo | Açıklama |
|-------|---------|
| `foods` | GI, carbs/100g, color_code, source (local/fatsecret) |
| `consumption_logs` | user_id, food_id, portion_grams, calculated_gl, logged_at |
| `user_health_profiles` | height, weight, diabetes_type, hba1c, activity_level |
| `coach_pairings` | high_risk_category → balancer_category (pre-made AI önerileri) |

### Sağlık Takip Tabloları
| Tablo | Açıklama |
|-------|---------|
| `mood_logs` | score(1-10), stress, energy, tags |
| `sleep_logs` | bed_time, wake_time, duration_minutes(AUTO), quality_score |
| `water_logs` | amount_ml, log_date |
| `caffeine_logs` | beverage_type, amount_mg |
| `exercise_logs` | exercise_name, duration_minutes, calories_burned, met_value |
| `photo_analyses` | Vision AI sonuçları |
| `barcode_cache` | Barkod → FoodID eşleşme cache |

### DB Fonksiyonları
- `fuzzy_food_search(term, threshold, max)` — Bulanık arama
- `estimate_gi_from_macros(carbs, fiber, fat, protein)` — GI tahmini
- `is_my_dietitian(target_user_id)` — Diyetisyen ilişki kontrolü

### View'lar
- `daily_water_summary`, `daily_caffeine_summary`, `daily_mood_summary`
- `mood_glucose_correlation` — Kortizol analizi için mood+tüketim JOIN

---

## Temel Algoritmalar

### Glisemik Yük (GL) Formülü
```
GL = (GI × Porsiyon_Karbonhidratı) / 100
Porsiyon_Karbonhidratı = (carbs_per_100g / 100) × gram

Örnek: Beyaz ekmek, GI=75, carbs=49g/100g, porsiyon=60g
  Carbs = (49/100) × 60 = 29.4g
  GL = (75 × 29.4) / 100 = 22.05 🔴
```

### Kişiselleştirilmiş GL Eşikleri
| Diyabet Tipi | Sarı | Kırmızı |
|-------------|------|---------|
| Tip 1 | ≥8 | ≥16 |
| Tip 2 | ≥8 | ≥15 |
| Pre-diyabet | ≥9 | ≥18 |
| Gestasyonel | ≥7 | ≥14 |
| Yok | ≥10 | ≥20 |
| HbA1c > 7.5 | −2 puan ek düşüş | −3 puan ek düşüş |

### Günlük Karbonhidrat Limiti
```
Limit = BaseCarb × BMI_Faktör × Aktivite_Faktör × HbA1c_Faktör

Base (g): Yok=250, Tip1=180, Tip2=150, Pre=170, Gestasyonel=160
BMI: Obez(≥30)=×0.80, Fazla Kilolu=×0.90, Zayıf=×1.10, Normal=×1.00
Aktivite: Sedanter=×0.85, Hafif=×0.95, Aktif=×1.05, ÇokAktif=×1.15
HbA1c > 7.0: ×0.90
```

### Günlük Sağlık Skoru (0-100)
| Bileşen | Ağırlık |
|---------|---------|
| Beslenme (GL/karbonhidrat) | %40 |
| Uyku (7-9 saat ideal) | %20 |
| Ruh Hali | %15 |
| Hidrasyon (ağırlık×30ml hedef) | %15 |
| Kafein (<300mg) | %10 |

Notlar: A≥85, B≥70, C≥55, D≥40, F<40

### Egzersiz Kalori Hesabı
```
kalori = (cal_per_min × (kullanici_kg / 65)) × sure_dakika
```

---

## Pratik Porsiyon Birimleri
```
Ekmek türleri → "Dilim" (30g)
Meyve → "Adet" (120g)
Çorba/pilav → "Kase" (200g)
İçecek → "Bardak" (200g)
Kuruyemiş → "Avuç" (30g)
Sos/reçel → "Kaşık" (15g)
Ana yemek → "Tabak" (200g)
```

---

## Renk Paleti
```
#10B981  Ana yeşil (primary, aktif tab)
#008A79  Koyu yeşil (header/gradient)
#F5A623  Sarı/uyarı
#E8453C  Kırmızı/tehlike
#A0A0A0  Pasif gri
```

---

## Çevre Değişkenleri (.env — hepsi EXPO_PUBLIC_)
```
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
EXPO_PUBLIC_FATSECRET_CLIENT_ID / CLIENT_SECRET
EXPO_PUBLIC_PIXABAY_API_KEY
EXPO_PUBLIC_GEMINI_API_KEY
EXPO_PUBLIC_RC_IOS_API_KEY / RC_ANDROID_API_KEY  ← henüz kullanılmıyor
```

---

## Veri Akışı
```
Kullanıcı → React Native (Zustand) → Supabase Client (RLS+JWT)
                                          ├── PostgreSQL
                                          └── Edge Functions
                                               ├── FatSecret OAuth
                                               ├── Gemini AI
                                               └── Pixabay
```

### Önbellek Stratejisi
- FatSecret token: bellekte ~60s
- Egzersiz listesi: state'de session boyunca
- Barcode sonuçları: Supabase `barcode_cache` tablosunda
- Görsel: React Native Image native cache
