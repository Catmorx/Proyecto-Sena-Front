import { Link } from "react-router-dom";
import { toggleMenu } from "../assets/js/script.jsx";
import menu from "../assets/img/menu.svg";
import home from "../assets/img/home.svg";
import salesorder from "../assets/img/salesorder.svg";
import customer from "../assets/img/customer.svg";
import employee from "../assets/img/employee.svg";
import items from "../assets/img/items.svg";
import card from "../assets/img/card.svg";
import logoutIcon from "../assets/img/logout.svg";
import adress from "../assets/img/adress.svg";

export const Nav = ({ logout}) => {
    return (
        <nav className="nav-lateral">
            <ul className="only-color">
                <li className="menu">
                    <Link onClick={toggleMenu}>
                        <span className="icon"><img src={menu} alt="menu" /></span><span className="text">Menú</span>
                    </Link>
                </li>
            </ul>
            <ul>
                <li className="nav">
                    <Link to="/">
                        <span className="icon"><img src={home} alt="home" /></span><span className="text-color">Dashboard</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/orders">
                        <span className="icon"><img src={salesorder} alt="salesorder" /></span><span className="text-color">Ordenes de Pedido</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/customer">
                        <span className="icon"><img src={customer} alt="customer" /></span><span className="text-color">Clientes</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/adress">
                        <span className="icon"><img src={adress} alt="adress" /></span><span className="text-color">Direcciones</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/employee">
                        <span className="icon"><img src={employee} alt="employee" /></span><span className="text-color">Empleado</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/item">
                        <span className="icon"><img src={items} alt="items" /></span><span className="text-color">Artículos</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/card">
                        <span className="icon"><img src={card} alt="card" /></span><span className="text-color">Ficha Técnica</span>
                    </Link>
                </li>
                <li className="nav">
                    <Link to="/login" onClick={logout}>
                        <span className="icon"><img src={logoutIcon} alt="card" /></span><span className="text-color">Cerrar Sesión</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};