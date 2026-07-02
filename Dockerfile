FROM node:22-slim

WORKDIR /app

# Install build dependencies for native node addons (like argon2 if required)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

CMD ["sh", "entrypoint.sh"]

