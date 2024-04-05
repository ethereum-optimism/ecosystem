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
RUN pnpm install --frozen-lockfile --prefer-offline

# build all packages/apps
RUN pnpm build

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/extra-ca-certificates.crt

EXPOSE 7300

CMD [ "pnpm", "start" ]
