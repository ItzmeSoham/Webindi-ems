FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and OpenSSL for Prisma
RUN apk add --no-cache openssl
RUN npm install

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
