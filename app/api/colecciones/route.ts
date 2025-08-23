import { NextResponse } from 'next/server';

interface CollectionDB {
  U_GSP_SEASON: string;
  Name: string;
  id?: string | number; // Add ID field
}

interface Reference {
  codigo_coleccion: string;
  codigo_referencia: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  lastUpdated: string;
  season: 'Spring/Summer' | 'Fall/Winter' | 'Resort' | 'Pre-Fall' | 'Summer Vacation' | 'Winter Sun';
}

interface Collection {
  id: string;
  label: string;
  img: string;
  bg: string;
  status: 'active' | 'archived' | 'planning';
  references: Reference[];
  lastUpdated: string;
  season: 'Spring/Summer' | 'Fall/Winter' | 'Resort' | 'Pre-Fall' | 'Summer Vacation' | 'Winter Sun';
}

const getImageByCollectionName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    return '/img/default-collection.jpg';
  }
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
  if (!name || typeof name !== 'string') {
    return '#9ca3af';
  }
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
  if (!name || typeof name !== 'string') {
    return 'Spring/Summer';
  }
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
  if (!name || typeof name !== 'string') {
    return 'unknown-collection';
  }
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

// Mock data para desarrollo basado en la consulta SQL real con códigos U_GSP_SEASON reales
// Simula el resultado de la consulta: SELECT "U_GSP_SEASON", "Name" FROM SBOJOZF."@GSP_TCCOLLECTION" 
// WHERE... ORDER BY "U_GSP_SEASON" DESC
const getMockBackendData = (): CollectionDB[] => [
  // Códigos ordenados de mayor a menor (110, 106, 105, 102, 96...)
  { U_GSP_SEASON: '110', Name: 'SPRING SUMMER 2025' },
  { U_GSP_SEASON: '109', Name: 'WINTER SUN 2025' },
  { U_GSP_SEASON: '108', Name: 'RESORT RTW 2025' },
  { U_GSP_SEASON: '107', Name: 'PREFALL 2025' },
  { U_GSP_SEASON: '106', Name: 'FALL WINTER 2025' },
  
  { U_GSP_SEASON: '105', Name: 'SPRING SUMMER 2024' },
  { U_GSP_SEASON: '104', Name: 'SUMMER VACATION 2024' },
  { U_GSP_SEASON: '103', Name: 'WINTER SUN 2024' },
  { U_GSP_SEASON: '102', Name: 'RESORT RTW 2024' },
  { U_GSP_SEASON: '101', Name: 'PREFALL 2024' },
  { U_GSP_SEASON: '100', Name: 'FALL WINTER 2024' },
  
  { U_GSP_SEASON: '99', Name: 'SPRING SUMMER 2023' },
  { U_GSP_SEASON: '98', Name: 'SUMMER VACATION 2023' },
  { U_GSP_SEASON: '97', Name: 'WINTER SUN 2023' },
  { U_GSP_SEASON: '96', Name: 'RESORT RTW 2023' },
  { U_GSP_SEASON: '95', Name: 'PREFALL 2023' },
  { U_GSP_SEASON: '94', Name: 'FALL WINTER 2023' },
  
  { U_GSP_SEASON: '93', Name: 'SPRING SUMMER 2022' },
  { U_GSP_SEASON: '92', Name: 'SUMMER VACATION 2022' },
  { U_GSP_SEASON: '91', Name: 'WINTER SUN 2022' },
  { U_GSP_SEASON: '90', Name: 'RESORT RTW 2022' },
  { U_GSP_SEASON: '89', Name: 'PREFALL 2022' },
  { U_GSP_SEASON: '88', Name: 'FALL WINTER 2022' },
  
  { U_GSP_SEASON: '87', Name: 'SPRING SUMMER 2021' },
  { U_GSP_SEASON: '86', Name: 'SUMMER VACATION 2021' },
  { U_GSP_SEASON: '85', Name: 'WINTER SUN 2021' },
  { U_GSP_SEASON: '84', Name: 'RESORT RTW 2021' },
  { U_GSP_SEASON: '83', Name: 'PREFALL 2021' },
  { U_GSP_SEASON: '82', Name: 'FALL WINTER 2021' },
  
  { U_GSP_SEASON: '81', Name: 'SPRING SUMMER 2020' },
  { U_GSP_SEASON: '80', Name: 'SUMMER VACATION 2020' },
  { U_GSP_SEASON: '79', Name: 'WINTER SUN 2020' },
  { U_GSP_SEASON: '78', Name: 'RESORT RTW 2020' },
  { U_GSP_SEASON: '77', Name: 'PREFALL 2020' },
  { U_GSP_SEASON: '76', Name: 'FALL WINTER 2020' },
  
  { U_GSP_SEASON: '75', Name: 'SPRING SUMMER 2019' },
  { U_GSP_SEASON: '74', Name: 'SUMMER VACATION 2019' },
  { U_GSP_SEASON: '73', Name: 'WINTER SUN 2019' },
  { U_GSP_SEASON: '72', Name: 'PREFALL 2019' },
  { U_GSP_SEASON: '71', Name: 'FALL WINTER 2019' },
  
  { U_GSP_SEASON: '70', Name: 'SPRING SUMMER 2018' },
  { U_GSP_SEASON: '69', Name: 'FALL WINTER 2018' }
];

// Función para procesar los datos mock usando la lógica original
const getMockCollections = (): Collection[] => {
  const mockBackendData = getMockBackendData();
  
  // Aplicar la lógica original de transformación
  const collections: Collection[] = mockBackendData.map((dbCollection) => {
    const collectionName = dbCollection.Name || 'Unknown Collection';
    
    // Generar referencias mock como en la lógica original
    const mockReferences: Reference[] = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, index) => ({
      codigo_coleccion: dbCollection.U_GSP_SEASON ? String(dbCollection.U_GSP_SEASON).padStart(3, '0') : '001',
      codigo_referencia: `PT${String(index + 1).padStart(5, '0')}`,
      label: `Referencia ${index + 1} - ${collectionName}`,
      img: getImageByCollectionName(collectionName),
      bg: getBgColorByCollectionName(collectionName),
      status: ['active', 'archived', 'planning'][Math.floor(Math.random() * 3)] as 'active' | 'archived' | 'planning',
      lastUpdated: new Date().toISOString().split('T')[0],
      season: getSeasonFromName(collectionName)
    }));
    
    return {
      id: dbCollection.U_GSP_SEASON || generateId(collectionName),
      label: collectionName,
      img: getImageByCollectionName(collectionName),
      bg: getBgColorByCollectionName(collectionName),
      status: 'active' as const,
      references: mockReferences,
      lastUpdated: new Date().toISOString().split('T')[0],
      season: getSeasonFromName(collectionName)
    };
  });
  
  return collections;
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
      // Si el backend no está disponible, usar datos mock
      console.warn('Backend not available for collections, using mock data');
      return NextResponse.json(getMockCollections());
    }

    const backendData: CollectionDB[] = await response.json();

    if (!Array.isArray(backendData)) {
      throw new Error('Invalid response format from backend');
    }

    // Transformar los datos del backend al formato esperado por el frontend
    const collections: Collection[] = backendData.map((dbCollection) => {
      // Verificar que dbCollection.Name existe
      const collectionName = dbCollection.Name || 'Unknown Collection';
      if (!dbCollection.Name) {
        console.warn('Collection without name found:', dbCollection);
      }
      
      // Generar referencias mock hasta que el backend las proporcione
      const mockReferences: Reference[] = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, index) => ({
        codigo_coleccion: dbCollection.id ? String(dbCollection.id).padStart(3, '0') : '001',
        codigo_referencia: `PT${String(index + 1).padStart(5, '0')}`,
        label: `Referencia ${index + 1} - ${collectionName}`,
        img: getImageByCollectionName(collectionName),
        bg: getBgColorByCollectionName(collectionName),
        status: ['active', 'archived', 'planning'][Math.floor(Math.random() * 3)] as 'active' | 'archived' | 'planning',
        lastUpdated: new Date().toISOString().split('T')[0],
        season: getSeasonFromName(collectionName)
      }));
      
      return {
        id: dbCollection.U_GSP_SEASON || generateId(collectionName),
        label: collectionName,
        img: getImageByCollectionName(collectionName),
        bg: getBgColorByCollectionName(collectionName),
        status: 'active' as const,
        references: mockReferences,
        lastUpdated: new Date().toISOString().split('T')[0],
        season: getSeasonFromName(collectionName)
      };
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections from backend, using mock data:', error);
    
    // Usar datos mock como fallback cuando hay error
    return NextResponse.json(getMockCollections());
  }
}