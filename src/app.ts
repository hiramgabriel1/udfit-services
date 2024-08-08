import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import cors from "cors"
import routerUser from "./routes/user.route"
import { rateLimit } from "express-rate-limit"

dotenv.config()
const app = express()
const limiter = rateLimit({
    windowMs: 15 * 60 * 200,
    limit: 40,
})

// ? configs
app.disable("x-powered-by")

// ? middlewares
app.use(morgan("dev"))
app.use(limiter)
app.use(express.json())
app.use(cors({
    origin: [''],
    methods: 'POST, GET, PUT, PATCH, DELETE'
}))

// ? endpoints
app.use(routerUser)

export default app