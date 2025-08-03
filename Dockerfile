FROM node:24-slim

WORKDIR /usr/local/app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsup.config.ts ./
COPY src ./src
COPY docs ./docs
COPY public ./public

RUN mkdir -p /usr/local/data
ENV DB_JSON_PATH=/usr/local/data/db.json
ENV OPENAPI_YAML=/usr/local/app/docs/openapi.yml
ENV STATIC_ROOT=/usr/local/app/public

RUN npm ci
RUN npm run build
RUN rm -rf src

ENTRYPOINT ["node"]
CMD ["dist/index.js"]
