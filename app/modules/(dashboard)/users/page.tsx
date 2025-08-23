
'use client';

import React, { useState } from 'react';
import DataTable from '@/app/globals/components/molecules/DataTable';
import ConnectionStatus, { CompactConnectionStatus } from '@/app/globals/components/molecules/ConnectionStatus';
import UserModal from '@/app/globals/components/molecules/UserModal';
import DeleteConfirmation from '@/app/globals/components/molecules/DeleteConfirmation';
import { useUserManagement } from '@/app/modules/hooks/useUserManagement';
import { Usuario, CreateUsuarioRequest, UpdateUsuarioRequest } from '@/app/modules/types';

export default function UsersPage() {
  const {
    users,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    isConnected,
    connectionStatus
  } = useUserManagement(true); // Enable real-time sync

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Error handling
  if (error) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Usuarios</h1>
          <p className="page-subtitle">Gestión de usuarios del sistema</p>
        </div>
        
        <div className="content-section">
          <div className="section-body">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="heading-4 mb-3">Error al Cargar Usuarios</h2>
              <p className="body-medium mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Intentar Nuevamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Usuarios</h1>
          <p className="page-subtitle">Cargando usuarios del sistema...</p>
        </div>
        <div className="content-section">
          <div className="section-body">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal handlers
  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: Usuario) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (user: Usuario) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleSaveUser = async (userData: CreateUsuarioRequest | UpdateUsuarioRequest) => {
    setActionLoading(true);
    try {
      if (modalMode === 'create') {
        await createUser(userData as CreateUsuarioRequest);
      } else {
        await updateUser(selectedUser!.ID_USUARIO.toString(), userData as UpdateUsuarioRequest);
      }
      setIsUserModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setActionLoading(true);
    try {
      await deleteUser(userToDelete.ID_USUARIO.toString());
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Transform data for DataTable
  const tableData = users
    .filter(user => user && user.ID_USUARIO != null) // Filter out invalid users
    .map((user) => ({
      id: user.ID_USUARIO.toString(),
      codigo: user.CODIGO_USUARIO || 'N/A',
      nombre: user.NOMBRE_COMPLETO || 'N/A',
      email: user.EMAIL || 'N/A',
      area: user.AREA || 'N/A',
      rol: user.ROL || 'N/A',
      estado: user.ESTADO || 'INACTIVO',
      fecha: user.FECHA_CREACION ? new Date(user.FECHA_CREACION).toLocaleDateString('es-CO') : 'N/A',
      _original: user // Keep original user data for actions
    }));

  const columns = [
    { key: 'codigo' as keyof typeof tableData[0], header: 'Código', sortable: true, filterable: true },
    { key: 'nombre' as keyof typeof tableData[0], header: 'Nombre Completo', sortable: true, filterable: true },
    { key: 'email' as keyof typeof tableData[0], header: 'Email', sortable: true, filterable: true },
    { key: 'area' as keyof typeof tableData[0], header: 'Área', sortable: true, filterable: true },
    { key: 'rol' as keyof typeof tableData[0], header: 'Rol', sortable: true, filterable: true },
    { 
      key: 'estado' as keyof typeof tableData[0], 
      header: 'Estado', 
      sortable: true, 
      filterable: true,
      render: (item: typeof tableData[0]) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.estado === 'ACTIVO' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.estado}
        </span>
      )
    },
    { key: 'fecha' as keyof typeof tableData[0], header: 'Fecha Creación', sortable: true },
    {
      key: 'actions' as keyof typeof tableData[0],
      header: 'Acciones',
      sortable: false,
      filterable: false,
      render: (item: typeof tableData[0]) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditUser(item._original)}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="Editar usuario"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteUser(item._original)}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
            title="Desactivar usuario"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Usuarios</h1>
            <p className="page-subtitle">Gestión de usuarios del sistema ({users.length} usuarios)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Usuario
            </button>
            <ConnectionStatus 
              isConnected={isConnected}
              connectionStatus={connectionStatus}
            />
          </div>
        </div>
      </div>
      
      <div className="content-section">
        <div className="section-body">
          <DataTable
            data={tableData}
            columns={columns}
            searchable={true}
            loading={isLoading}
            emptyMessage="No hay usuarios registrados en el sistema."
          />
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Desactivar Usuario"
        message={`¿Estás seguro de que deseas desactivar al usuario "${userToDelete?.NOMBRE_COMPLETO}"? El usuario cambiará a estado INACTIVO.`}
        confirmText="Desactivar"
        loading={actionLoading}
      />
    </div>
  );
}