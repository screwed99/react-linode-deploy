# --- Build Stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# --- Production Stage (Caddy) ---
FROM caddy:2-alpine AS prod

# 1. Copy the build artifacts
COPY --from=build /app/dist /srv

# 2. Copy the Caddyfile template
COPY Caddyfile.template /etc/caddy/Caddyfile

# # 3. Persist the ARGs as ENVs so Caddy can read them at runtime
# ARG FRONTEND_PORT
# ENV FRONTEND_PORT=$FRONTEND_PORT

# # Note: API_PORT is technically unused here now because 
# # the Gateway handles the API proxying, but we keep it for consistency.
# ARG API_PORT
# ENV API_PORT=$API_PORT

# 4. Run Caddy (It automatically picks up the ENVs)
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

# --- Dev Stage ---
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Consume build arguments for baking into the app (if needed by Vite/React code)
ARG FRONTEND_PORT
ARG API_PORT
ENV FRONTEND_PORT=$FRONTEND_PORT
ENV API_PORT=$API_PORT

CMD ["npm", "run", "dev", "--", "--host"]