import { Nav } from '../components/Nav.jsx'
import { Header } from '../components/Header.jsx'
import { FormSelect } from '../components/FormSelect.jsx'
import { FormInput } from '../components/FormInput.jsx'
import { API_URL } from '../../config/config.jsx'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export const Employee = () => {
    const { id } = useParams(); // <-- Para capturar el id si quieres editar
    const isCreating = id === "news";
    const isEditing = id && id !== "news";
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
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
        navigate("/employee")
    }
    const [healthEntities, setHealthEntities] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        entityType: 0,
        firstName: '',
        foreigner: 0,
        lastName: '',
        numberIdentification: '',
        phone: '',
        typeIdentification: '',
        verificationDigit: '',
        healthId: '',
        bloodId: ''
    });

    useEffect(() => {
        const fetchHealthEntities = async () => {
            try {
                const res = await fetch(`${API_URL}/api/healthEntity`);
                const data = await res.json();
                setHealthEntities(data);
            } catch (error) {
                console.error("Error fetching HealthEntities:", error);
            }
        };
        const fetchBloodTypes = async () => {
            try {
                const res = await fetch(`${API_URL}/api/bloodType`);
                const data = await res.json();
                setBloodTypes(data);
            } catch (error) {
                console.error("Error fetching bloodTypes:", error);
            }
        };
        const fetchEmployees = async () => {
            const res = await fetch(`${API_URL}/api/entity?entityType=0`);
            const data = await res.json();
            setEmployees(data);
        };

        const fetchEmployeeById = async (id) => {
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
                healthId: data?.[0]?.health_entity_id_health || '',
                bloodId: data?.[0]?.blood_type_id_blood || '',
            });
        };

        if (!id) {
            fetchEmployees();

        }
        if (isEditing) {
            fetchEmployeeById(id);
        }
        if (isCreating) {
            setFormData({
                companyName: '',
                email: '',
                entityType: 0,
                firstName: '',
                foreigner: 0,
                lastName: '',
                numberIdentification: '',
                phone: '',
                typeIdentification: '',
                verificationDigit: '',
                healthId: '',
                bloodId: ''
            });

        }

        fetchBloodTypes();
        fetchHealthEntities();
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
                    <h1>Agregar Nuevo Empleado</h1>
                    <Link to="/employee/news" >Crear Empleado</Link>
                    <Link to="/employee">Lista</Link>
                </div>
                {!id && (
                    <div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>EPS</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.id_entity}>
                                        <td data-label="Nombre">{employee.first_name} {employee.last_name}</td>
                                        <td data-label="EPS">{employee.health_entity_id_health}</td>
                                        <td data-label="Email">{employee.email}</td>
                                        <td data-label="Acciones">
                                            <button className="submit-btn" onClick={() => {
                                                navigate(`/employee/${employee.id_entity}`)
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
                        <FormSelect
                            label="EPS"
                            id="eps"
                            name="eps"
                            value={formData.healthId}
                            onChange={(e) => setFormData({ ...formData, healthId: e.target.value })}
                            options={healthEntities.map((activity) => ({
                                value: activity.id_health,
                                label: activity.health_name
                            }))}
                            required
                        />
                        <FormSelect
                            label="Tipo de Sangre"
                            id="blood_type"
                            name="blood_type"
                            value={formData.bloodId}
                            onChange={(e) => setFormData({ ...formData, bloodId: e.target.value })}
                            options={bloodTypes.map((activity) => ({
                                value: activity.id_blood,
                                label: activity.blood_name
                            }))}
                            required
                        />

                        <FormInput label="Extranjero" type="checkbox" id="foreigner" name="foreigner" checked={formData.foreigner === 1} onChange={(e) => setFormData({ ...formData, foreigner: e.target.checked ? 1 : 0 })} />

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Guardar</button>
                            <button type="button" className="cancel-btn" onClick={() => navigate("/employee")}>Cancelar</button>
                        </div>
                    </form>
                )}
            </main>
        </>
    )
}