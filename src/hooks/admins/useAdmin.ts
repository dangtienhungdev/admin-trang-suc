import { adminsApi, type GetAdminsParams } from '@/apis/admins.api';
import type {
	ChangePasswordRequest,
	CreateAdminRequest,
	UpdateAdminRequest,
} from '@/types/admin.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useAdmins = (params?: GetAdminsParams) => {
	const result = useQuery({
		queryKey: [adminsApi.getAdmins.name, params],
		queryFn: () => adminsApi.getAdmins(params),
	});
	const { data: adminsResponse } = result;

	const admins = adminsResponse?.data.items || [];
	const pagination = adminsResponse?.data;

	return {
		...result,
		admins,
		pagination,
	};
};

export const useAdminDetail = () => {
	const { adminId } = useParams();

	const result = useQuery({
		queryKey: [adminsApi.getAdmin.name, adminId],
		queryFn: () => adminsApi.getAdmin(adminId as string),
		enabled: !!adminId,
	});

	const { data: adminResponse } = result;
	const admin = adminResponse?.data;

	return {
		...result,
		admin,
	};
};

export const useCreateAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (admin: CreateAdminRequest) => adminsApi.createAdmin(admin),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [adminsApi.getAdmins.name],
			});
			toast.success('Tạo tài khoản quản trị viên thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message ||
				'Có lỗi xảy ra khi tạo tài khoản quản trị viên';
			toast.error(errorMessage);
		},
	});
};

export const useUpdateAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, admin }: { id: string; admin: UpdateAdminRequest }) =>
			adminsApi.updateAdmin(id, admin),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [adminsApi.getAdmins.name],
			});
			queryClient.invalidateQueries({
				queryKey: [adminsApi.getAdmin.name],
			});
			toast.success('Cập nhật thông tin quản trị viên thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message ||
				'Có lỗi xảy ra khi cập nhật thông tin quản trị viên';
			toast.error(errorMessage);
		},
	});
};

export const useDeleteAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => adminsApi.deleteAdmin(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [adminsApi.getAdmins.name],
			});
			toast.success('Xóa quản trị viên thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi xóa quản trị viên';
			toast.error(errorMessage);
		},
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: ChangePasswordRequest }) =>
			adminsApi.changePassword(id, data),
		onSuccess: () => {
			toast.success('Đổi mật khẩu thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu';
			toast.error(errorMessage);
		},
	});
};
