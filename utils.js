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

module.exports = {
	addEmissionData
}
