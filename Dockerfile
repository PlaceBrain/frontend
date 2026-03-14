FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.21
COPY --from=build /app/dist /dist
CMD ["sh", "-c", "rm -rf /output/* && cp -r /dist/. /output/"]
