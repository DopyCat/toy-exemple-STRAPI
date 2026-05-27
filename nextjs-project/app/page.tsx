import Image from "next/image";

// 1. A função de data fica aqui em cima, quietinha fora do componente
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

// 2. Criamos a função da página e usamos o "export default"
export default async function Page() {
  
  // 3. O fetch de dados fica obrigatoriamente aqui dentro
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*`,
  );
  const articles = await response.json();

  // 4. O HTML que você fez entra dentro do "return"
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Next.js and Strapi Integration</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-6">Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.data && articles.data.length > 0 ? (
            articles.data.map((article: any) => (
              <article
                key={article.id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <Image
                  className="w-full h-48 object-cover"
                  src={process.env.NEXT_PUBLIC_STRAPI_URL + article.cover.url}
                  alt={article.title}
                  width={180}
                  height={38}
                  priority
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.content}</p>
                  <p className="text-sm text-gray-500">
                    Published: {formatDate(article.publishedAt)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div>Nothing to fetch at the moment!</div>
          )}
        </div>
      </div>
    </div>
  );
}