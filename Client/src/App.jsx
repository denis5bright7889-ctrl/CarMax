import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState('checking...')

  useEffect(() => {
    // Check backend connection
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        setBackendStatus('connected ?')
        console.log('Backend connected:', response.data)
      })
      .catch(err => {
        setBackendStatus('disconnected ?')
        console.error('Backend connection error:', err)
      })

    // Fetch cars from backend
    axios.get('http://localhost:5000/api/cars')
      .then(response => {
        console.log('Cars received:', response.data)
        setCars(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching cars:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">CarMax Marketplace</h1>
              <p className="text-gray-600">Your trusted car marketplace</p>
            </div>
            <div className="text-sm">
              <span className="font-semibold">Backend: </span>
              <span className={backendStatus === 'connected ?' ? 'text-green-600' : 'text-red-600'}>
                {backendStatus}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Available Cars</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading cars...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found {cars.length} car{cars.length !== 1 ? 's' : ''} available
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img 
                    src={car.images?.[0] || 'https://via.placeholder.com/400x300?text=Car'} 
                    alt={car.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Car+Image'
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{car.title}</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">${car.price?.toLocaleString()}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Year: {car.year}</span>
                        <span>{car.mileage?.toLocaleString()} miles</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{car.fuelType}</span>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="text-gray-500 mt-2">
                        ?? {car.location}
                      </div>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!loading && cars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No cars available at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for new listings!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-auto py-6 text-center">
        <p>&copy; 2024 CarMax. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-2">
          Backend API: http://localhost:5000/api
        </p>
      </footer>
    </div>
  )
}

export default App
