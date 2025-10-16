import React, { useState, useEffect } from 'react';

interface ParametroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  codigo: string;
  baseTextilId: string;
  telaId: string;
  printId: string;
  hiloTelaId: string;
  hiloMoldeId: string;
  canalTelaId: string;
  sentidoSesgosId: string;
  rotacionMoldeId: string;
  restriccionesId: string;
}

interface SelectOption {
  ID: string;
  DESCRIPCION?: string;
  NOMBRE?: string;
}

const ParametroModal: React.FC<ParametroModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    baseTextilId: '',
    telaId: '',
    printId: '',
    hiloTelaId: '',
    hiloMoldeId: '',
    canalTelaId: '',
    sentidoSesgosId: '',
    rotacionMoldeId: '',
    restriccionesId: ''
  });

  const [options, setOptions] = useState<{
    baseTextil: SelectOption[];
    tela: SelectOption[];
    print: SelectOption[];
    hiloTela: SelectOption[];
    hiloMolde: SelectOption[];
    canalTela: SelectOption[];
    sentidoSesgos: SelectOption[];
    rotacionMolde: SelectOption[];
    restriccionesTela: SelectOption[];
  }>({
    baseTextil: [],
    tela: [],
    print: [],
    hiloTela: [],
    hiloMolde: [],
    canalTela: [],
    sentidoSesgos: [],
    rotacionMolde: [],
    restriccionesTela: []
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las opciones al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadAllOptions();
    }
  }, [isOpen]);

  const loadAllOptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoints = [
        { key: 'baseTextil', url: '/api/sap/base_textil/' },
        { key: 'tela', url: '/api/sap/tela/' },
        { key: 'print', url: '/api/sap/print/' },
        { key: 'hiloTela', url: '/api/sap/hilo_tela/' },
        { key: 'hiloMolde', url: '/api/sap/hilo_molde/' },
        { key: 'canalTela', url: '/api/sap/canal_tela/' },
        { key: 'sentidoSesgos', url: '/api/sap/sentido_sesgos/' },
        { key: 'rotacionMolde', url: '/api/sap/rotacion_molde/' },
        { key: 'restriccionesTela', url: '/api/sap/restricciones_tela/' }
      ];

      const promises = endpoints.map(endpoint => 
        fetch(endpoint.url).then(res => res.json())
      );
      
      const responses = await Promise.all(promises);
      
      const newOptions = {
        baseTextil: [],
        tela: [],
        print: [],
        hiloTela: [],
        hiloMolde: [],
        canalTela: [],
        sentidoSesgos: [],
        rotacionMolde: [],
        restriccionesTela: []
      };

      endpoints.forEach((endpoint, index) => {
        newOptions[endpoint.key as keyof typeof newOptions] = responses[index];
      });
      
      setOptions(newOptions);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando opciones:', error);
      setError('Error al cargar las opciones para los campos.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const requiredFields = [
      'codigo', 'baseTextilId', 'telaId', 'printId', 'hiloTelaId', 
      'hiloMoldeId', 'canalTelaId', 'sentidoSesgosId', 'rotacionMoldeId', 'restriccionesId'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        setError(`El campo ${field} es requerido`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        CODIGO: formData.codigo,
        BASE_TEXTIL_ID: parseInt(formData.baseTextilId),
        TELA_ID: parseInt(formData.telaId),
        PRINT_ID: parseInt(formData.printId),
        HILO_DE_TELA_ID: parseInt(formData.hiloTelaId),
        HILO_DE_MOLDE_ID: parseInt(formData.hiloMoldeId),
        CANAL_TELA_ID: parseInt(formData.canalTelaId),
        SENTIDO_SESGOS_ID: parseInt(formData.sentidoSesgosId),
        ROTACION_MOLDE_ID: parseInt(formData.rotacionMoldeId),
        RESTRICCIONES_ID: parseInt(formData.restriccionesId)
      };

      const response = await fetch('/api/sap/parametros/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ocurrió un error en el servidor.');
      }
      
      alert('Parámetro creado exitosamente!');
      onSuccess?.();
      onClose();
      
      // Resetear formulario
      setFormData({
        codigo: '',
        baseTextilId: '',
        telaId: '',
        printId: '',
        hiloTelaId: '',
        hiloMoldeId: '',
        canalTelaId: '',
        sentidoSesgosId: '',
        rotacionMoldeId: '',
        restriccionesId: ''
      });
      
    } catch (err: unknown) {
      console.error('Error creando parámetro:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Crear Nuevo Parámetro</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        {loading ? (
          <div className="loading">Cargando opciones...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Código *</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                required
                placeholder="Ejemplo: 001"
              />
            </div>

            <div className="form-group">
              <label>Base Textil *</label>
              <select
                value={formData.baseTextilId}
                onChange={(e) => setFormData({...formData, baseTextilId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.baseTextil) && options.baseTextil.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tela *</label>
              <select
                value={formData.telaId}
                onChange={(e) => setFormData({...formData, telaId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.tela) && options.tela.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Print *</label>
              <select
                value={formData.printId}
                onChange={(e) => setFormData({...formData, printId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.print) && options.print.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hilo de Tela *</label>
              <select
                value={formData.hiloTelaId}
                onChange={(e) => setFormData({...formData, hiloTelaId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.hiloTela) && options.hiloTela.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Hilo de Molde *</label>
              <select
                value={formData.hiloMoldeId}
                onChange={(e) => setFormData({...formData, hiloMoldeId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.hiloMolde) && options.hiloMolde.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Canal Tela *</label>
              <select
                value={formData.canalTelaId}
                onChange={(e) => setFormData({...formData, canalTelaId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.canalTela) && options.canalTela.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Sentido Sesgos *</label>
              <select
                value={formData.sentidoSesgosId}
                onChange={(e) => setFormData({...formData, sentidoSesgosId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.sentidoSesgos) && options.sentidoSesgos.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Rotación Molde *</label>
              <select
                value={formData.rotacionMoldeId}
                onChange={(e) => setFormData({...formData, rotacionMoldeId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.rotacionMolde) && options.rotacionMolde.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Restricciones *</label>
              <select
                value={formData.restriccionesId}
                onChange={(e) => setFormData({...formData, restriccionesId: e.target.value})}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(options.restriccionesTela) && options.restriccionesTela.map(item => (
                  <option key={item.ID} value={item.ID}>
                    {item.DESCRIPCION || item.NOMBRE || `ID: ${item.ID}`}
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="error-message">Error: {error}</div>}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Crear Parámetro'}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 0;
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
        }

        .form-group {
          margin: 15px 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-actions {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }

        .loading {
          padding: 40px;
          text-align: center;
          color: #666;
        }

        .error-message {
          margin: 15px 20px;
          padding: 10px;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ParametroModal;
