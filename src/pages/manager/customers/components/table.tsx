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
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import type { Customer } from '@/types/customer.type';
import { useDeleteCustomer } from '@/hooks/customers/useCustomer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TableCustomerProps {
	customers: Customer[];
}

export const TableCustomer = ({ customers }: TableCustomerProps) => {
	const navigate = useNavigate();
	const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleViewDetail = (customerId: string) => {
		navigate(`/customers/detail/${customerId}`);
	};

	const handleEditCustomer = (customerId: string) => {
		navigate(`/customers/edit/${customerId}`);
	};

	const handleDeleteCustomer = (customerId: string) => {
		setDeletingId(customerId);
		deleteCustomer(customerId, {
			onSettled: () => {
				setDeletingId(null);
			},
		});
	};

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">STT</TableHead>
						<TableHead>Họ và tên</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Số điện thoại</TableHead>
						<TableHead>Địa chỉ</TableHead>
						<TableHead>Ngày tạo</TableHead>
						<TableHead className="text-right">Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{customers.map((customer: Customer, index: number) => (
						<TableRow key={customer._id}>
							<TableCell className="font-mono text-xs">#{index + 1}</TableCell>
							<TableCell>
								<div className="font-medium text-gray-900">
									{customer?.fullName}
								</div>
							</TableCell>
							<TableCell>
								<div className="text-sm text-gray-600">{customer.email}</div>
							</TableCell>
							<TableCell>
								<div className="text-sm text-gray-600">{customer.phone}</div>
							</TableCell>
							<TableCell>
								<div className="text-sm text-gray-600 max-w-xs truncate">
									{customer.address}
								</div>
							</TableCell>
							<TableCell className="text-sm text-gray-600">
								{new Date(customer.createdAt).toLocaleDateString('vi-VN')}
							</TableCell>
							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleViewDetail(customer._id)}
										className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
									>
										<EyeIcon className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEditCustomer(customer._id)}
									>
										<PencilIcon className="w-4 h-4" />
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<TrashIcon className="w-4 h-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Xác nhận xóa khách hàng
												</AlertDialogTitle>
												<AlertDialogDescription>
													Bạn có chắc chắn muốn xóa khách hàng "
													{customer?.fullName}"? Hành động này không thể hoàn
													tác.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Hủy</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDeleteCustomer(customer._id)}
													disabled={isDeleting && deletingId === customer._id}
													className="bg-red-600 hover:bg-red-700"
												>
													{isDeleting && deletingId === customer._id
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
