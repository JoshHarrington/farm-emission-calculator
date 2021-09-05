import { useEffect, useState } from 'react'

const apiHost = 'http://localhost:9000/'
const apiDataUrl = apiHost + 'data'

function App() {

  const [data, setData] = useState([])

  useEffect(() => {
    fetch(apiDataUrl, {
      method: 'GET'
    }).then(res => res.json())
    .then(data => {
      setData(data)
    })
  }, [])

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
    </div>
  );
}

export default App;
