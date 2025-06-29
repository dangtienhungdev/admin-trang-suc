import {
	type OrderStats as OrderStatsType,
	orderHelpers,
} from '@/apis/orders.api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	AlertCircle,
	CheckCircle,
	Clock,
	DollarSign,
	Package,
	TrendingUp,
	Truck,
	XCircle,
} from 'lucide-react';
import React from 'react';

interface OrderStatsProps {
	stats: OrderStatsType | null;
	isLoading: boolean;
}

export const OrderStats: React.FC<OrderStatsProps> = ({ stats, isLoading }) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				{[...Array(4)].map((_, i) => (
					<Card key={i}>
						<CardContent className="p-6">
							<div className="animate-pulse">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-8 bg-gray-200 rounded w-1/2"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<Card>
					<CardContent className="p-6">
						<div className="text-center text-gray-500">
							<AlertCircle className="h-8 w-8 mx-auto mb-2" />
							<p>Không có dữ liệu thống kê</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <Clock className="h-4 w-4" />;
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

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'confirmed':
				return 'bg-blue-100 text-blue-800 border-blue-200';
			case 'shipping':
				return 'bg-purple-100 text-purple-800 border-purple-200';
			case 'success':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'failed':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	return (
		<div className="space-y-6 mb-6">
			{/* Overview Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Total Orders */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
						<Package className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalOrders.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground">
							Trong khoảng thời gian được chọn
						</p>
					</CardContent>
				</Card>

				{/* Total Revenue */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tổng doanh thu
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{orderHelpers.formatCurrency(stats.totalRevenue)}
						</div>
						<p className="text-xs text-muted-foreground">
							Từ {stats.totalOrders} đơn hàng
						</p>
					</CardContent>
				</Card>

				{/* Average Order Value */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Giá trị trung bình
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-blue-600">
							{orderHelpers.formatCurrency(
								stats.totalOrders > 0
									? stats.totalRevenue / stats.totalOrders
									: 0
							)}
						</div>
						<p className="text-xs text-muted-foreground">
							Trung bình mỗi đơn hàng
						</p>
					</CardContent>
				</Card>

				{/* Success Rate */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Tỷ lệ thành công
						</CardTitle>
						<CheckCircle className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{stats.totalOrders > 0
								? (
										((stats.statusBreakdown.find((s) => s._id === 'success')
											?.count || 0) /
											stats.totalOrders) *
										100
								  ).toFixed(1)
								: 0}
							%
						</div>
						<p className="text-xs text-muted-foreground">Đơn hàng hoàn thành</p>
					</CardContent>
				</Card>
			</div>

			{/* Status Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Package className="h-5 w-5" />
						Phân tích theo trạng thái
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
						{stats.statusBreakdown.map((statusData) => (
							<div key={statusData._id} className="space-y-2">
								<div className="flex items-center justify-between">
									<Badge className={getStatusColor(statusData._id)}>
										<div className="flex items-center gap-1">
											{getStatusIcon(statusData._id)}
											{orderHelpers.getStatusText(statusData._id)}
										</div>
									</Badge>
								</div>
								<div className="space-y-1">
									<div className="text-2xl font-bold">
										{statusData.count.toLocaleString()}
									</div>
									<div className="text-sm text-gray-600">
										{orderHelpers.formatCurrency(statusData.totalAmount)}
									</div>
									<div className="text-xs text-gray-500">
										{stats.totalOrders > 0
											? ((statusData.count / stats.totalOrders) * 100).toFixed(
													1
											  )
											: 0}
										% tổng đơn hàng
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Progress Bar */}
					<div className="mt-6">
						<div className="text-sm font-medium mb-2">Phân bố trạng thái</div>
						<div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
							{stats.statusBreakdown.map((statusData) => {
								const percentage =
									stats.totalOrders > 0
										? (statusData.count / stats.totalOrders) * 100
										: 0;

								let bgColor = 'bg-gray-400';
								switch (statusData._id) {
									case 'pending':
										bgColor = 'bg-yellow-400';
										break;
									case 'confirmed':
										bgColor = 'bg-blue-400';
										break;
									case 'shipping':
										bgColor = 'bg-purple-400';
										break;
									case 'success':
										bgColor = 'bg-green-400';
										break;
									case 'failed':
										bgColor = 'bg-red-400';
										break;
								}

								return (
									<div
										key={statusData._id}
										className={`${bgColor} h-full`}
										style={{ width: `${percentage}%` }}
										title={`${orderHelpers.getStatusText(
											statusData._id
										)}: ${percentage.toFixed(1)}%`}
									/>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
