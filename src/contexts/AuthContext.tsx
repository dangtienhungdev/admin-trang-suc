import type {
	AuthContextType,
	LoginRequest,
	LoginResponse,
} from '@/types/auth.type';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { authApi } from '@/apis/auth.api';
import axiosInstance from '@/configs/instances/axios';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const ADMIN_KEY = 'admin_data';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [admin, setAdmin] = useState<LoginResponse['admin'] | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Initialize auth state from localStorage
	useEffect(() => {
		const initializeAuth = () => {
			try {
				const storedToken = localStorage.getItem(TOKEN_KEY);
				const storedAdmin = localStorage.getItem(ADMIN_KEY);

				if (storedToken && storedAdmin) {
					setAccessToken(storedToken);
					setAdmin(JSON.parse(storedAdmin));
				}
			} catch (error) {
				console.error('Error initializing auth:', error);
				// Clear invalid data
				localStorage.removeItem(TOKEN_KEY);
				localStorage.removeItem(REFRESH_TOKEN_KEY);
				localStorage.removeItem(ADMIN_KEY);
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();
	}, []);

	// Set up axios interceptor for token
	useEffect(() => {
		// Request interceptor to add token
		const requestInterceptor = axiosInstance.interceptors.request.use(
			(config: any) => {
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}
				return config;
			},
			(error: any) => Promise.reject(error)
		);

		// Response interceptor to handle token expiration
		const responseInterceptor = axiosInstance.interceptors.response.use(
			(response: any) => response,
			async (error: any) => {
				const originalRequest = error.config;

				if (error.response?.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;

					try {
						const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
						if (refreshToken) {
							const response = await authApi.refreshToken(refreshToken);
							const { accessToken: newToken, admin: adminData } = response.data;

							setAccessToken(newToken);
							setAdmin(adminData);

							localStorage.setItem(TOKEN_KEY, newToken);
							localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));

							originalRequest.headers.Authorization = `Bearer ${newToken}`;
							return axiosInstance(originalRequest);
						}
					} catch (refreshError) {
						logout();
						return Promise.reject(refreshError);
					}
				}

				return Promise.reject(error);
			}
		);

		return () => {
			axiosInstance.interceptors.request.eject(requestInterceptor);
			axiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [accessToken]);

	const login = async (credentials: LoginRequest): Promise<void> => {
		try {
			setIsLoading(true);
			const response = await authApi.login(credentials);
			const {
				admin: adminData,
				accessToken: token,
				refreshToken,
			} = response.data;

			setAdmin(adminData);
			setAccessToken(token);

			// Store in localStorage
			localStorage.setItem(TOKEN_KEY, token);
			localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
			localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));

			toast.success('Đăng nhập thành công!');
		} catch (error: any) {
			const errorMessage =
				error?.response?.data?.message || 'Đăng nhập thất bại';
			toast.error(errorMessage);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setAdmin(null);
		setAccessToken(null);

		// Clear localStorage
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
		localStorage.removeItem(ADMIN_KEY);

		toast.success('Đăng xuất thành công!');
	};

	const value: AuthContextType = {
		admin,
		accessToken,
		isAuthenticated: !!admin && !!accessToken,
		isLoading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
