import API from '../api/axios'

export const getUser = async () => {
    const response = await API.get('/auth/me');
    return response.data.data;
}