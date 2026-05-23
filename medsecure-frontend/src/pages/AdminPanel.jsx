import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import API from '../api/axios'

function StatCard({ label, value, color = 'text-gray-800', loading }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500">{label}</p>
        {loading
          ? <Skeleton className="h-9 w-20 mt-1" />
          : <p className={`text-3xl font-semibold mt-1 ${color}`}>{value ?? 0}</p>
        }
      </CardContent>
    </Card>
  )
}

function AdminPanel() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/dashboard/system')
      setDashboard(res.data.data)
    } catch (err) {
      console.error('Failed to fetch dashboard', err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const stats = dashboard?.systemStats
  const apptStats = dashboard?.appointmentStats

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">System overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/doctors')}
          >
            Manage Doctors
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/departments')}
          >
            Manage Departments
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            size="sm"
            onClick={() => navigate('/admin/patients')}
          >
            View Patients
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      {/* System stats */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          System overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total doctors"       value={stats?.totalDoctors}        color="text-emerald-600" loading={loading} />
          <StatCard label="Total patients"      value={stats?.totalPatients}       color="text-blue-600"    loading={loading} />
          <StatCard label="Total appointments"  value={stats?.totalAppointments}   color="text-gray-800"    loading={loading} />
          <StatCard label="Today"               value={stats?.todayAppointments}   color="text-violet-600"  loading={loading} />
          <StatCard label="This week"           value={stats?.weeklyAppointments}  color="text-amber-600"   loading={loading} />
          <StatCard label="This month"          value={stats?.monthlyAppointments} color="text-pink-600"    loading={loading} />
        </div>
      </div>

      {/* Appointment status stats */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Appointment status
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard label="Pending"   value={apptStats?.pending}   color="text-yellow-600" loading={loading} />
          <StatCard label="Confirmed" value={apptStats?.confirmed} color="text-emerald-600" loading={loading} />
          <StatCard label="Completed" value={apptStats?.completed} color="text-blue-600"    loading={loading} />
          <StatCard label="Cancelled" value={apptStats?.cancelled} color="text-red-500"     loading={loading} />
          <StatCard label="Rejected"  value={apptStats?.rejected}  color="text-gray-500"    loading={loading} />
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <Card
            className="cursor-pointer hover:border-emerald-300 transition-colors"
            onClick={() => navigate('/admin/doctors')}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg">
                  👨‍⚕️
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Manage doctors</p>
                  <p className="text-xs text-gray-400 mt-0.5">Add, remove, assign departments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-blue-300 transition-colors"
            onClick={() => navigate('/admin/departments')}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
                  🏥
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Manage departments</p>
                  <p className="text-xs text-gray-400 mt-0.5">Create and manage departments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-violet-300 transition-colors"
            onClick={() => navigate('/admin/patients')}
          >
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-lg">
                  🧑‍🤝‍🧑
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">View patients</p>
                  <p className="text-xs text-gray-400 mt-0.5">Browse all registered patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  )
}

export default AdminPanel