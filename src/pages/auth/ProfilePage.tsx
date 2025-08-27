
import { Navigate } from "react-router"
import { useAuth } from "../../AuthContext"
import { BarLoader } from "react-spinners"
import { useState } from "react"
import api from "../../api"
import { toast } from "react-toastify"
import zxcvbn from 'zxcvbn'

const ProfilePage: React.FC = () => {
    const { user, loading, logoutUser, updateUser } = useAuth()
    const [ username, setUsername ] = useState<string>(user?.username || "")
    const [ newPassword, setNewPassword ] = useState<string>("")
    const [ confirmPassword, setConfirmPassword ] = useState<string>("")
    const [loadingPassword, setLoadingPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwordFocused, setPasswordFocused] = useState(false)

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

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoadingPassword(true)

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match")
        setLoadingPassword(false)
        return
      }

      if (newPassword.length < 8) {
        toast.error("Password must be at least 8 characters")
        setLoadingPassword(false)
        return
      }

      try {
        await api.post("/users/reset-password", {
          email: user.email,
          newPassword
        })
          toast.success("Password successfully updated")
          setNewPassword("")
          setConfirmPassword("")
      } catch (error) {
          console.log(error)
          toast.error("Error updating password")
      } finally {
          setLoadingPassword(false)
      }
    }

    // const getPasswordStrength = (pwd: string) => {
    //   if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[!@#$%^&*]/.test(pwd)) return "Strong"
    //   if (pwd.length >= 8) return "Medium"
    //   if (pwd.length > 0) return "Weak"
    //   return ""
    // }

    const score = zxcvbn(newPassword).score // 0-4

    const getBarColor = (score: number) => {
      switch(score) {
        case 0: return 'red'
        case 1: return 'orange'
        case 2: return 'yellow'
        case 3: return 'lightgreen'
        case 4: return 'green'
        default: return 'gray'
      }
    }


    return (
        <div>
            <h1>Profile Page</h1>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <h3>Edit Username</h3>

            <form onSubmit={submitHandler}>
              <div className="formControl">
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" value={username} onChange={userNameHandler} />
              </div>

              <button type="submit">Edit</button>
            </form>

            <h3>Reset Password</h3>
            <form onSubmit={handlePasswordReset}>
              <div className="formControl">
                <label htmlFor="newPassword">New Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />

              </div>

              <div className="formControl">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>

              {passwordFocused && newPassword && (
                <div style={{ height: '6px', width: '100%', background: '#000000ff' }}>
                  <div style={{ width: `${(score + 1) * 20}%`, height: '100%', background: getBarColor(score) }}></div>
                </div>
              )}


              <label>
                <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                  Show Passwords
              </label>

              <button type="submit" disabled={loadingPassword}>
                {loadingPassword ? "Updating..." : "Update Password"}
              </button>

            </form>

        </div>

    )
}
export default ProfilePage