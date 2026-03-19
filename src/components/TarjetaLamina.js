function TarjetaLamina({ lamina, onAñadir }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={lamina.imagen_url}
        alt={lamina.titulo}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <span className="text-xs font-semibold text-purple-500 uppercase tracking-wide">
          {lamina.categoria}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mt-1">{lamina.titulo}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{lamina.descripcion}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-purple-700">{lamina.precio} €</span>
          <button
            onClick={() => onAñadir(lamina)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors duration-200"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default TarjetaLamina