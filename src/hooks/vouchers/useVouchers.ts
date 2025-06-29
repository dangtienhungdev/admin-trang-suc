import {
	type CreateVoucherDto,
	type UpdateVoucherDto,
	type ValidateVoucherDto,
	type VoucherFilters,
	vouchersApi,
} from '@/apis/vouchers.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

// Query keys
export const voucherKeys = {
	all: ['vouchers'] as const,
	lists: () => [...voucherKeys.all, 'list'] as const,
	list: (filters: VoucherFilters) => [...voucherKeys.lists(), filters] as const,
	details: () => [...voucherKeys.all, 'detail'] as const,
	detail: (id: string) => [...voucherKeys.details(), id] as const,
	stats: () => [...voucherKeys.all, 'stats'] as const,
	active: () => [...voucherKeys.all, 'active'] as const,
	byCode: (code: string) => [...voucherKeys.all, 'code', code] as const,
};

// Hook để lấy danh sách vouchers
export const useVouchers = (filters: VoucherFilters = {}) => {
	return useQuery({
		queryKey: voucherKeys.list(filters),
		queryFn: () => vouchersApi.getVouchers(filters),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Hook để lấy chi tiết voucher
export const useVoucher = (voucherId: string) => {
	return useQuery({
		queryKey: voucherKeys.detail(voucherId),
		queryFn: () => vouchersApi.getVoucherById(voucherId),
		enabled: !!voucherId,
	});
};

// Hook để lấy voucher theo mã
export const useVoucherByCode = (code: string) => {
	return useQuery({
		queryKey: voucherKeys.byCode(code),
		queryFn: () => vouchersApi.getVoucherByCode(code),
		enabled: !!code,
	});
};

// Hook để lấy thống kê vouchers
export const useVoucherStats = () => {
	return useQuery({
		queryKey: voucherKeys.stats(),
		queryFn: () => vouchersApi.getVoucherStats(),
		staleTime: 10 * 60 * 1000, // 10 minutes
	});
};

// Hook để lấy vouchers đang hoạt động
export const useActiveVouchers = () => {
	return useQuery({
		queryKey: voucherKeys.active(),
		queryFn: () => vouchersApi.getActiveVouchers(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

// Hook để tạo voucher mới
export const useCreateVoucher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateVoucherDto) => vouchersApi.createVoucher(data),
		onSuccess: (newVoucher) => {
			// Invalidate và update cache
			queryClient.invalidateQueries({ queryKey: voucherKeys.all });

			// Update specific voucher detail cache
			queryClient.setQueryData(voucherKeys.detail(newVoucher._id), newVoucher);

			toast.success(`Tạo voucher "${newVoucher.discountName}" thành công`);
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || 'Tạo voucher thất bại';
			toast.error(message);
		},
	});
};

// Hook để cập nhật voucher
export const useUpdateVoucher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			voucherId,
			data,
		}: {
			voucherId: string;
			data: UpdateVoucherDto;
		}) => vouchersApi.updateVoucher(voucherId, data),
		onSuccess: (updatedVoucher) => {
			// Invalidate và update cache
			queryClient.invalidateQueries({ queryKey: voucherKeys.all });

			// Update specific voucher detail cache
			queryClient.setQueryData(
				voucherKeys.detail(updatedVoucher._id),
				updatedVoucher
			);

			toast.success(
				`Cập nhật voucher "${updatedVoucher.discountName}" thành công`
			);
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message || 'Cập nhật voucher thất bại';
			toast.error(message);
		},
	});
};

// Hook để xóa voucher
export const useDeleteVoucher = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (voucherId: string) => vouchersApi.deleteVoucher(voucherId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: voucherKeys.all });
			toast.success('Xóa voucher thành công');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || 'Xóa voucher thất bại';
			toast.error(message);
		},
	});
};

// Hook để validate voucher
export const useValidateVoucher = () => {
	return useMutation({
		mutationFn: (data: ValidateVoucherDto) => vouchersApi.validateVoucher(data),
		onSuccess: (result) => {
			if (result.isValid) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message || 'Kiểm tra voucher thất bại';
			toast.error(message);
		},
	});
};
