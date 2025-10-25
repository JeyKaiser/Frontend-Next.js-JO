'use client';

import { useState, useEffect } from 'react';
import Modal from '../atoms/Modal';
import Button from '../atoms/Button';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const BACKEND_URL = `${backendUrl}/api/colecciones/`;

interface DimensionOption {
  id: number;
  nombre: string;
}

interface FormData {
  prenda_id: number;
  cantidad_telas_id: number;
  uso_tela_id: number;
  base_textil_id: number;
  caracteristica_color_id: number;
  ancho_util_id: number;
  propiedades_tela_id: number;
  consumo_mtr: number;
  variante_id?: number;
  descripcion_id?: number;
  terminacion_id?: number;
}

interface ModalFormularioReferenteProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
}

export default function ModalFormularioReferente({ isOpen, onClose, onSave }: ModalFormularioReferenteProps) {
  const [formData, setFormData] = useState<FormData>({
    prenda_id: 0,
    cantidad_telas_id: 0,
    uso_tela_id: 0,
    base_textil_id: 0,
    caracteristica_color_id: 0,
    ancho_util_id: 0,
    propiedades_tela_id: 0,
    consumo_mtr: 0,
  });

  const [options, setOptions] = useState<{
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
  }>({
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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Cargar opciones de dimensiones
  useEffect(() => {
    const fetchOptions = async () => {
      if (!isOpen) return;

      setLoading(true);
      try {
        const endpoints = [
          { key: 'prendas', url: `${BACKEND_URL}/sap/dim_prenda/` },
          { key: 'cantidadesTelas', url: `${BACKEND_URL}/sap/dim_cantidad_telas/` },
          { key: 'usosTela', url: `${BACKEND_URL}/sap/dim_uso_tela/` },
          { key: 'basesTextiles', url: `${BACKEND_URL}/sap/dim_base_textil/` },
          { key: 'caracteristicasColor', url: `${BACKEND_URL}/sap/dim_caracteristica_color/` },
          { key: 'anchosUtil', url: `${BACKEND_URL}/sap/dim_ancho_util/` },
          { key: 'propiedadesTela', url: `${BACKEND_URL}/sap/dim_propiedades_tela/` },
          { key: 'variantes', url: `${BACKEND_URL}/sap/dim_variante/` },
          { key: 'descripciones', url: `${BACKEND_URL}/sap/dim_descripcion/` },
          { key: 'terminaciones', url: `${BACKEND_URL}/sap/dim_terminacion/` },
        ];

        const promises = endpoints.map(async ({ key, url }) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              return { key, data };
            }
          } catch (error) {
            console.error(`Error fetching ${key}:`, error);
          }
          return { key, data: [] };
        });

        const results = await Promise.all(promises);

        const newOptions: any = {};
        results.forEach(({ key, data }) => {
          newOptions[key] = data.map((item: any) => ({
            id: item.id || item.prenda_id || item.cantidad_telas_id || item.uso_tela_id ||
                item.base_textil_id || item.caracteristica_color_id || item.ancho_util_id ||
                item.propiedades_tela_id || item.variante_id || item.descripcion_id || item.terminacion_id,
            nombre: item.nombre || item.tipo_prenda_nombre || item.cantidad_telas_numero?.toString() ||
                   item.uso_tela_nombre || item.base_textil_nombre || item.caracteristica_nombre ||
                   item.ancho_util_metros?.toString() || item.categoria_terminacion ||
                   `Propiedad ${item.propiedades_tela_id}` || `Variante ${item.numero_variante}` ||
                   item.detalle_descripcion || 'Sin nombre'
          }));
        });

        setOptions(newOptions);
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [isOpen]);

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        prenda_id: 0,
        cantidad_telas_id: 0,
        uso_tela_id: 0,
        base_textil_id: 0,
        caracteristica_color_id: 0,
        ancho_util_id: 0,
        propiedades_tela_id: 0,
        consumo_mtr: 0,
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.prenda_id) newErrors.prenda_id = 'Debe seleccionar una prenda';
    if (!formData.cantidad_telas_id) newErrors.cantidad_telas_id = 'Debe seleccionar cantidad de telas';
    if (!formData.uso_tela_id) newErrors.uso_tela_id = 'Debe seleccionar uso de tela';
    if (!formData.base_textil_id) newErrors.base_textil_id = 'Debe seleccionar base textil';
    if (!formData.caracteristica_color_id) newErrors.caracteristica_color_id = 'Debe seleccionar característica de color';
    if (!formData.ancho_util_id) newErrors.ancho_util_id = 'Debe seleccionar ancho útil';
    if (!formData.propiedades_tela_id) newErrors.propiedades_tela_id = 'Debe seleccionar propiedades de tela';
    if (!formData.consumo_mtr || formData.consumo_mtr <= 0) newErrors.consumo_mtr = 'Debe ingresar consumo en metros mayor a 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving referente:', error);
      setErrors({ general: 'Error al guardar el referente. Intente nuevamente.' });
    } finally {
      setSaving(false);
    }
  };

  const renderSelectField = (
    label: string,
    field: keyof FormData,
    optionsList: DimensionOption[],
    required: boolean = true
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={formData[field] as number || ''}
        onChange={(e) => handleInputChange(field, parseInt(e.target.value) || 0)}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        disabled={loading}
      >
        <option value="">{required ? `Seleccionar ${label}` : `Seleccionar ${label} (opcional)`}</option>
        {optionsList.map((option) => (
          <option key={option.id} value={option.id}>
            {option.nombre}
          </option>
        ))}
      </select>
      {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
    </div>
  );

  const renderNumberField = (label: string, field: keyof FormData, required: boolean = true) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        step="0.01"
        min="0"
        value={formData[field] as number || ''}
        onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || 0)}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          errors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={`Ingrese ${label.toLowerCase()}`}
        disabled={loading}
      />
      {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Referente">
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando opciones...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelectField('Prenda', 'prenda_id', options.prendas)}
              {renderSelectField('Cantidad de Telas', 'cantidad_telas_id', options.cantidadesTelas)}
              {renderSelectField('Uso de Tela', 'uso_tela_id', options.usosTela)}
              {renderSelectField('Base Textil', 'base_textil_id', options.basesTextiles)}
              {renderSelectField('Característica de Color', 'caracteristica_color_id', options.caracteristicasColor)}
              {renderSelectField('Ancho Útil', 'ancho_util_id', options.anchosUtil)}
              {renderSelectField('Propiedades de Tela', 'propiedades_tela_id', options.propiedadesTela)}
              {renderNumberField('Consumo (mtr)', 'consumo_mtr')}
              {renderSelectField('Variante', 'variante_id', options.variantes, false)}
              {renderSelectField('Descripción', 'descripcion_id', options.descripciones, false)}
              {renderSelectField('Terminación', 'terminacion_id', options.terminaciones, false)}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
        <Button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600"
          disabled={saving}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={saving || loading}
        >
          {saving ? 'Guardando...' : 'Guardar Referente'}
        </Button>
      </div>
    </Modal>
  );
}