
//aqui vamos a manejar todo el fetching de datos a nuestras APIS's
// En pocas palabras, es el proceso de obtener información desde una fuente externa 
// (API, base de datos, archivo, etc.) para usarla en tu aplicación.
// En Next.js, lo importante no es solo traer los datos, sino dónde y cuándo hacerlo, porque eso afecta:

// El rendimiento

// El SEO (posicionamiento en buscadores)

// La experiencia de usuario

// Next.js 13+ y App Router
// Si usas el App Router (app/), el fetching de datos se hace más simple:

// Puedes hacer fetch directamente en un Server Component sin hooks especiales.

// Ejemplo:
// app/page.js
export default async function Page() {
  const res = await fetch('https://api.example.com/posts');
  const data = await res.json();

  return data.map(post => <p key={post.id}>{post.title}</p>);
}