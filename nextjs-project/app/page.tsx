export const dynamic = 'force-dynamic'

import Image from "next/image";

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "2-digit", day: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

export default async function Page() {
  
  const [strapiRes, usuariosRes] = await Promise.all([
    fetch(`http://strapi:1337/api/articles?populate=*`), // ← direto pro container
    fetch("https://jsonplaceholder.typicode.com/users")
  ]);

  const articles = await strapiRes.json();
  const usuarios = await usuariosRes.json();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Next.js + Strapi + JSONPlaceholder
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        
        {/* COLUNA 1: DADOS DO STRAPI (CMS) */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
            Artigos do Strapi (Backend 1)
          </h2>
          <div className="space-y-6">
            {articles.data && articles.data.length > 0 ? (
              articles.data.map((article: any) => (
                <article
                  key={article.id}
                  className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto min-h-[150px]">
                  <Image
                    className="object-cover"
                    // Deixe apenas o 'article.cover.url'. Ele já começa com "/uploads/..."
                    src={article.cover.url}
                    alt={article.title}
                    fill
                    priority
                    unoptimized
                  />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-gray-950">{article.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">{article.content}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Publicado em: {formatDate(article.publishedAt)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm text-gray-500 text-center">
                Nenhum artigo encontrado no Strapi!
              </div>
            )}
          </div>
        </div>

        {/* COLUNA 2: DADOS DO JSONPLACEHOLDER (USUÁRIOS) */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-2">
            Usuários do Sistema (Backend 2)
          </h2>
          <div className="space-y-4">
            {usuarios && usuarios.length > 0 ? (
              usuarios.map((user: any) => (
                <div 
                  key={user.id} 
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{user.name}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                    <p className="text-xs text-gray-400 mt-1">📧 {user.email}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                      {user.company.name}
                    </span>
                    <p className="text-xs text-gray-400 mt-2">🏙️ {user.address.city}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-sm text-gray-500 text-center">
                Carregando usuários...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}