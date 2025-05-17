import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from '../../config/config.jsx';
import { Nav } from '../components/Nav.jsx';
import { Header } from '../components/Header.jsx';
import { FormInput } from '../components/FormInput.jsx';
import { AuthContext } from "../../context/AuthContext.jsx";

export const Card = () => {
    const { id } = useParams(); // "news" o ID numérico
    const isCreating = id === "news";
    const isEditing = id && id !== "news";
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    const [cards, setCards] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        composition: '',
        madeYarn: '',
        typeFabric: '',
        printedFabric: 0,
        // date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
    });

    const fetchCardById = async (id) => {
        const res = await fetch(`${API_URL}/api/technicalData/${id}`);
        
        const data = await res.json();
        const card = data?.[0] || {};
        setFormData({
            name: card.name || '',
            description: card.description || '',
            composition: card.composition || '',
            madeYarn: card.made_yarn || '',
            typeFabric: card.type_fabric || '',
            printedFabric: card.printed_fabric || 0,
            // date: card.created_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        });
    };

    const fetchCards = async () => {
        const res = await fetch(`${API_URL}/api/technicalData`);
        const data = await res.json();
        setCards(data);
    };

    useEffect(() => {
        if (isEditing) fetchCardById(id);
        if (!id) fetchCards();
        if (isCreating) {
            setFormData({
                name: '',
                description: '',
                composition: '',
                madeYarn: '',
                typeFabric: '',
                printedFabric: 0,
                date: new Date().toISOString().split('T')[0],
            });
        }
    }, [id]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const uri = isCreating
            ? `${API_URL}/api/technicalData`
            : `${API_URL}/api/technicalData/${id}`;
        
        const method = isCreating ? "POST" : "PUT";
        // console.log('formdata', formData)
        const res = await fetch(uri, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        await res.json();
        // console.log('saved', result);
        navigate("/card");
    };

    useEffect(() => {
        (() => {
            if (!token) {
                navigate("/login");
            }
        })();
    });

    return (
        <>
            <Nav logout={logout} />
            <main>
                <Header />
                <div className="record-title">
                    <h1>Ficha Técnica</h1>
                    <Link to="/card/news">Crear Ficha Técnica</Link>
                    <Link to="/card">Lista</Link>
                </div>

                {!id && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo de Tela</th>
                                <th>Hilo</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map(card => (
                                <tr key={card.id_technical_data}>
                                    <td data-label="Nombre">{card.name}</td>
                                    <td data-label="Tipo de Tela">{card.type_fabric}</td>
                                    <td data-label="Hilo">{card.made_yarn}</td>
                                    <td data-label="Fecha">{card.created_date?.split('T')[0]}</td>
                                    <td data-label="Acciones">
                                        <button className="submit-btn" onClick={() => navigate(`/card/${card.id_technical_data}`)}>Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {(isCreating || isEditing) && (
                    <form onSubmit={onSubmit} className="formulario">
                        <FormInput label="Nombre" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <FormInput label="Descripción" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        <FormInput label="Composición" id="composition" value={formData.composition} onChange={(e) => setFormData({ ...formData, composition: e.target.value })} />
                        <FormInput label="Hecho con hilo" id="made_yarn" value={formData.madeYarn} onChange={(e) => setFormData({ ...formData, madeYarn: e.target.value })} />
                        <FormInput label="Tipo de Tela" id="type_fabric" value={formData.typeFabric} onChange={(e) => setFormData({ ...formData, typeFabric: e.target.value })} />
                        <FormInput label="Tela Estampada" type="checkbox" id="printed_fabric" name="printed_fabric" checked={formData.printedFabric === 1} onChange={(e) => setFormData({ ...formData, printedFabric: e.target.checked ? 1 : 0 })} />
                        <FormInput label="Fecha" type="date" id="date" value={formData.date} disabled />

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Guardar</button>
                            <button type="button" className="cancel-btn" onClick={() => navigate("/card")}>Cancelar</button>
                        </div>
                    </form>
                )}
            </main>
        </>
    );
};
