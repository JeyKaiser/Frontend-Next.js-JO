// pages/api/sublineas/[id].js

export default function handler(req, res) {
    const { id } = req.query;

    // Simulación de sublíneas para esa línea
    const sublineas = [
        { id: 1, nombre_sublinea: 'Sublinea 1' },
        { id: 2, nombre_sublinea: 'Sublinea 2' },
    ];

    res.status(200).json(sublineas);
}   
