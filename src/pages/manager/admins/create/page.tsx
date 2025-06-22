import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateAdmin } from '@/hooks/admins/useAdmin';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createAdminSchema = z.object({
	username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
	email: z.string().email('Email không hợp lệ'),
	password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
	role: z.enum(['SuperAdmin', 'Staff'], {
		required_error: 'Vui lòng chọn vai trò',
	}),
});

type CreateAdminForm = z.infer<typeof createAdminSchema>;

export default function CreateAdminPage() {
	const navigate = useNavigate();
	const { mutate: createAdmin, isPending } = useCreateAdmin();

	const form = useForm<CreateAdminForm>({
		resolver: zodResolver(createAdminSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			role: 'Staff',
		},
	});

	const onSubmit = (data: CreateAdminForm) => {
		createAdmin(data, {
			onSuccess: () => {
				navigate('/admins');
			},
		});
	};

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Thêm quản trị viên mới
				</h1>
				<p className="text-gray-600">
					Tạo tài khoản quản trị viên mới cho hệ thống
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

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email *</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="email"
												placeholder="Nhập địa chỉ email"
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Mật khẩu *</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="password"
												placeholder="Nhập mật khẩu"
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Vai trò *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isPending}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Chọn vai trò" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="Staff">Staff</SelectItem>
												<SelectItem value="SuperAdmin">Super Admin</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
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
								{isPending ? 'Đang tạo...' : 'Tạo quản trị viên'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
