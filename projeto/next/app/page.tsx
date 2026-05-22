async function getPosts() {
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
  const posts = await getPosts()
  const status = await getStatus()

  return (
    <div>
      <h1>Posts</h1>

      {posts.map((post:any)=>(
        <div key={post.id}>
          <h2>{post.titulo}</h2>
          <p>{status.mensagem}</p>
        </div>
      ))}
    </div>
  )
}