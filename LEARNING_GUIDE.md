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

## 🚀 Dağıtım ve Performans Soruları

### 1. "SSR ile Docker arasında nasıl bir bağ var? Performansı etkiler mi?"

**Teknik Cevap:** SSR (Server Side Rendering), sunucuda sürekli çalışan veya istek anında uyanan bir "beyin" gerektirir. Docker, bu beyni paketleyen standart kutudur.

*   **Cold Start (Maliyet vs Hız):** Azure Container Apps gibi sistemlerde "sıfıra ölçekleme" yaparsak, siteye kimse girmediğinde sunucu uyur. İlk istekte Docker kutusunun açılması "Cold Start" olarak adlandırılır ve 2-5 sn arası bir gecikmeye sebep olabilir.
*   **Standalone Modu:** Docker imajını hafifletmek için Next.js'in sadece gerekli dosyaları topladığı moddur. İmaj ne kadar küçükse sunucu o kadar hızlı uyanır.

### 2. "Docker her zaman en iyi seçenek mi?"

**Teknik Cevap:** Neredeyse evet. Sadece tamamen statik (v0/HTML/CSS) projeler için Docker yerine direkt dosya yüklemek daha ucuzdur. Ancak Next.js'in SSR gücünü kullanmak için Docker en profesyonel yoldur.

## 💾 Veritabanı (Azure SQL) Kararları

### 1. "Neden ID için `UNIQUEIDENTIFIER` yerine `NVARCHAR` seçtik?"

**Teknik Cevap:** Hız ve esneklik için:
*   **JSON Uyumu:** Next.js tarafında `crypto.randomUUID()` ile ürettiğimiz string ID'ler, hem JSON hem de SQL'de aynı formatta (string) kalarak kod tarafında dönüşüm (casting) gerektirmez.
*   **Geliştirme Hızı:** Geliştirme aşamasında veritabanı tipleriyle uğraşmak yerine hızlıca kalıcılık sağlamaya odaklandık.
*   **Esneklik:** İleride ID yapısını değiştirirsek (örneğin NanoID veya özel bir string), `NVARCHAR` tabloyu bozmadan bunu destekler.

---
*Özet: Tasarımınız modern, veriniz güvende ve mimariniz ölçeklenebilir.*
