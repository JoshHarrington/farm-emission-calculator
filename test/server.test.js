const fs = require('fs')
const { app, dataFilePath } = require('../server')
const request = require('supertest')

beforeAll(() => {
	process.env.NODE_ENV = 'test';
})

const exampleData = [{"name": "Example farm"}]

const defaultDataFileContents = JSON.stringify(exampleData)

const resetDataTestJson = () => {
	fs.writeFileSync(dataFilePath, defaultDataFileContents)
}

test('get root page', async () => {
	resetDataTestJson()

	const res = await request(app).get('/')
	const response = exampleData
	expect(res.status).toBe(200)
	expect(res.body).toEqual(response)
})
