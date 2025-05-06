import { Navigate, Outlet } from "react-router"
import { useAuth } from "../AuthContext"
import { BarLoader } from "react-spinners"
import { useEffect } from "react"


const PrivateRoute: React.FC = () => {
    const { user, loading, logoutUser } = useAuth()

    useEffect(() => {
      if (user) {
          const currentTime = Date.now()
          const tokenExpirationTime = user.exp * 1000

          if (currentTime >= tokenExpirationTime) {
              logoutUser()
          }
      }
  }, [user, logoutUser])

    if (loading) {
        return (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <BarLoader color="#646cff" loading={true} />
          </div>
        )
      }

    if(!user) {
        return <Navigate to={'/login'} />
    }

    const isExpired = user.exp * 1000 < Date.now()


    if (isExpired) {
        return <Navigate to="/login" />
    }

    return (
        <Outlet />
    )
}

export default PrivateRoute
