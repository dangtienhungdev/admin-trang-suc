import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useAdminDetail, useUpdateAdmin } from '@/hooks/admins/useAdmin';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateAdminSchema = z.object({
	username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
});

type UpdateAdminForm = z.infer<typeof updateAdminSchema>;

export default function EditAdminPage() {
	const navigate = useNavigate();
	const { admin, isLoading, error } = useAdminDetail();
	const { mutate: updateAdmin, isPending } = useUpdateAdmin();

	const form = useForm<UpdateAdminForm>({
		resolver: zodResolver(updateAdminSchema),
		defaultValues: {
			username: '',
		},
	});

	useEffect(() => {
		if (admin) {
			form.reset({
				username: admin.username,
			});
		}
	}, [admin, form]);

	const onSubmit = (data: UpdateAdminForm) => {
		if (!admin) return;

		updateAdmin(
			{ id: admin._id, admin: data },
			{
				onSuccess: () => {
					navigate('/admins');
				},
			}
		);
	};

	if (isLoading) {
		return (
			<div className="py-8 px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<div className="text-gray-500">Đang tải dữ liệu...</div>
				</div>
			</div>
		);
	}

	if (error || !admin) {
		return (
			<div className="py-8 px-4 sm:px-6 lg:px-8">
				<div className="text-center text-red-600">
					<h2 className="text-2xl font-bold">Lỗi tải dữ liệu</h2>
					<p>Không thể tải thông tin quản trị viên. Vui lòng thử lại.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Chỉnh sửa thông tin quản trị viên
				</h1>
				<p className="text-gray-600">
					Cập nhật thông tin cho quản trị viên: {admin.username}
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tên đăng nhập *</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập tên đăng nhập"
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Email
								</label>
								<Input value={admin.email} disabled className="bg-gray-50" />
								<p className="text-xs text-gray-500">
									Email không thể thay đổi
								</p>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Vai trò
								</label>
								<Input
									value={admin.role === 'SuperAdmin' ? 'Super Admin' : 'Staff'}
									disabled
									className="bg-gray-50"
								/>
								<p className="text-xs text-gray-500">
									Vai trò không thể thay đổi
								</p>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Đăng nhập lần cuối
								</label>
								<Input
									value={
										admin.lastLogin
											? new Date(admin.lastLogin).toLocaleString('vi-VN')
											: 'Chưa đăng nhập'
									}
									disabled
									className="bg-gray-50"
								/>
							</div>
						</div>

						<div className="flex items-center gap-4 pt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate('/admins')}
								disabled={isPending}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
