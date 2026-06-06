import {  createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../libs/firebase.js";

type AuthProviderProps = {
    children: React.ReactNode;
    // loading: boolean;
}

type AuthContextType = {
    user: User | null
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({user: null, loading: true});
const useAuthContext = () => useContext(AuthContext);

const AuthProvider = (props: AuthProviderProps) => {
    const { children } = props;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [])

    return (
        <>
            {loading ? (<p>Loading・・・</p>) :
                <AuthContext.Provider value={{user, loading}}>
                    {children}
                </AuthContext.Provider>
            }
        </>
    )
};

export { useAuthContext, AuthProvider };