import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './dbConfig/dbConfig.js'
import cors from 'cors'
import authRoutes from './routes/authRoutes/authRoutes.js'
import analyze from './routes/analyzeRoutes/analyze.js'
import billSummaryRoutes from './routes/billSummaryRoutes/billSummaryRoutes.js'
import cookieParser from 'cookie-parser'

dotenv.config()
dbConnect()
console.log("connected successfully with mongodb")

const app = express()

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}
))

app.use(express.json());
app.use(cookieParser())

app.use(authRoutes)
app.use(analyze)
app.use(billSummaryRoutes)


app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen("3003", () => {
    console.log(`app is listening on Port ${process.env.PORT}`)
})