import {
	type VoucherStats as VoucherStatsType,
	voucherHelpers,
} from '@/apis/vouchers.api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	CheckCircleIcon,
	TicketIcon,
	TrendingUpIcon,
	XCircleIcon,
} from 'lucide-react';
import React from 'react';

interface VoucherStatsProps {
	stats: VoucherStatsType | null;
	isLoading?: boolean;
}

export const VoucherStats: React.FC<VoucherStatsProps> = ({
	stats,
	isLoading = false,
}) => {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{[...Array(4)].map((_, index) => (
					<Card key={index} className="animate-pulse">
						<CardHeader className="pb-2">
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						</CardHeader>
						<CardContent>
							<div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
							<div className="h-3 bg-gray-200 rounded w-full"></div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="text-center py-8">
				<p className="text-gray-500">Không có dữ liệu thống kê</p>
			</div>
		);
	}

	const statCards = [
		{
			title: 'Tổng vouchers',
			value: stats.totalVouchers,
			icon: TicketIcon,
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
			description: 'Tất cả vouchers trong hệ thống',
		},
		{
			title: 'Đang hoạt động',
			value: stats.activeVouchers,
			icon: CheckCircleIcon,
			color: 'text-green-600',
			bgColor: 'bg-green-100',
			description: 'Vouchers có thể sử dụng',
		},
		{
			title: 'Đã hết hạn',
			value: stats.expiredVouchers,
			icon: XCircleIcon,
			color: 'text-red-600',
			bgColor: 'bg-red-100',
			description: 'Vouchers không còn hiệu lực',
		},
		{
			title: 'Tổng lượt sử dụng',
			value: stats.totalUsed,
			icon: TrendingUpIcon,
			color: 'text-purple-600',
			bgColor: 'bg-purple-100',
			description: 'Tổng số lần vouchers được sử dụng',
		},
	];

	return (
		<div className="space-y-6">
			{/* Main Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<Card key={index} className="hover:shadow-md transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-gray-600">
									{stat.title}
								</CardTitle>
								<div className={`p-2 rounded-full ${stat.bgColor}`}>
									<Icon className={`h-4 w-4 ${stat.color}`} />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-gray-900">
									{stat.value.toLocaleString()}
								</div>
								<p className="text-xs text-gray-500 mt-1">{stat.description}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Type Breakdown */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Breakdown by Type */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold flex items-center gap-2">
							<TicketIcon className="h-5 w-5" />
							Phân loại vouchers
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{stats.typeBreakdown.map((type, index) => {
							const percentage =
								stats.totalVouchers > 0
									? Math.round((type.count / stats.totalVouchers) * 100)
									: 0;

							return (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className={
													type._id === 'Percentage'
														? 'bg-blue-50 text-blue-700 border-blue-200'
														: 'bg-green-50 text-green-700 border-green-200'
												}
											>
												{voucherHelpers.getDiscountTypeText(type._id)}
											</Badge>
											<span className="text-sm font-medium">
												{type.count} vouchers
											</span>
										</div>
										<span className="text-sm text-gray-500">{percentage}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`h-2 rounded-full transition-all duration-300 ${
												type._id === 'Percentage'
													? 'bg-blue-500'
													: 'bg-green-500'
											}`}
											style={{ width: `${percentage}%` }}
										/>
									</div>
									<div className="text-xs text-gray-500">
										Đã sử dụng: {type.totalUsed.toLocaleString()} lần
									</div>
								</div>
							);
						})}
					</CardContent>
				</Card>

				{/* Usage Summary */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold flex items-center gap-2">
							<TrendingUpIcon className="h-5 w-5" />
							Tổng quan sử dụng
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-600">
									Tỷ lệ vouchers hoạt động
								</span>
								<span className="text-sm font-bold text-green-600">
									{stats.totalVouchers > 0
										? Math.round(
												(stats.activeVouchers / stats.totalVouchers) * 100
										  )
										: 0}
									%
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-green-500 h-2 rounded-full transition-all duration-300"
									style={{
										width: `${
											stats.totalVouchers > 0
												? (stats.activeVouchers / stats.totalVouchers) * 100
												: 0
										}%`,
									}}
								/>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-gray-600">
									Tỷ lệ vouchers hết hạn
								</span>
								<span className="text-sm font-bold text-red-600">
									{stats.totalVouchers > 0
										? Math.round(
												(stats.expiredVouchers / stats.totalVouchers) * 100
										  )
										: 0}
									%
								</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-red-500 h-2 rounded-full transition-all duration-300"
									style={{
										width: `${
											stats.totalVouchers > 0
												? (stats.expiredVouchers / stats.totalVouchers) * 100
												: 0
										}%`,
									}}
								/>
							</div>
						</div>

						<div className="pt-4 border-t">
							<div className="text-center">
								<div className="text-2xl font-bold text-gray-900">
									{(stats.totalUsed / Math.max(stats.totalVouchers, 1)).toFixed(
										1
									)}
								</div>
								<div className="text-sm text-gray-500">
									Trung bình lượt sử dụng/voucher
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
