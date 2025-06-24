// components/FormReferencia.js
import { useState, useEffect } from 'react';
import styles from '@/styles/createStyle.module.css';

export default function FormReferencia() {
    const [previewSrc, setPreviewSrc] = useState('');
    const [sublineas, setSublineas] = useState([]);
    const [lineaId, setLineaId] = useState('');
    const [codigoColor, setCodigoColor] = useState('');

    // Simulaciones de datos que antes recibías desde Django
    const miColorReferencia = []; // Reemplazar con fetch o props
    const miCreativo = [];
    const miTecnico = [];
    const miStatus = [];
    const miLinea = [];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLineaChange = async (e) => {
        const id = e.target.value;
        setLineaId(id);
        if (id) {
            const response = await fetch(`/api/sublineas/${id}`);
            const data = await response.json();
            setSublineas(data);
        } else {
            setSublineas([]);
        }
    };

    const handleColorChange = (e) => {
        const selectedOption = e.target.selectedOptions[0];
        setCodigoColor(selectedOption.dataset.codigo || '');
    };

    return (
        <form method="POST" encType="multipart/form-data">
            {/* Aquí puedes agregar un csrf token si lo necesitas desde el backend */}
            <div className={styles.contenedor}>
                <div className={styles.imageContainer}>
                    <label>FOTO REFERENCIA</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {previewSrc && (
                        <img
                            src={previewSrc}
                            alt="Vista previa"
                            className={styles.imagePreview}
                        />
                    )}
                </div>

                <div className={styles.formContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label>REFERENCIA:</label></td>
                                <td><input name="referencia" type="text" required /></td>
                            </tr>
                            <tr>
                                <td><label>Nombre Sistema:</label></td>
                                <td><input name="nombreSistema" type="text" required /></td>
                            </tr>
                            <tr>
                                <td><label>Código MD:</label></td>
                                <td><input name="codigoSapMD" type="text" defaultValue="MD" /></td>
                            </tr>
                            <tr>
                                <td><label>Código PT:</label></td>
                                <td><input name="codigoSapPT" type="text" defaultValue="PT" /></td>
                            </tr>
                            <tr>
                                <td><label>Código Color:</label></td>
                                <td>
                                    <select name="codigoColor" onChange={handleColorChange}>
                                        <option value="">Elegir una opción</option>
                                        <option value="NULL">Ninguno</option>
                                        {miColorReferencia.map((color) => (
                                            <option key={color.id} value={color.id} data-codigo={color.codigoColor}>
                                                {color.descripcionColor}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <label>{codigoColor}</label>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Creativo:</label></td>
                                <td>
                                    <select name="creativo">
                                        <option value="">Elegir un Creativo</option>
                                        {miCreativo.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombreCreativo}</option>
                                        ))}
                                        <option value="NULL">Ninguno</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Técnico:</label></td>
                                <td>
                                    <select name="tecnico">
                                        <option value="">Elegir un Técnico</option>
                                        {miTecnico.map((t) => (
                                            <option key={t.id} value={t.id}>{t.nombreTecnico}</option>
                                        ))}
                                        <option value="NULL">Ninguno</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Status:</label></td>
                                <td>
                                    <select name="status">
                                        <option value="">Elegir un Estado</option>
                                        {miStatus.map((s) => (
                                            <option key={s.id} value={s.id}>{s.status}</option>
                                        ))}
                                        <option value="NULL">Ninguno</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><label>Línea:</label></td>
                                <td>
                                    <select name="linea" value={lineaId} onChange={handleLineaChange}>
                                        <option value="">Seleccione una línea</option>
                                        {miLinea.map((l) => (
                                            <option key={l.id} value={l.id}>{l.nombre_linea}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select name="sublinea">
                                        <option value="">Seleccione una sublinea</option>
                                        {sublineas.map((s) => (
                                            <option key={s.id} value={s.id}>{s.nombre_sublinea}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button type="submit">Crear Referencia</button>
            </div>
        </form>
    );
}
