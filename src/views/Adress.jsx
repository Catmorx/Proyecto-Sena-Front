import { Nav } from '../components/Nav.jsx'
import { FormSelect } from '../components/FormSelect.jsx'
import { Header } from '../components/Header.jsx'
import { FormInput } from '../components/FormInput.jsx'
import { API_URL } from '../../config/config.jsx'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export const Adress = () => {
    const { id } = useParams();
    const isCreating = id === "news";
    const isEditing = id && id !== "news";
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    async function onSubmit(e) {
        e.preventDefault()
        console.log('ids', [id, id === "news", isCreating])
        const uri = isCreating ? `${API_URL}/api/adress` : `${API_URL}/api/adress/${id}`
        const method = isCreating ? "POST" : "PUT"
        const dataToSend = { ...formData }; // Haces una copia nueva
        console.log('dataToSend', dataToSend);

        const res = await fetch(uri, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(dataToSend)

        })

        const ok = await res.json()
        console.log('ok', ok)
        navigate("/adress")
    }
    const [entities, setEntities] = useState([]);
    // const [payments, setPayments] = useState([]);
    const [adress, setAdress] = useState([]);
    const [formData, setFormData] = useState({
        adressDr1: '',
        adressDr2: '',
        country: '',
        town: '',
        zip: '',
        memoAdress: '',
        entityId: '',
    });
    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const res = await fetch(`${API_URL}/api/entity`);
                const data = await res.json();
                setEntities(data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };
        // const fetchPaymentMethods = async () => {
        //     try {
        //         const res = await fetch(`${API_URL}/api/paymentMethod`);
        //         const data = await res.json();
        //         setPayments(data);
        //     } catch (error) {
        //         console.error("Error fetching payment methods:", error);
        //     }
        // };
        const fetchAdress = async () => {
            const res = await fetch(`${API_URL}/api/adress`);
            const data = await res.json();
            setAdress(data);
        };

        const fetchCustomerById = async (id) => {
            let data = {}
            if (id !== 'news') {
                const res = await fetch(`${API_URL}/api/adress/${id}`);
                data = await res.json();
                console.log('id', data)
            }

            setFormData({
                adressDr1: data?.[0]?.adress_dr1,
                adressDr2: data?.[0]?.adress_dr2,
                country: data?.[0]?.country,
                town: data?.[0]?.town,
                zip: data?.[0]?.zip,
                memoAdress: data?.[0]?.memo_adress,
                entityId: data?.[0]?.entity_id_entity,
            });
        };

        if (!id) {
            fetchAdress();

        }
        if (isEditing) {
            fetchCustomerById(id);
        }
        if (isCreating) {
            setFormData({
                adressDr1: '',
                adressDr2: '',
                country: '',
                town: '',
                zip: '',
                memoAdress: '',
                entityId: '',
            });

        }
        fetchEntities();
    }, [id]);

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
                    <h1>Agregar Nueva Dirección</h1>
                    <Link to="/adress/news" >Crear Dirección</Link>
                    <Link to="/adress">Lista</Link>
                </div>
                {!id && (
                    <div>
                        {/* Aquí muestras la lista de clientes */}
                        <table>
                            <thead>
                                <tr>
                                    <th>Entidad</th>
                                    <th>Dirección</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adress.map((adress) => (
                                    <tr key={adress.id_adress}>
                                        <td>{adress.entity_id_entity}</td>
                                        <td>{adress.adress_dr1} {adress.country}</td>
                                        <td>
                                            <button className="submit-btn" onClick={() => {
                                                navigate(`/adress/${adress.id_adress}`)
                                            }}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {(isCreating || isEditing) && (
                    <form onSubmit={onSubmit} className="formulario">
                        <FormInput label="Dirección" id="adress" value={formData.adressDr1} onChange={(e) => setFormData({ ...formData, adressDr1: e.target.value })} required />
                        <FormInput label="Pais" id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required />
                        <FormInput label="Cuidad" id="town" name="town" value={formData.town} onChange={(e) => setFormData({ ...formData, town: e.target.value })} />

                        <FormInput label="Nota" id="memo" name="memo" value={formData.memoAdress} onChange={(e) => setFormData({ ...formData, memoAdress: e.target.value })} required />
                        <FormInput label="Zip" id="zip" name="zip" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} required />
                        <FormSelect
                            label="Entidad"
                            id="entity"
                            name="entity"
                            value={formData.entityId}
                            onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                            options={entities.map((entity) => ({
                                value: entity.id_entity,
                                label: entity.company_name,
                            }))}
                            required
                        />
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Guardar</button>
                            <button type="button" className="cancel-btn" onClick={() => navigate("/adress")}>Cancelar</button>
                        </div>
                    </form>
                )}
            </main>
        </>
    )
}