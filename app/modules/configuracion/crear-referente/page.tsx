'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/app/globals/components/molecules/Breadcrumb';
import axios from 'axios'; // Usaremos axios para las peticiones

// Definimos un tipo para las opciones que vendrán de la API
interface DimensionOption {
  id: number; // El ID siempre será un número
  // El nombre puede venir en diferentes campos según la API, los definimos todos como opcionales
  nombre?: string;
  tipo_prenda_nombre?: string;
  cantidad_telas_numero?: number;
  uso_tela_nombre?: string;
  base_textil_nombre?: string;
  caracteristica_nombre?: string;
  ancho_util_metros?: number;
  detalle_descripcion?: string;
  categoria_terminacion?: string;
  numero_variante?: number;
}

// Estructura para guardar todas las opciones de los selects
interface AllOptions {
  prendas: DimensionOption[];
  cantidadesTelas: DimensionOption[];
  usosTela: DimensionOption[];
  basesTextiles: DimensionOption[];
  caracteristicasColor: DimensionOption[];
  anchosUtil: DimensionOption[];
  propiedadesTela: DimensionOption[];
  variantes: DimensionOption[];
  descripciones: DimensionOption[];
  terminaciones: DimensionOption[];
}

// Estructura para los datos del formulario
interface FormData {
  prenda_id: string;
  cantidad_telas_id: string;
  uso_tela_id: string;
  base_textil_id: string;
  caracteristica_color_id: string;
  ancho_util_id: string;
  propiedades_tela_id: string;
  consumo_mtr: number | string;
  variante_id: string;
  descripcion_id: string;
  terminacion_id: string;
}

// Definimos el estado inicial del formulario fuera del componente para poder reutilizarlo
const initialFormData: FormData = {
  prenda_id: '',
  cantidad_telas_id: '',
  uso_tela_id: '',
  base_textil_id: '',
  caracteristica_color_id: '',
  ancho_util_id: '',
  propiedades_tela_id: '',
  consumo_mtr: '',
  variante_id: '',
  descripcion_id: '',
  terminacion_id: '',
};

export default function CrearReferentePage() {
  // 1. Estado unificado para todas las opciones de los selects
  const [options, setOptions] = useState<AllOptions>({
    prendas: [],
    cantidadesTelas: [],
    usosTela: [],
    basesTextiles: [],
    caracteristicasColor: [],
    anchosUtil: [],
    propiedadesTela: [],
    variantes: [],
    descripciones: [],
    terminaciones: [],
  });

  // 2. Estado para manejar los datos del formulario
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Estado para manejar la carga de datos
  const [isLoading, setIsLoading] = useState(true);
  // Nuevo estado para manejar el estado de envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // useEffect para cargar los datos de las dimensiones cuando el componente se monta
  useEffect(() => {
    // 3. Función para cargar TODAS las opciones en paralelo
    async function fetchAllOptions() {
      setIsLoading(true);
      const endpoints = {
        prendas: 'http://localhost:8000/api/sap/dim_prenda/',
        cantidadesTelas: 'http://localhost:8000/api/sap/dim_cantidad_telas/',
        usosTela: 'http://localhost:8000/api/sap/dim_uso_tela/',
        basesTextiles: 'http://localhost:8000/api/sap/dim_base_textil/',
        caracteristicasColor: 'http://localhost:8000/api/sap/dim_caracteristica_color/',
        anchosUtil: 'http://localhost:8000/api/sap/dim_ancho_util/',
        propiedadesTela: 'http://localhost:8000/api/sap/dim_propiedades_tela/',
        variantes: 'http://localhost:8000/api/sap/dim_variante/',
        descripciones: 'http://localhost:8000/api/sap/dim_descripcion/',
        terminaciones: 'http://localhost:8000/api/sap/dim_terminacion/',
      };

      try {
        // Usamos Promise.all para hacer todas las peticiones a la vez
        const responses = await Promise.all(
          Object.values(endpoints).map((url) => axios.get(url))
        );

        // CAMBIO CLAVE: Accedemos a la propiedad 'results' de cada respuesta.
        // AÑADIMOS TOLERANCIA: Si 'results' no existe, usamos la data directamente.
        const newOptions: AllOptions = {
          prendas: responses[0].data.results || responses[0].data,
          cantidadesTelas: responses[1].data.results || responses[1].data,
          usosTela: responses[2].data.results || responses[2].data,
          basesTextiles: responses[3].data.results || responses[3].data,
          caracteristicasColor: responses[4].data.results || responses[4].data,
          anchosUtil: responses[5].data.results || responses[5].data,
          propiedadesTela: responses[6].data.results || responses[6].data,
          variantes: responses[7].data.results || responses[7].data,
          descripciones: responses[8].data.results || responses[8].data,
          terminaciones: responses[9].data.results || responses[9].data,
        };

        setOptions(newOptions);
      } catch (error) {
        console.error("Error al obtener las opciones para el formulario:", error);
        // Aquí podrías manejar el error, por ejemplo, mostrando una notificación
      } finally {
        // Marcamos que la carga ha terminado (incluso si falló)
        setIsLoading(false);
      }
    }

    // Llamamos a la función
    fetchAllOptions();
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  // 4. Función para manejar los cambios en cualquier campo del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Nueva función para limpiar el formulario
  const handleClearForm = () => {
    setFormData(initialFormData);
  };

  // 7. Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setIsSubmitting(true);
    setSubmitError(null);

    // --- INICIO DE LA VALIDACIÓN Y PREPARACIÓN DEL PAYLOAD ---
    const requiredFields: (keyof FormData)[] = [
      'prenda_id', 'cantidad_telas_id', 'uso_tela_id', 'base_textil_id',
      'caracteristica_color_id', 'ancho_util_id', 'propiedades_tela_id', 'consumo_mtr'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        const errorMessage = `El campo "${field.replace('_id', '')}" es requerido.`;
        setSubmitError(errorMessage);
        setIsSubmitting(false);
        alert(errorMessage);
        return; // Detener el envío
      }
    }

    try {
      // Solo si la validación pasa, preparamos el payload
      const payload = {
        prenda_id: parseInt(formData.prenda_id, 10),
        cantidad_telas_id: parseInt(formData.cantidad_telas_id, 10),
        uso_tela_id: parseInt(formData.uso_tela_id, 10),
        base_textil_id: parseInt(formData.base_textil_id, 10),
        caracteristica_color_id: parseInt(formData.caracteristica_color_id, 10),
        ancho_util_id: parseInt(formData.ancho_util_id, 10),
        propiedades_tela_id: parseInt(formData.propiedades_tela_id, 10),
        consumo_mtr: parseFloat(formData.consumo_mtr as string),
        // Campos opcionales: si hay un valor, lo convertimos a número, si no, lo dejamos como null
        variante_id: formData.variante_id ? parseInt(formData.variante_id, 10) : null,
        descripcion_id: formData.descripcion_id ? parseInt(formData.descripcion_id, 10) : null,
        terminacion_id: formData.terminacion_id ? parseInt(formData.terminacion_id, 10) : null,
      };

      const response = await axios.post(
        'http://localhost:8000/api/sap/fact_consumo/',
        payload
      );

      if (response.status === 201) {
        alert('¡Referente creado exitosamente!'); // Puedes reemplazar esto con una notificación más elegante
        handleClearForm(); // Limpiar el formulario después del éxito
      }
    } catch (error) {
      console.error('Error al crear el referente:', error);
      let errorMessage = 'Ocurrió un error inesperado.';
      if (axios.isAxiosError(error) && error.response) {
        // Extraemos el mensaje de error específico del backend
        errorMessage = error.response.data.error || JSON.stringify(error.response.data);
      }
      setSubmitError(errorMessage);
      alert(`Error: ${errorMessage}`); // Notificación de error
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define los items para las migas de pan (breadcrumb)
  const breadcrumbItems = [
    { label: 'Configuración' }, // No tiene href porque es la categoría padre
    { label: 'Crear Referente', current: true },
  ];

  // 5. Función reutilizable para renderizar un campo de selección (select)
  const renderSelectField = (
    name: keyof FormData,
    label: string,
    optionsList: DimensionOption[],
    displayField: keyof DimensionOption,
    required = true
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-secondary-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
          !formData[name] ? 'text-secondary-400' : 'text-secondary-900'
        }`}
        disabled={isLoading}
        required={required}
      >
        <option value="" disabled>
          {isLoading ? `Cargando ${label.toLowerCase()}...` : `Seleccione...`}
        </option>
        {!isLoading &&
          optionsList.map((option) => (
            <option key={option.id} value={option.id}>
              {/* Convertimos explícitamente el valor a string para asegurar consistencia */}
              {String(option[displayField] || option.nombre || `ID: ${option.id}`)}
            </option>
          ))}
      </select>
    </div>
  );

  // 6. Función reutilizable para renderizar un campo numérico
  const renderNumberField = (name: keyof FormData, label: string, required = true) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-secondary-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
        disabled={isLoading}
        required={required}
        step="0.01"
        min="0"
        placeholder="0.00"
      />
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Encabezado de la página */}
      <header className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-3xl font-bold text-secondary-900 mt-2">
          Crear Nuevo Referente de Consumo
        </h1>
        <p className="text-secondary-600 mt-1 max-w-2xl">
          Rellena los campos para registrar un nuevo consumo base. Estos datos se usarán como referente para futuros costeos.
        </p>
      </header>

      {/* Contenedor principal para el formulario */}
      <div className="bg-white p-6 rounded-xl shadow-soft border border-secondary-200">
        <h2 className="text-xl font-semibold text-secondary-800 border-b pb-4 mb-6">
          Detalles del Consumo
        </h2>
        
        {/* Contenido del formulario */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Todos los Selects */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            {renderSelectField('prenda_id', 'Tipo de Prenda', options.prendas, 'tipo_prenda_nombre')}
            {renderSelectField('cantidad_telas_id', 'Cantidad de Telas', options.cantidadesTelas, 'cantidad_telas_numero')}
            {renderSelectField('uso_tela_id', 'Uso de Tela', options.usosTela, 'uso_tela_nombre')}
            {renderSelectField('base_textil_id', 'Base Textil', options.basesTextiles, 'base_textil_nombre')}
            {renderSelectField('caracteristica_color_id', 'Característica de Color', options.caracteristicasColor, 'caracteristica_nombre')}
            {renderSelectField('ancho_util_id', 'Ancho Útil (metros)', options.anchosUtil, 'ancho_util_metros')}
            {renderSelectField('propiedades_tela_id', 'Propiedades de Tela', options.propiedadesTela, 'nombre')}
            {renderSelectField('variante_id', 'Variante', options.variantes, 'numero_variante', false)}
            {renderSelectField('descripcion_id', 'Descripción', options.descripciones, 'detalle_descripcion', false)}
            {renderSelectField('terminacion_id', 'Terminación', options.terminaciones, 'categoria_terminacion', false)}
          </div>

          {/* Columna Derecha: Input de Consumo y Botones */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex-grow">
              {renderNumberField('consumo_mtr', 'Consumo (metros)')}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-secondary-200">
              <button type="button" onClick={handleClearForm} className="w-full px-6 py-3 bg-secondary-100 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-200 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:ring-offset-2 transition-all" disabled={isLoading || isSubmitting}>
                Limpiar
              </button>
              <button type="submit" className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:bg-secondary-300" disabled={isLoading || isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Referente'}
              </button>
            </div>
            {/* Muestra el error de envío si existe */}
            {submitError && (
              <p className="text-red-600 text-sm mt-4 text-center lg:text-left">{submitError}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
