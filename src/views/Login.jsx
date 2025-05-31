import { Header } from '../components/Header.jsx';
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config/config.jsx'
import { FormInput } from '../components/FormInput.jsx'
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export const Login = () => {
    const navigate = useNavigate();
    const { token, setCookies } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    async function onSubmit(e) {
        e.preventDefault()
        const uri = `${API_URL}/api/login`
        const method = "POST"
        // console.log('formData', formData)
        const res = await fetch(uri, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(formData)

        })
        const { message, token } = await res.json();

        if (message === "Bienvenido") {
            setCookies("token", token, { path: "/", maxAge: 1 * 24 * 60 * 60 })
            navigate("/")
        } else {
            setErrorMessage(message); // 👈 Aquí se guarda el mensaje de error
        }
    }
    const [formData, setFormData] = useState({
        email: '',
        password: '',

    });
    useEffect(() => {
        (() => {
            if (token) {
                navigate("/");
            }
        })();
    });
    return (
        <>
            <Header />

            <main className="cuerpo">
                <form onSubmit={onSubmit}>
                    <h2>Inicio de sesion</h2 >
                    <div className="form-group">
                        <FormInput style={{ marginBottom: '10px' }} label="Correo Electronico" id="email" type='email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                        <FormInput label="Contraseña" type='password' id="password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                        {errorMessage && <p style={{ color: 'red', fontSize: '0.9em' }} className="error-message">{errorMessage}</p>}

                        <button style={{ marginTop: '10px' }} className="submit-btn" type="submit">Acceder</button>
                    </div>
                </form>
                {/* <a className="a" href="#">Olvidaste tu Contraseña?</a>
                <a className="a" href="#">Registrarse</a> */}
            </main>
        </>
    )
}