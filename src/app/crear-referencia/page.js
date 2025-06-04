// src/app/crear-referencia/page.js

'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CrearReferencia() {
    const [formData, setFormData] = useState({
        referencia: '',
        nombre_sistema: '',
        codigo_sap_md: 'MD',
        codigo_sap_pt: 'PT',
        codigo_color: '',
        creativo: '',
        tecnico: '',
        status: '',
        linea: '',
        sublinea: '',
        foto: null,
    });

    const [sublineas, setSublineas] = useState([]);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, foto: file }));

        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        if (file) reader.readAsDataURL(file);
    };

    const handleLineaChange = async (e) => {
        const lineaId = e.target.value;
        setFormData((prev) => ({ ...prev, linea: lineaId }));

        if (lineaId) {
            try {
                const response = await axios.get(`/api/obtener_sublineas/${lineaId}/`);
                setSublineas(response.data);
            } catch (error) {
                console.error('Error al obtener sublineas', error);
                setSublineas([]);
            }
        } else {
            setSublineas([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (let key in formData) {
            data.append(key, formData[key]);
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/crear-referencia/', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Referencia creada con éxito');
        } catch (error) {
            console.error('Error al enviar formulario', error);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crear Nueva Referencia</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">FOTO REFERENCIA</label>
                    <input type="file" name="foto" accept="image/*" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Vista previa" className="mt-2 max-w-xs" />}
                </div>
                <div>
                    <label>REFERENCIA</label>
                    <input name="referencia" value={formData.referencia} onChange={handleChange} required className="block w-full border px-2 py-1" />
                </div>
                <div>
                    <label>Nombre Sistema</label>
                    <input name="nombre_sistema" value={formData.nombre_sistema} onChange={handleChange} required className="block w-full border px-2 py-1" />
                </div>
                <div>
                    <label>Código MD</label>
                    <input name="codigo_sap_md" value={formData.codigo_sap_md} onChange={handleChange} className="block w-full border px-2 py-1" />
                </div>
                <div>
                    <label>Código PT</label>
                    <input name="codigo_sap_pt" value={formData.codigo_sap_pt} onChange={handleChange} className="block w-full border px-2 py-1" />
                </div>
                <div>
                    <label>Código Color</label>
                    <select name="codigo_color" value={formData.codigo_color} onChange={handleChange} className="block w-full border px-2 py-1">
                        <option value="">Elegir una opción</option>
                        <option value="NULL">Ninguno</option>
                        {/* Agrega aquí tus opciones desde tu API si quieres hacerlas dinámicas */}
                        <option value="1">Rojo</option>
                        <option value="2">Azul</option>
                    </select>
                </div>
                <div>
                    <label>Creativo</label>
                    <select name="creativo" value={formData.creativo} onChange={handleChange} className="block w-full border px-2 py-1">
                        <option value="">Elegir un creativo</option>
                        <option value="NULL">Ninguno</option>
                        <option value="1">Juan</option>
                        <option value="2">Ana</option>
                    </select>
                </div>
                <div>
                    <label>Técnico</label>
                    <select name="tecnico" value={formData.tecnico} onChange={handleChange} className="block w-full border px-2 py-1">
                        <option value="">Elegir un técnico</option>
                        <option value="NULL">Ninguno</option>
                        <option value="1">Pedro</option>
                        <option value="2">Laura</option>
                    </select>
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="block w-full border px-2 py-1">
                        <option value="">Elegir un estado</option>
                        <option value="NULL">Ninguno</option>
                        <option value="1">En proceso</option>
                        <option value="2">Finalizado</option>
                    </select>
                </div>
                <div>
                    <label>Línea</label>
                    <select name="linea" value={formData.linea} onChange={handleLineaChange} className="block w-full border px-2 py-1">
                        <option value="">Elegir línea</option>
                        <option value="1">Línea A</option>
                        <option value="2">Línea B</option>
                    </select>
                </div>
                <div>
                    <label>Sublinea</label>
                    <select name="sublinea" value={formData.sublinea} onChange={handleChange} className="block w-full border px-2 py-1">
                        <option value="">Elegir sublinea</option>
                        {sublineas.map((s) => (
                            <option key={s.id} value={s.id}>{s.nombre_sublinea}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Crear Referencia</button>
            </form>
        </div>
    );
}
