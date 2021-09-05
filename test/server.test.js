const fs = require('fs')
const { app, dataFilePath } = require('../server')
const request = require('supertest')

const exampleData = [{"name": "Example farm"}]

const defaultDataFileContents = JSON.stringify(exampleData)

const resetDataTestJson = () => {
	fs.writeFileSync(dataFilePath, defaultDataFileContents)
}

beforeAll(() => {
	process.env.NODE_ENV = 'test';
})

beforeEach(() => {
	resetDataTestJson()
})

afterAll(() => {
	resetDataTestJson()
})


test('get root page', async () => {
	const res = await request(app).get('/')
	expect(res.status).toBe(200)
	expect(res.text).toEqual('Homepage loaded')
})


test('get all data', async () => {
	const res = await request(app).get('/all-data')
	const response = exampleData
	expect(res.status).toBe(200)
	expect(res.body).toEqual(response)
})

test('post full farm data to create farm', async () => {
	const res = await request(app).post('/create-from-full-data').send({"name": "New Farm"})
	expect(res.status).toBe(200)
	expect(res.body).toEqual([{"name": "Example farm"}, {"name": "New Farm"}])
})
