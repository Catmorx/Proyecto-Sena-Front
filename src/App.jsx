// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./views/LandingPage.jsx";
import { Order } from "./views/Order.jsx"
import { Customer } from "./views/Customer.jsx";
import { Card } from "./views/Card.jsx";
import { Employee } from "./views/Employee.jsx";
import { Item } from "./views/Item.jsx";
import { Login } from "./views/Login.jsx";
import { Adress } from "./views/Adress.jsx";
import { AuthProvider } from "../context/AuthContext.jsx";
import { PrivateRoute } from "./components/PrivateRoute.jsx";

function App() {
    // const [count, setCount] = useState(0)

    return (
        <>
            <BrowserRouter future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<Login />}></Route>
                         <Route element={<PrivateRoute />}>
                        <Route path="/" element={<LandingPage />}></Route>
                        <Route path="/customer" element={<Customer />}></Route>
                        <Route path="/customer/:id" element={<Customer />} />
                        <Route path="/adress" element={<Adress />}></Route>
                        <Route path="/adress/:id" element={<Adress />}></Route>
                        <Route path="/employee" element={<Employee />}></Route>
                        <Route path="/employee/:id" element={<Employee />}></Route>
                        <Route path="/item" element={<Item />}></Route>
                        <Route path="/item/:id" element={<Item />}></Route>
                        <Route path="/orders" element={<Order />}></Route>
                        <Route path="/orders/:id" element={<Order />}></Route>
                        <Route path="/card" element={<Card />}></Route>
                        <Route path="/card/:id" element={<Card />}></Route>
            </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>

        </>
    )
}
export default App
