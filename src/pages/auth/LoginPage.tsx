import { useState } from "react"
import { API_URL } from "../../utils/config"
import { useNavigate } from "react-router"
import { useAuth } from "../../AuthContext"
import api from "../../api"

const LoginPage: React.FC = () => {
    const { loginUser } = useAuth()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const navigate = useNavigate()

    const userEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)
    const userPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

    const loginHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        try {
            const loginInfo = { email, password }
            const res = await api.post(`${API_URL}/users/login`, loginInfo)
            const { token } = res.data

            if (token) {
                loginUser(token)
                navigate('/dashboard/profile')
            }
    
        } catch (error) {
            console.log('Failed to register', error)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={loginHandler}>
                <div className="formControl">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" value={email} onChange={userEmailHandler} />
                </div>
                <div className="formControl">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" value={password} onChange={userPasswordHandler} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default LoginPage