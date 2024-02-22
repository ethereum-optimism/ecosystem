import promBundle from 'express-prom-bundle'

export const getPromMetrics = () => promBundle({ includeMethod: true })
