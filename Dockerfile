FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache python3 make g++

########################################################
# STAGE 1: Install monorepo dependencies
########################################################

FROM base AS builder
WORKDIR /usr/src/app

# fetch packages & install
COPY ../pnpm-lock.yaml ./
RUN pnpm fetch
COPY . ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# build apps
RUN pnpm nx run-many --targets=build --projects=ponder-interop,autorelayer-interop,sponsored-sender

# deploy apps (cd into each app so that it's package.json is used)
RUN pnpm deploy --filter ponder-interop --prod /prod/ponder-interop
RUN pnpm deploy --filter autorelayer-interop --prod /prod/autorelayer-interop
RUN pnpm deploy --filter sponsored-sender --prod /prod/sponsored-sender

########################################################
# STAGE 2: Images
########################################################

########################################################
# Image: Ponder Interop
########################################################

FROM builder AS ponder-interop

WORKDIR /usr/src/app
COPY --from=builder /prod/ponder-interop ./

EXPOSE 42069

ENTRYPOINT ["pnpm"]
CMD ["start"]

########################################################
# Image: Autorelayer Interop
########################################################

FROM builder AS autorelayer-interop

WORKDIR /usr/src/app
COPY --from=builder /prod/autorelayer-interop ./

EXPOSE 7300

ENTRYPOINT ["pnpm"]
CMD ["start"]

########################################################
# Image: Sponsored Sender
########################################################

FROM builder AS sponsored-sender

WORKDIR /usr/src/app
COPY --from=builder /prod/sponsored-sender ./

EXPOSE 3000

ENTRYPOINT ["pnpm"]
CMD ["start"]