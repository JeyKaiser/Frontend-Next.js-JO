import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CrearReferencia() {
    const [formData, setFormData] = useState({
        referencia: '',
        nombreSistema: '',
        codigoSapMD: 'MD',
        codigoSapPT: 'PT',
        codigoColor: '',
        creativo: '',
        tecnico: '',
        status: '',
        linea: '',
        sublinea: '',
        foto: null
    });
  
    const [miColorReferencia, setMiColorReferencia] = useState([]);
    const [miCreativo, setMiCreativo] = useState([]);
    const [miTecnico, setMiTecnico] = useState([]);
    const [miStatus, setMiStatus] = useState([]);
    const [miLinea, setMiLinea] = useState([]);
    const [sublineas, setSublineas] = useState([]);
    const [imgPreview, setImgPreview] = useState(null);
    const [codigoColorTexto, setCodigoColorTexto] = useState('');

    useEffect(() => {
        axios.get('/api/colores').then(res => setMiColorReferencia(res.data));
        axios.get('/api/creativos').then(res => setMiCreativo(res.data));
        axios.get('/api/tecnicos').then(res => setMiTecnico(res.data));
        axios.get('/api/status').then(res => setMiStatus(res.data));
        axios.get('/api/lineas').then(res => setMiLinea(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'foto') {
            const file = files[0];
            setFormData({ ...formData, foto: file });
            const reader = new FileReader();
            reader.onloadend = () => setImgPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, [name]: value });
            if (name === 'codigoColor') {
                const selected = miColorReferencia.find(c => c.id == value);
                setCodigoColorTexto(selected ? selected.codigoColor : '');
            }
        }
    };

    const handleLineaChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, linea: value, sublinea: '' });
        if (value) {
            axios.get(`/api/sublineas/${value}`).then(res => setSublineas(res.data));
        } else {
            setSublineas([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        for (const key in formData) {
            payload.append(key, formData[key]);
        }
        await axios.post('/api/referencias', payload);
        alert('Referencia creada exitosamente');
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crear Nueva Referencia</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block">FOTO REFERENCIA</label>
                        <input type="file" name="foto" accept="image/*" onChange={handleChange} className="block mb-2" />
                        {imgPreview && <img src={imgPreview} alt="Vista previa" className="max-w-full h-auto" />}
                    </div>

                    <div className="flex-1">
                        <div className="grid grid-cols-1 gap-2">
                            <input name="referencia" placeholder="REFERENCIA" required value={formData.referencia} onChange={handleChange} />
                            <input name="nombreSistema" placeholder="Nombre Sistema" required value={formData.nombreSistema} onChange={handleChange} />
                            <input name="codigoSapMD" placeholder="Código MD" value={formData.codigoSapMD} onChange={handleChange} />
                            <input name="codigoSapPT" placeholder="Código PT" value={formData.codigoSapPT} onChange={handleChange} />
                            <select name="codigoColor" onChange={handleChange} value={formData.codigoColor} required>
                                <option value="" hidden>Elegir una opción</option>
                                <option value="NULL">Ninguno</option>
                                {miColorReferencia.map(color => (
                                    <option key={color.id} value={color.id} data-codigo={color.codigoColor}>{color.descripcionColor}</option>
                                ))}
                            </select>
                            <label className="text-sm">{codigoColorTexto}</label>
                            <select name="creativo" onChange={handleChange} value={formData.creativo}>
                                <option value="" hidden>Elegir un Creativo</option>
                                {miCreativo.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombreCreativo}</option>
                                ))}
                                <option value="NULL">Ninguno</option>
                            </select>
                            <select name="tecnico" onChange={handleChange} value={formData.tecnico}>
                                <option value="" hidden>Elegir un Técnico</option>
                                {miTecnico.map(t => (
                                    <option key={t.id} value={t.id}>{t.nombreTecnico}</option>
                                ))}
                                <option value="NULL">Ninguno</option>
                            </select>
                            <select name="status" onChange={handleChange} value={formData.status}>
                                <option value="" hidden>Elegir un Estado</option>
                                {miStatus.map(s => (
                                    <option key={s.id} value={s.id}>{s.status}</option>
                                ))}
                                <option value="NULL">Ninguno</option>
                            </select>
                            <select name="linea" onChange={handleLineaChange} value={formData.linea}>
                                <option value="">Seleccione una línea</option>
                                {miLinea.map(linea => (
                                    <option key={linea.id} value={linea.id}>{linea.nombre_linea}</option>
                                ))}
                            </select>
                            <select name="sublinea" onChange={handleChange} value={formData.sublinea}>
                                <option value="">Seleccione una sublinea</option>
                                {sublineas.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.nombre_sublinea}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Crear Referencia</button>
                </div>
            </form>
        </div>
    );
}
