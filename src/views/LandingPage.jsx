import { Nav } from '../components/Nav.jsx'
import employee from '../assets/img/employee.svg'
import salesorder from '../assets/img/salesorder.svg'
import customer from '../assets/img/customer.svg'
import card from '../assets/img/card.svg'
import itemsIcon from '../assets/img/items.svg'
import { Header } from '../components/Header.jsx';
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config/config.jsx'
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

export const LandingPage = () => {
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    const handleRedirect = (id) => {
        const urls = {
            bttn1: '/orders',
            bttn2: '/employee',
            bttn3: '/customer',
            bttn4: '/card',
            bttn5: '/item'
        };
        const url = urls[id];
        if (url) {
            navigate(url); // ✅ Usa navegación interna
        } else {
            console.error("No se encontró la ruta para el botón con ID:", id);
        }
    };
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    console.log('items', items)
    console.log('orders', orders)
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`${API_URL}/api/item`);
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching Items:", error);
            }
        };
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/api/order`);
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching Items:", error);
            }
        };
        fetchOrders();
        fetchItems();
    }, []);

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
                <Header/>

                <div className="container-nav">
                    <div className="center-data-container">
                        <div className="card">
                            <div>
                                <p className="title">Total Ordenes</p>
                            </div>
                            <div className="icon">
                                <span
                                ><img
                                        src={salesorder}
                                        alt="salesorder"
                                    /></span>
                            </div>
                        </div>
                        <button id="bttn1" className="center-data" onClick={(e) => handleRedirect(e.currentTarget.id)}>Introducir Orden</button>
                    </div>
                    <div className="center-data-container">
                        <div className="card-white">
                            <div>
                                <p className="title">Total Empleados</p>
                            </div>
                            <div className="icon">
                                <span
                                ><img src={employee} alt="employee"
                                    /></span>
                            </div>
                        </div>
                        <button id="bttn2" className="center-data" onClick={(e) => handleRedirect(e.currentTarget.id)}>Introducir Empleado</button>
                    </div>
                    <div className="center-data-container">
                        <div className="card-white">
                            <div>
                                <p className="title">Total Clientes</p>
                            </div>
                            <div className="icon">
                                <span
                                ><img src={customer} alt="customer"
                                    /></span>
                            </div>
                        </div>
                        <button id="bttn3" className="center-data" onClick={(e) => handleRedirect(e.currentTarget.id)}>Introducir Cliente</button>
                    </div>
                    <div className="center-data-container">
                        <div className="card-white">
                            <div>
                                <p className="title">Total Fichas</p>
                            </div>
                            <div className="icon">
                                <span
                                ><img src={card} alt="card"
                                    /></span>
                            </div>
                        </div>
                        <button id="bttn4" className="center-data" onClick={(e) => handleRedirect(e.currentTarget.id)}>
                            Introducir Ficha Técnica
                        </button>
                    </div>
                    <div className="center-data-container">
                        <div className="card-white">
                            <div>
                                <p className="title">Total Artículos</p>
                            </div>
                            <div className="icon">
                                <span
                                ><img src={itemsIcon} alt="item"
                                    /></span>
                            </div>
                        </div>
                        <button id="bttn5" className="center-data" onClick={(e) => handleRedirect(e.currentTarget.id)}>Introducir Artículo</button>
                    </div>
                </div>
                <div className="card-order">
                    <div><h2>Ordenes</h2></div>
                    <div className="table">
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Número de Transacción</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>IVA</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order.id_orders}>
                                            <td>OR-{order.id_orders}</td>
                                            <td>{new Date(order.created_date).toLocaleDateString()}</td>
                                            <td>$ {parseFloat(order.subtotal || 0).toLocaleString()}</td>
                                            <td>$ {parseFloat(order.tax_amount || 0).toLocaleString()}</td>
                                            <td>$ {parseFloat(order.total || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
                <div className="card-order">
                    <h2>Artículos</h2>
                    <div className="table">
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Fecha de Creación</th>
                                        <th>Costo Materia Prima</th>
                                        <th>Ficha Técnica</th>
                                        <th>Costo de Venta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.slice(0, 5).map((item) => (
                                        <tr key={item.id_item}>
                                            <td>{item.comercial_name}</td>
                                            <td>{new Date(item.created_date).toLocaleDateString()}</td>
                                            <td>{item.cost}</td>
                                            <td>{item.technical_data_id_technical_data || 'N/A'}</td>
                                            <td>{item.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}