import type { LoginRequest, LoginResponse } from '@/types/auth.type';

import type { BaseResponse } from '@/types/common.type';
import axiosInstance from '@/configs/instances/axios';

export const authApi = {
	login: async (
		credentials: LoginRequest
	): Promise<BaseResponse<LoginResponse>> => {
		const response = await axiosInstance.post('/admins/login', credentials);
		return response.data;
	},

	logout: async (): Promise<BaseResponse<null>> => {
		const response = await axiosInstance.post('/admins/logout');
		return response.data;
	},

	refreshToken: async (
		refreshToken: string
	): Promise<BaseResponse<LoginResponse>> => {
		const response = await axiosInstance.post('/admins/refresh-token', {
			refreshToken,
		});
		return response.data;
	},
};
