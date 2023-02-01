# nodejs-rate-limiting
A nodejs server with capability to rate limit api requests. 

## What is rate Limiting ?
Rate limiting is a strategy for limiting network traffic. It puts a cap on how often someone can repeat an action within a certain timeframe – for instance, trying to log in to an account. Rate limiting can help stop certain kinds of malicious bot activity. It can also reduce strain on web servers

### How does rate limiting work?
Rate limiting runs within an application, rather than running on the web server itself. Typically, rate limiting is based on tracking the IP addresses that requests are coming from, and tracking how much time elapses between each request. The IP address is the main way an application identifies who or what is making the request.

A rate limiting solution measures the amount of time between each request from each IP address, and also measures the number of requests within a specified timeframe. If there are too many requests from a single IP within the given timeframe, the rate limiting solution will not fulfill the IP address's requests for a certain amount of time.

Essentially, a rate-limited application will say, "Hey, slow down," to unique users that are making requests at a rapid rate. This is comparable to a police officer who pulls over a driver for exceeding the road's speed limit, or to a parent who tells their child not to eat so much candy in such a short span of time.

### Methods Used to rate limit API
- Using IP Address
- Using API Key

### What kinds of bot attacks are stopped by rate limiting?
- Brute force attacks
- DoS and DDoS attacks
- Web scraping

### Response Of API KEY
{
	"id": "e9325ec2-e8fc-4dbc-91af-efc959c696f2",
	"message": "Your API Key is X4S5XGN-X3Y4VF1-J6QYZJE-B739DWM valid for 10 days",
	"usage": "Use the above API key in headers of every request. Ex => X-API_KEY : API_KEY"
}
----
#### Rate limiting using IP Address (npm package - express-rate-limit)
![alt text](https://raw.githubusercontent.com/gouravojha/nodejs-rate-limiting/master/public/Screenshot%202023-02-01%20at%206.29.39%20PM.png)
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
----

#### Rate limiting using API KEY and Redis 
![alt text](https://raw.githubusercontent.com/gouravojha/nodejs-rate-limiting/master/public/Screenshot%202023-02-01%20at%206.29.54%20PM.png)

- **Initial Limit of every API_KEY is set to default of 10**
![alt text](https://raw.githubusercontent.com/gouravojha/nodejs-rate-limiting/master/public/Screenshot%202023-02-01%20at%206.29.08%20PM.png)

- **Once the Limit is exhausted the data in Redis is set to 0**
![alt text](https://raw.githubusercontent.com/gouravojha/nodejs-rate-limiting/master/public/Screenshot%202023-02-01%20at%206.30.21%20PM.png)
