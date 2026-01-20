# ForBodrum - Öğrenme Rehberi (Learning Guide)

Bu doküman, proje geliştirme sürecinde sorulan önemli soruların ve alınan mimari kararların teknik açıklamalarını içerir.

## 🛡️ Backend Mimari ve Güvenlik Soruları

### 1. "Şu an uygulama sadece frontend'den mi oluşuyor? Backend nerede?"

**Teknik Cevap:** Hayır, uygulama şu an **hem Frontend hem de Backend** içeriyor. 

Next.js'in "Full-stack Framework" olma özelliği sayesinde, `app/api` klasörü altındaki dosyalar (örneğin `/api/analyze`) Node.js ortamında çalışan gerçek birer **Backend Service (Serverless Function)** olarak işlev görür. Browser'da değil, sunucuda çalışırlar.

### 2. "Güvenlik için (API Key vb.) ayrı bir backend layer gerekmez mi?"

**Teknik Cevap:** Hayır, Next.js API Routes bu güvenlik katmanını zaten sağlar.

*   **API Key Güvenliği:** Gemini API anahtarı gibi kritik veriler `.env.local` dosyasında saklanır. Bu değerler sadece sunucu tarafında (`Server-side`) okunabilir.
*   **İşlem Akışı:** Kullanıcı bir fotoğraf yüklediğinde, tarayıcı direkt Google Gemini'a gitmez. Önce bizim Backend uç noktamıza (`/api/analyze`) gelir. Backend, API anahtarını ekleyerek Gemini ile konuşur ve sonucu tarayıcıya döner.
*   **Sonuç:** API anahtarı hiçbir zaman kullanıcının bilgisayarına (tarayıcısına) inmez, ağ trafiğinde (`Network tab`) görünmez. Bu tam bir güvenlik sağlar.

### 3. "Daha büyük bir Backend (FastAPI, .NET Core) ne zaman gerekir?"

Next.js API'ları şu an için Azure SQL bağlantısı dahil her şeyi yapabilir. Başka bir backend teknolojisine ancak şu durumlarda ihtiyaç duyarız:
- Uygulamanın merkezi bir API olup, hem web hem de native mobil uygulamalar (iOS/Android) tarafından tüketilmesi gerektiğinde.
- Çok ağır görsel işleme veya uzun süren CPU tabanlı işlemler (background jobs) yapıldığında.
- Kurumsal zorunluluklar veya ekibin farklı bir dilde uzmanlığı olması durumunda.

## 💡 Temel Kavramlar

- **Hydration Mismatch:** Tarayıcı eklentilerinin (Grammarly vb.) HTML koduna müdahale etmesi sonucu React'in oluşturduğu kodla tarayıcıdaki kodun çakışmasıdır. `suppressHydrationWarning` ile çözülür.
- **Client Components (`"use client"`):** React hook'larını (useState, useEffect) kullanabilmek için dosyanın en üstüne yazılır.
- **Server components:** API çağrıları ve hassas veri işlemlerinin yapıldığı, varsayılan Next.js bileşenleridir.

---
*Özet: Tasarımınız modern, veriniz güvende ve mimariniz ölçeklenebilir.*
