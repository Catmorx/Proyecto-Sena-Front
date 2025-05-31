import { createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [cookies, setCookies] = useCookies(["token"]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        setToken(cookies.token || null);
    }, [cookies]);

    const logout = () => {
        setCookies("token", "", { path: "*", maxAge: 0 });
        setToken(null);
    };


    return (
        <AuthContext.Provider value={{ token, setCookies, logout }}>
            {children}
        </AuthContext.Provider>
    )
}