async function getPosts() {
  const res = await fetch(
    "http://localhost:1337/api/posts"
  )

  const data = await res.json()

  return data.data
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <div>
      <h1>Posts</h1>

      {posts.map((post:any)=>(
        <div key={post.id}>
          <h2>{post.titulo}</h2>
        </div>
      ))}
    </div>
  )
}