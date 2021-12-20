const express = require("express")
require("dotenv").config()
const morgan = require("morgan")

const { createProxyMiddleware } =  require("http-proxy-middleware")

// Create express server
const app = express()

// Config
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "localhost"
const API_SERVICE_URL = process.env.API_SERVICE_URL || "https://jsonplaceholder.typicode.com"

// Log info
app.use(morgan("dev"))

app.get("/info", (req, res, next) =>  {
  res.send("This is a proxy server")
})
  
app.use("", (req, res, next) => {
  if (req.headers.authorization) {
    next()
  } else {
    res.sendStatus(403)
  }
})

// Proxy endpoints
app.use("/json_placeholder", createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {[`^/json_placeholder`]:""}
}))

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`)
})
