import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import resumeRoutes from "./routes/resume.js"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/resume", resumeRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`)
})
