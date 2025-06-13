import { Nav } from '../components/Nav.jsx'
import { Header } from '../components/Header.jsx'
import { FormSelect } from '../components/FormSelect.jsx'
import { FormInput } from '../components/FormInput.jsx'
import { API_URL } from '../../config/config.jsx'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export const Item = () => {
    const { id } = useParams(); // <-- Para capturar el id si quieres editar
    const isCreating = id === "news";
    const isEditing = id && id !== "news";
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    async function onSubmit(e) {
        e.preventDefault()
        // console.log('ids', [id, id === "news", isCreating])
        const uri = isCreating ? `${API_URL}/api/item` : `${API_URL}/api/item/${id}`
        const method = isCreating ? "POST" : "PUT"
        const dataToSend = { ...formData }; // Haces una copia nueva
        // console.log('dataToSend', dataToSend);

        const res = await fetch(uri, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(dataToSend)

        })

        await res.json()
        // console.log('ok', ok)
        navigate("/item")
    }
    const [technicalDatas, setTechnicalDatas] = useState([]);
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        upc: '',
        description: '',
        comercialName: '',
        technicalDataId: '',
        cost: '',
        rate: '',
        foreigner: 0,
    });

    useEffect(() => {
        const fetchTechnicalDatas = async () => {
            try {
                const res = await fetch(`${API_URL}/api/technicalData`);
                const data = await res.json();
                setTechnicalDatas(data);
            } catch (error) {
                console.error("Error fetching TechnicalData:", error);
            }
        };

        const fetchItems = async () => {
            const res = await fetch(`${API_URL}/api/item`);
            const data = await res.json();
            setItems(data);
        };

        const fetchItemById = async (id) => {
            let data = {}
            if (id !== 'news') {
                const res = await fetch(`${API_URL}/api/item/${id}`);
                data = await res.json();
                // console.log('id', data)
            }

            setFormData({
                upc: data?.[0]?.code_upc || '',
                description: data?.[0]?.description || '',
                comercialName: data?.[0]?.comercial_name || '',
                technicalDataId: data?.[0]?.technical_data_id_technical_data || '',
                cost: data?.[0]?.cost || 0,
                rate: data?.[0]?.rate || 0,
                foreigner: data?.[0]?.foreinger || 0,
            });
        };

        if (!id) {
            fetchItems();

        }
        if (isEditing) {
            fetchItemById(id);
        }
        if (isCreating) {
            setFormData({
                upc: '',
                description: '',
                comercialName: '',
                technicalDataId: '',
                cost: '',
                rate: '',
                foreigner: 0,
            });

        }

        fetchTechnicalDatas();
    }, [id]);

    useEffect(() => {
        (() => {
            if (!token) {
                navigate("/login");
            }
        })();
    });

    const [errors, setErrors] = useState({ firstName: '' });
    const validate = {
        upc: { max: 45 },
        comercialName: { max: 45 },
        description: { max: 45 },
        cost: { max: 45 },
        rate: { max: 45 },
    };
    useEffect(() => {
        const newErrors = {};

        for (const field in validate) {
            const rule = validate[field];
            const value = formData[field] || '';

            if (value.length > rule.max) {
                newErrors[field] = `Máximo ${rule.max} caracteres.`;
            }
        }

        setErrors(newErrors);
    }, [formData]);

    return (
        <>
            <Nav logout={logout} />
            <main>
                <Header />
                {!id && (<>
                     <div className="record-title">
                        <h1>Listado de Artículos</h1>
                        <button className="submit-btn" onClick={() => navigate('/item/news')}>Crear Artículo</button>
                    </div>
                    <div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>UPC</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id_item}>
                                        <td data-label="UPC">{item.code_upc}</td>
                                        <td data-label="Nombre">{item.comercial_name}</td>
                                        <td data-label="Descripción">{item.description}</td>
                                        <td data-label="Acciones">
                                            <button className="submit-btn" onClick={() => {
                                                navigate(`/item/${item.id_item}`)
                                            }}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
                )}
                {(isCreating || isEditing) && (<>
                    <div className="record-title">
                        {isEditing && <>
                            <h1>Editar Artículo</h1>
                            <button className="submit-btn" onClick={() => navigate('/item/news')}>Crear Artículo</button></>
                        }
                        {isCreating && <h1>Agregar Nueva Artículo</h1>}
                        <button className="submit-btn" onClick={() => navigate('/item')}>Lista</button>
                    </div>
                    <form onSubmit={onSubmit} className="formulario">
                        <FormInput label="Código UPC" id="upc" value={formData.upc} onChange={(e) => setFormData({ ...formData, upc: e.target.value })} required errorMessage={errors.upc} />

                        <FormInput label="Nombre Comercial" id="comercial-name" value={formData.comercialName} onChange={(e) => setFormData({ ...formData, comercialName: e.target.value })} required errorMessage={errors.comercialName} />

                        <FormInput label="Descripción" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required errorMessage={errors.description} />

                        <FormSelect
                            label="Ficha Técnica"
                            id="technical-data"
                            name="technical-data"
                            value={formData.technicalDataId}
                            onChange={(e) => setFormData({ ...formData, technicalDataId: e.target.value })}
                            options={technicalDatas.map((technicalData) => ({
                                value: technicalData.id_technical_data,
                                label: technicalData.name
                            }))}
                            required
                        />

                        <FormInput label="Costo de Materia Prima" type='number' id="cost" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} required errorMessage={errors.cost} />

                        <FormInput label="Tarifa para Venta" type='number' id="rate" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} required errorMessage={errors.rate} />

                        <FormInput label="Extranjero" type="checkbox" id="foreigner" name="foreigner" checked={formData.foreigner === 1} onChange={(e) => setFormData({ ...formData, foreigner: e.target.checked ? 1 : 0 })} />

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Agregar</button>
                            <button type="submit" className="cancel-btn">Cancelar</button>
                        </div>
                    </form>
                </>
                )}
            </main>
        </>

    )
}