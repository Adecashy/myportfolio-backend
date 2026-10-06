const express = require("express")
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
const connectToDb = require("./config/dB")
const contactRoute = require("./routes/contactRoute")

dotenv.config()
connectToDb()

app.use(cors())
app.use(express.json())

app.use("/api/contact", contactRoute)

app.get("/", (req, res) => {
    res.json({
        message: "welcome to my backend engineering"
    })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})











// i0IdYPW6WuO6twgY

// crimefile67_db_user