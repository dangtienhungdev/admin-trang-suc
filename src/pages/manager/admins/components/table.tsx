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
import { EyeIcon, KeyIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import type { Admin } from '@/types/admin.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeleteAdmin } from '@/hooks/admins/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TableAdminProps {
	admins: Admin[];
}

export const TableAdmin = ({ admins }: TableAdminProps) => {
	const navigate = useNavigate();
	const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleViewDetail = (adminId: string) => {
		navigate(`/admins/detail/${adminId}`);
	};

	const handleEditAdmin = (adminId: string) => {
		navigate(`/admins/edit/${adminId}`);
	};

	const handleChangePassword = (adminId: string) => {
		navigate(`/admins/change-password/${adminId}`);
	};

	const handleDeleteAdmin = (adminId: string) => {
		setDeletingId(adminId);
		deleteAdmin(adminId, {
			onSettled: () => {
				setDeletingId(null);
			},
		});
	};

	const getRoleBadge = (role: string) => {
		if (role === 'SuperAdmin') {
			return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
		}
		return <Badge variant="secondary">Staff</Badge>;
	};

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">STT</TableHead>
						<TableHead>Tên đăng nhập</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Vai trò</TableHead>
						<TableHead>Đăng nhập lần cuối</TableHead>
						<TableHead>Ngày tạo</TableHead>
						<TableHead className="text-right">Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{admins.map((admin: Admin, index: number) => (
						<TableRow key={admin._id}>
							<TableCell className="font-mono text-xs">#{index + 1}</TableCell>
							<TableCell>
								<div className="font-medium text-gray-900">
									{admin.username}
								</div>
							</TableCell>
							<TableCell>
								<div className="text-sm text-gray-600">{admin.email}</div>
							</TableCell>
							<TableCell>{getRoleBadge(admin.role)}</TableCell>
							<TableCell className="text-sm text-gray-600">
								{admin.lastLogin
									? new Date(admin.lastLogin).toLocaleDateString('vi-VN')
									: 'Chưa đăng nhập'}
							</TableCell>
							<TableCell className="text-sm text-gray-600">
								{new Date(admin.createdAt).toLocaleDateString('vi-VN')}
							</TableCell>
							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleViewDetail(admin._id)}
										className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
									>
										<EyeIcon className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEditAdmin(admin._id)}
									>
										<PencilIcon className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleChangePassword(admin._id)}
										className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
									>
										<KeyIcon className="w-4 h-4" />
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
												disabled={admin.role === 'SuperAdmin'}
											>
												<TrashIcon className="w-4 h-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Xác nhận xóa quản trị viên
												</AlertDialogTitle>
												<AlertDialogDescription>
													Bạn có chắc chắn muốn xóa quản trị viên "
													{admin.username}"? Hành động này không thể hoàn tác.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Hủy</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDeleteAdmin(admin._id)}
													disabled={isDeleting && deletingId === admin._id}
													className="bg-red-600 hover:bg-red-700"
												>
													{isDeleting && deletingId === admin._id
														? 'Đang xóa...'
														: 'Xóa'}
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
