import axios, {
	AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor
axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Add auth token if available
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// Log request for debugging
		if (import.meta.env.DEV) {
			console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
		}
		return config;
	},
	(error: AxiosError) => {
		console.error('❌ Request Error:', error);
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		// Log response for debugging
		if (import.meta.env.DEV) {
			console.log('✅ Response:', response.status, response.config.url);
		}
		return response;
	},
	(error: AxiosError) => {
		// Log error for debugging
		console.error(
			'❌ Response Error:',
			error.response?.status,
			error.config?.url
		);

		// Handle common error cases
		if (error.response?.status === 401) {
			// Unauthorized - clear token and redirect to login
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.href = '/login';
		} else if (error.response?.status === 403) {
			// Forbidden - user doesn't have permission
			console.error('Access denied:', error.response.data);
		} else if (error.response?.status === 500) {
			console.error('Server Error:', error.response.data);
		} else if (error.response?.status === 404) {
			console.error('Resource not found:', error.config?.url);
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
