const express = require('express')
const cors = require('cors')

const app = express()
const port = 9000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(port)