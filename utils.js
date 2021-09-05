const constants = require('./constants.js')

const addEmissionData = (data) => {
	const dieselTotalPurchased = data["dieselPurchased"]
	const electricityTotalPurchased = data["electricityPurchased"]
	const foodPurchased = data["soyPurchased"] + data["grassPurchased"]

	const emissionsFossilFuels = dieselTotalPurchased * constants.emissionFactors.diesel
	const emissionsElectricity = electricityTotalPurchased * constants.emissionFactors.electricity
	const emissionsFood = foodPurchased * constants.emissionFactors.food

	const emissionsTotal = emissionsFossilFuels + emissionsElectricity + emissionsFood
	const litresMilkProduced = data["milkProduced"]

	data["emissionsFossilFuels"] = emissionsFossilFuels
	data["emissionsElectricity"] = emissionsElectricity
	data["emissionsFood"] = emissionsFood
	data["emissionsPerLitreMilk"] = emissionsTotal / litresMilkProduced
	return data
}

const findAverageFromArray = (array) => {
	return (array.reduce((a,b)=>a+b)) / array.length
}

const estimatePurchasesAndEmissionData = ({existingData, partialFarmData}) => {
	const dieselUsedPerTractorAllFarms = []
	const soyEatenPerCowAllFarms = []
	const grassEatenPerCowAllFarms = []
	const electricityUsedPerMachineAllFarms = []

	existingData.map(f => {
		const numberOfTractors = f["tractors"]
		const amountOfDieselPurchased = f["dieselPurchased"]
		const dieselUsedPerTractor = amountOfDieselPurchased / numberOfTractors
		dieselUsedPerTractorAllFarms.push(dieselUsedPerTractor)

		const numberOfCows = f["cows"]
		const amountOfSoyPurchased = f["soyPurchased"]
		const soyEatenPerCow = amountOfSoyPurchased / numberOfCows
		soyEatenPerCowAllFarms.push(soyEatenPerCow)

		const amountOfGrassPurchased = f["grassPurchased"]
		const grassEatenPerCow = amountOfGrassPurchased / numberOfCows
		grassEatenPerCowAllFarms.push(grassEatenPerCow)

		const numberOfMachines = f["milkMachines"]
		const electricityPurchased = f["electricityPurchased"]
		const electricityUsedPerMachine = electricityPurchased / numberOfMachines
		electricityUsedPerMachineAllFarms.push(electricityUsedPerMachine)
	})

	const averageDieselUsedPerTractor = findAverageFromArray(dieselUsedPerTractorAllFarms)
	const estimatedDieselPurchased = partialFarmData["tractors"] * averageDieselUsedPerTractor
	partialFarmData["dieselPurchased"] = estimatedDieselPurchased

	const averageSoyEatenPerCow = findAverageFromArray(soyEatenPerCowAllFarms)
	const estimatedSoyPurchased = partialFarmData["cows"] * averageSoyEatenPerCow
	partialFarmData["soyPurchased"] = estimatedSoyPurchased

	const averageGrassEatenPerCow = findAverageFromArray(grassEatenPerCowAllFarms)
	const estimatedGrassPurchased = partialFarmData["cows"] * averageGrassEatenPerCow
	partialFarmData["grassPurchased"] = estimatedGrassPurchased

	const averageElectricityUsedPerMachine = findAverageFromArray(electricityUsedPerMachineAllFarms)
	const estimatedElectricityPurchased = partialFarmData["milkMachines"] * averageElectricityUsedPerMachine
	partialFarmData["electricityPurchased"] = estimatedElectricityPurchased

	return addEmissionData(partialFarmData)
}

module.exports = {
	addEmissionData,
	estimatePurchasesAndEmissionData
}
