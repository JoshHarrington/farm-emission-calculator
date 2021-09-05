const fs = require('fs')
const { app, dataFilePath } = require('../server')
const request = require('supertest')

const exampleFullData = [{
	"name": "Example farm",
	"acres": 10,
	"cows": 20,
	"tractors": 3,
	"milkMachines": 4,
	"milkProduced": 30,
	"dieselPurchased": 40,
	"electricityPurchased": 100,
	"soyPurchased": 80,
	"grassPurchased": 75,
	"emissionsFossilFuels": 107.51480000000001,
	"emissionsElectricity": 23.314,
	"emissionsFood": 205.9795,
	"emissionsPerLitreMilk": 11.226943333333335
}]

const newFullFarmData = {
	"name": "Example farm 2",
	"acres": 42,
	"cows": 74,
	"tractors": 5,
	"milkMachines": 23,
	"milkProduced": 83,
	"dieselPurchased": 84,
	"electricityPurchased": 328,
	"soyPurchased": 24,
	"grassPurchased": 421
}

const defaultDataFileContents = JSON.stringify(exampleFullData)

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
	const response = exampleFullData
	expect(res.status).toBe(200)
	expect(res.body).toEqual(response)
})

test('post full farm data to create farm', async () => {
	const res = await request(app).post('/create-from-full-data').send(newFullFarmData)
	expect(res.status).toBe(200)
	expect(res.body.length).toEqual(2)
	expect(res.body[1]["name"]).toEqual("Example farm 2")
	expect(res.body[1]["emissionsFossilFuels"]).toEqual(225.78108000000003)
	expect(res.body[1]["emissionsElectricity"]).toEqual(76.46992)
	expect(res.body[1]["emissionsFood"]).toEqual(591.3605)
	expect(res.body[1]["emissionsPerLitreMilk"]).toEqual(10.76640361445783)
})
