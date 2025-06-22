import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	useCustomerDetail,
	useUpdateCustomer,
} from '@/hooks/customers/useCustomer';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateCustomerSchema = z.object({
	fullName: z.string().min(1, 'Họ và tên là bắt buộc'),
	phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
	address: z.string().min(1, 'Địa chỉ là bắt buộc'),
});

type UpdateCustomerForm = z.infer<typeof updateCustomerSchema>;

export default function EditCustomerPage() {
	const navigate = useNavigate();
	const { customer, isLoading, error } = useCustomerDetail();
	const { mutate: updateCustomer, isPending } = useUpdateCustomer();

	const form = useForm<UpdateCustomerForm>({
		resolver: zodResolver(updateCustomerSchema),
		defaultValues: {
			fullName: '',
			phone: '',
			address: '',
		},
	});

	useEffect(() => {
		if (customer) {
			form.reset({
				fullName: customer.fullName,
				phone: customer.phone,
				address: customer.address,
			});
		}
	}, [customer, form]);

	const onSubmit = (data: UpdateCustomerForm) => {
		if (!customer) return;

		updateCustomer(
			{ id: customer._id, customer: data },
			{
				onSuccess: () => {
					navigate('/customers');
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

	if (error || !customer) {
		return (
			<div className="py-8 px-4 sm:px-6 lg:px-8">
				<div className="text-center text-red-600">
					<h2 className="text-2xl font-bold">Lỗi tải dữ liệu</h2>
					<p>Không thể tải thông tin khách hàng. Vui lòng thử lại.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Chỉnh sửa thông tin khách hàng
				</h1>
				<p className="text-gray-600">
					Cập nhật thông tin cho khách hàng: {customer.fullName}
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

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Email
								</label>
								<Input value={customer.email} disabled className="bg-gray-50" />
								<p className="text-xs text-gray-500">
									Email không thể thay đổi
								</p>
							</div>

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

							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Ngày tạo
								</label>
								<Input
									value={new Date(customer.createdAt).toLocaleDateString(
										'vi-VN'
									)}
									disabled
									className="bg-gray-50"
								/>
							</div>
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
								{isPending ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
