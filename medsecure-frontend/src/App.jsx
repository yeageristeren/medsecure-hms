import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './routes/ProtectedRoutes'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminPanel from './pages/AdminPanel'
import Unauthorized from './pages/Unauthorized'
import Layout from './components/Layout'
import BookAppointment from './pages/BookAppointment'
import AdminPatient from './pages/AdminPatient'
import Signup from './pages/SignUp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["PATIENT"]}>
          <Layout><PatientDashboard /></Layout>
        </ProtectedRoute>
      }/>

      <Route path="/doctor" element={
        <ProtectedRoute allowedRoles={["DOCTOR"]}>
          <Layout><DoctorDashboard /></Layout>
        </ProtectedRoute>
      }/>

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Layout><AdminPanel /></Layout>
        </ProtectedRoute>
      }/>
      <Route path ="/book-appointment" element={
        <ProtectedRoute allowedRoles={["PATIENT"]}>
          <Layout><BookAppointment /></Layout>
        </ProtectedRoute>
      }/>
      <Route path="/admin/patients" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Layout><AdminPatient/></Layout>
        </ProtectedRoute>
      }/ >
        <Route path="/signup" element={
          <Signup />
        } />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default App