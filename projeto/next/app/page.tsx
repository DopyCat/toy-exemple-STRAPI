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
  const Listas = await getListas()
  const status = await getStatus()

  return (
    <div>
      <h1>Listas</h1>

      {Listas.map((lista:any)=>(
        <div key={lista.id}>
          <h2>{lista.Texto}</h2>
          <p>{status.mensagem}</p>
        </div>
      ))}
    </div>
  )
}