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
  uso_en_prenda: string;
  base_textil: string;
  color: string;
  ancho_tela: number;
  propiedades: string;
  consumo: number;
}

interface Filtros {
  cantidad_telas?: string;
  uso_tela?: string;
  base_textil?: string;
  caracteristica_color?: string;
  ancho_util?: string;
}

interface ConteoTelas {
  conteo_telas_unicas: number;
}

export default function ReferentesPage() {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  // const [images, setImages] = useState<ImageData[]>([]); // Comentado - solo usamos availableImages
  const [error, setError] = useState<string | null>(null);

  // Estados para la funcionalidad de consumo textil
  const [consumoData, setConsumoData] = useState<ConsumoData[]>([]);
  const [conteosTelas, setConteosTelas] = useState<ConteoTelas[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({});
  const [showTable, setShowTable] = useState(false);
  const [showConteoCards, setShowConteoCards] = useState(false);
  const [selectedPrenda, setSelectedPrenda] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availableImages, setAvailableImages] = useState<ImageData[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [showImageUpload, setShowImageUpload] = useState(false); // Controla la visibilidad de los inputs de edición (punto 1)
  const [showConteoImageUpload, setShowConteoImageUpload] = useState(false); // Controla la visibilidad de los inputs de edición (punto 2)
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set()); // Controla qué imágenes se están subiendo
  const [refreshKey, setRefreshKey] = useState<number>(0); // Forzar actualización de las cards

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
      setAvailableImages(data); // Guardar en availableImages para las cards de conteo
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

  // Función para manejar la subida de imágenes para cantidad de telas
  const handleImageUploadForConteo = async (prendaNombre: string, cantidadTelas: number, file: File) => {
    const uploadKey = `${prendaNombre}_${cantidadTelas}_TELAS`;

    try {
      // Marcar como subiendo
      setUploadingImages(prev => new Set(prev).add(uploadKey));

      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', `${prendaNombre.toUpperCase()}_${cantidadTelas}_TELAS`);

      console.log('Subiendo imagen para conteo:', uploadKey);

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
      alert(`✅ Imagen subida exitosamente para ${prendaNombre} con ${cantidadTelas} tela${cantidadTelas > 1 ? 's' : ''}`);
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



  // Función para obtener conteos de telas por prenda
  const fetchConteosTelas = async (tipoPrenda?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tipoPrenda) {
        params.append('tipo_prenda', tipoPrenda);
      }

      const url = `http://localhost:8000/api/sap/consumo-textil/${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Error al obtener los conteos de telas');
      }
      const data = await response.json();
      setConteosTelas(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la imagen correcta para cada prenda
  const getPrendaImage = (prendaNombre: string, cantidadTelas?: number): ImageData | null => {
    console.log('=== getPrendaImage ===');
    console.log('prendaNombre:', prendaNombre);
    console.log('cantidadTelas:', cantidadTelas);
    console.log('availableImages count:', availableImages.length);
    console.log('refreshKey:', refreshKey);

    // Si hay cantidad de telas específica, buscar SOLO imagen específica para esa cantidad
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
      // Si no se encuentra imagen específica, NO buscar alternativas
      return null;
    }

    // Para prendas principales (sin cantidad de telas), buscar imagen de portada específica
    const imagenesEspecificas: { [key: string]: string } = {
      'BIKINI BOTTOM': 'PORTADA BIKINI BOTTOM',
      'BIKINI TOP': 'PORTADA BIKINI TOP',
      'ONEPIECE': 'PORTADA ONEPIECE'
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

  // Función para obtener datos de consumo textil
  const fetchConsumoData = async (tipoPrenda: string, filtrosAdicionales: Filtros = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('tipo_prenda', tipoPrenda);

      if (filtrosAdicionales.cantidad_telas) {
        params.append('cantidad_telas', filtrosAdicionales.cantidad_telas);
      }
      if (filtrosAdicionales.uso_tela) {
        params.append('uso_tela', filtrosAdicionales.uso_tela);
      }
      if (filtrosAdicionales.base_textil) {
        params.append('base_textil', filtrosAdicionales.base_textil);
      }
      if (filtrosAdicionales.caracteristica_color) {
        params.append('caracteristica_color', filtrosAdicionales.caracteristica_color);
      }
      if (filtrosAdicionales.ancho_util) {
        params.append('ancho_util', filtrosAdicionales.ancho_util);
      }

      const response = await fetch(`http://localhost:8000/api/sap/consumo-textil/?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos de consumo');
      }
      const data = await response.json();
      setConsumoData(data);
      setRecordCount(data.length);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el click en una card de prenda
  const handlePrendaClick = (tipoPrenda: string) => {
    setSelectedPrenda(tipoPrenda);
    setShowConteoCards(true);
    // Obtener conteos de telas para mostrar las cards de conteo
    fetchConteosTelas(tipoPrenda);
  };

  // Función para manejar el click en una card de conteo
  const handleConteoCardClick = (tipoPrenda: string, cantidadTelas?: number) => {
    setShowTable(true);
    setShowConteoCards(false);
    setRecordCount(0);
    // Si se especifica cantidadTelas, aplicarla como filtro inicial
    if (cantidadTelas) {
      setFiltros({ cantidad_telas: cantidadTelas.toString() });
      fetchConsumoData(tipoPrenda, { cantidad_telas: cantidadTelas.toString() });
    } else {
      fetchConsumoData(tipoPrenda);
    }
  };

  // Función para volver a la vista de cards de prendas
  const handleBackToPrendas = () => {
    setShowTable(false);
    setShowConteoCards(false);
    setSelectedPrenda('');
    setConsumoData([]);
    setFiltros({});
  };

  // Función para volver a la vista de cards de conteo
  const handleBackToConteo = () => {
    setShowTable(false);
    setShowConteoCards(true);
    setConsumoData([]);
    setFiltros({});
    setRecordCount(0);
  };

  // Función para aplicar filtros
  const handleApplyFilters = () => {
    setRecordCount(0);
    if (selectedPrenda) {
      fetchConsumoData(selectedPrenda, filtros);
    }
  };

  // Función para limpiar filtros
  const handleClearFilters = () => {
    setFiltros({});
    setRecordCount(0);
    if (selectedPrenda) {
      fetchConsumoData(selectedPrenda);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Referentes</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}


      {/* Sección de prendas */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {showConteoCards ? `Telas para ${selectedPrenda}${showConteoImageUpload ? ' - Editando Imágenes' : ''}` : 'Prendas'}
          </h2>
          <div className="flex gap-2">
            {/* Botón Editar Portadas - visible solo en vista de prendas principales */}
            {!showTable && !showConteoCards && (
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
            )}

            {/* Botón Editar Imágenes - visible solo en vista de conteo de telas */}
            {!showTable && showConteoCards && (
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
            )}

            {(showTable || showConteoCards) && (
              <button
                onClick={showTable ? handleBackToConteo : handleBackToPrendas}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                ← Volver
              </button>
            )}
          </div>
        </div>


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
                  <p className="text-gray-600 text-sm">Haz clic para ver telas disponibles</p>
                )}
              </div>
            );
          })}
          </div>
        ) : showConteoCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">Cargando telas...</p>
              </div>
            ) : (
              Array.from({ length: conteosTelas.length }, (_, index) => {
                const cantidadTelas = conteosTelas[index].conteo_telas_unicas;
                const imagenEspecifica = getPrendaImage(selectedPrenda, cantidadTelas);
                const uploadKey = `${selectedPrenda}_${cantidadTelas}_TELAS`;
                const isUploading = uploadingImages.has(uploadKey);
                console.log(`Card de conteo ${cantidadTelas} telas - imagen encontrada:`, imagenEspecifica ? 'SÍ' : 'NO');
                return (
                  <div
                    key={`${index}-${refreshKey}`}
                    className={`bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                      showConteoImageUpload ? 'border-2 border-blue-300' : ''
                    }`}
                    onClick={() => !showConteoImageUpload && handleConteoCardClick(selectedPrenda, cantidadTelas)}
                  >
                    <div className="w-full h-48 bg-white rounded mb-4 flex items-center justify-center overflow-hidden shadow-inner border">
                      {imagenEspecifica ? (
                        <img
                          src={`http://localhost:8000${imagenEspecifica.image_url}`}
                          alt={`${cantidadTelas} Tela(s)`}
                          className="w-full h-full object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<span class="text-gray-500 text-sm">Sin imagen asignada</span>';
                            }
                          }}
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Sin imagen asignada</span>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold mb-4">{cantidadTelas} Tela{cantidadTelas > 1 ? 's' : ''}</h3>

                    {/* Input de archivo - solo visible cuando showConteoImageUpload es true */}
                    {showConteoImageUpload && (
                      <div className="space-y-3">
                        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          <strong>Se guardará como:</strong><br />
                          <code className="text-blue-600">{selectedPrenda.toUpperCase()}_{cantidadTelas}_TELAS</code>
                        </div>

                        <div className="relative">
                          <input
                            type="file"
                            accept=".png"
                            disabled={isUploading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUploadForConteo(selectedPrenda, cantidadTelas, file);
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Consumo Textil - {selectedPrenda}</h3>
                {recordCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {recordCount} registro{recordCount !== 1 ? 's' : ''} encontrado{recordCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={handleBackToConteo}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                ← Volver a Telas
              </button>
            </div>

            {/* Filtros */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium mb-3">Filtros</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uso en Prenda
                  </label>
                  <select
                    value={filtros.uso_tela || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, uso_tela: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todos</option>
                    <option value="LUCIR">LUCIR</option>
                    <option value="FORRO">FORRO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Textil
                  </label>
                  <select
                    value={filtros.base_textil || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, base_textil: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Todas</option>
                    <option value="LYCRA VITA">LYCRA VITA</option>
                    <option value="LYCRA BAHIA">LYCRA BAHIA</option>
                    <option value="LYCRA CRINALE">LYCRA CRINALE</option>
                    <option value="LYCRA BAHIA FORRO">LYCRA BAHIA FORRO</option>
                    <option value="FUSIONABLE">FUSIONABLE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    value={filtros.caracteristica_color || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, caracteristica_color: e.target.value }))}
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
                    onChange={(e) => setFiltros(prev => ({ ...prev, ancho_util: e.target.value }))}
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
                  onClick={handleApplyFilters}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Aplicar Filtros
                </button>
                <button
                  onClick={handleClearFilters}
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
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Uso en Prenda</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Base Textil</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ancho Tela</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Propiedades</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Consumo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consumoData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.uso_en_prenda}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.base_textil}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.color}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.ancho_tela}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.propiedades}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.consumo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {consumoData.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No se encontraron registros con los filtros aplicados.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sección de imágenes comentada - funcionalidad no requerida por ahora */}
      {/* <div>
        <h2 className="text-2xl font-semibold mb-4">Imágenes Subidas</h2>
        {images.length === 0 ? (
          <p className="text-gray-500">No hay imágenes subidas aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md p-4">
                <img
                  src={`http://localhost:8000${image.image_url}`}
                  alt={image.title || `Imagen ${image.id}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="text-sm font-medium">{image.title || `Imagen ${image.id}`}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(image.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}
