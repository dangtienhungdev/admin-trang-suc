import axios, {
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor
axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
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
		if (error.response?.status === 500) {
			console.error('Server Error:', error.response.data);
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
