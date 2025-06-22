import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useAdminDetail, useChangePassword } from '@/hooks/admins/useAdmin';

import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
		newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
		confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Mật khẩu xác nhận không khớp',
		path: ['confirmPassword'],
	});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
	const navigate = useNavigate();
	const { admin, isLoading, error } = useAdminDetail();
	const { mutate: changePassword, isPending } = useChangePassword();

	const form = useForm<ChangePasswordForm>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (data: ChangePasswordForm) => {
		if (!admin) return;

		changePassword(
			{ id: admin._id, data },
			{
				onSuccess: () => {
					form.reset();
					navigate(`/admins/detail/${admin._id}`);
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
				<Button
					variant="ghost"
					onClick={() => navigate(`/admins/detail/${admin._id}`)}
					className="mb-4"
				>
					<ArrowLeftIcon className="w-4 h-4 mr-2" />
					Quay lại chi tiết
				</Button>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Đổi mật khẩu</h1>
				<p className="text-gray-600">
					Đổi mật khẩu cho quản trị viên: {admin.username}
				</p>
			</div>

			<div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mật khẩu hiện tại *</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Nhập mật khẩu hiện tại"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mật khẩu mới *</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Nhập mật khẩu mới"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Xác nhận mật khẩu mới *</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Nhập lại mật khẩu mới"
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate(`/admins/detail/${admin._id}`)}
								disabled={isPending}
								className="flex-1"
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isPending} className="flex-1">
								{isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
