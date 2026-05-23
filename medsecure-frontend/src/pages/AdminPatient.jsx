import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import API from '../api/axios'

const BLOOD_GROUP_COLORS = {
  A_POSITIVE:  'bg-red-100 text-red-700',
  A_NEGATIVE:  'bg-red-100 text-red-800',
  B_POSITIVE:  'bg-orange-100 text-orange-700',
  B_NEGATIVE:  'bg-orange-100 text-orange-800',
  O_POSITIVE:  'bg-blue-100 text-blue-700',
  O_NEGATIVE:  'bg-blue-100 text-blue-800',
  AB_POSITIVE: 'bg-purple-100 text-purple-700',
  AB_NEGATIVE: 'bg-purple-100 text-purple-800',
}

function AdminPatient() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchPatients(0, search)
  }, [search])

  const fetchPatients = async (page, query) => {
    setLoading(true)
    try {
      const res = await API.get('/admin/patients', {
        params: {
          page,
          size: 10,
          ...(query && { search: query }),
        }
      })
      setPatients(res.data.content)
      setPagination({
        page: res.data.number,
        totalPages: res.data.totalPages,
        totalElements: res.data.totalElements,
      })
    } catch (err) {
      console.error('Failed to fetch patients', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const getAge = (birthDate) => {
    if (!birthDate) return '—'
    const age = Math.floor((new Date() - new Date(birthDate)) / (365.25 * 24 * 60 * 60 * 1000))
    return `${age} yrs`
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
          ← Back
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pagination.totalElements} registered patients
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-sm font-medium text-gray-700">
              All patients
            </CardTitle>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Search by name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-48 h-8 text-sm"
              />
              <Button type="submit" variant="outline" size="sm">Search</Button>
              {search && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400"
                  onClick={() => { setSearch(''); setSearchInput('') }}
                >
                  Clear
                </Button>
              )}
            </form>
          </div>
        </CardHeader>
        <CardContent>

          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wide border-b border-gray-100">
            <span>Name</span>
            <span>Gender</span>
            <span>Date of birth</span>
            <span>Age</span>
            <span>Blood group</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="space-y-3 mt-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No patients found
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {patients.map(patient => (
                <div
                  key={patient.id}
                  className="grid grid-cols-5 gap-4 px-3 py-3 items-center hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {/* Name + avatar */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-medium flex-shrink-0">
                      {patient.name?.slice(0, 2).toUpperCase() ?? 'P'}
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {patient.name ?? '—'}
                    </span>
                  </div>

                  {/* Gender */}
                  <span className="text-sm text-gray-500 capitalize">
                    {patient.gender?.toLowerCase() ?? '—'}
                  </span>

                  {/* DOB */}
                  <span className="text-sm text-gray-500">
                    {formatDate(patient.birthDate)}
                  </span>

                  {/* Age */}
                  <span className="text-sm text-gray-500">
                    {getAge(patient.birthDate)}
                  </span>

                  {/* Blood group */}
                  {patient.bloodGroup ? (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium w-fit ${BLOOD_GROUP_COLORS[patient.bloodGroup] ?? 'bg-gray-100 text-gray-600'}`}>
                      {patient.bloodGroup.replace('_', ' ')}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {pagination.page + 1} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 0}
                  onClick={() => fetchPatients(pagination.page - 1, search)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page + 1 >= pagination.totalPages}
                  onClick={() => fetchPatients(pagination.page + 1, search)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  )
}

export default AdminPatient