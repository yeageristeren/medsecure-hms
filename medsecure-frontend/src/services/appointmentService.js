import API from '../api/axios'

export const getAvailableDoctors = async () => {
    const response = await API.get('/public/doctors')
    return response.data.data
}

export const bookAppointment = async (appointmentData) => {
    const response = await API.post('/appointment', appointmentData)
    return response.data.data
}

export const getPatientAppointments = async (page = 0, size = 10) => {
    const response = await API.get(`/appointments?page=${page}&size=${size}`)
    return response.data.data
}

export const cancelAppointment = async (appointmentId) => {
    const response = await API.post(`/appointments/${appointmentId}/cancel`)
    return response.data.data
}

export const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
    const response = await API.put(`/appointments/${appointmentId}/reschedule`, {
        appointmentDate: newDate,
        appointmentTime: newTime
    })
    return response.data.data
}
