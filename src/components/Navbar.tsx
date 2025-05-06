import { NavLink } from "react-router"
import LogoutButton from "./LogoutButton"

function Navbar() {

  return (
    <nav>

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

            <li>
                <NavLink to="/dashboard">Dashboard</NavLink>
            </li>

            <li>
                <NavLink to="/dashboard/admin">Admin Dashboard</NavLink>
            </li>

            <li>
                <NavLink to="/dashboard/settings">Settings</NavLink>
            </li>

            <li>
                <NavLink to="/dashboard/profile">Profile</NavLink>
            </li>

            <li>
                <NavLink to="/login">Login</NavLink>
            </li>

            <li>
                <NavLink to="/register">Register</NavLink>
            </li>

            <li>
                <LogoutButton />
            </li>

      </ul>
      
    </nav>
  )
}

export default Navbar