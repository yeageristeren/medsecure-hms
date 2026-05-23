import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function PatientDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [appointments, setAppointments] = useState([])
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        fetchAppointments(0)
    }, [])

    const fetchAppointments = async (page) => {
        setLoading(true)
        try {
            const [apptRes, profileRes] = await Promise.all([
                API.get(`/patients/appointments?page=${page}&size=5`),
                API.get('/patients/profile'),
            ])
            setAppointments(apptRes.data.data.content)  
            setPagination({
                page: apptRes.data.data.number,
                totalPages: apptRes.data.data.totalPages,
                totalElements: apptRes.data.data.totalElements,
            })
            setProfile(profileRes.data.data)
        } catch (err) {
            console.error('Failed to fetch dashboard data', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return

        try {
            await API.patch(`/patients/appointment/${appointmentId}/cancel`)
            fetchAppointments(pagination.page)
        } catch (err) {
            console.error('Failed to cancel appointment', err)
        }
    }

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        CONFIRMED: 'bg-green-100 text-green-700',
        CANCELLED: 'bg-red-100 text-red-700',
        COMPLETED: 'bg-blue-100 text-blue-700',
    }

    if (loading) return (
        <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
        </div>
    )

    return (
        <div className="space-y-6">

            {/* Welcome banner */}
            <div className="bg-emerald-600 text-white rounded-xl px-6 py-5 flex items-center justify-between">
                <div>
                    <p className="text-emerald-100 text-sm">Welcome back,</p>
                    <h1 className="text-2xl font-semibold">{user?.username}</h1>
                </div>
                <Button
                    onClick={() => navigate('/book-appointment')}
                    className="bg-white text-emerald-700 hover:bg-emerald-50 font-medium"
                >
                    + Book Appointment
                </Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: appointments.length, color: 'text-gray-700' },
                    { label: 'Pending', value: appointments.filter(a => a.status === 'PENDING').length, color: 'text-yellow-600' },
                    { label: 'Confirmed', value: appointments.filter(a => a.status === 'CONFIRMED').length, color: 'text-green-600' },
                    { label: 'Completed', value: appointments.filter(a => a.status === 'COMPLETED').length, color: 'text-blue-600' },
                ].map(stat => (
                    <Card key={stat.label}>
                        <CardContent className="pt-4">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={`text-3xl font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Appointments list */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base font-medium">My Appointments</CardTitle>
                    <span className="text-xs text-gray-400">{pagination.totalElements} total</span>
                </CardHeader>
                <CardContent>
                    {appointments.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-lg">No appointments yet</p>
                            <p className="text-sm mt-1">Book your first appointment to get started</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-gray-100">
                                {appointments.map(appt => (
                                    <div key={appt.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                Dr. {appt.doctor.name}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {appt.doctor.department} · {new Date(appt.appointmentTime).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[appt.status]}`}>
                                                {appt.status}
                                            </span>
                                            {appt.status === 'PENDING' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 text-xs"
                                                    onClick={() => handleCancel(appt.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination controls */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    Page {pagination.page + 1} of {pagination.totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page === 0}
                                        onClick={() => fetchAppointments(pagination.page - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pagination.page + 1 >= pagination.totalPages}
                                        onClick={() => fetchAppointments(pagination.page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}

export default PatientDashboard