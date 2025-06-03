// pages/crear-coleccion.js
import { useState } from 'react';
import axios from 'axios';

export default function CrearColeccion() {
  const [form, setForm] = useState({
    referencia: '',
    nombreSistema: '',
    codigoSapMD: '',
    codigoSapPT: '',
    descripcionColor: '',
    codigoColor: '',
    tallaje: '',
    largo: '',
    modista: '',
  });

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/colecciones/', form);
      console.log('Colección creada:', response.data);
    } catch (error) {
      console.error('Error al crear la colección:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="referencia" onChange={handleChange} placeholder="Referencia" />
      <input name="nombreSistema" onChange={handleChange} placeholder="Nombre del sistema" />
      {/* Otros campos */}
      <button type="submit">Crear colección</button>
    </form>
  );
}
