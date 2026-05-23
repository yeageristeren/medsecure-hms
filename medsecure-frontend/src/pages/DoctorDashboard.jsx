import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import API from '../api/axios'

function DoctorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    rejected: 0,
    completed: 0,
  })

  // Fetch doctor appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await API.get('/doctors/appointments')
      setAppointments(response.data.data.content || [])
      calculateStats(response.data.data.content || [])
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from appointments
  const calculateStats = (appointmentsList) => {
    const newStats = {
      total: appointmentsList.length,
      confirmed: 0,
      pending: 0,
      rejected: 0,
      completed: 0,
    }

    appointmentsList.forEach((apt) => {
      const status = apt.status?.toUpperCase()
      if (status === 'CONFIRMED') newStats.confirmed++
      else if (status === 'PENDING') newStats.pending++
      else if (status === 'REJECTED') newStats.rejected++
      else if (status === 'COMPLETED') newStats.completed++
    })

    setStats(newStats)
  }

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await API.patch(`/doctors/appointments/${appointmentId}/status`, {
        status: newStatus,
      })
      
      // Update local state
      const updatedAppointments = appointments.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
      setAppointments(updatedAppointments)
      calculateStats(updatedAppointments)
    } catch (error) {
      console.error('Failed to update appointment status:', error)
      // Display error alert for business logic exceptions
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update appointment status'
      alert(`Error: ${errorMessage}`)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchAppointments()
  }, [user, navigate])

  const getStatusBadgeColor = (status) => {
    const statusMap = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REJECTED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    }
    return statusMap[status?.toUpperCase()] || 'bg-gray-100 text-gray-800'
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-'
    const date = new Date(dateTimeString)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    return `${formattedDate} at ${formattedTime}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your appointments and patient consultations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Appointments */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Appointments</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </Card>

        {/* Pending */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </Card>

        {/* Confirmed */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium mb-2">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium mb-2">Completed</p>
            <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
          </div>
        </Card>

        {/* Rejected */}
        <Card className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-red-600 text-sm font-medium mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card className="border-0 shadow-sm bg-white">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your appointments</p>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No appointments found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-700">Patient Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="text-gray-900 font-medium">
                      {appointment.patient.name || 'Unknown Patient'}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDateTime(appointment.appointmentTime)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(appointment.status)}>
                        {appointment.status?.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            disabled={['CANCELLED', 'REJECTED', 'COMPLETED'].includes(
                              appointment.status?.toUpperCase()
                            )}
                          >
                            Change Status
                          </Button>
                        </DropdownMenuTrigger>
                        {!['CANCELLED', 'REJECTED', 'COMPLETED'].includes(
                          appointment.status?.toUpperCase()
                        ) && (
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel className="text-xs font-semibold">
                              Update Status
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Confirm and Reject - only for PENDING */}
                            {appointment.status?.toUpperCase() === 'PENDING' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateAppointmentStatus(appointment.id, 'CONFIRMED')
                                  }
                                  className="cursor-pointer"
                                >
                                  <span className="text-green-600 font-medium">✓ Confirm</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateAppointmentStatus(appointment.id, 'REJECTED')
                                  }
                                  className="cursor-pointer"
                                >
                                  <span className="text-red-600 font-medium">✗ Reject</span>
                                </DropdownMenuItem>
                              </>
                            )}

                            {/* Completed - only for CONFIRMED */}
                            {appointment.status?.toUpperCase() === 'CONFIRMED' && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateAppointmentStatus(appointment.id, 'COMPLETED')
                                }
                                className="cursor-pointer"
                              >
                                <span className="text-blue-600 font-medium">✓ Completed</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        )}
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default DoctorDashboard