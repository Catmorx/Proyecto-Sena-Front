import { Nav } from '../components/Nav.jsx'
import { FormSelect } from '../components/FormSelect.jsx'
import { Header } from '../components/Header.jsx'
import { FormInput } from '../components/FormInput.jsx'
import { API_URL } from '../../config/config.jsx'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export const Customer = () => {
    const { id } = useParams(); // <-- Para capturar el id si quieres editar
    const isCreating = id === "news";
    const isEditing = id && id !== "news";
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    async function onSubmit(e) {
        e.preventDefault()
        // console.log('ids', [id, id === "news", isCreating])
        const uri = isCreating ? `${API_URL}/api/entity` : `${API_URL}/api/entity/${id}`
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
        navigate("/customer")
    }

    const [activities, setActivities] = useState([]);
    const [payments, setPayments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        entityType: 1,
        firstName: '',
        foreigner: 0,
        lastName: '',
        numberIdentification: '',
        phone: '',
        typeIdentification: '',
        verificationDigit: '',
        economyActivityId: '',
        paymentId: ''
    });
    
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch(`${API_URL}/api/economyActivity`);
                const data = await res.json();
                setActivities(data);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };
        const fetchPaymentMethods = async () => {
            try {
                const res = await fetch(`${API_URL}/api/paymentMethod`);
                const data = await res.json();
                setPayments(data);
            } catch (error) {
                console.error("Error fetching payment methods:", error);
            }
        };
        const fetchCustomers = async () => {
            const res = await fetch(`${API_URL}/api/entity?entityType=1`);
            const data = await res.json();
            setCustomers(data);
        };

        const fetchCustomerById = async (id) => {
            let data = {}
            if (id !== 'news') {
                const res = await fetch(`${API_URL}/api/entity/${id}`);
                data = await res.json();
                // console.log('id', data)
            }

            setFormData({
                companyName: data?.[0]?.company_name || '',
                email: data?.[0]?.email || '',
                entityType: data?.[0]?.entity_type || 1,
                firstName: data?.[0]?.first_name || '',
                foreigner: data?.[0]?.foreigner || 0,
                lastName: data?.[0]?.last_name || '',
                numberIdentification: data?.[0]?.number_identification || '',
                phone: data?.[0]?.phone || '',
                typeIdentification: data?.[0]?.type_identification || '',
                verificationDigit: data?.[0]?.verification_digit || '',
                economyActivityId: data?.[0]?.economy_activity_id_economy || '',
                paymentId: data?.[0]?.payment_method_id_payment || '',
            });
        };

        if (!id) {
            fetchCustomers();

        }
        if (isEditing) {
            fetchCustomerById(id);
        }
        if (isCreating) {
            setFormData({
                companyName: '',
                email: '',
                entityType: 1,
                firstName: '',
                foreigner: 0,
                lastName: '',
                numberIdentification: '',
                phone: '',
                typeIdentification: '',
                verificationDigit: '',
                economyActivityId: '',
                paymentId: ''
            });
            
        }

        fetchPaymentMethods();
        fetchActivities();
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
                    <h1>Agregar Nuevo Cliente</h1>
                    <Link to="/customer/news" >Crear Cliente</Link>
                    <Link to="/customer">Lista</Link>
                </div>
                {!id && (
                    <div>
                        {/* Aquí muestras la lista de clientes */}
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Razón Social</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id_entity}>
                                        <td data-label="Nombre">{customer.first_name} {customer.last_name}</td>
                                        <td data-label="Razón Social">{customer.company_name}</td>
                                        <td data-label="Email">{customer.email}</td>
                                        <td data-label="Acciones">
                                            <button className="submit-btn" onClick={() => {
                                                navigate(`/customer/${customer.id_entity}`)
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
                        <FormInput label="Nombres" id="nombres" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                        <FormInput label="Apellidos" id="apellidos" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                        <FormSelect
                            label="Tipo de Pago"
                            id="type-payment"
                            name="type-payment"
                            value={formData.paymentId}
                            onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                            options={payments.map((payment) => ({
                                value: payment.id_payment,
                                label: payment.payment_method
                            }))}
                            
                        />
                        <FormInput label="Razón Social" id="reason" name="reason" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />

                        <FormInput label="Email" type="email" id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />

                        <FormInput label="Teléfono" type="tel" id="telefono" name="telefono" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                        <FormSelect
                            label="Tipo de Identificación"
                            id="tipo-id"
                            name="tipo-id"
                            value={formData.typeIdentification}
                            onChange={(e) => setFormData({ ...formData, typeIdentification: e.target.value })}
                            options={[
                                { value: "Cédula de Ciudadanía", label: "Cédula de Ciudadanía" },
                                { value: "Cédula de Extranjería", label: "Cédula de Extranjería" },
                                { value: "NIT", label: "NIT" },
                            ]}
                            required
                        />

                        <FormInput label="Número de Identificación" id="numero-id" name="numero-id" value={formData.numberIdentification} onChange={(e) => setFormData({ ...formData, numberIdentification: e.target.value })} required />

                        <FormInput label="Digito de Verificación" id="verif" name="verif" value={formData.verificationDigit} onChange={(e) => setFormData({ ...formData, verificationDigit: e.target.value })} />

                        <FormInput label="Extranjero" type="checkbox" id="foreigner" name="foreigner" checked={formData.foreigner === 1} onChange={(e) => setFormData({ ...formData, foreigner: e.target.checked ? 1 : 0 })} />
                        <FormSelect
                            label="Actividad Economica"
                            id="economy-activity"
                            name="economy-activity"
                            value={formData.economyActivityId}
                            onChange={(e) => setFormData({ ...formData, economyActivityId: e.target.value })}
                            options={activities.map((activity) => ({
                                value: activity.id_economy,
                                label: activity.activity_name
                            }))}
                            
                        />
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Guardar</button>
                            <button type="button" className="cancel-btn" onClick={() => navigate("/customer")}>Cancelar</button> 
                        </div>
                    </form>
                )}
            </main>
        </>
    )
}