
import { Navigate } from "react-router"
import { useAuth } from "../../AuthContext"
import { BarLoader } from "react-spinners"
import { useState } from "react"
import api from "../../api"

const ProfilePage: React.FC = () => {
    const { user, loading, logoutUser, updateUser } = useAuth()
    const [ username, setUsername ] = useState<string>(user?.username || "")

    if (loading) {
        return (
          <div style={{ textAlign: "center", margin: "50px" }}>
            <BarLoader color="#646cff" loading={true} />
          </div>
        )
      }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    const isExpired = user.exp * 1000 < Date.now()

    if(isExpired) {
        logoutUser()
        return <Navigate to={'/login'} />
    }

    const userNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value)
    }

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      console.log("Form submitted:", { username })

      try {
        const { data } = await api.put('/users/update', { username })
        const { user } = data
        updateUser(user)
      } catch (error) {
        console.log(error)       
      }
    }

 
    return (
        <div>
            <h1>Profile Page</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <form onSubmit={submitHandler}>
              <div className="formControl">
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" value={username} onChange={userNameHandler} />
              </div>

              <button type="submit">Edit</button>
            </form>

        </div>
    )
}
export default ProfilePage