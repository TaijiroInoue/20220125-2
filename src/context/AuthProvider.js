import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "../firebase/auth";

const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState();

    useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((firebaseuser) => {
            setUser(firebaseuser);
        });
        return () => {
            unsubscribed();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    );
}