require('dotenv').config()

const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const path = require('path')
const cors = require('cors')
const http = require('http')
const { initializeSocket, getIO } = require('./socket')

const server = http.createServer(app)

const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')
const protectedRouter = require('./routes/protectedProducts')
const usersRouter = require('./routes/users')
const messagesRouter = require('./routes/messages')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
const authMiddleware = require('./middleware/authentication')

//const __dirname = path.resolve();

app.use(express.json())
app.use(cors())

initializeSocket(server)

//app.use("/api/v1/auth", authRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/protected/products', authMiddleware, protectedRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authMiddleware, usersRouter)
app.use('/api/v1/chat', authMiddleware, messagesRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000
/*
if (process.env.NODE_ENV === "production") {
	console.log("HI")
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}*/

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    server.listen(port, () => {
      console.log(`Listening on port ${port}...`)
      const io = getIO()
    })
  } catch(err) {
    console.log(err)
  }

}

start()