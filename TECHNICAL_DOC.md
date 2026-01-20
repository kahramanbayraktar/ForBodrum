# ForBodrum - Teknik Dokümantasyon

ForBodrum, Bodrum vatandaşlarının şehirsel sorunları (çukur, çöp, bozuk sokak lambası vb.) yapay zeka desteğiyle raporlayabildiği, çözüm önerileri sunabildiği ve oylayabildiği modern bir **Civic Tech (Kent Teknolojisi)** platformudur.

## 🏗️ Teknoloji Yığını (Tech Stack)

### Frontend & Core
- **Framework:** Next.js 16.0.10 (App Router)
- **Library:** React 19.2.0
- **Styling:** Tailwind CSS v4.1.9 (Modern & Responsive)
- **Icons:** Lucide React
- **Fonts:** 
  - `Instrument Serif` (Bodrum Ruhu için Başlıklar)
  - `Inter` (Okunabilirlik için Body metinleri)

### Backend & API Layer
- **API Routes:** Next.js Serverless Functions (Backend katmanı olarak konumlandırılmıştır)
- **AI Integration:** Google Gemini 2.0 Flash (Görsel analiz ve veri etiketleme)
- **Veri Saklama:** 
  - Mevcut: `JSON` (Dosya tabanlı geçici DB)
  - Planlanan: `Azure SQL Database`

## 🎨 Tasarım Kimliği (Aegean Aesthetic)
- **Bodrum Blue:** Derin Ege Denizi mavisi (`primary`).
- **Bougainvillea Pink:** Canlı Begonvil pembesi (`CTA/Accent`).
- **Whitewash:** Bodrum mimarisine uygun temiz beyaz (`background`).
- **Responsive Strateji:** Mobile-first PWA. Masaüstünde şık bir dashboard görünümü (Sidebar + Map), mobilde ise uygulama (Bottom Nav) deneyimi.

## 🚀 Temel Özellikler & Akışlar

### 1. Dinamik Raporlama Flow (AI Powered)
- **Adım 1:** Vatandaş sorunun fotoğrafını çeker veya yükler.
- **Adım 2 (Analyze):** Fotoğraf `/api/analyze` uç noktasına gönderilir. Gemini AI görüntüyü analiz ederek otomatik olarak:
  - Başlık (Title)
  - Kategori (Infrastructure, Environment vb.)
  - Önem Derecesi (Critical, High, Medium, Low)
  - Açıklama ve Etiketler üretir.
- **Adım 3:** Konum tespiti ve onay.
- **Adım 4:** Son kontrol ve gönderim.

### 2. Harita ve Keşif
- Bodrum genelindeki sorunlar ısı haritası ve ikonlar üzerinde gösterilir.
- Yakındaki sorunlar "Recent Issues Near You" paneli üzerinden takip edilebilir.

## 🛠️ Kurulum ve Çalıştırma

### Çevre Değişkenleri (.env.local)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Komutlar
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (Port: 3005)
npm run dev
```

## 📅 Yol Haritası (Roadmap)
1. **Azure SQL Entegrasyonu:** Mevcut JSON yapısından kurumsal veritabanına geçiş.
2. **Harita Kütüphanesi:** Statik/Simüle haritadan gerçek Mapbox veya Leaflet entegrasyonuna geçiş.
3. **PWA Finalize:** Offline çalışma kapasitesi ve "Ana Ekrana Ekle" (Install) prompt tasarımı.
4. **Oylama & Katılım:** Topluluk etkinlikleri ve çözüm önerileri için oylama sistemi.

---
*Hazırlayan: Antigravity AI Assistant*
*Tarih: 20 Ocak 2026*
