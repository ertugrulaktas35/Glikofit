# GlikoFit — Geliştirici Kılavuzu

> Diyabet ve kan şekeri yönetimi için React Native mobil uygulaması.  
> Bu belge, projeye yeni katılan geliştiricilerin her şeyi hızla anlayabilmesi için hazırlanmıştır.

---

## 📋 İçindekiler

1. [Proje Özeti](#proje-özeti)
2. [Teknoloji Yığını](#teknoloji-yığını)
3. [Klasör Yapısı](#klasör-yapısı)
4. [Kurulum](#kurulum)
5. [Ortam Değişkenleri](#ortam-değişkenleri)
6. [Ekranlar ve Navigasyon](#ekranlar-ve-navigasyon)
7. [State Yönetimi (Zustand)](#state-yönetimi-zustand)
8. [API Entegrasyonları](#api-entegrasyonları)
9. [Kritik Algoritmalar](#kritik-algoritmalar)
10. [Bileşenler](#bileşenler)
11. [Servisler](#servisler)
12. [Supabase Şeması](#supabase-şeması)
13. [Animasyon Sistemleri](#animasyon-sistemleri)
14. [Premium Sistemi](#premium-sistemi)
15. [Bilinen Sorunlar ve TODO](#bilinen-sorunlar-ve-todo)

---

## Proje Özeti

GlikoFit, diyabet hastalarının günlük beslenmesini takip etmelerine, glisemik yük (GL) hesaplamalarıyla bilinçli tercihler yapmalarına ve AI destekli koç tavsiyeleri almalarına olanak tanır.

**Hedef kullanıcı:** Tip 1, Tip 2, prediyabet veya gestasyonel diyabet tanısı almış bireyler.

**Temel özellikler:**
- Besin arama (yerel DB + FatSecret API hibrit)
- Glisemik Yük (GL) hesaplama ve trafik lambası sistemi
- Öğün bazlı günlük kayıt (Kahvaltı / Öğle / Akşam / Ara Öğün)
- AI koç tavsiyeleri (Google Gemini)
- Fotoğrafla yemek tanıma (LogMeal API)
- Barkod tarama (FatSecret API)
- Su takibi, egzersiz ve ruh hali günlükleri
- Günlük sağlık skoru (0-100)

---

## Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|--------|-----------|---------|
| Framework | React Native + Expo | SDK 54 |
| Dil | TypeScript (strict) | ~5.x |
| UI | NativeWind (Tailwind CSS for RN) | - |
| Stil | expo-linear-gradient, StyleSheet | - |
| State | Zustand v5 | - |
| Kalıcılık | AsyncStorage (Zustand persist) | - |
| Backend | Supabase (PostgreSQL + Auth + Storage) | - |
| AI | Google Gemini API | gemini-1.5-flash |
| Besin DB | FatSecret API (OAuth 2.0 Client Credentials) | v2 |
| Yemek Fotoğraf | LogMeal API | v2 |
| Görsel | Pixabay API | - |
| SVG | react-native-svg | 15.12.1 |
| Kamera | expo-camera | ^55.x |
| Galeri | expo-image-picker | ~17.x |
| Slider | @react-native-community/slider | - |
| Navigasyon | React Navigation (Stack + BottomTabs) | v6 |
| Bildirimler | expo-notifications | - |

---

## Klasör Yapısı

```
c:\diyabetuygulamasi\
├── App.tsx                        # Giriş noktası, navigasyon, tab bar, popup
├── .env                           # API anahtarları (EXPO_PUBLIC_ prefix zorunlu)
├── PROGRESS.md                    # Özellik ilerleme takibi
├── ARCH.md                        # Mimari kararlar
├── RULES.md                       # Kod standartları
├── DEVELOPER.md                   # Bu dosya
│
├── src/
│   ├── screens/                   # Tüm ekranlar
│   │   ├── HomeScreen.tsx         # Ana sayfa: besin arama, metrik dashboard
│   │   ├── MealsScreen.tsx        # Öğünler: 3 ana öğün + ara öğün
│   │   ├── DailyLogScreen.tsx     # Günlük: öğüne göre gruplu kayıtlar
│   │   ├── ProfileScreen.tsx      # Profil: sağlık skoru, ayarlar
│   │   ├── FoodDetailScreen.tsx   # Besin detay: GL, makro, porsiyon
│   │   ├── FoodCameraScreen.tsx   # LogMeal AI yemek tarama
│   │   ├── BarcodeScannerScreen.tsx # FatSecret barkod tarama
│   │   ├── PremiumScreen.tsx      # Premium plan karşılaştırma sayfası
│   │   ├── OnboardingScreen.tsx   # İlk kullanım profil kurulumu
│   │   ├── LoginScreen.tsx        # Supabase Auth (email/password)
│   │   ├── ExerciseScreen.tsx     # Egzersiz kaydı
│   │   ├── RecipeScreen.tsx       # Tarif keşfet (FatSecret)
│   │   ├── SettingsScreen.tsx     # Ayarlar
│   │   └── AboutScreen.tsx        # Uygulama hakkında
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── WaterGlassWidget.tsx   # SVG bardak, yüzen su butonu
│   │       ├── WaterModal.tsx         # Su takibi modalı
│   │       ├── MealTimePopup.tsx      # Öğün vakti hatırlatma popup
│   │       ├── CoachAdviceCard.tsx    # AI koç tavsiye kartı
│   │       └── GlTrendChart.tsx       # GL trend grafiği
│   │
│   ├── store/
│   │   ├── useAppStore.ts         # Genel app state (dailyLog, isPremium, MealType)
│   │   ├── useUserStore.ts        # Kullanıcı profili, BMI, karbonhidrat limiti
│   │   └── useHealthStore.ts      # Sağlık günlükleri (su, kafein, uyku, ruh hali)
│   │
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   └── fatsecret.ts           # FatSecret API tüm endpoint'leri
│   │
│   ├── services/
│   │   ├── logmeal.ts             # LogMeal API: fotoğraf tanıma + makro
│   │   ├── ai.ts                  # Gemini AI entegrasyonu
│   │   ├── db.ts                  # Supabase sorguları (koç, yemek geçmişi)
│   │   ├── notificationService.ts # Expo bildirimleri
│   │   └── photoAnalysis.ts       # Fotoğraf önişleme
│   │
│   ├── hooks/
│   │   └── useGlycemicLoad.ts     # GL hesaplama hook
│   │
│   ├── types/
│   │   └── database.ts            # Supabase tablo tipleri + arayüzler
│   │
│   └── utils/
│       ├── images.ts              # Pixabay görsel arama
│       └── healthCalculations.ts  # BMI, karbonhidrat limiti, sağlık skoru
│
└── .api/
    └── apis/logmeal-api/
        └── openapi.json           # LogMeal API OpenAPI spec (v2.1.0)
```

---

## Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyasını oluştur (.env.example'dan kopyala)
cp .env.example .env
# ve API anahtarlarını doldur

# 3. iOS Simulator
npx expo start --ios

# 4. Android Emülatör
npx expo start --android

# 5. Fiziksel cihaz (Expo Go)
npx expo start
```

**Gereksinimler:**
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 14+ (macOS)
- Android: Android Studio + SDK

---

## Ortam Değişkenleri

`.env` dosyasındaki tüm değişkenler `EXPO_PUBLIC_` prefix'i ile başlamalıdır (Expo client-side erişimi için).

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# FatSecret API (OAuth 2.0 Client Credentials)
EXPO_PUBLIC_FATSECRET_CLIENT_ID=xxxx
EXPO_PUBLIC_FATSECRET_CLIENT_SECRET=xxxx

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...

# Pixabay (yemek görselleri)
EXPO_PUBLIC_PIXABAY_API_KEY=xxxxx

# LogMeal (yemek fotoğraf analizi)
EXPO_PUBLIC_LOGMEAL_API_KEY=ede32...

# RevenueCat (premium - henüz aktif değil)
EXPO_PUBLIC_RC_IOS_API_KEY=appl_xxx
EXPO_PUBLIC_RC_ANDROID_API_KEY=goog_xxx
```

> ⚠️ `.env` dosyasını asla git'e commit etme. `.gitignore`'da olduğundan emin ol.

---

## Ekranlar ve Navigasyon

### Navigasyon yapısı

```
NavigationContainer
└── Stack.Navigator
    ├── LoginScreen          (oturum açılmamışsa)
    ├── OnboardingScreen     (ilk kez açılmışsa)
    └── MainTabs (BottomTab)
        ├── HomeScreen       → tab: Ana Sayfa
        ├── MealsScreen      → tab: Öğünler
        ├── DailyLogScreen   → tab: Günlük
        └── ProfileScreen    → tab: Profil
    
    Stack (modal ekranlar):
    ├── FoodDetail           → HomeScreen veya Öğünler'den
    ├── BarcodeScanner       → HomeScreen veya Öğünler'den
    ├── FoodCamera           → HomeScreen veya Öğünler'den (LogMeal)
    ├── Exercise
    ├── Recipes
    ├── Settings
    ├── About
    └── Premium              → ProfileScreen'den
```

### Önemli ekran detayları

**HomeScreen:**
- Besin arama (Supabase + FatSecret hibrit)
- Filtreler: Tümü / Güvenli / Dikkat / Riskli + kategori filtreleri
- Sağ üst köşede yüzen `WaterGlassWidget` (tıklandığında `WaterModal` açılır)
- Sağ üstte: tarih kutusu
- Arama çubuğu: barkod + kamera ikonları
- `MealTimePopup`: uygulama açılınca saate göre öğün hatırlatması

**MealsScreen:**
- 4 öğün tipi: `kahvalti | ogle | aksam | ara`
- 4 kategori: `tabak | icecek | meyve | diger`
- Her öğün kendi GL toplamını tutar
- Arama + barkod + kamera butonları
- "Kaydet" → `addToDailyLog` ile her item `mealType` ve `mealCategory` ile kaydedilir

**FoodDetailScreen:**
- Akıllı porsiyon sistemi: `getSmartPortion()` besin adı ve kategorisine göre uygun birim döner
- `pratik` mod: Dilim / Bardak / Kase / Avuç / vb. + preset butonları
- `gram` mod: 5g adımlarla slider
- GL hesabı: `useGlycemicLoad` hook
- Makro halkalar (MacroRing bileşeni)
- GI gauge (yarım daire göstergesi)
- AI koç: GL "red" ise Gemini tavsiyesi

---

## State Yönetimi (Zustand)

### useAppStore

```typescript
interface AppState {
  isPremium: boolean
  dailyLog: DailyLogEntry[]       // tüm gün kayıtları
  addToDailyLog(entry): void
  clearDailyLog(): void
  // ... arama, seçim state'leri
}

// DailyLogEntry
interface DailyLogEntry {
  id: string
  foodId: string
  foodName: string
  portion: number          // gram
  portionText?: string     // "2 Bardak" veya "150g"
  glycemicLoad: number
  trafficLight: 'green' | 'yellow' | 'red'
  timestamp: Date
  mealType?: MealType      // 'kahvalti' | 'ogle' | 'aksam' | 'ara'
  mealCategory?: MealCategory  // 'tabak' | 'icecek' | 'meyve' | 'diger'
}
```

### useUserStore

```typescript
interface UserState {
  profile: UserProfile | null  // diabetesType, hba1c, weight, height, activityLevel
  bmi: number
  dailyCarbLimit: number       // hesaplanmış günlük karb limiti
  glThresholds: { yellowThreshold, redThreshold }  // diyabet tipine göre
  isOnboarded: boolean
}
```

### useHealthStore

```typescript
interface HealthState {
  todayWaterMl: number
  todayWaterEntries: WaterLog[]
  healthScore: HealthScoreResult | null  // 0-100 puan
  addWater(userId, amountMl): Promise<void>
  loadTodayData(userId): Promise<void>
  // + caffeine, mood, sleep, exercise
}
```

---

## API Entegrasyonları

### 1. FatSecret API (`src/lib/fatsecret.ts`)

**Auth:** OAuth 2.0 Client Credentials → Bearer token (cache'lenir)

**Endpoint'ler:**
```
POST https://oauth.fatsecret.com/connect/token    # token al
GET  https://platform.fatsecret.com/rest/server.api

?method=foods.search          # besin arama
?method=food.get.v4           # besin detayı
?method=food.find_id_for_barcode  # barkod → food_id
?method=recipes.search        # tarif arama
?method=recipe.get            # tarif detayı
```

**Önemli fonksiyonlar:**
- `searchFoodsFatSecret(query, maxResults)` → `FsFood[]`
- `getFoodDetail(foodId)` → `FsFood`
- `findFoodByBarcode(barcode)` → `BarcodeResult` (Supabase cache ile)
- `getCarbsPer100g(foodName)` → `number | null`
- `parseServing(serving)` → 100g normalize

**Barkod akışı:**
1. Supabase `barcode_cache` tablosuna bak
2. Bulunamazsa FatSecret `food.find_id_for_barcode` çağır
3. food_id ile `food.get.v4` çağır
4. Sonucu `barcode_cache`'e yaz

### 2. LogMeal API (`src/services/logmeal.ts`)

**Auth:** Bearer token (API key direkt)

**Akış:**
```
POST /v2/image/segmentation/complete
  Body: FormData { image: File }
  Response: {
    imageId: number,
    occasion: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    segmentation_results: [{
      recognition_results: [{ name, prob, id }]
    }]
  }

POST /v2/nutrition/recipe/nutritionalInfo
  Body: { imageId: number }
  Response: {
    serving_size: number,
    nutritional_info: {
      calories: number,
      totalNutrients: {
        CHOCDF: { quantity, unit },  // karbonhidrat
        PROCNT: { quantity, unit },  // protein
        FAT:    { quantity, unit },  // yağ
        FIBTG:  { quantity, unit },  // lif
        SUGAR:  { quantity, unit },  // şeker
        ENERC_KCAL: { quantity }     // kalori (alternatif)
      }
    }
  }
```

**GI hesaplama zinciri:**
1. Supabase `foods` tablosunda tam ad eşleşmesi → gerçek GI
2. İlk kelimeyle `ilike` fuzzy arama → yakın GI
3. `estimateGI()` kural bazlı tahmin (fallback)

### 3. Google Gemini AI (`src/services/ai.ts`)

```typescript
// Model: gemini-1.5-flash
// Kullanım: GL "red" durumda koç tavsiyesi

getSmartCoachAdvice(food, portion, profile) → CoachPairing
```

**Prompt:** Besin adı, porsiyon, GL değeri ve kullanıcının diyabet tipi + HbA1c bilgisiyle kişiselleştirilmiş tavsiye.

### 4. Pixabay (`src/utils/images.ts`)

```typescript
getFoodImage(foodName: string) → Promise<string | null>
// Besin adını İngilizce'ye çevir → Pixabay'da ara → URL döndür
```

### 5. Supabase

**Auth:** Email/Password (`supabase.auth`)

**Tablolar:** (aşağıda ayrıntılı)

---

## Kritik Algoritmalar

### Glisemik Yük (GL) Formülü

```
GL = (GI × karbonhidrat_gram_porsiyonda) / 100

karbonhidrat_gram_porsiyonda = (carbs_per_100g / 100) × portion_gram

Örnek: Pilav 150g
  GI = 64, carbs_per_100g = 28g
  carbs_in_portion = (28/100) × 150 = 42g
  GL = (64 × 42) / 100 = 26.9 → Riskli (kırmızı)
```

### Kişiselleştirilmiş GL Eşikleri

```typescript
// useUserStore.ts — glThresholds
Tip 1:        yellow ≥ 8,  red ≥ 15
Tip 2:        yellow ≥ 10, red ≥ 20
Prediyabet:   yellow ≥ 12, red ≥ 22
Gestasyonel:  yellow ≥ 8,  red ≥ 14
Normal (yok): yellow ≥ 10, red ≥ 20
```

HbA1c değerine göre eşikler daha da düşürülür (yüksek HbA1c = daha sıkı eşik).

### Günlük Karbonhidrat Limiti

```typescript
baseCarb = 130g (minimum güvenli)
BMI faktörü: BMI > 30 → 0.85x, BMI 25-30 → 0.92x, normal → 1.0x
Aktivite: sedanter → 0.9x, aktif → 1.1x, çok aktif → 1.2x
HbA1c: > 9 → 0.8x, 7-9 → 0.9x, < 7 → 1.0x
Diyabet tipi faktörü: Tip 1 → 0.9x, diğer → 1.0x

dailyCarbLimit = baseCarb × bmiF × activityF × hba1cF × diabetesF
```

### Günlük Sağlık Skoru (0-100)

```
Beslenme GL: %40  → günlük GL / hedef GL oranı
Uyku:        %20  → 7-9 saat optimum
Ruh hali:    %15  → 1-5 skala
Su:          %15  → içilen / hedef oran
Kafein:      %10  → < 400mg ideal
```

---

## Bileşenler

### WaterGlassWidget (`src/components/ui/WaterGlassWidget.tsx`)

- **react-native-svg** tabanlı gerçekçi cam tasarımı
- SVG path'ler: `OUTER` (dış trapezoid) ve `INNER` (iç alan)
- Katmanlar: cam gövdesi gradyanı, iç arka plan, animasyonlu su dolumu, dalga yüzeyi, sol yansıma elipsi, sağ gölge
- `AnimatedRect` ile `fillY` ve `fillH` animate edilir
- `shakeAnim` prop'u HomeScreen'den gelir (35sn'de bir sallama)

### WaterModal (`src/components/ui/WaterModal.tsx`)

- Aşağıdan kayarak açılan `Modal`
- Aynı SVG bardak tasarımı (96×136 px, büyük render)
- Hızlı ekle: 75ml / 200ml / 350ml / 500ml
- Özel miktar girişi
- 5sn'de değişen hidrasyon ipuçları
- Bugünkü kayıtlar listesi
- Diyabet & hidrasyon bilgi kartı

### MealTimePopup (`src/components/ui/MealTimePopup.tsx`)

- Sağ üst köşeden slayt animasyonu
- Saate göre 8 farklı mesaj (6:00–23:00)
- 6 saniye sonra otomatik kapanır
- "Öğüne Git" butonu → MealsScreen

---

## Servisler

### notificationService.ts

```typescript
scheduleHighGLNotification()  // GL red olduğunda bildirim
// expo-notifications ile çalışır, izin ister
```

### db.ts

```typescript
getCoachAdvice(category: string) → CoachPairing
// Supabase coach_pairings tablosundan kategori bazlı tavsiye
```

---

## Supabase Şeması

### foods

| Alan | Tip | Açıklama |
|------|-----|---------|
| id | int8 | PK |
| name | text | Besin adı (Türkçe) |
| category | text | Kategori |
| gi_value | int4 | Glisemik İndeks (0-100) |
| carbs_per_100g | float8 | 100g'da karbonhidrat |
| protein_per_100g | float8 | - |
| fat_per_100g | float8 | - |
| calories_per_100g | float8 | - |
| fiber_per_100g | float8 | - |
| color_code | text | 'GREEN' / 'YELLOW' / 'RED' |
| source | text | 'local' / 'fatsecret' |

### users

| Alan | Tip | Açıklama |
|------|-----|---------|
| id | uuid | FK: auth.users |
| full_name | text | |
| diabetes_type | text | tip1/tip2/prediyabet/gestasyonel/yok |
| hba1c | float8 | |
| weight_kg | float8 | |
| height_cm | float8 | |
| age | int4 | |
| activity_level | text | sedanter/hafif/orta/aktif/cok_aktif |
| is_premium | bool | |

### consumption_logs

| Alan | Tip | Açıklama |
|------|-----|---------|
| id | int8 | PK |
| user_id | uuid | FK: users |
| food_id | int8 | FK: foods |
| portion_grams | float8 | |
| calculated_gl | float8 | |
| consumed_at | timestamptz | |

### water_logs

| Alan | Tip | Açıklama |
|------|-----|---------|
| id | int8 | PK |
| user_id | uuid | FK: users |
| amount_ml | int4 | |
| log_date | date | |
| logged_at | timestamptz | |

### barcode_cache

| Alan | Tip | Açıklama |
|------|-----|---------|
| barcode | text | PK (EAN/UPC) |
| fatsecret_id | text | FatSecret food_id |
| food_name | text | |
| brand | text | |

### Diğer tablolar
- `mood_logs` — ruh hali (1-5)
- `sleep_logs` — uyku (saat)
- `exercise_logs` — egzersiz (tür, süre, kalori)
- `caffeine_logs` — kafein (mg)
- `coach_pairings` — AI koç tavsiyeleri (kategori bazlı)

---

## Animasyon Sistemleri

Uygulama ağırlıklı olarak React Native'in `Animated` API'sini kullanır (expo-blur yok).

### Tab Bar Glass Effect

```tsx
LinearGradient colors: ['rgba(255,255,255,0.96)', 'rgba(248,250,252,0.94)']
borderColor: 'rgba(255,255,255,0.75)'
glassSheen: üst 18px beyaz şerit (parıltı efekti)
glassTopEdge: 1px beyaz çizgi (cam kenarı)
```

### Su Bardağı SVG Animasyonları

```typescript
fillAnim:  Animated.Value(0) → dolum yüksekliği (useNativeDriver: false)
waveAnim:  Animated.loop → dalga translateX (±5-8px)
glowAnim:  Animated.loop → dış halo opacity (0.3 ↔ 0.65)
shakeAnim: Animated.sequence → X ekseninde sallama (HomeScreen'de)
```

### MealTimePopup Animasyonu

```typescript
slideY:  Animated.spring(0)   → aşağıdan yukarı slide-in
opacity: Animated.timing(1)   → fade-in
scale:   Animated.spring(1)   → scale-up
```

---

## Premium Sistemi

**Mevcut durum:** RevenueCat entegrasyonu henüz tamamlanmadı. `isPremium` flag'i manuel veya Supabase'ten `is_premium` alanıyla set edilir.

**PremiumScreen (`src/screens/PremiumScreen.tsx`):**
- Karanlık tema (dark mode)
- Plan seçici: Aylık (₺49,99) / Yıllık (₺399,99)
- Ücretsiz vs Premium özellik karşılaştırması
- "Başla" → `Alert` (henüz gerçek ödeme yok)

**ProfileScreen'de premium kartı:**
- Premium değilse: koyu gradient, altın elmas ikonu, "BAŞLA" butonu
- Premium ise: yeşil kart, onay rozeti

**Planlanan entegrasyon:**
```typescript
import Purchases from 'react-native-purchases';
// EXPO_PUBLIC_RC_IOS_API_KEY / EXPO_PUBLIC_RC_ANDROID_API_KEY
```

---

## Bilinen Sorunlar ve TODO

### Aktif Sorunlar
- `src/lib/fatsecret.ts` bazı Supabase RPC çağrılarında `never` tipi hatası (Supabase codegen eksik)
- `src/services/notificationService.ts` Expo bildirim API'si değişikliği (SDK 55 uyumu)
- `src/services/photoAnalysis.ts` — `expo-file-system` EncodingType değişikliği

### Geliştirme Backlog

| Öncelik | Özellik |
|---------|---------|
| 🔴 Yüksek | RevenueCat premium entegrasyonu |
| 🔴 Yüksek | Ayarlar ekranı (link var, içerik yok) |
| 🟡 Orta | GL trend grafiği (bileşen hazır, veri bağlantısı yok) |
| 🟡 Orta | Fotoğraftan besin tespiti — UI tamamlandı, test gerekiyor |
| 🟡 Orta | Sağlık dashboard (mood/uyku/su widget) |
| 🟢 Düşük | Offline mod / cache |
| 🟢 Düşük | Dark mode |
| 🟢 Düşük | Çoklu dil desteği (EN/TR) |

---

## Geliştirici Notları

### Yeni ekran eklerken
1. `src/screens/` altına dosya oluştur
2. `App.tsx`'deki Stack.Navigator'a ekle
3. Gerekirse TAB_CONFIG'e ekle

### Yeni Supabase tablosu eklerken
1. Supabase dashboard'dan tablo oluştur
2. `src/types/database.ts`'e tip ekle
3. İlgili store'a fonksiyon ekle

### API anahtarı eklerken
1. `.env`'e `EXPO_PUBLIC_` prefix ile ekle
2. `process.env.EXPO_PUBLIC_XXX` ile eriş
3. Tip güvenliği için `?? ''` fallback kullan

### Performans
- FlatList/ScrollView büyük listelerde `getItemLayout` ekle
- Görsel yüklemelerde `React.memo` + `useCallback` kullan
- Supabase sorguları `select('kolon1, kolon2')` ile sadece gerekli alanları çek

---

*Son güncelleme: Mayıs 2026 — GlikoFit v3.x*
