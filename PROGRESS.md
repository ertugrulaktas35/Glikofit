# GlikoFit — Mevcut Durum & Yol Haritası

Son güncelleme: 2026-05-03

---

## Tamamlanan Özellikler (MVP) ✅

### Kimlik Doğrulama & Profil
- [x] E-posta/şifre girişi (Supabase Auth)
- [x] Kayıt olma
- [x] Son kullanılan e-posta hatırlama (AsyncStorage)
- [x] 4 adımlı onboarding (isim/doğum/cinsiyet → boy/kilo/VKİ → diyabet → aktivite)
- [x] Profil Supabase'e kayıt

### Yiyecek & Beslenme
- [x] Yiyecek arama (hibrit: Supabase local + FatSecret fallback)
- [x] GL hesaplama (GI × karbonhidrat / 100)
- [x] Kişiselleştirilmiş GL eşikleri (diyabet tipine + HbA1c'ye göre)
- [x] Trafik ışığı sistemi (yeşil/sarı/kırmızı)
- [x] Gerçek zamanlı porsiyon kaydırıcısı (10-500g)
- [x] Pratik porsiyon birimleri (dilim, kase, bardak, avuç, kaşık, tabak)
- [x] Günlük yiyecek logu
- [x] Tabak oluşturucu (MealBuilder) — toplu log
- [x] Barkod tarayıcı (EAN-13, UPC-A/E) → FatSecret → FoodDetail

### Yapay Zeka
- [x] AI Koç tavsiyeleri (Gemini 1.5 Flash) — kırmızı GL'de tetiklenir
- [x] Edge Function üzerinden + doğrudan API fallback
- [x] Kişiselleştirilmiş bağlam (diyabet tipi, HbA1c, VKİ, yaş)

### Keşfet & Ekstralar
- [x] Yiyecek arama ekranı (kategori + renk filtresi)
- [x] Egzersiz takibi (FatSecret exercise library + kalori hesabı)
- [x] Tarif keşfet (FatSecret recipes — popüler + arama)
- [x] Sağlık profili sayfası (VKİ, diyabet durumu, GL eşikleri)
- [x] Hakkında ekranı (teknik dokümantasyon dahil)

### Backend
- [x] Supabase schema v3 (11 tablo + view'lar + custom functions)
- [x] RLS politikaları
- [x] Edge Functions: smart-coach, analyze-food-photo, food-search, populate-food-macros
- [x] Fuzzy yiyecek arama (`fuzzy_food_search` DB fonksiyonu)
- [x] Barkod cache (`barcode_cache` tablosu)

### Sağlık Takibi (Backend Hazır, UI Kısmi)
- [x] Ruh hali logu (mood_logs tablosu + store)
- [x] Uyku takibi (sleep_logs tablosu + store)
- [x] Su takibi (water_logs tablosu + store)
- [x] Kafein takibi (caffeine_logs tablosu + store)
- [x] Sağlık skoru algoritması (5 bileşen, 0-100)

---

## Kısmi / Taslak Özellikler ⚠️

| Özellik | Durum | Notlar |
|---------|-------|--------|
| Premium sistem | Toggle var, kısıtlama yok | RevenueCat kütüphanesi var, entegre değil |
| Mood/Uyku UI | Store + DB hazır, ekrana yansıtılmamış | useHealthStore tam ama widget yok; Su ✅ tamamlandı |

---

## Eksik Özellikler — Öncelik Sırasıyla 🔲

### Yüksek Öncelik (Core UX)
1. ~~**Ayarlar Ekranı**~~ ✅ Tamamlandı — SettingsScreen oluşturuldu, menü navigasyonu bağlandı
2. **Sağlık Dashboard'u** — mood/su/uyku/kafein widgetları (HomeScreen veya ayrı tab)
3. ~~**GL Trend Grafiği**~~ ✅ Tamamlandı — Supabase consumption_logs'tan gerçek veri çekiyor
4. ~~**Günlük Sağlık Skoru Gösterimi**~~ ✅ Tamamlandı — ProfileScreen'e breakdown çubukları + insight kartı eklendi

### Orta Öncelik (Değer Katan)
5. **Fotoğraftan Yiyecek Tespiti** — Edge Function hazır (`analyze-food-photo`), UI entegrasyonu yok
6. **Öğün Planlayıcı** — Sabah/öğle/akşam bazında günlük plan oluşturma
7. **Su Takip Widget'ı** — Hızlı su ekleme (HomeScreen veya yüzen buton)
8. **Uyku & Ruh Hali Logu UI** — Basit günlük check-in modal
9. **RevenueCat Entegrasyonu** — Premium özelliklerin kilitlenmesi/açılması
10. **Haftalık Özet** — Haftalık GL ortalaması, en çok yenen yiyecekler

### Düşük Öncelik (Nice-to-Have)
11. **Diyetisyen Portalı** — `is_my_dietitian` fonksiyonu + schema hazır, UI yok
12. **Sosyal Paylaşım** — Günlük log veya başarım paylaşımı
13. **Başarımlar/Rozetler** — Gamification (örn. 7 gün üst üste yeşil GL)
14. **Kan Şekeri Manuel Girişi** — Yemek öncesi/sonrası ölçüm takibi
15. **CGM Entegrasyonu** — Sürekli glikoz monitörü bağlantısı (uzun vadeli)
16. **İlaç Takibi** — İnsülin/ilaç hatırlatıcısı
17. **Yiyecek Kara Listesi** — Kullanıcı bazlı "asla yeme" listesi
18. **Offline Mod** — Çevrimdışı temel işlevler

### Teknik Borç
- [ ] Tüm API key'leri gerçekten server-side Edge Function'lara taşı (şu an EXPO_PUBLIC_)
- [ ] RevenueCat API key'leri gerçek key'lerle güncelle
- [x] ~~Barcode scanner izin reddi durumu handle edilmemiş~~ ✅ Linking.openSettings() eklendi

---

## Ekran Durumu Özeti

| Ekran | Durum | Notlar |
|-------|-------|--------|
| LoginScreen | ✅ Tamamlandı | |
| OnboardingScreen | ✅ Tamamlandı | |
| HomeScreen | ✅ Tamamlandı | |
| MealBuilderScreen | ✅ Tamamlandı | |
| DailyLogScreen | ✅ Tamamlandı | Şu an git'te modified |
| ProfileScreen | ⚠️ Kısmi | Sağlık skoru + grafik bağlantısı eksik |
| FoodDetailScreen | ✅ Tamamlandı | AI koç entegre |
| SearchScreen | ✅ Tamamlandı | |
| BarcodeScannerScreen | ✅ Tamamlandı | |
| ExerciseScreen | ✅ Tamamlandı | |
| RecipeScreen | ✅ Tamamlandı | |
| AboutScreen | ✅ Tamamlandı | |
| SettingsScreen | ✅ Tamamlandı | Bildirim toggle, profil düzenleme, izinler, hakkında |
| HealthDashboardScreen | 🔲 Yok | Gerekli |

---

## Git Durumu (2026-05-03)
- Branch: `master`
- Modified:
  - `src/screens/DailyLogScreen.tsx`
  - `supabase/functions/populate-food-macros/index.ts`
  - `supabase/migration_v3.sql`
- Son commit: `feat: GlikoFit v3 — FatSecret tam entegrasyon + Edge Functions + yeni ekranlar`
