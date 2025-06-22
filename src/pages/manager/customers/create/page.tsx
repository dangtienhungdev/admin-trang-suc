import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCustomer } from '@/hooks/customers/useCustomer';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createCustomerSchema = z.object({
	fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
	phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
	email: z.string().email('Email không hợp lệ'),
	password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
	address: z.string().min(1, 'Địa chỉ là bắt buộc'),
});

type CreateCustomerForm = z.infer<typeof createCustomerSchema>;

export default function CreateCustomerPage() {
	const navigate = useNavigate();
	const { mutate: createCustomer, isPending } = useCreateCustomer();

	const form = useForm<CreateCustomerForm>({
		resolver: zodResolver(createCustomerSchema),
		defaultValues: {
			fullName: '',
			phone: '',
			email: '',
			password: '',
			address: '',
		},
	});

	const onSubmit = (data: CreateCustomerForm) => {
		createCustomer(data, {
			onSuccess: () => {
				navigate('/customers');
			},
		});
	};

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Thêm khách hàng mới
				</h1>
				<p className="text-gray-600">
					Điền thông tin để tạo tài khoản khách hàng mới
				</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Họ và tên *</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập họ và tên"
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
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Số điện thoại *</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Nhập số điện thoại"
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
						</div>

						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Địa chỉ *</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Nhập địa chỉ đầy đủ"
											disabled={isPending}
											rows={3}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex items-center gap-4 pt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate('/customers')}
								disabled={isPending}
							>
								Hủy
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? 'Đang tạo...' : 'Tạo khách hàng'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
