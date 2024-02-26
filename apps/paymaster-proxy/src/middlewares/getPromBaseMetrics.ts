import promBundle from 'express-prom-bundle'

export const getPromBaseMetrics = () => promBundle({ includeMethod: true })
