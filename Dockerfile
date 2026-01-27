# Build Stage
FROM node:18-alpine as build

# Increase Node.js memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install (faster and more reliable)
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application with verbose logging
RUN npm run build --verbose || (echo "Build failed. Checking for errors..." && cat /root/.npm/_logs/*.log 2>/dev/null && exit 1)

# Production Stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
