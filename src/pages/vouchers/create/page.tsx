import { ArrowLeft, Calendar, Loader2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import type { CreateVoucherDto } from '@/apis/vouchers.api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateVoucher } from '@/hooks/vouchers/useVouchers';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema validation với Zod
const createVoucherSchema = z
	.object({
		discountCode: z
			.string()
			.min(3, 'Mã voucher phải có ít nhất 3 ký tự')
			.max(20, 'Mã voucher không được quá 20 ký tự'),
		discountName: z
			.string()
			.min(3, 'Tên voucher phải có ít nhất 3 ký tự')
			.max(100, 'Tên voucher không được quá 100 ký tự'),
		description: z
			.string()
			.max(500, 'Mô tả không được quá 500 ký tự')
			.optional(),
		discountType: z.enum(['Percentage', 'FixedAmount'], {
			required_error: 'Vui lòng chọn loại giảm giá',
		}),
		discountValue: z
			.number({
				required_error: 'Vui lòng nhập giá trị giảm giá',
				invalid_type_error: 'Giá trị giảm giá phải là số',
			})
			.min(0.01, 'Giá trị giảm giá phải lớn hơn 0'),
		startDate: z.string({
			required_error: 'Vui lòng chọn ngày bắt đầu',
		}),
		endDate: z.string({
			required_error: 'Vui lòng chọn ngày kết thúc',
		}),
		minOrderValue: z
			.number({
				invalid_type_error: 'Giá trị đơn hàng tối thiểu phải là số',
			})
			.min(0, 'Giá trị đơn hàng tối thiểu không được âm')
			.optional(),
		maxDiscountAmount: z
			.number({
				invalid_type_error: 'Giá trị giảm tối đa phải là số',
			})
			.min(0, 'Giá trị giảm tối đa không được âm')
			.optional(),
		usageLimit: z
			.number({
				invalid_type_error: 'Số lần sử dụng tối đa phải là số',
			})
			.min(1, 'Số lần sử dụng tối đa phải ít nhất là 1')
			.optional(),
		isActive: z.boolean(),
	})
	.refine(
		(data) => {
			const startDate = new Date(data.startDate);
			const endDate = new Date(data.endDate);
			return endDate > startDate;
		},
		{
			message: 'Ngày kết thúc phải sau ngày bắt đầu',
			path: ['endDate'],
		}
	)
	.refine(
		(data) => {
			if (data.discountType === 'Percentage') {
				return data.discountValue <= 100;
			}
			return true;
		},
		{
			message: 'Giá trị giảm giá theo phần trăm không được vượt quá 100%',
			path: ['discountValue'],
		}
	)
	.refine(
		(data) => {
			if (data.discountType === 'FixedAmount') {
				return data.discountValue >= 1000;
			}
			return true;
		},
		{
			message: 'Giá trị giảm giá cố định phải ít nhất 1,000 VNĐ',
			path: ['discountValue'],
		}
	);

type FormData = z.infer<typeof createVoucherSchema>;

export default function CreateVoucherPage() {
	const navigate = useNavigate();
	const { admin } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createVoucherMutation = useCreateVoucher();

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(createVoucherSchema),
		defaultValues: {
			discountType: 'Percentage',
			discountValue: 10,
			minOrderValue: 0,
			isActive: true,
			discountCode: '',
			discountName: '',
			description: '',
			startDate: '',
			endDate: '',
		},
	});

	const discountType = watch('discountType');
	const discountValue = watch('discountValue');

	// Handle discount type change
	const handleDiscountTypeChange = async (
		newType: 'Percentage' | 'FixedAmount'
	) => {
		setValue('discountType', newType);

		// Auto-adjust discount value based on type
		const currentValue = watch('discountValue');
		if (newType === 'FixedAmount' && currentValue < 1000) {
			// If switching to FixedAmount and current value is too small, set a reasonable default
			setValue('discountValue', 50000);
		} else if (newType === 'Percentage' && currentValue > 100) {
			// If switching to Percentage and current value is too large, set a reasonable default
			setValue('discountValue', 10);
		}

		// Trigger validation for discountValue after changing
		await trigger('discountValue');
	};

	const onSubmit = async (data: FormData) => {
		console.log('🚀 Form data before submit:', data);

		if (!admin?._id) {
			toast.error('Không thể xác định admin hiện tại. Vui lòng đăng nhập lại.');
			return;
		}

		try {
			setIsSubmitting(true);

			const voucherData: CreateVoucherDto = {
				discountCode: data.discountCode.toUpperCase(),
				discountName: data.discountName,
				description: data.description || '',
				discountType: data.discountType,
				discountValue: data.discountValue,
				startDate: new Date(data.startDate).toISOString(),
				endDate: new Date(data.endDate).toISOString(),
				minOrderValue: data.minOrderValue || 0,
				maxDiscountAmount: data.maxDiscountAmount,
				usageLimit: data.usageLimit,
				isActive: data.isActive,
				createdBy: admin._id,
			};

			console.log('📤 Voucher data to send:', voucherData);

			await createVoucherMutation.mutateAsync(voucherData);

			toast.success('Tạo voucher thành công!');
			navigate('/vouchers');
		} catch (error: any) {
			console.error('❌ Create voucher error:', error);
			console.error('❌ Error response:', error?.response?.data);

			const errorMessage = error?.response?.data?.message;
			if (Array.isArray(errorMessage)) {
				toast.error(`Lỗi: ${errorMessage.join(', ')}`);
			} else {
				toast.error(errorMessage || 'Tạo voucher thất bại');
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBack = () => {
		navigate('/vouchers');
	};

	// Format date for input[type="datetime-local"]
	const formatDateForInput = (date: Date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	// Set default dates
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	const nextMonth = new Date();
	nextMonth.setMonth(nextMonth.getMonth() + 1);

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<div className="flex items-center gap-4 mb-4">
					<Button
						variant="outline"
						size="sm"
						onClick={handleBack}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Quay lại
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Tạo voucher mới</h1>
						<p className="text-gray-600">Tạo voucher giảm giá cho khách hàng</p>
					</div>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Debug Section - Remove in production */}
				{process.env.NODE_ENV === 'development' && (
					<Card className="border-yellow-200 bg-yellow-50">
						<CardHeader>
							<CardTitle className="text-yellow-800">🐛 Debug Info</CardTitle>
						</CardHeader>
						<CardContent className="text-sm">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<strong>Form Values:</strong>
									<pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
										{JSON.stringify(
											{
												discountType: watch('discountType'),
												discountValue: watch('discountValue'),
												discountCode: watch('discountCode'),
												discountName: watch('discountName'),
												startDate: watch('startDate'),
												endDate: watch('endDate'),
												isActive: watch('isActive'),
											},
											null,
											2
										)}
									</pre>
								</div>
								<div>
									<strong>Form Errors:</strong>
									<pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
										{JSON.stringify(errors, null, 2)}
									</pre>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Main Information */}
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Thông tin cơ bản</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="discountCode">
											Mã voucher <span className="text-red-500">*</span>
										</Label>
										<Input
											id="discountCode"
											{...register('discountCode')}
											placeholder="VD: GIAM10K, SUMMER2024"
											className="uppercase"
											maxLength={20}
										/>
										{errors.discountCode && (
											<p className="text-sm text-red-500 mt-1">
												{errors.discountCode.message}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor="discountName">
											Tên voucher <span className="text-red-500">*</span>
										</Label>
										<Input
											id="discountName"
											{...register('discountName')}
											placeholder="VD: Giảm 10K cho đơn hàng đầu tiên"
											maxLength={100}
										/>
										{errors.discountName && (
											<p className="text-sm text-red-500 mt-1">
												{errors.discountName.message}
											</p>
										)}
									</div>
								</div>

								<div>
									<Label htmlFor="description">Mô tả voucher</Label>
									<Textarea
										id="description"
										{...register('description')}
										placeholder="Mô tả chi tiết về voucher..."
										rows={3}
										maxLength={500}
									/>
									{errors.description && (
										<p className="text-sm text-red-500 mt-1">
											{errors.description.message}
										</p>
									)}
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="discountType">
											Loại giảm giá <span className="text-red-500">*</span>
										</Label>
										<Select
											onValueChange={(value) =>
												handleDiscountTypeChange(
													value as 'Percentage' | 'FixedAmount'
												)
											}
											defaultValue="Percentage"
										>
											<SelectTrigger>
												<SelectValue placeholder="Chọn loại giảm giá" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Percentage">
													Theo phần trăm (%)
												</SelectItem>
												<SelectItem value="FixedAmount">
													Số tiền cố định (VNĐ)
												</SelectItem>
											</SelectContent>
										</Select>
										{errors.discountType && (
											<p className="text-sm text-red-500 mt-1">
												{errors.discountType.message}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor="discountValue">
											Giá trị giảm giá <span className="text-red-500">*</span>
										</Label>
										<div className="relative">
											<Input
												id="discountValue"
												type="number"
												step={discountType === 'Percentage' ? '0.01' : '1000'}
												min="0"
												max={discountType === 'Percentage' ? '100' : undefined}
												{...register('discountValue', { valueAsNumber: true })}
												placeholder={
													discountType === 'Percentage' ? '10' : '50000'
												}
											/>
											<div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
												{discountType === 'Percentage' ? '%' : 'VNĐ'}
											</div>
										</div>
										{errors.discountValue && (
											<p className="text-sm text-red-500 mt-1">
												{errors.discountValue.message}
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Date Range */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									Thời gian áp dụng
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="startDate">
											Ngày bắt đầu <span className="text-red-500">*</span>
										</Label>
										<Input
											id="startDate"
											type="datetime-local"
											{...register('startDate')}
											defaultValue={formatDateForInput(tomorrow)}
										/>
										{errors.startDate && (
											<p className="text-sm text-red-500 mt-1">
												{errors.startDate.message}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor="endDate">
											Ngày kết thúc <span className="text-red-500">*</span>
										</Label>
										<Input
											id="endDate"
											type="datetime-local"
											{...register('endDate')}
											defaultValue={formatDateForInput(nextMonth)}
										/>
										{errors.endDate && (
											<p className="text-sm text-red-500 mt-1">
												{errors.endDate.message}
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Settings */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Cài đặt nâng cao</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="minOrderValue">
										Giá trị đơn hàng tối thiểu
									</Label>
									<Input
										id="minOrderValue"
										type="number"
										step="1000"
										min="0"
										{...register('minOrderValue', {
											setValueAs: (value) =>
												value === '' ? undefined : Number(value),
										})}
										placeholder="0"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Để trống hoặc 0 nếu không giới hạn
									</p>
									{errors.minOrderValue && (
										<p className="text-sm text-red-500 mt-1">
											{errors.minOrderValue.message}
										</p>
									)}
								</div>

								{discountType === 'Percentage' && (
									<div>
										<Label htmlFor="maxDiscountAmount">
											Giá trị giảm tối đa
										</Label>
										<Input
											id="maxDiscountAmount"
											type="number"
											step="1000"
											min="0"
											{...register('maxDiscountAmount', {
												setValueAs: (value) =>
													value === '' ? undefined : Number(value),
											})}
											placeholder="100000"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Để trống nếu không giới hạn
										</p>
										{errors.maxDiscountAmount && (
											<p className="text-sm text-red-500 mt-1">
												{errors.maxDiscountAmount.message}
											</p>
										)}
									</div>
								)}

								<div>
									<Label htmlFor="usageLimit">Số lần sử dụng tối đa</Label>
									<Input
										id="usageLimit"
										type="number"
										min="1"
										{...register('usageLimit', {
											setValueAs: (value) =>
												value === '' ? undefined : Number(value),
										})}
										placeholder="100"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Để trống nếu không giới hạn
									</p>
									{errors.usageLimit && (
										<p className="text-sm text-red-500 mt-1">
											{errors.usageLimit.message}
										</p>
									)}
								</div>

								<div className="flex items-center gap-2">
									<input
										id="isActive"
										type="checkbox"
										{...register('isActive')}
										className="rounded border-gray-300"
									/>
									<Label htmlFor="isActive" className="text-sm">
										Kích hoạt voucher ngay
									</Label>
								</div>
							</CardContent>
						</Card>

						{/* Preview */}
						<Card>
							<CardHeader>
								<CardTitle>Xem trước</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
									<div className="text-lg font-bold text-blue-600 mb-1">
										{watch('discountCode') || 'MÃ_VOUCHER'}
									</div>
									<div className="text-sm text-gray-700 mb-2">
										{watch('discountName') || 'Tên voucher'}
									</div>
									<div className="text-lg font-semibold text-purple-600">
										Giảm {discountValue || 0}
										{discountType === 'Percentage' ? '%' : 'đ'}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-end gap-4 pt-6 border-t">
					<Button
						type="button"
						variant="outline"
						onClick={handleBack}
						disabled={isSubmitting}
					>
						Hủy
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center gap-2"
					>
						{isSubmitting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						{isSubmitting ? 'Đang tạo...' : 'Tạo voucher'}
					</Button>
				</div>
			</form>
		</div>
	);
}
