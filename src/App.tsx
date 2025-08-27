import { BrowserRouter, Route, Routes } from "react-router"
import { Bounce, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import Navbar from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import DashboardPage from "./pages/dashboard/DashboardPage"
import SettingsPage from "./pages/dashboard/SettingsPage"
import ProfilePage from "./pages/auth/ProfilePage"
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage"
import LocationsPage from "./pages/locations/LocationsPage"
import LocationPage from "./pages/locations/LocationPage"
import LocationCreatePage from "./pages/locations/LocationCreatePage"
import LocationEditPage from "./pages/locations/LocationEditPage"
import InstructorsPage from "./pages/instructors/InstructorsPage"
import InstructorPage from "./pages/instructors/InstructorPage"
import InstructorCreatePage from "./pages/instructors/InstructorCreatePage"
import InstructorEditPage from "./pages/instructors/InstructorEditPage"
import EquipmentPackagesPage from "./pages/equipmentPackages/EquipmentPackagesPage"
import EquipmentPackagePage from "./pages/equipmentPackages/EquipmentPackagePage"
import EquipmentPackageCreatePage from "./pages/equipmentPackages/EquipmentPackageCreatePage"
import EquipmentPackageEditPage from "./pages/equipmentPackages/EquipmentPackageEditPage"
import SessionsPage from "./pages/sessions/SessionsPage"
import SessionPage from "./pages/sessions/SessionPage"
import SessionCreatePage from "./pages/sessions/SessionCreatePage"
import SessionEditPage from "./pages/sessions/SessionEditPage"
import BookingsPage from "./pages/bookings/BookingsPage"
import BookingPage from "./pages/bookings/BookingPage"
import BookingCreatePage from "./pages/bookings/BookingCreatePage"
import BookingEditPage from "./pages/bookings/BookingEditPage"

function App() {

  return (
    <BrowserRouter>
      <Navbar />

    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />

      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path='dashboard'>
            <Route index element={<DashboardPage />}/>
            <Route path='settings' element={<SettingsPage />}/>
            <Route path='profile' element={<ProfilePage />} />
            <Route path='admin' element={<AdminDashboardPage />} />
          </Route>
        </Route>

          <Route path='locations'>
            <Route index element={<LocationsPage />} />
            <Route path=':id' element={<LocationPage />} />
            <Route path="create" element={<LocationCreatePage />} />
            <Route path="edit/:id" element={<LocationEditPage />} />
          </Route>

          <Route path='instructors'>
            <Route index element={<InstructorsPage />} />
            <Route path=':id' element={<InstructorPage />} />
            <Route path="create" element={<InstructorCreatePage />} />
            <Route path="edit/:id" element={<InstructorEditPage />} />
          </Route>

          <Route path='packages'>
            <Route index element={<EquipmentPackagesPage />} />
            <Route path=':id' element={<EquipmentPackagePage />} />
            <Route path="create" element={<EquipmentPackageCreatePage />} />
            <Route path="edit/:id" element={<EquipmentPackageEditPage />} />
          </Route>

          <Route path='sessions'>
            <Route index element={<SessionsPage />} />
            <Route path=':id' element={<SessionPage />} />
            <Route path="create" element={<SessionCreatePage />} />
            <Route path="edit/:id" element={<SessionEditPage />} />
          </Route>

          <Route path='bookings'>
            <Route index element={<BookingsPage />} />
            <Route path=':id' element={<BookingPage />} />
            <Route path="create" element={<BookingCreatePage />} />
            <Route path="edit/:id" element={<BookingEditPage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
