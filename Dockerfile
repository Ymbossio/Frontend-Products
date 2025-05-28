# Etapa 1: Build
FROM node:20-alpine AS builder

# Instala pnpm de forma global
RUN corepack enable && corepack prepare pnpm@latest --activate

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos necesarios
COPY . .

# Instala dependencias y construye la app
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Etapa 2: Servir estáticos con nginx
FROM nginx:stable-alpine

# Elimina el archivo por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia archivos de build desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
