# ============================================================
# 🚀 GlikoFit — Supabase Edge Functions Deploy Script
# ============================================================
# Bu script'i supabase login TAMAMLANDIKTAN SONRA çalıştırın.
# PowerShell'de: .\deploy.ps1
# ============================================================

# PATH güncelle (scoop)
$env:PATH += ";$env:USERPROFILE\scoop\shims"

$PROJECT_ID = "zfinrltiftdnrrlafekd"

Write-Host "🔗 Proje bağlanıyor..." -ForegroundColor Cyan
supabase link --project-ref $PROJECT_ID

Write-Host ""
Write-Host "🔑 Secrets tanımlanıyor..." -ForegroundColor Cyan
supabase secrets set GEMINI_API_KEY=AIzaSyB63geFjONDuahIN2KWSPdRM2lHv6XJd0o
supabase secrets set FATSECRET_CLIENT_ID=485bdb3693b148e7a03bef2be850ba3e
supabase secrets set FATSECRET_CLIENT_SECRET=8786c0347f6e4b349b3317c028dcb9d0

Write-Host ""
Write-Host "📦 Edge Functions deploy ediliyor..." -ForegroundColor Cyan

Write-Host "  → analyze-food-photo" -ForegroundColor Yellow
supabase functions deploy analyze-food-photo --no-verify-jwt

Write-Host "  → smart-coach" -ForegroundColor Yellow
supabase functions deploy smart-coach --no-verify-jwt

Write-Host "  → food-search" -ForegroundColor Yellow
supabase functions deploy food-search --no-verify-jwt

Write-Host "  → populate-food-macros" -ForegroundColor Yellow
supabase functions deploy populate-food-macros --no-verify-jwt

Write-Host ""
Write-Host "✅ Tüm Edge Functions deploy edildi!" -ForegroundColor Green
Write-Host ""
Write-Host "⚡ Şimdi mevcut besinlerin makrolarını FatSecret'tan çekmek için:" -ForegroundColor Cyan
Write-Host "   supabase functions invoke populate-food-macros --data '{}'" -ForegroundColor White
Write-Host ""
Write-Host "Hatirlatma: migration_v3.sql dosyasini calistirmayi unutma!" -ForegroundColor Yellow
