
 
 
import { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        console.log("Auth useEffect");
        console.log("Token in localStorage:", token);
        console.log("User in localStorage:", storedUser);

        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("Token expired. Logging out...");
                    handleLogout();
                } else {
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        const newUser = {
                            id: decodedToken.id,
                            name: decodedToken.name,
                            role: decodedToken.role,
                        };
                        setUser(newUser);
                        localStorage.setItem("user", JSON.stringify(newUser));
                    }
                }
            } catch (error) {
                console.error("Invalid token. Logging out...");
                handleLogout();
            }
        } else {
            setUser(null);
        }
        setIsLoading(false);
    }, [location.pathname]);

    const login = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const userData = {
                id: decodedToken.id,
                name: decodedToken.name,
                role: decodedToken.role,
            };
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Invalid token provided during login.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        window.location.href = "/exam";
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
