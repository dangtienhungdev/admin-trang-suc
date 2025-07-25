import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
	useCustomerDetail,
	useDeleteCustomer,
} from '@/hooks/customers/useCustomer';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CustomerDetailPage() {
	const navigate = useNavigate();
	const { customer, isLoading, error } = useCustomerDetail();
	const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleDeleteCustomer = () => {
		if (!customer) return;

		deleteCustomer(customer._id, {
			onSuccess: () => {
				navigate('/customers');
			},
			onSettled: () => {
				setShowDeleteDialog(false);
			},
		});
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
					<Button
						variant="outline"
						onClick={() => navigate('/customers')}
						className="mt-4"
					>
						Quay lại danh sách
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<Button
					variant="ghost"
					onClick={() => navigate('/customers')}
					className="mb-4"
				>
					<ArrowLeftIcon className="w-4 h-4 mr-2" />
					Quay lại danh sách
				</Button>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Chi tiết khách hàng
				</h1>
				<p className="text-gray-600">
					Thông tin chi tiết của khách hàng: {customer?.fullName}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Information */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-lg font-medium text-gray-900">
								Thông tin cá nhân
							</h2>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Họ và tên
									</label>
									<div className="text-lg font-semibold text-gray-900">
										{customer?.fullName}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<div className="text-gray-900">{customer.email}</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Số điện thoại
									</label>
									<div className="text-gray-900">{customer.phone}</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Trạng thái
									</label>
									<Badge
										variant="secondary"
										className="bg-green-100 text-green-800"
									>
										Hoạt động
									</Badge>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Địa chỉ
								</label>
								<div className="text-gray-900 p-3 bg-gray-50 rounded-md">
									{customer.address}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Actions & Info Sidebar */}
				<div className="space-y-6">
					{/* Action Buttons */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác</h3>
						<div className="space-y-3">
							<Button
								onClick={() => navigate(`/customers/edit/${customer._id}`)}
								className="w-full justify-start"
								variant="outline"
							>
								<PencilIcon className="w-4 h-4 mr-2" />
								Chỉnh sửa thông tin
							</Button>

							<AlertDialog
								open={showDeleteDialog}
								onOpenChange={setShowDeleteDialog}
							>
								<AlertDialogTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
									>
										<TrashIcon className="w-4 h-4 mr-2" />
										Xóa khách hàng
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
										<AlertDialogDescription>
											Bạn có chắc chắn muốn xóa khách hàng "{customer?.fullName}
											"? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ
											liệu liên quan.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Hủy</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleDeleteCustomer}
											disabled={isDeleting}
											className="bg-red-600 hover:bg-red-700"
										>
											{isDeleting ? 'Đang xóa...' : 'Xóa khách hàng'}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>

					{/* System Information */}
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-lg font-medium text-gray-900 mb-4">
							Thông tin hệ thống
						</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									ID khách hàng
								</label>
								<code className="text-sm bg-gray-100 px-2 py-1 rounded">
									{customer._id}
								</code>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Ngày tạo tài khoản
								</label>
								<div className="text-sm text-gray-600">
									{new Date(customer.createdAt).toLocaleString('vi-VN')}
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Cập nhật lần cuối
								</label>
								<div className="text-sm text-gray-600">
									{new Date(customer.updatedAt).toLocaleString('vi-VN')}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
