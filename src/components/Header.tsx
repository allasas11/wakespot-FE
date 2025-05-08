import { NavLink } from "react-router"
import LogoutButton from "./LogoutButton"
import { useAuth } from "../AuthContext"
import ROLES from "../config/roles"

function Navbar() {

  const { user } = useAuth()
    
  return (
    <header className="header">
        <nav className="navigation">
            <ul>

                <li>
                    <NavLink to="/">Home</NavLink>
                </li>

                <li>
                    <NavLink to="/locations">Locations</NavLink>
                </li>

                <li>
                    <NavLink to="/instructors">Instructors</NavLink>
                </li>

                <li>
                    <NavLink to="/packages">Equipment Packages</NavLink>
                </li>

                <li>
                    <NavLink to="/sessions">Sessions</NavLink>
                </li>

                <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                </li>

                {user && (
                    <>

                        <li>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        </li>

                        {user?.role === ROLES.ADMIN && (
                            <li>
                                <NavLink to="/dashboard/admin">Admin Dashboard</NavLink>
                            </li>
                        )}

                        <li>
                        <NavLink to="/dashboard/settings">Settings</NavLink>
                        </li>

                        <li>
                        <NavLink to="/dashboard/profile">Profile</NavLink>
                        </li>

                    </>
                )}

                    {user ? (
                        <li>
                            <LogoutButton />
                        </li>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login">Login</NavLink>
                            </li>

                            <li>
                                <NavLink to="/register">Register</NavLink>
                            </li>
                        </>
                    )}

            </ul>
        </nav>
    </header>
  )
}

export default Navbar