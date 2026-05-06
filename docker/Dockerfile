FROM node:20-slim

WORKDIR /app

# Install system dependencies for voice (optional)
RUN apt-get update && apt-get install -y \
    build-essential \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000 8765

CMD ["node", "src/core/index.js"]
