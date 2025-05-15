import axios from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_URL } from '@/constants'

export const axiosInstance = axios.create({
	baseURL: `${BACKEND_URL}/api`
})

axiosInstance.interceptors.request.use(
	config => {
		const token = Cookies.get('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => Promise.reject(error)
)
