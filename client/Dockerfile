# Use an official Node.js image to build the frontend
FROM node:20-alpine AS builder

# Set WORKDIR to /app/client (root of the client application inside the container)
WORKDIR /app/client

RUN npm install -g pnpm

# Copy client's package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install frontend dependencies (Tailwind build tools, Webpack, etc.)
RUN pnpm install --frozen-lockfile

# Copy the rest of the frontend source code
COPY . ./

# Build the frontend assets (using pnpm run build)
RUN pnpm run build

# Use Nginx to serve the static files
FROM nginx:alpine

# Copy custom Nginx configuration (we'll create this later at project root)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend assets to Nginx's web root
# Based on your webpack.config.js, output is in client/public
COPY --from=builder /app/client/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

