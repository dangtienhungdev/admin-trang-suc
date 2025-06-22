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
import { ArrowLeftIcon, KeyIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useAdminDetail, useDeleteAdmin } from '@/hooks/admins/useAdmin';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdminDetailPage() {
	const navigate = useNavigate();
	const { admin, isLoading, error } = useAdminDetail();
	const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleDeleteAdmin = () => {
		if (!admin) return;

		deleteAdmin(admin._id, {
			onSuccess: () => {
				navigate('/admins');
			},
			onSettled: () => {
				setShowDeleteDialog(false);
			},
		});
	};

	const getRoleBadge = (role: string) => {
		if (role === 'SuperAdmin') {
			return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
		}
		return <Badge variant="secondary">Staff</Badge>;
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
					<Button
						variant="outline"
						onClick={() => navigate('/admins')}
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
					onClick={() => navigate('/admins')}
					className="mb-4"
				>
					<ArrowLeftIcon className="w-4 h-4 mr-2" />
					Quay lại danh sách
				</Button>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Chi tiết quản trị viên
				</h1>
				<p className="text-gray-600">
					Thông tin chi tiết của quản trị viên: {admin.username}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Information */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow">
						<div className="px-6 py-4 border-b border-gray-200">
							<h2 className="text-lg font-medium text-gray-900">
								Thông tin tài khoản
							</h2>
						</div>
						<div className="p-6 space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Tên đăng nhập
									</label>
									<div className="text-lg font-semibold text-gray-900">
										{admin.username}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<div className="text-gray-900">{admin.email}</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Vai trò
									</label>
									{getRoleBadge(admin.role)}
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Đăng nhập lần cuối
									</label>
									<div className="text-gray-900">
										{admin.lastLogin
											? new Date(admin.lastLogin).toLocaleString('vi-VN')
											: 'Chưa đăng nhập'}
									</div>
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
								onClick={() => navigate(`/admins/edit/${admin._id}`)}
								className="w-full justify-start"
								variant="outline"
							>
								<PencilIcon className="w-4 h-4 mr-2" />
								Chỉnh sửa thông tin
							</Button>

							<Button
								onClick={() => navigate(`/admins/change-password/${admin._id}`)}
								className="w-full justify-start"
								variant="outline"
							>
								<KeyIcon className="w-4 h-4 mr-2" />
								Đổi mật khẩu
							</Button>

							{admin.role !== 'SuperAdmin' && (
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
											Xóa quản trị viên
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Xác nhận xóa quản trị viên
											</AlertDialogTitle>
											<AlertDialogDescription>
												Bạn có chắc chắn muốn xóa quản trị viên "
												{admin.username}"? Hành động này không thể hoàn tác và
												sẽ xóa tất cả dữ liệu liên quan.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Hủy</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleDeleteAdmin}
												disabled={isDeleting}
												className="bg-red-600 hover:bg-red-700"
											>
												{isDeleting ? 'Đang xóa...' : 'Xóa quản trị viên'}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
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
									ID quản trị viên
								</label>
								<code className="text-sm bg-gray-100 px-2 py-1 rounded">
									{admin._id}
								</code>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Ngày tạo tài khoản
								</label>
								<div className="text-sm text-gray-600">
									{new Date(admin.createdAt).toLocaleString('vi-VN')}
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Cập nhật lần cuối
								</label>
								<div className="text-sm text-gray-600">
									{new Date(admin.updatedAt).toLocaleString('vi-VN')}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
