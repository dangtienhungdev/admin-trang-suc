import { type Order, orderHelpers } from '@/apis/orders.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, CreditCard, MapPin, Package, User } from 'lucide-react';
import React from 'react';

interface OrderDetailModalProps {
	order: Order | null;
	isOpen: boolean;
	onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
	order,
	isOpen,
	onClose,
}) => {
	if (!order) return null;

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <Package className="h-4 w-4" />;
			case 'confirmed':
				return <Package className="h-4 w-4" />;
			case 'shipping':
				return <Package className="h-4 w-4" />;
			case 'success':
				return <Package className="h-4 w-4" />;
			case 'failed':
				return <Package className="h-4 w-4" />;
			default:
				return <Package className="h-4 w-4" />;
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						<span>Chi tiết đơn hàng #{order.orderCode}</span>
						<Badge className={orderHelpers.getStatusColor(order.status)}>
							<div className="flex items-center gap-1">
								{getStatusIcon(order.status)}
								{orderHelpers.getStatusText(order.status)}
							</div>
						</Badge>
					</DialogTitle>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Thông tin khách hàng */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-lg font-semibold">
							<User className="h-5 w-5" />
							Thông tin khách hàng
						</div>
						<div className="space-y-2 bg-gray-50 p-4 rounded-lg">
							<div>
								<label className="text-sm font-medium text-gray-500">
									Họ tên:
								</label>
								<p className="font-medium">{order.customerId?.fullName}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">
									Email:
								</label>
								<p>{order.customerId.email}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">
									Số điện thoại:
								</label>
								<p>{order.customerId.phone}</p>
							</div>
						</div>
					</div>

					{/* Thông tin giao hàng */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-lg font-semibold">
							<MapPin className="h-5 w-5" />
							Thông tin giao hàng
						</div>
						<div className="space-y-2 bg-gray-50 p-4 rounded-lg">
							<div>
								<label className="text-sm font-medium text-gray-500">
									Người nhận:
								</label>
								<p className="font-medium">{order.recipientName}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">
									Số điện thoại:
								</label>
								<p>{order.recipientPhone}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">
									Địa chỉ:
								</label>
								<p>{order.shippingAddress}</p>
							</div>
						</div>
					</div>

					{/* Thông tin đơn hàng */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-lg font-semibold">
							<Calendar className="h-5 w-5" />
							Thông tin đơn hàng
						</div>
						<div className="space-y-2 bg-gray-50 p-4 rounded-lg">
							<div>
								<label className="text-sm font-medium text-gray-500">
									Ngày đặt:
								</label>
								<p>{orderHelpers.formatDate(order.orderDate)}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">
									Mã đơn hàng:
								</label>
								<p className="font-mono">{order.orderCode}</p>
							</div>
							{order.notes && (
								<div>
									<label className="text-sm font-medium text-gray-500">
										Ghi chú:
									</label>
									<p>{order.notes}</p>
								</div>
							)}
							{order.processedBy && (
								<div>
									<label className="text-sm font-medium text-gray-500">
										Xử lý bởi:
									</label>
									<p>{order.processedBy.username}</p>
								</div>
							)}
						</div>
					</div>

					{/* Thông tin thanh toán */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 text-lg font-semibold">
							<CreditCard className="h-5 w-5" />
							Thông tin thanh toán
						</div>
						<div className="space-y-2 bg-gray-50 p-4 rounded-lg">
							<div className="flex justify-between">
								<span className="text-gray-500">Tổng tiền hàng:</span>
								<span>{orderHelpers.formatCurrency(order.totalAmount)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">Phí vận chuyển:</span>
								<span>{orderHelpers.formatCurrency(order.shippingFee)}</span>
							</div>
							{order.discountAmount > 0 && (
								<div className="flex justify-between text-green-600">
									<span>Giảm giá:</span>
									<span>
										-{orderHelpers.formatCurrency(order.discountAmount)}
									</span>
								</div>
							)}
							<div className="border-t pt-2">
								<div className="flex justify-between font-semibold text-lg">
									<span>Tổng thanh toán:</span>
									<span className="text-blue-600">
										{orderHelpers.formatCurrency(order.finalAmount)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Chi tiết sản phẩm */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold flex items-center gap-2">
						<Package className="h-5 w-5" />
						Chi tiết sản phẩm
					</h3>
					<div className="border rounded-lg overflow-hidden">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-2 text-left">Sản phẩm</th>
									<th className="px-4 py-2 text-center">Số lượng</th>
									<th className="px-4 py-2 text-right">Đơn giá</th>
									<th className="px-4 py-2 text-right">Thành tiền</th>
								</tr>
							</thead>
							<tbody>
								{order.orderDetails.map((item, index) => (
									<tr key={index} className="border-t">
										<td className="px-4 py-3">
											<div>
												<p className="font-medium">
													Sản phẩm #{item.productId}
												</p>
												{item.discountApplied > 0 && (
													<p className="text-sm text-green-600">
														Giảm giá: -
														{orderHelpers.formatCurrency(item.discountApplied)}
													</p>
												)}
											</div>
										</td>
										<td className="px-4 py-3 text-center">{item.quantity}</td>
										<td className="px-4 py-3 text-right">
											{orderHelpers.formatCurrency(item.priceAtPurchase)}
										</td>
										<td className="px-4 py-3 text-right font-medium">
											{orderHelpers.formatCurrency(
												item.quantity * item.priceAtPurchase -
													item.discountApplied
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Vouchers áp dụng */}
				{order.appliedDiscounts.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Vouchers áp dụng</h3>
						<div className="space-y-2">
							{order.appliedDiscounts.map((discount, index) => (
								<div
									key={index}
									className="flex justify-between items-center bg-green-50 p-3 rounded-lg"
								>
									<span>Voucher #{discount.discountId}</span>
									<span className="text-green-600 font-medium">
										-{orderHelpers.formatCurrency(discount.discountAmount)}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Footer */}
				<div className="flex justify-end gap-2 pt-4 border-t">
					<Button variant="outline" onClick={onClose}>
						Đóng
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
