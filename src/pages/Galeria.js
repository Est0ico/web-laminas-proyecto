import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import TarjetaLamina from '../components/TarjetaLamina'

function Galeria({ onAñadir }) {
  const [laminas, setLaminas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarLaminas() {
      const { data, error } = await supabase
        .from('laminas')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) setLaminas(data)
      setCargando(false)
    }
    cargarLaminas()
  }, [])

  if (cargando) return <p className="text-center text-gray-500 mt-20">Cargando láminas...</p>
  if (laminas.length === 0) return <p className="text-center text-gray-500 mt-20">No hay láminas aún.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {laminas.map(lamina => (
        <TarjetaLamina key={lamina.id} lamina={lamina} onAñadir={onAñadir} />
      ))}
    </div>
  )
}

export default Galeria