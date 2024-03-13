FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

########################################
# STEP 1: BUILDER
########################################

FROM base AS builder

# install required dependencies for node-gyp
# context: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/monorepo

# copy just the lockfile to run pnpm fetch
COPY pnpm-lock.yaml ./

# https://pnpm.io/cli/fetch
# Fetches packages based on lockfile not package.json - cache is valid even if any other file than pnpm-lock.yaml changes
RUN pnpm fetch

# copy in all monorepo files
COPY . ./

# install monorepo dependencies, from the virtual store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline

# build all packages/apps
RUN pnpm nx run-many --target=build

# copy built paymaster-proxy app & isolated node_modules to prod/paymaster-proxy
#
# note: unexpected behavior of pnpm deploy (that will hopefully be fixed)
# - it ignores /dist folder because it is listed in the local gitignore. Have to add "dist" folder explicitly to "files" in package.json to include. (https://github.com/pnpm/pnpm/issues/7286)
RUN pnpm deploy --filter=paymaster-proxy --prod /prod/paymaster-proxy

# copy built dapp-console-api app & isolated node_modules to prod/dapp-console-api
RUN pnpm deploy --filter=dapp-console-api --prod /prod/dapp-console-api

########################################
# STEP 2: PAYMASTER-PROXY
########################################

FROM base AS paymaster-proxy

COPY --from=builder /prod/paymaster-proxy /prod/paymaster-proxy
WORKDIR /prod/paymaster-proxy

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/extra-ca-certificates.crt

EXPOSE 7310

CMD [ "pnpm", "start" ]

########################################
# STEP 3: EVENT-LOG-INDEXER
########################################

FROM node:18.19-bullseye-slim AS event-log-indexer

RUN apt-get update \
  && apt-get install -y libvips libxtst6 libxss1 curl \
  git ca-certificates python3 pkg-config build-essential --no-install-recommends

COPY ./ ./monorepo
WORKDIR /monorepo/apps/event-log-indexer

RUN npm install pnpm --global
RUN pnpm install --frozen-lockfile

ENV NODE_ENVIRONMENT=production
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/extra-ca-certificates.crt

EXPOSE 42069

CMD [ "pnpm", "start" ]

########################################
# STEP 4: DAPP-CONSOLE-API
########################################

FROM base AS dapp-console-api

COPY ./apps/dapp-console-api/migrations ./prod/dapp-console-api/migrations
COPY  --from=builder /prod/dapp-console-api /prod/dapp-console-api
WORKDIR /prod/dapp-console-api

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/extra-ca-certificates.crt

EXPOSE 7300

CMD [ "pnpm", "start" ]
