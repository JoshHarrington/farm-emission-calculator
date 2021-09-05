const express = require('express')
const cors = require('cors')
const fs = require('fs')
const { addEmissionData } = require('./utils.js')

const app = express()
const port = process.env.NODE_ENV === 'test' ? 9001 : 9000;

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const dataFilePath = process.env.NODE_ENV === 'test' ? './test/data.test.json' : 'data.json'

app.get('/', (req, res) => {
	res.send('Homepage loaded')
})

app.get('/all-data', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) throw err
    const fileData = JSON.parse(data)
		res.send(fileData)
	})
})

app.post('/create-from-full-data', (req, res) => {

	fs.readFile(dataFilePath, (err, data) => {
		if (err) throw err
		const currentFileData = JSON.parse(data)
		const newFarmData = addEmissionData(req.body)
		const newFileData = [...currentFileData, newFarmData]
		const stringifiedNewFileData = JSON.stringify(newFileData)

		fs.writeFile(
			dataFilePath,
			stringifiedNewFileData,
			(err) => {
				if (err) throw err
				res.send(newFileData)
			}
		)
	})
})

const server = app.listen(port)

module.exports = {
	app,
	server,
	dataFilePath
}