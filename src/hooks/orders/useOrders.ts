import {
	type OrderFilters,
	type UpdateOrderStatusDto,
	ordersApi,
} from '@/apis/orders.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

// Query keys
export const orderKeys = {
	all: ['orders'] as const,
	lists: () => [...orderKeys.all, 'list'] as const,
	list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
	details: () => [...orderKeys.all, 'detail'] as const,
	detail: (id: string) => [...orderKeys.details(), id] as const,
	stats: () => [...orderKeys.all, 'stats'] as const,
	payments: (orderId: string) =>
		[...orderKeys.all, 'payments', orderId] as const,
};

// Hook để lấy danh sách orders
export const useOrders = (filters: OrderFilters = {}) => {
	return useQuery({
		queryKey: orderKeys.list(filters),
		queryFn: () => ordersApi.getOrders(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Hook để lấy chi tiết order
export const useOrder = (orderId: string) => {
	return useQuery({
		queryKey: orderKeys.detail(orderId),
		queryFn: () => ordersApi.getOrderById(orderId),
		enabled: !!orderId,
	});
};

// Hook để lấy thống kê orders
export const useOrderStats = (
	filters: Pick<OrderFilters, 'startDate' | 'endDate'> = {}
) => {
	return useQuery({
		queryKey: orderKeys.stats(),
		queryFn: () => ordersApi.getOrderStats(filters),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook để lấy payments của order
export const useOrderPayments = (orderId: string) => {
	return useQuery({
		queryKey: orderKeys.payments(orderId),
		queryFn: () => ordersApi.getOrderPayments(orderId),
		enabled: !!orderId,
	});
};

// Hook để cập nhật trạng thái order
export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			orderId,
			data,
		}: {
			orderId: string;
			data: UpdateOrderStatusDto;
		}) => ordersApi.updateOrderStatus(orderId, data),
		onSuccess: (updatedOrder) => {
			// Invalidate và update cache
			queryClient.invalidateQueries({ queryKey: orderKeys.all });

			// Update specific order detail cache
			queryClient.setQueryData(
				orderKeys.detail(updatedOrder._id),
				updatedOrder
			);

			toast.success(`Cập nhật trạng thái đơn hàng thành công`);
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message ||
				'Cập nhật trạng thái đơn hàng thất bại';
			toast.error(message);
		},
	});
};

// Hook để hủy order
export const useCancelOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ orderId, reason }: { orderId: string; reason?: string }) =>
			ordersApi.cancelOrder(orderId, reason),
		onSuccess: (cancelledOrder) => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.setQueryData(
				orderKeys.detail(cancelledOrder._id),
				cancelledOrder
			);

			toast.success('Hủy đơn hàng thành công');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || 'Hủy đơn hàng thất bại';
			toast.error(message);
		},
	});
};

// Hook để xóa order
export const useDeleteOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => ordersApi.deleteOrder(orderId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			toast.success('Xóa đơn hàng thành công');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || 'Xóa đơn hàng thất bại';
			toast.error(message);
		},
	});
};
