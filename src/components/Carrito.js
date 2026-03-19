async function pagar(items) {
  const respuesta = await fetch(`${process.env.REACT_APP_SERVER_URL}/crear-sesion-pago`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ laminas: items })
  })

  const { url } = await respuesta.json()
  window.location.href = url
}

function Carrito({ items, onQuitar }) {
  const total = items.reduce((suma, item) => suma + parseFloat(item.precio), 0)

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Carrito</h2>
        <p className="text-gray-400 text-sm">No hay láminas en el carrito.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Carrito</h2>

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">{item.titulo}</p>
              <p className="text-sm text-purple-600">{item.precio} €</p>
            </div>
            <button
              onClick={() => onQuitar(item.id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="font-bold text-purple-700">{total.toFixed(2)} €</span>
        </div>
        <button
          onClick={() => pagar(items)}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
        >
          Pagar
        </button>
      </div>
    </div>
  )
}

export default Carrito