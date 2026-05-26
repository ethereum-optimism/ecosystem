# Docker Node install scripts policy

Dependency installs in `Dockerfile` use `--ignore-scripts` by default (see `.npmrc`).

`pnpm fetch` has no ignore-scripts flag; it only populates the store from the lockfile.

## Allowlist

| Package | Reason | Dockerfile step |
|---------|--------|-----------------|
| _(none)_ | Local `docker build --target sponsored-sender` passed with install-only hardening | |
