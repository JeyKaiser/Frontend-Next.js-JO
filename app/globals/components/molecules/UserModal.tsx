'use client';

import React, { useState, useEffect } from 'react';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '@/app/modules/types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: CreateUsuarioRequest | UpdateUsuarioRequest) => Promise<void>;
  user?: Usuario | null;
  mode: 'create' | 'edit';
}

export default function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState<CreateUsuarioRequest>({
    CODIGO_USUARIO: '',
    NOMBRE_COMPLETO: '',
    EMAIL: '',
    AREA: '',
    ROL: '',
    ESTADO: 'ACTIVO'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        CODIGO_USUARIO: user.CODIGO_USUARIO,
        NOMBRE_COMPLETO: user.NOMBRE_COMPLETO,
        EMAIL: user.EMAIL || '',
        AREA: user.AREA,
        ROL: user.ROL,
        ESTADO: user.ESTADO
      });
    } else {
      setFormData({
        CODIGO_USUARIO: '',
        NOMBRE_COMPLETO: '',
        EMAIL: '',
        AREA: '',
        ROL: '',
        ESTADO: 'ACTIVO'
      });
    }
    setErrors({});
  }, [mode, user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.CODIGO_USUARIO.trim()) {
      newErrors.CODIGO_USUARIO = 'El código de usuario es requerido';
    }

    if (!formData.NOMBRE_COMPLETO.trim()) {
      newErrors.NOMBRE_COMPLETO = 'El nombre completo es requerido';
    }

    if (!formData.AREA.trim()) {
      newErrors.AREA = 'El área es requerida';
    }

    if (!formData.ROL.trim()) {
      newErrors.ROL = 'El rol es requerido';
    }

    if (formData.EMAIL && !/\S+@\S+\.\S+/.test(formData.EMAIL)) {
      newErrors.EMAIL = 'El formato del email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Usuario *
              </label>
              <input
                type="text"
                name="CODIGO_USUARIO"
                value={formData.CODIGO_USUARIO}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.CODIGO_USUARIO ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese el código de usuario"
                disabled={loading}
              />
              {errors.CODIGO_USUARIO && (
                <p className="text-red-500 text-sm mt-1">{errors.CODIGO_USUARIO}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="NOMBRE_COMPLETO"
                value={formData.NOMBRE_COMPLETO}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.NOMBRE_COMPLETO ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ingrese el nombre completo"
                disabled={loading}
              />
              {errors.NOMBRE_COMPLETO && (
                <p className="text-red-500 text-sm mt-1">{errors.NOMBRE_COMPLETO}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="EMAIL"
                value={formData.EMAIL}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.EMAIL ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="usuario@empresa.com"
                disabled={loading}
              />
              {errors.EMAIL && (
                <p className="text-red-500 text-sm mt-1">{errors.EMAIL}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área *
              </label>
              <select
                name="AREA"
                value={formData.AREA}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.AREA ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Seleccione un área</option>
                <option value="DISEÑO">Diseño</option>
                <option value="DESARROLLO">Desarrollo</option>
                <option value="PRODUCCION">Producción</option>
                <option value="CALIDAD">Calidad</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="ADMINISTRATIVA">Administrativa</option>
              </select>
              {errors.AREA && (
                <p className="text-red-500 text-sm mt-1">{errors.AREA}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                name="ROL"
                value={formData.ROL}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ROL ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Seleccione un rol</option>
                <option value="ADMIN">Administrador</option>
                <option value="DISEÑADOR">Diseñador</option>
                <option value="DESARROLLADOR">Desarrollador</option>
                <option value="ANALISTA">Analista</option>
                <option value="USUARIO">Usuario</option>
              </select>
              {errors.ROL && (
                <p className="text-red-500 text-sm mt-1">{errors.ROL}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="ESTADO"
                value={formData.ESTADO}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}