import CollectionCard from '@/components/molecules/Card';

interface Card {
  id: number;
  bg: string;
  img: string;
  label: string;
  coleccion: string;  
}

export default function AnioColeccionPage({ params }: { params: { coleccion: string } }) {
  const { coleccion } = params;

  // Aquí simulas tus datos
  const cards: Card[] = [
    {
      id: 1,
      bg: '#feea4d',
      img: '/img/fall-winter.jpg',
      label: 'Referencia 001',
      coleccion,
    },
    {
      id: 2,
      bg: '#70a7ff',
      img: '/img/pre-fall.jpg',
      label: 'Referencia 002',
      coleccion,
    },
    // etc.
  ];

  return (
    <div className="p-8">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 uppercase tracking-wider">AÑO DE COLECCIÓN</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 mx-auto mt-2 rounded"></div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4">
        {cards.map((card) => (
          <CollectionCard
            key={card.id}
            href={`/referencias/${card.id}`}
            imageSrc={card.img}         // antes era `img`
            title={card.label}          // antes era `label`
            bgColor={card.bg}           // antes era `bg`     
            // subtitle={card.coleccion}       
            />
        ))}
      </div>
    </div>
  );
}
