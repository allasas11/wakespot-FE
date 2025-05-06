import { useAuth } from "../../AuthContext"
import ROLES from "../../config/roles"


const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth()

    if(user?.role !== ROLES.ADMIN) {
        return (
            <p>Access denied</p>
        )
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    )
}

export default AdminDashboardPage