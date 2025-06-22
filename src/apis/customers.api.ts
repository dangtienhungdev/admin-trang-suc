import type { BaseResponse, PaginatedResponse } from '@/types/common.type';
import type {
	CreateCustomerRequest,
	Customer,
	UpdateCustomerRequest,
} from '@/types/customer.type';

import axiosInstance from '@/configs/instances/axios';

export interface GetCustomersParams {
	page?: number;
	limit?: number;
}

export const customersApi = {
	getCustomers: async (
		params?: GetCustomersParams
	): Promise<BaseResponse<PaginatedResponse<Customer>>> => {
		const response = await axiosInstance.get('/customers', { params });
		return response.data;
	},

	getCustomer: async (id: string): Promise<BaseResponse<Customer>> => {
		const response = await axiosInstance.get(`/customers/${id}`);
		return response.data;
	},

	createCustomer: async (
		customer: CreateCustomerRequest
	): Promise<BaseResponse<Customer>> => {
		const response = await axiosInstance.post('/customers/register', customer);
		return response.data;
	},

	updateCustomer: async (
		id: string,
		customer: UpdateCustomerRequest
	): Promise<BaseResponse<Customer>> => {
		const response = await axiosInstance.patch(`/customers/${id}`, customer);
		return response.data;
	},

	deleteCustomer: async (id: string): Promise<BaseResponse<null>> => {
		const response = await axiosInstance.delete(`/customers/${id}`);
		return response.data;
	},
};
