/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs'

const ENABLE_SENTRY = process.env.ENABLE_SENTRY === 'true'
const SENTRY_ORG = process.env.SENTRY_ORG
const SENTRY_PROJECT = process.env.SENTRY_PROJECT
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN

const nextConfig = {};

const sentryConfig = {
    ...nextConfig,

    sentry: {
        // Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-your-nextjs-configuration
    }
}

// Docs: https://github.com/getsentry/sentry-webpack-plugin#options.
const sentryWebpackOptions = {
    org: SENTRY_ORG,
    project: SENTRY_PROJECT,
    authToken: SENTRY_AUTH_TOKEN,
    silent: true,
}

if (ENABLE_SENTRY) {
    console.log('Sentry is enabled for this build.')
}

export default ENABLE_SENTRY ? withSentryConfig(sentryConfig, sentryWebpackOptions) : nextConfig
