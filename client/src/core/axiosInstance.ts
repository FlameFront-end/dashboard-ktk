import axios from 'axios'
import Cookies from 'js-cookie'
import { BACKEND_URL } from '@/constants'

export const axiosInstance = axios.create({
	baseURL: `${BACKEND_URL}/api`
})

axiosInstance.interceptors.request.use(
	async config => {
		const token = Cookies.get('token')
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	async error => {
		throw error
	}
)
