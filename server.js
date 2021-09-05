const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = process.env.NODE_ENV === 'test' ? 9001 : 9000;

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const dataFilePath = process.env.NODE_ENV === 'test' ? './test/data.test.json' : 'data.json'

app.get('/', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) throw err
    const fileData = JSON.parse(data)
		res.send(fileData)
	})
})

const server = app.listen(port)

module.exports = {
	app,
	server,
	dataFilePath
}