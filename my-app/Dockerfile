# # Stage 1: Build frontend
# FROM node:18-alpine AS build

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .
# # Copy environment for build
# COPY .env .env.production

# RUN npm run build

# # Stage 2: Run frontend
# FROM node:18-alpine

# WORKDIR /app

# COPY --from=build /app/package*.json ./
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/public ./public
# COPY --from=build /app/next.config.mjs ./
# COPY --from=build /app/.env.production .env

# RUN npm ci --production

# EXPOSE 3000
# CMD ["npm", "start"]
# # CMD ["nginx","-g","daemon off;"]


# Stage 1: Build Next.js (static export)
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build   # output will be inside /app/out

# Stage 2: Serve using NGINX
FROM nginx:alpine

COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

