FROM node:18-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY package.json ./
RUN npm install -g corepack@0.32.0
RUN corepack enable
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

## provide a path for extra certs to be injected into the container
ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/extra-ca-certificates.crt

########################################################
# STAGE 1: Monorepo Builder
########################################################

FROM base AS builder
WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

COPY ../pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline
RUN rm -f apps/ponder-interop/.npmignore

# provide the ability to build a single projects
ARG DOCKER_TARGET

RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "ponder-interop" ]; then pnpm nx build @eth-optimism/ponder-interop; fi
RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "autorelayer-interop" ]; then pnpm nx build @eth-optimism/autorelayer-interop; fi
RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "sponsored-sender" ]; then pnpm nx build @eth-optimism/sponsored-sender;  fi
RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "verbs-service" ]; then pnpm nx build @eth-optimism/verbs-service; fi

RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "autorelayer-interop" ]; then pnpm deploy --filter autorelayer-interop --prod /prod/autorelayer-interop; fi
RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "ponder-interop" ]; then pnpm deploy --filter ponder-interop --prod /prod/ponder-interop; fi
RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "sponsored-sender" ]; then pnpm deploy --filter sponsored-sender --prod /prod/sponsored-sender; fi
RUN if [ -z "$DOCKER_TARGET" ] || [ "$DOCKER_TARGET" = "verbs-service" ]; then pnpm deploy --filter verbs-service --prod /prod/verbs-service; fi

########################################################
# STAGE 2: Images
########################################################

########################################################
# Autorelayer Interop
########################################################

FROM base AS autorelayer-interop

WORKDIR /usr/src/app
COPY --from=builder /prod/autorelayer-interop ./

EXPOSE 7300

ENTRYPOINT ["pnpm"]
CMD ["start"]

########################################################
# Ponder Interop
########################################################

FROM base AS ponder-interop

WORKDIR /usr/src/app
COPY --from=builder /prod/ponder-interop ./

EXPOSE 42069

ENTRYPOINT ["pnpm"]
CMD ["start"]

########################################################
# Sponsored Sender
########################################################

FROM base AS sponsored-sender

WORKDIR /usr/src/app
COPY --from=builder /prod/sponsored-sender ./

EXPOSE 3000

ENTRYPOINT ["pnpm"]
CMD ["start"]

########################################################
# Verbs Service
########################################################

FROM base AS verbs-service

WORKDIR /usr/src/app
COPY --from=builder /prod/verbs-service ./

EXPOSE 3000

ENTRYPOINT ["pnpm"]
CMD ["start"]