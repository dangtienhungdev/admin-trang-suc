import { customersApi, type GetCustomersParams } from '@/apis/customers.api';
import type {
	CreateCustomerRequest,
	UpdateCustomerRequest,
} from '@/types/customer.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useCustomers = (params?: GetCustomersParams) => {
	const result = useQuery({
		queryKey: [customersApi.getCustomers.name, params],
		queryFn: () => customersApi.getCustomers(params),
	});
	const { data: customersResponse } = result;

	const customers = customersResponse?.data.items || [];
	const pagination = customersResponse?.data;

	return {
		...result,
		customers,
		pagination,
	};
};

export const useCustomerDetail = () => {
	const { customerId } = useParams();

	const result = useQuery({
		queryKey: [customersApi.getCustomer.name, customerId],
		queryFn: () => customersApi.getCustomer(customerId as string),
		enabled: !!customerId,
	});

	const { data: customerResponse } = result;
	const customer = customerResponse?.data;

	return {
		...result,
		customer,
	};
};

export const useCreateCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (customer: CreateCustomerRequest) =>
			customersApi.createCustomer(customer),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [customersApi.getCustomers.name],
			});
			toast.success('Tạo khách hàng thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi tạo khách hàng';
			toast.error(errorMessage);
		},
	});
};

export const useUpdateCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			customer,
		}: {
			id: string;
			customer: UpdateCustomerRequest;
		}) => customersApi.updateCustomer(id, customer),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [customersApi.getCustomers.name],
			});
			queryClient.invalidateQueries({
				queryKey: [customersApi.getCustomer.name],
			});
			toast.success('Cập nhật thông tin khách hàng thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message ||
				'Có lỗi xảy ra khi cập nhật thông tin khách hàng';
			toast.error(errorMessage);
		},
	});
};

export const useDeleteCustomer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => customersApi.deleteCustomer(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [customersApi.getCustomers.name],
			});
			toast.success('Xóa khách hàng thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi xóa khách hàng';
			toast.error(errorMessage);
		},
	});
};
