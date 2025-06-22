import type {
	Admin,
	ChangePasswordRequest,
	CreateAdminRequest,
	UpdateAdminRequest,
} from '@/types/admin.type';
import type { BaseResponse, PaginatedResponse } from '@/types/common.type';

import axiosInstance from '@/configs/instances/axios';

export interface GetAdminsParams {
	page?: number;
	limit?: number;
}

export const adminsApi = {
	getAdmins: async (
		params?: GetAdminsParams
	): Promise<BaseResponse<PaginatedResponse<Admin>>> => {
		const response = await axiosInstance.get('/admins', { params });
		return response.data;
	},

	getAdmin: async (id: string): Promise<BaseResponse<Admin>> => {
		const response = await axiosInstance.get(`/admins/${id}`);
		return response.data;
	},

	createAdmin: async (
		admin: CreateAdminRequest
	): Promise<BaseResponse<Admin>> => {
		const response = await axiosInstance.post('/admins/register', admin);
		return response.data;
	},

	updateAdmin: async (
		id: string,
		admin: UpdateAdminRequest
	): Promise<BaseResponse<Admin>> => {
		const response = await axiosInstance.patch(`/admins/${id}`, admin);
		return response.data;
	},

	deleteAdmin: async (id: string): Promise<BaseResponse<null>> => {
		const response = await axiosInstance.delete(`/admins/${id}`);
		return response.data;
	},

	changePassword: async (
		id: string,
		data: ChangePasswordRequest
	): Promise<BaseResponse<null>> => {
		const response = await axiosInstance.patch(
			`/admins/${id}/change-password`,
			data
		);
		return response.data;
	},
};
