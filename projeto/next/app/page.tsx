async function getListas() {
  const res = await fetch(
    "http://localhost:1337/api/listas"
  )

  const data = await res.json()

  return data.data
}

async function getStatus() {
  const res = await fetch(
    "http://localhost:4000/api/status"
  )

  return res.json()
}

export default async function Home() {
  const listas = await getListas()
  const status = await getStatus()

  return (
    <main className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-6">
      
      <div className="bg-pink-200 p-8 rounded-3xl shadow-xl w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-pink-700 text-center mb-6">
          💗 Listas 💗
        </h1>

        <div className="space-y-4">
          {listas.map((lista: any) => (
            <div
              key={lista.id}
              className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-4 shadow-md hover:scale-105 transition"
            >
              <h2 className="text-xl font-semibold text-pink-600">
                {lista.Texto}
              </h2>

              <p className="text-pink-500 mt-2">
                {status.mensagem}
              </p>
            </div>
          ))}
        </div>
      </div>

    </main>
  )
}