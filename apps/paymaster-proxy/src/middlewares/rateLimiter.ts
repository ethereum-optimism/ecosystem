import { rateLimit } from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})
