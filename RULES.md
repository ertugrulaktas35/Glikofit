# GlikoFit — Kodlama Standartları & Vibe

## Genel İlkeler
- TypeScript strict mode — any kullanma
- Sade, okunabilir kod; gereksiz abstraction yok
- Yorum sadece "neden" için, "ne" için değil
- Emoji yok (kod ve yorumlarda)
- Türkçe ekran metinleri, İngilizce kod tanımlayıcıları

---

## Adlandırma Kuralları

| Tür | Kural | Örnek |
|-----|-------|-------|
| Bileşenler | PascalCase | `FoodDetailScreen`, `CoachAdviceCard` |
| Değişken/Fonksiyon | camelCase | `currentPortion`, `calculateGl()` |
| Sabitler | UPPER_SNAKE_CASE | `MAX_PORTION_GRAMS` |
| Tipler/Interface | PascalCase | `UserHealthProfile`, `DailyLogEntry` |
| Dosyalar (screen) | PascalCase + Screen | `HomeScreen.tsx` |
| Dosyalar (hook) | camelCase + use | `useGlycemicLoad.ts` |
| Dosyalar (store) | camelCase + use | `useAppStore.ts` |

---

## TypeScript Kuralları
- Supabase tablo tipleri: `Row/Insert/Update` ayrımı yap (`src/types/database.ts`)
- Enum yerine union type kullan: `'tip1' | 'tip2' | 'prediyabet' | 'gestasyonel' | 'yok'`
- `interface` yerine `type` tercih et (özellikle union tipler için)
- Zorunlu olmayan prop'lar için `?` kullan, `undefined` geçme
- `as` type assertion'dan kaç; mümkünse type guard yaz

---

## Bileşen Yapısı
```tsx
// 1. Import'lar (React → RN → expo → lib → store → utils → types)
// 2. Tip tanımları (sadece bu dosyaya özel olanlar)
// 3. Bileşen (functional, arrow function)
// 4. StyleSheet.create (dosya sonunda)

const MyScreen = () => {
  // hooks (useStore, useState, useEffect, useMemo sırası)
  // derived values
  // handlers (handle prefix)
  // render helpers (sadece JSX karmaşıksa)
  // return JSX
};
```

---

## State Yönetimi
- Global state → Zustand store (3 store: App / User / Health)
- Geçici UI state → useState
- Hesaplanmış değerler → useMemo veya store'da getter
- Kalıcı veriler → useUserStore / useHealthStore (AsyncStorage ile persist)
- Supabase realtime kullanılmıyor — manuel fetch

---

## Stil Kuralları
- **Önce NativeWind className** (Tailwind utility-first)
- Dinamik/hesaplanmış stiller için `StyleSheet.create` + inline style
- Renk değerleri doğrudan hex kullan (constants/theme'den al)
- Spacing: 4'ün katları (4, 8, 12, 16, 20, 24, 28, 32...)
- Border radius: kart=12-16, buton=20-28, pill=9999
- Gölge: `shadow-sm` veya `elevation: 2-4`
- Safe area: her screen'de `useSafeAreaInsets()` kullan

---

## Veri Fetching
- Supabase için `supabase.from(table).select/insert/update/delete` zinciri
- Hata: her zaman `const { data, error } = await ...` destruktur et
- Edge Function: `supabase.functions.invoke('function-name', { body })`
- FatSecret: `src/lib/fatsecret.ts` üzerinden — doğrudan fetch yazma
- Arama debounce: 400ms (kullanıcı input'u için standart)
- Loading state: her async işlem için `isLoading` bayrağı

---

## Hata Yönetimi
- try/catch ile sarmala, kullanıcıya `Alert.alert` göster
- Edge Function başarısız → fallback to direct API call (Gemini pattern)
- Supabase hata mesajları kullanıcıya gösterilmez — generic mesaj ver

---

## Ekranlar Arası Veri Geçişi
- `useAppStore.setSelectedFood()` → FoodDetailScreen
- Navigation params: minimum veri geç (id veya basit değer)
- Büyük nesneler store üzerinden taşı, params'a koyma

---

## Notifikasyon Kuralları
- `src/services/notification.ts` üzerinden tetikle
- GL ≥ 20 olduğunda yüksek GL uyarısı gönder
- Yeni trigger eklerken `scheduleLocalNotification` kullan

---

## Supabase Kuralları
- RLS her tablo için açık olmalı (migration'da `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
- Yeni tablo → Row/Insert/Update tiplerini `src/types/database.ts`'e ekle
- Migration dosyası: `supabase/migration_v{N}.sql` formatı
- Edge Function: `supabase/functions/{name}/index.ts` — Deno runtime

---

## FatSecret Entegrasyonu
- Token cache: `fatsecretTokenCache` object (memory-based, 60s TTL)
- Tüm API çağrıları `src/lib/fatsecret.ts` içinden
- Yeni endpoint eklerken token refresh mekanizmasını koru
- Response parsing: FatSecret bazen tek nesne, bazen array döner — her ikisini handle et

---

## Performans Kuralları
- Arama: `lodash.debounce` 400ms
- Görsel: `expo-image` veya RN `Image` (boyut belirt)
- FlatList: `keyExtractor`, `getItemLayout` (sabit yükseklik varsa)
- useMemo: GL hesaplama gibi sık değişen hesaplamalar için
- useCallback: FlatList `renderItem` fonksiyonları için

---

## Dosya Organizasyonu
- Yeni screen → `src/screens/XxxScreen.tsx`
- Yeni reusable component → `src/components/ui/XxxCard.tsx`
- Yeni store → `src/store/useXxxStore.ts`
- Yeni util → `src/utils/xxxUtils.ts`
- Yeni tip → `src/types/database.ts` veya ilgili dosyaya
