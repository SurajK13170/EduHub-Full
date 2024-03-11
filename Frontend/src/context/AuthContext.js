import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

const AuthContextProvider = ({children}) => {
    const [auth, setAuth] = useState()
    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthContext
export {
    AuthContextProvider,
    useAuth
}