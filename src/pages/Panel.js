import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Panel({ onLogout }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [categoria, setCategoria] = useState('anime')
  const [imagen, setImagen] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setExito(false)

    // 1. Subir la imagen al Storage
    const extension = imagen.name.split('.').pop()
    const nombreArchivo = `${Date.now()}.${extension}`

    const { error: errorStorage } = await supabase.storage
      .from('laminas')
      .upload(nombreArchivo, imagen)

    if (errorStorage) {
      setError('Error al subir la imagen')
      setCargando(false)
      return
    }

    // 2. Obtener la URL pública de la imagen
    const { data: urlData } = supabase.storage
      .from('laminas')
      .getPublicUrl(nombreArchivo)

    // 3. Guardar la lámina en la base de datos
    const { error: errorBD } = await supabase
      .from('laminas')
      .insert({
        titulo,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        imagen_url: urlData.publicUrl
      })

    if (errorBD) {
      setError('Error al guardar la lámina')
    } else {
      setExito(true)
      setTitulo('')
      setDescripcion('')
      setPrecio('')
      setCategoria('anime')
      setImagen(null)
    }

    setCargando(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-purple-700">Panel del dibujante</h2>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Subir nueva lámina</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="text-sm font-semibold text-gray-600">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Descripción</label>
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Precio (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Categoría</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="anime">Anime</option>
                <option value="series">Series</option>
                <option value="videojuegos">Videojuegos</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImagen(e.target.files[0])}
                className="w-full mt-1 text-sm text-gray-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {exito && <p className="text-green-500 text-sm">¡Lámina publicada correctamente!</p>}

            <button
              type="submit"
              disabled={cargando}
              className="bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
            >
              {cargando ? 'Publicando...' : 'Publicar lámina'}
            </button>

          </form>
        </div>

      </div>
    </div>
  )
}

export default Panel