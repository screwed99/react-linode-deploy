import { useEffect, useState } from 'react'
import './App.css'

// Define the shape of the data we expect from the backend
interface ApiResponse {
  status: string;
  python: string;
  env: string;
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // We use the relative path /api which Vite proxies to the backend
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      })
  }, [])

  return (
    <div className="app-container">
      <header>
        <img src="/rock.svg" className="logo" alt="Rock logo" />
        <h1>Rock App</h1>
      </header>

      <main>
        <div className="card">
          <h2>Backend Status</h2>
          
          {loading && <p className="status-loading">Connecting to server...</p>}
          
          {error && (
            <div className="status-error">
              <p>⚠️ Connection Failed</p>
              <small>{error}</small>
            </div>
          )}

          {data && (
            <div className="json-display">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>

        <button onClick={() => window.location.reload()}>
          Ping Server Again
        </button>
      </main>
    </div>
  )
}

export default App