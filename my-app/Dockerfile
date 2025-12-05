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


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY out/ ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

