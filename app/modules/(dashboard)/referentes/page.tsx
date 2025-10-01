'use client';

import { useState, useEffect } from 'react';

interface Prenda {
  prenda_id: number;
  tipo_prenda_nombre: string;
  cantidad_telas?: number;
  prenda_base?: string;
}

interface ImageData {
  id: number;
  title: string;
  image_url: string;
  uploaded_at: string;
}

interface ConsumoData {
  indice?: number;
  uso_en_prenda?: string;
  uso_tela?: string;
  base_textil?: string;
  color?: string;
  caracteristica_color?: string;
  consumo_mtr?: number;
  ancho_tela?: number;
  ancho_util_metros?: number;
  consumo?: number;
  propiedades?: string;
  cantidad_telas?: number;
  numero_variante?: string;
  tipo_prenda?: string;
  descripcion_variante?: string;
}

interface Filtros {
  cantidad_telas?: string;
  uso_tela?: string;
  base_textil?: string;
  caracteristica_color?: string;
  ancho_util?: string;
}

interface ConteoVarianteData {
  'cantidad_telas': number;
  'numero_variante': string;
  'descripcion_variante': string;
}

interface ConsumoEspecificoData {
  uso_tela: string;
  base_textil: string;
  caracteristica_color: string;
  consumo_mtr: number;
  ancho_util_metros: number;
}

interface ConteoVarianteBackendData {
  cantidad_telas: number;
  numero_variante: string;
  descripcion_variante: string;
}



export default function ReferentesPage() {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Estados para la funcionalidad de consumo textil
  const [consumoData, setConsumoData] = useState<ConsumoData[]>([]);
  const [consumoDataOriginal, setConsumoDataOriginal] = useState<ConsumoData[]>([]);
  const [conteosTelas, setConteosTelas] = useState<ConteoVarianteData[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [showTable, setShowTable] = useState(false);
  const [showConteoCards, setShowConteoCards] = useState(false);
  const [selectedPrenda, setSelectedPrenda] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availableImages, setAvailableImages] = useState<ImageData[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showConteoImageUpload, setShowConteoImageUpload] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchPrendas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sap/prendas/');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener los datos');
      }
      const data = await response.json();
      setPrendas(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  const fetchImages = async (): Promise<ImageData[]> => {
    try {
      const response = await fetch('http://localhost:8000/api/sap/images/');
      if (!response.ok) {
        throw new Error('Error al obtener las imágenes');
      }
      const data = await response.json();
      // setImages(data); // Comentado - solo usamos availableImages
      setAvailableImages(data); // Guardar en availableImages para las cards de prendas y conteos
      return data;
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchPrendas();
    fetchImages();
  }, []);

  // Monitorear cambios en refreshKey y availableImages
  useEffect(() => {
    console.log('🔄 Estado actualizado - refreshKey:', refreshKey, 'availableImages:', availableImages.length);
  }, [refreshKey, availableImages]);


  // Función para manejar la subida de imágenes de portadas para prendas
  const handleImageUploadForPrenda = async (prendaNombre: string, file: File) => {
    const uploadKey = `PORTADA_${prendaNombre}`;

    try {
      // Marcar como subiendo
      setUploadingImages(prev => new Set(prev).add(uploadKey));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', `PORTADA ${prendaNombre.toUpperCase()}`);

      console.log('Subiendo imagen para:', uploadKey);

      const response = await fetch('http://localhost:8000/api/sap/images/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      await response.json(); // Consumir la respuesta

      // Pequeño delay para asegurar que la imagen esté disponible en el servidor
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Refrescar la lista de imágenes para asegurar que se actualice
      await fetchImages();

      // Forzar un re-render actualizando el estado de error para trigger el re-render
      setError(null);

      // Forzar re-render de las cards
      setRefreshKey(prev => {
        console.log('Actualizando refreshKey de', prev, 'a', prev + 1);
        return prev + 1;
      });

      // Mostrar mensaje de éxito
      alert(`✅ Imagen subida exitosamente para ${prendaNombre}`);
      console.log('Imagen subida exitosamente:', uploadKey);
      console.log('Nuevo refreshKey establecido');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`❌ Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      // Remover de uploading
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  };






  // Función para manejar la subida de imágenes para variantes
  const handleImageUploadForVariante = async (prendaNombre: string, cantidadTelas: number, numeroVariante: string, file: File) => {
    const uploadKey = `${prendaNombre}_${cantidadTelas}_${numeroVariante}_VARIANTE`;

    try {
      // Marcar como subiendo
      setUploadingImages(prev => new Set(prev).add(uploadKey));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', `${prendaNombre.toUpperCase()}_${cantidadTelas}_${numeroVariante}_VARIANTE`);

      console.log('Subiendo imagen para variante:', uploadKey);

      const response = await fetch('http://localhost:8000/api/sap/images/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir la imagen');
      }

      await response.json(); // Consumir la respuesta

      // Pequeño delay para asegurar que la imagen esté disponible en el servidor
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Refrescar la lista de imágenes para asegurar que se actualice
      await fetchImages();

      // Forzar un re-render actualizando el estado de error para trigger el re-render
      setError(null);

      // Forzar re-render de las cards
      setRefreshKey(prev => {
        console.log('Actualizando refreshKey de', prev, 'a', prev + 1);
        return prev + 1;
      });

      // Mostrar mensaje de éxito
      alert(`✅ Imagen subida exitosamente para ${prendaNombre} - ${cantidadTelas} telas - Variante ${numeroVariante}`);
      console.log('Imagen subida exitosamente:', uploadKey);
      console.log('Nuevo refreshKey establecido');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`❌ Error al subir la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      // Remover de uploading
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  };

  // Función para obtener la imagen correcta para cada prenda/variante
  const getPrendaImage = (prendaNombre: string, cantidadTelas?: number, numeroVariante?: string): ImageData | null => {
    console.log('=== getPrendaImage ===');
    console.log('prendaNombre:', prendaNombre);
    console.log('cantidadTelas:', cantidadTelas);
    console.log('numeroVariante:', numeroVariante);
    console.log('availableImages count:', availableImages.length);
    console.log('refreshKey:', refreshKey);

    // Si hay numero_variante, buscar imagen específica para esa variante
    if (numeroVariante && cantidadTelas) {
      const tituloVariante = `${prendaNombre.toUpperCase()}_${cantidadTelas}_${numeroVariante}_VARIANTE`;
      console.log('Buscando imagen de variante:', tituloVariante);

      const imagenVariante = availableImages.find(img =>
        img.title.toUpperCase() === tituloVariante.toUpperCase()
      );

      if (imagenVariante) {
        console.log('✅ Imagen de variante encontrada:', imagenVariante.title);
        return imagenVariante;
      }

      console.log('❌ Imagen de variante no encontrada');
    }

    // Si hay cantidad de telas específica, buscar imagen específica para esa cantidad
    if (cantidadTelas) {
      const tituloEspecifico = `${prendaNombre.toUpperCase()}_${cantidadTelas}_TELAS`;
      console.log('Buscando imagen específica:', tituloEspecifico);

      const imagenEspecifica = availableImages.find(img =>
        img.title.toUpperCase() === tituloEspecifico.toUpperCase()
      );

      if (imagenEspecifica) {
        console.log('✅ Imagen específica encontrada:', imagenEspecifica.title);
        return imagenEspecifica;
      }

      console.log('❌ Imagen específica no encontrada');
    }

    // Para prendas principales (sin cantidad de telas), buscar imagen de portada específica
    const imagenesEspecificas: { [key: string]: string } = {
      'BIKINI BOTTOM': 'PORTADA BIKINI BOTTOM',
      'BIKINI TOP': 'PORTADA BIKINI TOP',
      'ONEPIECE': 'PORTADA ONEPIECE',
      'BIKINI BOTTOM PANTY': 'PORTADA BIKINI BOTTOM PANTY'
    };

    const tituloBuscado = imagenesEspecificas[prendaNombre];
    console.log('Buscando imagen de portada:', tituloBuscado);

    if (tituloBuscado) {
      // Buscar imagen por título exacto (insensible a mayúsculas/minúsculas)
      const imagenEspecifica = availableImages.find(img =>
        img.title.toUpperCase() === tituloBuscado.toUpperCase()
      );

      if (imagenEspecifica) {
        console.log('✅ Imagen de portada encontrada:', imagenEspecifica.title);
        return imagenEspecifica;
      }
    }

    console.log('❌ Imagen de portada no encontrada');
    // Si no se encuentra la imagen específica, NO buscar alternativas para evitar conflictos
    return null;
  };

  // Función para obtener datos específicos de consumo textil
  const fetchConsumoEspecifico = async (tipoPrenda: string, cantidadTelas: number, numeroVariante: string) => {
    console.log('🔄 fetchConsumoEspecifico - tipoPrenda:', tipoPrenda);
    console.log('🔄 fetchConsumoEspecifico - cantidadTelas:', cantidadTelas);
    console.log('🔄 fetchConsumoEspecifico - numeroVariante:', numeroVariante);

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('tipo_prenda', tipoPrenda);
      params.append('cantidad_telas', cantidadTelas.toString());

      const url = `http://localhost:8000/api/sap/consumo-textil/?${params.toString()}`;
      console.log('🔄 fetchConsumoEspecifico - URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los datos específicos de consumo');
      }
      const data = await response.json();
      console.log('🔄 fetchConsumoEspecifico - Datos recibidos:', data.length, 'registros');
      console.log('🔄 fetchConsumoEspecifico - Datos:', data);

      // Mapear los datos para que coincidan con la interfaz ConsumoData
      const mappedData = data.map((item: ConsumoEspecificoData, index: number) => ({
        uso_tela: item.uso_tela,
        base_textil: item.base_textil,
        caracteristica_color: item.caracteristica_color,
        consumo_mtr: item.consumo_mtr,
        ancho_util_metros: item.ancho_util_metros,
        cantidad_telas: cantidadTelas,
        numero_variante: numeroVariante,
        tipo_prenda: tipoPrenda,
        // Agregar índice dinámico basado en la posición
        indice: index + 1
      }));

      // Guardar datos originales para filtros
      setConsumoDataOriginal(mappedData);


      // Aplicar filtros actuales si existen
      if (filtros && Object.keys(filtros).length > 0) {
        const filteredData = applyFiltersToData(mappedData, filtros);
        setConsumoData(filteredData);
        setRecordCount(filteredData.length);
        console.log('🔄 fetchConsumoEspecifico - Filtros aplicados automáticamente:', filteredData.length, 'registros');
      } else {
        setConsumoData(mappedData);
        setRecordCount(data.length);
      }
    } catch (error) {
      console.error('❌ fetchConsumoEspecifico - Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };



  // Función para obtener conteos de telas y variantes por prenda
  const fetchConteosTelas = async (tipoPrenda: string) => {
    console.log('🔄 fetchConteosTelas - tipoPrenda:', tipoPrenda);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('tipo_prenda', tipoPrenda);

      const url = `http://localhost:8000/api/sap/consumo-textil/?${params.toString()}`;
      console.log('🔄 fetchConteosTelas - URL:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los conteos de telas');
      }
      const data = await response.json();
      console.log('🔄 fetchConteosTelas - Datos recibidos:', data.length, 'registros');
      console.log('🔄 fetchConteosTelas - Datos:', data);

      // Mapear los datos para que coincidan con la interfaz ConteoVarianteData
      const mappedData = data.map((item: ConteoVarianteBackendData) => ({
        cantidad_telas: item.cantidad_telas,
        numero_variante: item.numero_variante,
        descripcion_variante: item.descripcion_variante
      }));

      setConteosTelas(mappedData);
      setShowConteoCards(true);
    } catch (error) {
      console.error('❌ fetchConteosTelas - Error:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el click en una card de prenda
  const handlePrendaClick = (tipoPrenda: string) => {
    console.log('🔄 handlePrendaClick - tipoPrenda:', tipoPrenda);
    setSelectedPrenda(tipoPrenda);
    setShowTable(false);
    // Obtener conteos de telas y variantes para mostrar las cards intermedias
    fetchConteosTelas(tipoPrenda);
  };

  // Función para manejar el click en una card de conteos/variantes
  const handleConteoCardClick = (tipoPrenda: string, cantidadTelas: number, numeroVariante: string, descripcionVariante: string) => {
    console.log('🔄 handleConteoCardClick - tipoPrenda:', tipoPrenda);
    console.log('🔄 handleConteoCardClick - cantidadTelas:', cantidadTelas);
    console.log('🔄 handleConteoCardClick - numeroVariante:', numeroVariante);
    console.log('🔄 handleConteoCardClick - descripcionVariante:', descripcionVariante);
    setShowTable(true);
    setShowConteoCards(false);
    setRecordCount(0);
    // Obtener datos específicos filtrados por tipo_prenda, cantidad_telas y numero_variante
    fetchConsumoEspecifico(tipoPrenda, cantidadTelas, numeroVariante);
  };


  // Función para aplicar filtros en el frontend
  const applyFiltersToData = (data: ConsumoData[], filters: Filtros): ConsumoData[] => {
    if (!filters || Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      // Filtrar por uso_tela
      if (filters.uso_tela && item.uso_tela !== filters.uso_tela) {
        return false;
      }

      // Filtrar por base_textil
      if (filters.base_textil && item.base_textil !== filters.base_textil) {
        return false;
      }

      // Filtrar por caracteristica_color
      if (filters.caracteristica_color && item.caracteristica_color !== filters.caracteristica_color) {
        return false;
      }

      // Filtrar por ancho_util
      if (filters.ancho_util && item.ancho_util_metros !== parseFloat(filters.ancho_util)) {
        return false;
      }

      return true;
    });
  };




  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Referentes</h1>


      {error && <p className="text-red-500 mb-4">{error}</p>}


      {/* Sección de prendas */}
      <div className="mb-8">
        <div className="flex justify-end items-center mb-4">
          {/* Botón Volver a Referentes - posicionado al lado derecho sin título */}
          {(showTable || showConteoCards) && (
            <button
              onClick={() => {
                window.location.href = 'http://localhost:3000/modules/referentes';
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              ← Volver a Referentes
            </button>
          )}
        </div>

        {/* Contenedor para botones de edición - solo cuando sea necesario */}
        {(!showTable && !showConteoCards) && (
          <div className="flex justify-start items-center mb-4">
            {/* Botón Editar Portadas - visible solo en vista de prendas principales */}
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                showImageUpload
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {showImageUpload ? '❌ Terminar' : '✏️ Editar Portadas'}
            </button>
          </div>
        )}

        {/* Contenedor para botones de edición en variantes - solo cuando sea necesario */}
        {showConteoCards && !showTable && (
          <div className="flex justify-start items-center mb-4">
            {/* Botón Editar Imágenes - visible solo en vista de variantes */}
            <button
              onClick={() => setShowConteoImageUpload(!showConteoImageUpload)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                showConteoImageUpload
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {showConteoImageUpload ? '❌ Terminar' : '✏️ Editar Imágenes'}
            </button>
          </div>
        )}


        {!showTable && !showConteoCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {prendas.map((prenda) => {
              const imagenPrenda = getPrendaImage(prenda.tipo_prenda_nombre, prenda.cantidad_telas);
              const uploadKey = `PORTADA_${prenda.tipo_prenda_nombre}`;
              const isUploading = uploadingImages.has(uploadKey);

              return (
                <div
                  key={`${prenda.prenda_id}-${refreshKey}`}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                    showImageUpload ? 'border-2 border-blue-300' : ''
                  }`}
                  onClick={() => !showImageUpload && handlePrendaClick(prenda.tipo_prenda_nombre)}
                >
                  <div className="w-full h-48 bg-white rounded mb-4 flex items-center justify-center overflow-hidden shadow-inner border">
                    {imagenPrenda ? (
                      <img
                        src={`http://localhost:8000${imagenPrenda.image_url}`}
                        alt={prenda.tipo_prenda_nombre}
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-gray-500 text-sm">Imagen no disponible</span>';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">Sin imagen asignada</span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-4">{prenda.tipo_prenda_nombre}</h3>

                  {/* Input de archivo - solo visible cuando showImageUpload es true */}
                  {showImageUpload && (
                    <div className="space-y-3">
                      <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                        <strong>Se guardará como:</strong><br />
                        <code className="text-blue-600">PORTADA {prenda.tipo_prenda_nombre.toUpperCase()}</code>
                      </div>

                      <div className="relative">
                        <input
                          type="file"
                          accept=".png"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUploadForPrenda(prenda.tipo_prenda_nombre, file);
                              // Limpiar el input después de la subida
                              e.target.value = '';
                            }
                          }}
                          className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:cursor-pointer transition-all duration-200 ${
                            isUploading
                              ? 'file:bg-gray-400 file:text-white cursor-not-allowed'
                              : 'file:bg-blue-500 file:text-white hover:file:bg-blue-600'
                          }`}
                        />
                        {isUploading && (
                          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded flex items-center justify-center">
                            <span className="text-blue-600 text-sm font-medium">Procesando...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!showImageUpload && (
                    <p className="text-gray-600 text-sm">Haz clic para ver variantes disponibles</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : showConteoCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Cargando variantes...</p>
              </div>
            ) : (
              conteosTelas.map((conteos, index) => {
                const cantidadTelas = conteos.cantidad_telas;
                const descripcionVariante = conteos.descripcion_variante;
                const numeroVariante = conteos.numero_variante;
                const imagenEspecifica = getPrendaImage(selectedPrenda, cantidadTelas, numeroVariante);
                const uploadKey = `${selectedPrenda}_${cantidadTelas}_${numeroVariante}_VARIANTE`;
                const isUploading = uploadingImages.has(uploadKey);
                console.log(`Card de variante ${cantidadTelas} telas - variante: ${numeroVariante} - descripcion: ${descripcionVariante}`);
                return (
                  <div
                    key={`${index}-${refreshKey}`}
                    className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                      showConteoImageUpload ? 'border-2 border-blue-300' : ''
                    }`}
                    onClick={() => !showConteoImageUpload && !isUploading && handleConteoCardClick(selectedPrenda, cantidadTelas, numeroVariante, descripcionVariante)}
                  >
                    <div className="w-full h-48 bg-white rounded mb-4 flex items-center justify-center overflow-hidden shadow-inner border">
                      {imagenEspecifica ? (
                        <img
                          src={`http://localhost:8000${imagenEspecifica.image_url}`}
                          alt={`${cantidadTelas} Tela(s) - ${descripcionVariante}`}
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span class="text-gray-500 text-sm">Imagen no disponible</span>';
                            }
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Sin imagen asignada</span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{cantidadTelas} Tela{cantidadTelas > 1 ? 's' : ''}</h3>
                    <p className="text-sm text-gray-600 mb-2">Variante: {numeroVariante}</p>
                    <p className="text-sm text-gray-600 mb-4">{descripcionVariante}</p>

                    {/* Input de archivo - solo visible cuando showConteoImageUpload es true */}
                    {showConteoImageUpload && (
                      <div className="space-y-3">
                        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          <strong>Se guardará como:</strong><br />
                          <code className="text-blue-600">{selectedPrenda.toUpperCase()}_{cantidadTelas}_{numeroVariante}_VARIANTE</code>
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            accept=".png"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUploadForVariante(selectedPrenda, cantidadTelas, numeroVariante, file);
                                // Limpiar el input después de la subida
                                e.target.value = '';
                              }
                            }}
                            className={`w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:cursor-pointer transition-all duration-200 ${
                              isUploading
                                ? 'file:bg-gray-400 file:text-white cursor-not-allowed'
                                : 'file:bg-blue-500 file:text-white hover:file:bg-blue-600'
                            }`}
                          />
                          {isUploading && (
                            <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-medium">Procesando...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!showConteoImageUpload && (
                      <p className="text-gray-600 text-sm">Haz clic para ver detalles</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Consumo Textil - {selectedPrenda} ({conteosTelas[0]?.cantidad_telas || 0} telas - V{conteosTelas[0]?.numero_variante || ''})</h3>
            </div>

            {/* Filtros */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium">Filtros</h4>
                {recordCount > 0 && (
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                    {recordCount} registro{recordCount !== 1 ? 's' : ''} encontrado{recordCount !== 1 ? 's' : ''}
                  </span>
                )}
                <button
                  onClick={() => {
                    setShowTable(false);
                    setShowConteoCards(true);
                    // Restaurar datos originales cuando se vuelva a las variantes
                    setConsumoData(consumoDataOriginal);
                    setRecordCount(consumoDataOriginal.length);
                    setFiltros({});
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  ← Volver a Variantes
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uso en Prenda
                  </label>
                  <select
                    value={filtros.uso_tela || ''}
                    onChange={(e) => {
                      const newFiltros = { ...filtros, uso_tela: e.target.value };
                      setFiltros(newFiltros);
                      // Aplicar filtros automáticamente
                      if (consumoDataOriginal.length > 0) {
                        const filteredData = applyFiltersToData(consumoDataOriginal, newFiltros);
                        setConsumoData(filteredData);
                        setRecordCount(filteredData.length);
                      }
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos</option>
                    <option value="LUCIR">LUCIR</option>
                    <option value="FORRO">FORRO</option>
                    <option value="SESGO">SESGO</option>
                    <option value="FUSIONABLE">FUSIONABLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Textil
                  </label>
                  <select
                    value={filtros.base_textil || ''}
                    onChange={(e) => {
                      const newFiltros = { ...filtros, base_textil: e.target.value };
                      setFiltros(newFiltros);
                      // Aplicar filtros automáticamente
                      if (consumoDataOriginal.length > 0) {
                        const filteredData = applyFiltersToData(consumoDataOriginal, newFiltros);
                        setConsumoData(filteredData);
                        setRecordCount(filteredData.length);
                      }
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todas</option>
                    <option value="LYCRA VITA">LYCRA VITA</option>
                    <option value="LYCRA BAHIA">LYCRA BAHIA</option>
                    <option value="LYCRA CRINKLE">LYCRA CRINKLE</option>
                    <option value="LYCRA SUMATRA">LYCRA SUMATRA</option>
                    <option value="LYCRA SHIMMERING">LYCRA SHIMMERING</option>
                    <option value="FUSIONABLE">FUSIONABLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    value={filtros.caracteristica_color || ''}
                    onChange={(e) => {
                      const newFiltros = { ...filtros, caracteristica_color: e.target.value };
                      setFiltros(newFiltros);
                      // Aplicar filtros automáticamente
                      if (consumoDataOriginal.length > 0) {
                        const filteredData = applyFiltersToData(consumoDataOriginal, newFiltros);
                        setConsumoData(filteredData);
                        setRecordCount(filteredData.length);
                      }
                    }}
                    className="w-full p-2 border  rounded"
                  >
                    <option value="">Todos</option>
                    <option value="SOLIDO">SOLIDO</option>
                    <option value="MODIFICACION">MODIFICACION</option>
                    <option value="UBICACION">UBICACION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ancho Tela (metros)
                  </label>
                  <select
                    value={filtros.ancho_util || ''}
                    onChange={(e) => {
                      const newFiltros = { ...filtros, ancho_util: e.target.value };
                      setFiltros(newFiltros);
                      // Aplicar filtros automáticamente
                      if (consumoDataOriginal.length > 0) {
                        const filteredData = applyFiltersToData(consumoDataOriginal, newFiltros);
                        setConsumoData(filteredData);
                        setRecordCount(filteredData.length);
                      }
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos</option>
                    <option value="1.20">1.20</option>
                    <option value="1.46">1.46</option>
                    <option value="1.48">1.48</option>
                    <option value="1.50">1.50</option>
                    <option value="1.52">1.52</option>
                    <option value="1.54">1.54</option>
                    <option value="1.56">1.56</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    console.log('🔄 Limpiar Filtros - Restaurando datos originales');
                    setFiltros({});
                    // Restaurar datos originales
                    setConsumoData(consumoDataOriginal);
                    setRecordCount(consumoDataOriginal.length);
                    console.log('🔄 Limpiar Filtros - Datos restaurados:', consumoDataOriginal.length, 'registros');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>

            {/* Tabla de resultados */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Uso Tela</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Base Textil</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Característica Color</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Consumo (mtr)</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ancho Util (metros)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consumoData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.uso_tela}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.base_textil}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.caracteristica_color}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.consumo_mtr}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.ancho_util_metros}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {consumoData.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      {consumoDataOriginal.length === 0
                        ? "No se encontraron registros para esta variante."
                        : "No se encontraron registros con los filtros aplicados."
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
