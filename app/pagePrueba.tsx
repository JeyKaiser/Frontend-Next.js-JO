'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';

// Define interfaces for your data
interface Product {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    stock: number;
}

interface User {
    nombre: string;
    email: string;
    rol: string;
    departamento: string;
    estado: 'Activo' | 'Vacaciones'; // Enforce specific status values
}

interface TableData {
    headers: string[];
    rows: Product[] | User[]; // Rows can be either Product or User
}

interface SimulatedData {
    productos: TableData;
    usuarios: TableData;
}

// Simulated data as a constant
const simulatedData: SimulatedData = {
    productos: {
        headers: ['ID', 'Nombre', 'Categoría', 'Precio', 'Stock'],
        rows: [
            { id: 101, nombre: "Laptop Asus", categoria: "Tecnología", precio: 1200, stock: 15 },
            { id: 205, nombre: "Silla Ergonómica", categoria: "Mobiliario", precio: 450, stock: 8 },
            { id: 309, nombre: "Monitor 4K", categoria: "Tecnología", precio: 700, stock: 12 },
            { id: 412, nombre: "Mesa", categoria: "Mobiliario", precio: 320, stock: 5 },
            { id: 101, nombre: "Laptop X1", categoria: "Tecnología", precio: 1200, stock: 15 },
            { id: 205, nombre: "Silla Gamer", categoria: "Mobiliario", precio: 450, stock: 8 },
            { id: 309, nombre: "Monitor HD", categoria: "Tecnología", precio: 700, stock: 12 },
            { id: 412, nombre: "Mesa Oficina", categoria: "Mobiliario", precio: 320, stock: 5 }
        ],
    },
    usuarios: {
        headers: ['Nombre', 'Email', 'Rol', 'Departamento', 'Estado'],
        rows: [
            { nombre: "Ana Pérez", email: "ana@corp.com", rol: "Developer", departamento: "TI", estado: "Activo" },
            { nombre: "Carlos Ruiz", email: "carlos@corp.com", rol: "Designer", departamento: "UX", estado: "Vacaciones" },
            { nombre: "Laura Gómez", email: "laura@corp.com", rol: "Product Manager", departamento: "Marketing", estado: "Activo" }
        ],
    },
};

const DynamicTable: React.FC = () => {
    const [selectedReference, setSelectedReference] = useState<string>('');
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [tableRows, setTableRows] = useState<(Product | User)[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Function to simulate asynchronous data fetching
    const fetchData = (ref: string): Promise<TableData> => {
        return new Promise((resolve, reject) => {
            setIsLoading(true);
            setErrorMessage('');
            setTableHeaders([]);
            setTableRows([]);

            setTimeout(() => {
                setIsLoading(false);
                if (!simulatedData[ref as keyof SimulatedData]) {
                    reject(new Error('Referencia no encontrada'));
                } else {
                    resolve(simulatedData[ref as keyof SimulatedData]);
                }
            }, 800); // Simulate network delay
        });
    };

    // Handle change event for the select dropdown
    const handleReferenceChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const ref = event.target.value;
        setSelectedReference(ref);

        if (ref) {
            fetchData(ref)
                .then(data => {
                    setTableHeaders(data.headers);
                    setTableRows(data.rows);
                })
                .catch(err => {
                    setErrorMessage(err.message);
                });
        }
    };

    // Helper function to render table rows based on selected reference type
    const renderTableRows = () => {
        if (!tableRows.length && !isLoading && !errorMessage && selectedReference) {
            return (
                <tr>
                    <td colSpan={tableHeaders.length} style={{ textAlign: 'center', padding: '1rem' }}>
                        No hay datos disponibles para esta referencia.
                    </td>
                </tr>
            );
        }

        return tableRows.map((row, index) => (
            <tr key={index}>
                {selectedReference === 'productos' && (row as Product) && (
                    <>
                        <td>{(row as Product).id}</td>
                        <td>{(row as Product).nombre}</td>
                        <td>{(row as Product).categoria}</td>
                        <td>${(row as Product).precio.toFixed(2)}</td>
                        <td>{(row as Product).stock} unidades</td>
                    </>
                )}
                {selectedReference === 'usuarios' && (row as User) && (
                    <>
                        <td>{(row as User).nombre}</td>
                        <td><a href={`mailto:${(row as User).email}`}>{((row as User).email)}</a></td>
                        <td>{(row as User).rol}</td>
                        <td>{(row as User).departamento}</td>
                        <td>
                            <span className={`status-badge ${(row as User).estado.toLowerCase()}`}>
                                {(row as User).estado}
                            </span>
                        </td>
                    </>
                )}
            </tr>
        ));
    };

    return (
        <>
            <style jsx>{`
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 2rem;
                    background: #f9f9f9;
                    color: #222;
                }

                h1 {
                    text-align: center;
                    margin-bottom: 1rem;
                }

                label {
                    font-weight: 600;
                    margin-right: 0.5rem;
                }

                select {
                    padding: 0.4rem 0.6rem;
                    font-size: 1rem;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    margin-bottom: 1.5rem;
                }

                .table-container {
                    overflow-x: auto;
                    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
                    border-radius: 8px;
                    background: #fff;
                    padding: 1rem;
                    position: relative; /* Added for loading overlay positioning */
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 600px;
                }

                thead {
                    background-color: #323232;
                    color: #ddd0c8;
                }

                th,
                td {
                    padding: 0.75rem 1rem;
                    border: 1px solid #ddd;
                    text-align: left;
                }

                tbody tr:nth-child(even) {
                    background-color: #f5f0eb;
                }

                .status-badge {
                    padding: 0.2rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #fff;
                    display: inline-block;
                }

                .activo {
                    background-color: #5e503f;
                }

                .vacaciones {
                    background-color: #a86f4c;
                }

                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #5e503f;
                    border-radius: 8px;
                    /* display: none; Managed by isLoading state */
                }

                @media (max-width: 700px) {
                    table {
                        min-width: 100%;
                    }
                }
            `}</style>

            <h1>Ejemplo de Tabla Dinámica</h1>

            <label htmlFor="reference-select">Seleccione referencia:</label>
            <select
                id="reference-select"
                aria-label="Seleccionar referencia"
                value={selectedReference}
                onChange={handleReferenceChange}
            >
                <option value="" disabled>-- Elija una opción --</option>
                <option value="productos">Inventario de Productos</option>
                <option value="usuarios">Listado de Usuarios</option>
            </select>

            <div className="table-container">
                {isLoading && (
                    <div id="loading" className="loading-overlay">Cargando datos...</div>
                )}

                <table id="dynamic-table" aria-describedby="table-description" role="table">
                    <caption id="table-description" className="sr-only">Tabla dinámica con datos de la base</caption>
                    <thead>
                        <tr>
                            {tableHeaders.map((header, index) => (
                                <th key={index} scope="col">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderTableRows()}
                    </tbody>
                </table>

                {errorMessage && (
                    <div id="error-message" role="alert" style={{ color: '#a86f4c', marginTop: '1rem' }}>
                        {errorMessage}
                    </div>
                )}
            </div>
        </>
    );
};

export default DynamicTable;