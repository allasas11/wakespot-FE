import React from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../AuthContext'

const LogoutButton: React.FC = () => {
    const { logoutUser } = useAuth()
    const navigate = useNavigate()

    const logoutHandler = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logoutUser()
            navigate('/login')
        }
    }
    return (
        <button onClick={logoutHandler}>Logout</button>
    )
}
export default LogoutButton