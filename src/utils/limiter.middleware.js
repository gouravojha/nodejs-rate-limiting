// IP based rate limiter for API

const rateLimit = require('express-rate-limit');

limiter = rateLimit({
	windowMs: 10 * 1000, // 10 sec
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per 10 sec)
	message: 'Too many requests. Try after sometime',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = {
	limiter
}

