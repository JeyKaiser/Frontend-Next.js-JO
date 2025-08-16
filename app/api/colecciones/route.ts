import { NextResponse } from 'next/server';

interface CollectionDB {
  U_GSP_SEASON: string;
  Name: string;
}

interface Collection {
  id: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  references: number;
  lastUpdated: string;
  season: 'Spring/Summer' | 'Fall/Winter' | 'Resort' | 'Pre-Fall' | 'Summer Vacation' | 'Winter Sun';
}

const getImageByCollectionName = (name: string): string => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, ' ').trim();
  
  if (normalizedName.includes('spring summer')) return '/img/spring-summer.jpg';
  if (normalizedName.includes('winter sun')) return '/img/winter-sun.jpg';
  if (normalizedName.includes('resort')) return '/img/resort-rtw.jpg';
  if (normalizedName.includes('summer vacation')) return '/img/summer-vacation.jpg';
  if (normalizedName.includes('prefall')) return '/img/pre-fall.jpg';
  if (normalizedName.includes('fall winter')) return '/img/fall-winter.jpg';
  
  // Imagen por defecto para colecciones no reconocidas
  return '/img/default-collection.jpg';
};

const getBgColorByCollectionName = (name: string): string => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, ' ').trim();
  
  if (normalizedName.includes('spring summer')) return '#81c963';
  if (normalizedName.includes('winter sun')) return '#feea4d';
  if (normalizedName.includes('resort')) return '#70a7ff';
  if (normalizedName.includes('summer vacation')) return '#ff935f';
  if (normalizedName.includes('prefall')) return '#c6b9b1';
  if (normalizedName.includes('fall winter')) return '#b03c5c';
  
  // Color por defecto para colecciones no reconocidas
  return '#9ca3af';
};

const getSeasonFromName = (name: string): Collection['season'] => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, ' ').trim();
  
  if (normalizedName.includes('spring summer')) return 'Spring/Summer';
  if (normalizedName.includes('winter sun')) return 'Winter Sun';
  if (normalizedName.includes('resort')) return 'Resort';
  if (normalizedName.includes('summer vacation')) return 'Summer Vacation';
  if (normalizedName.includes('prefall')) return 'Pre-Fall';
  if (normalizedName.includes('fall winter')) return 'Fall/Winter';
  
  // Temporada por defecto
  return 'Spring/Summer';
};

const generateId = (name: string): string => {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/sap/collections/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // Evita cache para obtener datos frescos
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const backendData: CollectionDB[] = await response.json();

    if (!Array.isArray(backendData)) {
      throw new Error('Invalid response format from backend');
    }

    // Transformar los datos del backend al formato esperado por el frontend
    const collections: Collection[] = backendData.map((dbCollection) => ({
      id: generateId(dbCollection.Name),
      label: dbCollection.Name,
      img: getImageByCollectionName(dbCollection.Name),
      bg: getBgColorByCollectionName(dbCollection.Name),
      status: 'active' as const,
      references: Math.floor(Math.random() * 50) + 10, // Temporal, puedes obtener esto de otra tabla
      lastUpdated: new Date().toISOString().split('T')[0],
      season: getSeasonFromName(dbCollection.Name)
    }));

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections from backend:', error);
    
    // Respuesta más detallada del error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Error fetching collections',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}