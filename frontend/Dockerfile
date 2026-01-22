# 1. Aşama: Bağımlılıkları yükle ve build al
FROM node:20-alpine AS builder
WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json package-lock.json* ./
RUN npm ci

# Kaynak kodları kopyala ve build al
COPY . .
RUN npm run build

# 2. Aşama: Çalıştırma ortamı (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js standalone için port 3000 varsayılandır
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Sadece gerekli olan dosyaları standalone klasöründen kopyala
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Standalone modu için başlatma komutu
EXPOSE 3000
CMD ["node", "server.js"]
