require('dotenv').config()
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const morgan = require('morgan');
const helmet = require("helmet");
const { limiter } = require('./utils/limiter.middleware')
const { getIpFromRequest } = require('./utils/ip')
const { client } = require('./db/redis')
const uuidApiKey = require('uuid-apikey')

const app = express()
const PORT = process.env.PORT || 4000
app.use(cors())
app.use(morgan())
app.use(helmet());
app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "Server is working" })
})

app.get('/photos', limiter, async (req, res) => {
    // console.log(getIpFromRequest(req))
    try {
        let apiKey = req.headers['x-api_key']
        if(await client.get(apiKey) !== null){
            let remaining_access_points = parseInt(await client.get(apiKey))
            if(remaining_access_points > 0){
                const response = await axios.get(process.env.THIRD_PARTY_API)
                await client.set(apiKey,remaining_access_points - 1)
                return res.status(200).json({ message: response.data })
            }else{
                return res.status(401).json({message : "You have exhausted your API limit. Please refill"})
            }
        }else{
            return res.status(401).json({error : "You are Unauthorized"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong. Please try again" })
    }
})

app.get('/register', async (req, res) => {
    try {
        let { uuid, apiKey } = uuidApiKey.create()
        await client.set(apiKey, 100, {
            EX: 864000,
            NX: true
        })
        res.json({
            id : uuid,
            message : `Your API Key is ${apiKey} valid for 10 days`,
            usage : "Use the above API key in headers of every request. Ex => X-API_KEY : API_KEY"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Something went wrong. Please try again" })
    }
})

app.listen(PORT, async () => {
    await client.connect()
    console.log(`Server running at port ${PORT}`)
})



