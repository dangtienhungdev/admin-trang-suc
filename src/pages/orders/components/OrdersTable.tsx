import { type Order, orderHelpers } from '@/apis/orders.api';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	useCancelOrder,
	useDeleteOrder,
	useUpdateOrderStatus,
} from '@/hooks/orders/useOrders';
import {
	CheckCircle,
	Eye,
	Package,
	Trash2,
	Truck,
	XCircle,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrdersTableProps {
	orders: Order[];
	isLoading: boolean;
	onViewDetails: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
	orders,
	isLoading,
	onViewDetails,
}) => {
	const [deleteDialog, setDeleteDialog] = useState<{
		isOpen: boolean;
		order: Order | null;
	}>({ isOpen: false, order: null });

	const updateOrderStatus = useUpdateOrderStatus();
	const cancelOrder = useCancelOrder();
	const deleteOrder = useDeleteOrder();

	const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
		updateOrderStatus.mutate({
			orderId,
			data: { status: newStatus },
		});
	};

	const handleCancelOrder = (orderId: string) => {
		cancelOrder.mutate({ orderId });
	};

	const handleDeleteOrder = () => {
		if (deleteDialog.order) {
			deleteOrder.mutate(deleteDialog.order._id);
			setDeleteDialog({ isOpen: false, order: null });
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <Package className="h-4 w-4" />;
			case 'confirmed':
				return <CheckCircle className="h-4 w-4" />;
			case 'shipping':
				return <Truck className="h-4 w-4" />;
			case 'success':
				return <CheckCircle className="h-4 w-4" />;
			case 'failed':
				return <XCircle className="h-4 w-4" />;
			default:
				return <Package className="h-4 w-4" />;
		}
	};

	const getNextStatus = (currentStatus: string): Order['status'][] => {
		switch (currentStatus) {
			case 'pending':
				return ['confirmed', 'failed'];
			case 'confirmed':
				return ['shipping', 'failed'];
			case 'shipping':
				return ['success', 'failed'];
			default:
				return [];
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
				))}
			</div>
		);
	}

	if (!orders.length) {
		return (
			<div className="text-center py-8">
				<Package className="mx-auto h-12 w-12 text-gray-400" />
				<p className="mt-2 text-gray-500">Không có đơn hàng nào</p>
			</div>
		);
	}

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mã đơn hàng</TableHead>
							<TableHead>Khách hàng</TableHead>
							<TableHead>Ngày đặt</TableHead>
							<TableHead>Tổng tiền</TableHead>
							<TableHead>Trạng thái</TableHead>
							<TableHead>Phương thức thanh toán</TableHead>
							<TableHead className="text-right">Thao tác</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((order) => (
							<TableRow key={order._id}>
								<TableCell className="font-medium">{order.orderCode}</TableCell>
								<TableCell>
									<div>
										<p className="font-medium">{order.customerId?.fullName}</p>
										<p className="text-sm text-gray-500">
											{order.customerId?.email}
										</p>
									</div>
								</TableCell>
								<TableCell>
									{orderHelpers.formatDate(order.orderDate)}
								</TableCell>
								<TableCell>
									{orderHelpers.formatCurrency(order.finalAmount)}
								</TableCell>
								<TableCell>
									<Badge className={orderHelpers.getStatusColor(order.status)}>
										<div className="flex items-center gap-1">
											{getStatusIcon(order.status)}
											{orderHelpers.getStatusText(order.status)}
										</div>
									</Badge>
								</TableCell>
								<TableCell>
									<span className="text-sm">
										{/* Có thể add payment method từ API */}
										Cash/PayOS
									</span>
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Mở menu</span>
												<svg
													className="h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 5v.01M12 12v.01M12 19v.01"
													/>
												</svg>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onViewDetails(order)}>
												<Eye className="mr-2 h-4 w-4" />
												Xem chi tiết
											</DropdownMenuItem>

											{/* Status update options */}
											{getNextStatus(order.status).map((status) => (
												<DropdownMenuItem
													key={status}
													onClick={() => handleStatusChange(order._id, status)}
													disabled={updateOrderStatus.isPending}
												>
													{getStatusIcon(status)}
													<span className="ml-2">
														Chuyển sang {orderHelpers.getStatusText(status)}
													</span>
												</DropdownMenuItem>
											))}

											{/* Cancel order if not already failed/success */}
											{!['failed', 'success'].includes(order.status) && (
												<DropdownMenuItem
													onClick={() => handleCancelOrder(order._id)}
													disabled={cancelOrder.isPending}
													className="text-red-600"
												>
													<XCircle className="mr-2 h-4 w-4" />
													Hủy đơn hàng
												</DropdownMenuItem>
											)}

											{/* Delete order */}
											<DropdownMenuItem
												onClick={() => setDeleteDialog({ isOpen: true, order })}
												className="text-red-600"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Xóa đơn hàng
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Delete confirmation dialog */}
			<AlertDialog
				open={deleteDialog.isOpen}
				onOpenChange={(open) =>
					setDeleteDialog({
						isOpen: open,
						order: open ? deleteDialog.order : null,
					})
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa đơn hàng{' '}
							<strong>{deleteDialog.order?.orderCode}</strong>? Hành động này
							không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteOrder}
							className="bg-red-600 hover:bg-red-700"
						>
							Xóa đơn hàng
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
