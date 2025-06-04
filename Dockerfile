# Usa imagen oficial Node.js LTS
FROM node:20-slim

# Instala librerías para Puppeteer
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Crea directorio app y copia archivos
WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

# Puppeteer necesita esta variable para encontrar Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Expone el puerto que usa Express
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "server.js"]
