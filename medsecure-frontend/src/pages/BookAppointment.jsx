import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

function BookAppointment() {
  const navigate = useNavigate()

  const [doctors, setDoctors] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 })
  const [specialization, setSpecialization] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loadingDoctors, setLoadingDoctors] = useState(true)

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [appointmentTime, setAppointmentTime] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchDoctors(0, specialization)
  }, [specialization])

  const fetchDoctors = async (page, spec) => {
    setLoadingDoctors(true)
    try {
    //   const params = new URLSearchParams({ page, size: 6 })
    //   if (spec) params.append('specialization', spec)
      const res = await API.get(`/public/doctor`,{
        params: {
          page,
          size: 5,
          ...(spec ? { specialization: spec } : {}) 
        } 
      })
      setDoctors(res.data.data.content)
      setPagination({
        page: res.data.data.number,
        totalPages: res.data.data.totalPages,
      })
    } catch (err) {
      console.error('Failed to fetch doctors', err)
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSpecialization(searchInput)
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setSpecialization('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedDoctor) return setError('Please select a doctor.')
    if (!appointmentTime) return setError('Please select an appointment time.')
    if (!reason.trim()) return setError('Please enter a reason for the appointment.')

    setSubmitting(true)
    try {
      await API.post('/patients/appointment', {
        doctorId: selectedDoctor.id,
        appointmentTime: new Date(appointmentTime).toISOString(),
        reason,
      })
      setSuccess(true)
    } catch (err) {
      setError('Failed to book appointment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-emerald-600 text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Appointment Booked!</h2>
        <p className="text-gray-500 text-sm">
          Your appointment with Dr. {selectedDoctor?.name} has been successfully booked.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => {
              setSuccess(false)
              setSelectedDoctor(null)
              setAppointmentTime('')
              setReason('')
            }}
          >
            Book Another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          ← Back
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Book Appointment</h1>
          <p className="text-sm text-gray-400">Find a doctor and schedule your visit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Doctor selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Step 1 — Select a doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              {/* Search by specialization */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search by specialization..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline" size="sm">Search</Button>
                {specialization && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-gray-400"
                  >
                    Clear
                  </Button>
                )}
              </form>

              {/* Doctor cards */}
              {loadingDoctors ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No doctors found for "{specialization}"
                </div>
              ) : (
                <div className="space-y-2">
                  {doctors.map(doctor => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedDoctor?.id === doctor.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-medium flex-shrink-0">
                          {doctor.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">
                            Dr. {doctor.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {doctor.specialization}
                          </p>
                        </div>
                        {selectedDoctor?.id === doctor.id && (
                          <span className="text-emerald-600 text-sm">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-gray-400">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 0}
                      onClick={() => fetchDoctors(pagination.page - 1, specialization)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page + 1 >= pagination.totalPages}
                      onClick={() => fetchDoctors(pagination.page + 1, specialization)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right — Appointment details */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Step 2 — Appointment details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Selected doctor preview */}
                {selectedDoctor ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-medium">
                      {selectedDoctor.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Dr. {selectedDoctor.name}</p>
                      <p className="text-xs text-gray-500">{selectedDoctor.specialization}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center text-sm text-gray-400">
                    No doctor selected yet
                  </div>
                )}

                {/* Date & time */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Appointment date & time</Label>
                  <Input
                    type="datetime-local"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-600">Reason for visit</Label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe your symptoms or reason for the appointment..."
                    rows={4}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={submitting || !selectedDoctor}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {submitting ? 'Booking...' : 'Confirm Appointment'}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default BookAppointment