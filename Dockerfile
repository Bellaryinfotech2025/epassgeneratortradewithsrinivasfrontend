# ---------- Build stage ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# adjust if your build output is `dist` (Vite) instead of `build` (CRA)
RUN npm run build

# ---------- Nginx stage ----------
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]