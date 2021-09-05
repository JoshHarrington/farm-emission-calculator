import { useEffect, useState } from 'react'
import classNames from 'classnames'

const apiHost = 'http://localhost:9000/'
const apiAllDataUrl = apiHost + 'all-data'
const apiFullDataPost = apiHost + 'create-from-full-data'
const apiPartialDataPost = apiHost + 'create-from-partial-data'

function App() {

  const [data, setData] = useState([])
  const [formState, updateFormState] = useState({})

  const maxNumberOfInputFarms = 10
  const isFullDataEntryRequired = data.length <= maxNumberOfInputFarms

  useEffect(() => {
    fetch(apiAllDataUrl, {
      method: 'GET'
    }).then(res => res.json())
    .then(data => {
      setData(data)
    })

    updateFormState({})
    // clear form data on every rerender
    // avoiding issue where rerenders locks input fields with data in them
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

  const tableCellBorderClasses = "border-green-500 px-4 py-2"
  const tableHeaderCellClasses = "text-bold text-center border-0 border-b"
  const tableBodyCellClasses = "border text-left"

  return (
    <div className="flex flex-col h-full p-6">
      <table className="table-auto">
        <thead>
          <tr>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses)}>Farm name</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses)}>Acres</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses)}>Cows</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses)}>Diesel Tractors</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses)}>Milk machines</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses)}>Litres milk produced</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses, "text-green-600")}>Scope 1<br/><hr/>Fossil fuel emissions (kgCO2e)</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses, "text-green-600")}>Scope 2<br/><hr/>Electricity emissions (kgCO2e)</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses, "text-green-600")}>Scope 3<br/><hr/>Food purchase emissions (kgCO2e)</th>
            <th className={classNames(tableCellBorderClasses, tableHeaderCellClasses, "text-green-800")}>Emissions per litre of milk (kgCO2e / l)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((f, i) => (
            <tr key={i}>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f["name"]}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f["acres"]}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f["cows"]}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f["tractors"]}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f["milkMachines"]}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f["milkProduced"]}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f.emissionsFossilFuels.toFixed(2)}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f.emissionsElectricity.toFixed(2)}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f.emissionsFood.toFixed(2)}</td>
              <td className={classNames(tableCellBorderClasses, tableBodyCellClasses)}>{f.emissionsPerLitreMilk.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr className="mt-6" />

      <h2 className="text-2xl font-medium mt-3 mb-2">Add {isFullDataEntryRequired ? 'full' : 'partial'} farm details</h2>
      <form
        className="mb-8"
        onSubmit={(e) => {
          e.preventDefault()
          fetch(isFullDataEntryRequired ? apiFullDataPost : apiPartialDataPost, {
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

        {isFullDataEntryRequired &&
          <FormElement name="soyPurchased" type="number">Soy Purchased (kg)</FormElement>
        }

        {isFullDataEntryRequired &&
          <FormElement name="grassPurchased" type="number">Grass Purchased (kg)</FormElement>
        }

        <FormElement name="tractors" type="number">Number of Tractors</FormElement>

        {isFullDataEntryRequired &&
          <FormElement name="dieselPurchased" type="number">Diesel Purchased (l)</FormElement>
        }

        <FormElement name="milkMachines" type="number">Number of Milk Machines</FormElement>

        {isFullDataEntryRequired &&
          <FormElement name="electricityPurchased" type="number">Electricity Purchased (kWh)</FormElement>
        }

        <FormElement name="milkProduced" type="number">Litres of Milk produced</FormElement>


        <div className="w-full flex justify-center mt-5">
          <button className="bg-green-600 text-white py-1 px-2 rounded-sm text-xl" type="submit">Submit new farm details</button>
        </div>
      </form>
    </div>
  );
}

export default App;
