require('dotenv').config()

const express = require('express')
const server = express()
const connectDB = require('./db/connect')
const path = require('path')
const cors = require('cors')

const productsRouter = require('./routes/products')
const authRouter = require('./routes/auth')
const protectedRouter = require('./routes/protectedProducts')
const usersRouter = require('./routes/users')

const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
const authMiddleware = require('./middleware/authentication')

//const __dirname = path.resolve();

server.use(express.json())
server.use(cors())

//server.use("/api/v1/auth", authRouter)
server.use('/api/v1/products', productsRouter)
server.use('/api/v1/protected/products', authMiddleware, protectedRouter)
server.use('/api/v1/auth', authRouter)
server.use('/api/v1/users', authMiddleware, usersRouter)

server.use(notFoundMiddleware)
server.use(errorHandlerMiddleware)

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
    })
  } catch(err) {
    console.log(err)
  }

}

start()