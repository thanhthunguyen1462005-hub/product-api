# Stage 1: Production Base
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Install curl or wget for healthcheck (wget is built-in in alpine)
# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose API port
EXPOSE 3000

# Add Healthcheck instruction
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "server.js"]
