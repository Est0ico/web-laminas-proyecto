import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Galeria from './pages/Galeria'
import Login from './pages/Login'
import Panel from './pages/Panel'
import Carrito from './components/Carrito'

function App() {
  const [sesion, setSesion] = useState(null)
  const [vista, setVista] = useState('galeria')
  const [carrito, setCarrito] = useState([])

  useEffect(() => {
  // Comprueba la sesión inicial
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSesion(session)
  })

  // Escucha cambios de autenticación en tiempo real
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setSesion(session)
    }
  )

  // Limpia el listener cuando el componente se desmonta
  return () => subscription.unsubscribe()
}, [])
console.log('Sesion actual:', sesion)
console.log('Vista actual:', vista)

  function añadirAlCarrito(lamina) {
    const yaEsta = carrito.find(item => item.id === lamina.id)
    if (!yaEsta) setCarrito([...carrito, lamina])
  }

  function quitarDelCarrito(id) {
    setCarrito(carrito.filter(item => item.id !== id))
  }

  if (vista === 'login') {
    return <Login onLogin={() => setVista('panel')} />
  }

  if (vista === 'panel' && sesion) {
    return <Panel onLogout={() => { setSesion(null); setVista('galeria') }} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700">Mi tienda de láminas</h1>
          <button
            onClick={() => setVista('login')}
            className="text-sm text-purple-600 hover:underline"
          >
            Acceso dibujante
          </button>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <Galeria onAñadir={añadirAlCarrito} />
          </div>
          <div className="w-80">
            <Carrito
              items={carrito}
              onQuitar={quitarDelCarrito}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default App