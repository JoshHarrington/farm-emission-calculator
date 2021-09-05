import { useEffect, useState } from 'react'

const apiHost = 'http://localhost:9000/'
const apiAllDataUrl = apiHost + 'all-data'
const apiFullDataPost = apiHost + 'create-from-full-data'

function App() {

  const [data, setData] = useState([])
  const [formState, updateFormState] = useState({})

  useEffect(() => {
    fetch(apiAllDataUrl, {
      method: 'GET'
    }).then(res => res.json())
    .then(data => {
      setData(data)
    })
  }, [])

  const FormElement = ({name, type, children}) => {
    const isNumberField = type === 'number'
    return (
      <div className="flex flex-col mb-2">
        <label className="mb-1" htmlFor={name}>{children}</label>
        <input
          className="border border-gray-400 p-2"
          type={type}
          min={isNumberField ? 0 : undefined}
          step={isNumberField ? 'any' : undefined}
          required={true}
          id={name}
          name={name}
          value={formState[name]}
          onChange={(e) => {
            const value = e.target.value
            formState[name] = isNumberField ? parseFloat(value) : value
            updateFormState(formState)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <table className="table-auto">
        <thead>
          <tr>
            <th>Farm name</th>
            <th>Acres</th>
            <th>Cows</th>
            <th>Diesel Tractors</th>
            <th>Milk machines</th>
            <th>Litres milk produced</th>
          </tr>
        </thead>
        <tbody>
          {data.map((f, i) => (
            <tr key={i}>
              <td>{f["name"]}</td>
              <td>{f["acres"]}</td>
              <td>{f["cows"]}</td>
              <td>{f["tractors"]}</td>
              <td>{f["milkMachines"]}</td>
              <td>{f["milkProduced"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-medium mt-3 mb-2">Add Farm details</h2>
      <form
        className="mb-8"
        onSubmit={(e) => {
          e.preventDefault()
          fetch(apiFullDataPost, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
          }).then(res => res.json())
          .then(data => {
            updateFormState({})
            setData(data)
            window.scrollTo(0,0)
          })
        }}
      >
        <FormElement name="name" type="text">Farm Name</FormElement>

        <FormElement name="acres" type="number">Number of Acres</FormElement>

        <FormElement name="cows" type="number">Number of Cows</FormElement>

        <FormElement name="soyPurchased" type="number">Soy Purchased (kg)</FormElement>

        <FormElement name="grassPurchased" type="number">Grass Purchased (kg)</FormElement>

        <FormElement name="tractors" type="number">Number of Tractors</FormElement>

        <FormElement name="dieselUsage" type="number">Diesel Usage (l/100 mile)</FormElement>

        <FormElement name="dieselPurchased" type="number">Diesel Purchased (l)</FormElement>

        <FormElement name="milkMachines" type="number">Number of Milk Machines</FormElement>

        <FormElement name="milkMachineUsage" type="number">Usage (kWh) per Milk Machine</FormElement>

        <FormElement name="electricityPurchased" type="number">Electricity Purchased (kWh)</FormElement>

        <FormElement name="milkProduced" type="number">Litres of Milk produced</FormElement>

        <div className="w-full flex justify-center mt-5">
          <button className="bg-green-600 text-white py-1 px-2 rounded-sm text-xl" type="submit">Submit new farm details</button>
        </div>
      </form>
    </div>
  );
}

export default App;
