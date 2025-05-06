import { useState } from "react"
import { API_URL } from "../../utils/config"
import { useNavigate } from "react-router"
import api from "../../api"

const RegisterPage: React.FC = () => {
    const [ username, setUsername ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const navigate = useNavigate()

    const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value)
    const userEmailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)
    const userPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)

    const registerHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        try {
            const userInfo = { username, email, password }
            await api.post(`${API_URL}/users/register`, userInfo)
            navigate('/login')
        } catch (error) {
            console.log('Failed to register', error)
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={registerHandler}>
                <div className="formControl">
                    <label htmlFor="username">User name:</label>
                    <input type="text" name="username" id="username" value={username} onChange={userNameHandler} />
                </div>
                <div className="formControl">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" value={email} onChange={userEmailHandler} />
                </div>
                <div className="formControl">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" value={password} onChange={userPasswordHandler} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}
export default RegisterPage