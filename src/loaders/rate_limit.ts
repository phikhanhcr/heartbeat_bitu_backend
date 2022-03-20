import rateLimit from 'express-rate-limit'

const apiLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  message: "Too many request, please slowly"
});

const rateLimitLoader = app => {
  app.use(apiLimiter)
}
export {
  rateLimitLoader
}
