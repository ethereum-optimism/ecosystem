FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/monorepo
WORKDIR /usr/src/monorepo

# required dependencies for node-gyp
# context: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#node-gyp-alpine
RUN apk add --no-cache python3 make g++

# https://pnpm.io/cli/fetch
# Fetches packages based on lockfile not package.json - cache is valid even if package.json changes
RUN pnpm fetch

# install monorepo dependencies, from the virtual store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

# build all packages/apps
RUN pnpm nx run-many --target=build

# copy built paymaster-proxy app & isolated node_modules to prod/paymaster-proxy
#
# note: unexpected behavior of pnpm deploy (that will hopefully be fixed)
# - it ignores /dist folder because it is listed in the local gitignore. Have to add "dist" folder explicitly to "files" in package.json to include. (https://github.com/pnpm/pnpm/issues/7286)
RUN pnpm deploy --filter=paymaster-proxy --prod /prod/paymaster-proxy

FROM base AS paymaster-proxy
COPY --from=build /prod/paymaster-proxy /prod/paymaster-proxy
WORKDIR /prod/paymaster-proxy
EXPOSE 3000
CMD [ "pnpm", "start" ]
