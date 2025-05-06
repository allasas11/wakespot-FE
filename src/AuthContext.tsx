import { jwtDecode } from "jwt-decode"
import { createContext, useContext, useEffect, useState } from "react"

interface DecodedToken {
    sub: string
    exp: number 
    id: string 
    username: string 
    email: string
    role: string 
}

interface AuthContextType {
    user: DecodedToken | null
    loading: boolean
    loginUser: (token: string) => void
    logoutUser: () => void
    updateUser: (newUser: Partial<DecodedToken>) => void
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginUser: () => {},
    logoutUser: () => {},
    updateUser: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<DecodedToken | null>(null)
    console.log("🚀 ~ AuthProvider ~ user:", user)
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (storedToken) {
            try {
                const decoded = jwtDecode<DecodedToken>(storedToken)
                if (decoded.exp * 1000 > Date.now()) {
                    setUser(decoded)
                } else {
                    localStorage.removeItem('token')
                }
         
            } catch {
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }, [])

    const loginUser = (token: string) => {
        localStorage.setItem('token', token)
        const decoded = jwtDecode<DecodedToken>(token)
        setUser(decoded)
    }

    const logoutUser = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const updateUser = (newUser: Partial<DecodedToken>) => {
        setUser(prevState => {
            if (!prevState) return null
            return {
                ...prevState,
                ...newUser
            }
        })
    }

    const contextValue: AuthContextType = {
        user,
        loading,
        loginUser,
        logoutUser,
        updateUser
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}