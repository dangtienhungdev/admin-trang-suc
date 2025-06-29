import { type Order, type OrderFilters } from '@/apis/orders.api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useOrders, useOrderStats } from '@/hooks/orders/useOrders';
import { Package, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { OrderDetailModal } from './components/OrderDetailModal';
import { OrderFilters as OrderFiltersComponent } from './components/OrderFilters';
import { OrderPagination } from './components/OrderPagination';
import { OrdersTable } from './components/OrdersTable';
import { OrderStats } from './components/OrderStats';

// Status tabs configuration
const statusTabs = [
	{ value: '', label: 'Tất cả', icon: Package },
	{ value: 'pending', label: 'Chờ xử lý', icon: Package },
	{ value: 'confirmed', label: 'Đã xác nhận', icon: Package },
	{ value: 'shipping', label: 'Đang giao', icon: Package },
	{ value: 'success', label: 'Hoàn thành', icon: Package },
	{ value: 'failed', label: 'Đã hủy', icon: Package },
];

const OrderPage: React.FC = () => {
	// State management
	const [filters, setFilters] = useState<OrderFilters>({
		page: 1,
		limit: 10,
		status: '',
		sortBy: 'orderDate',
		sortOrder: 'desc',
	});

	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [showFilters, setShowFilters] = useState(false);

	// API hooks
	const { data: ordersData, isLoading, refetch } = useOrders(filters);
	const { data: statsData, isLoading: isStatsLoading } = useOrderStats({
		startDate: filters.startDate,
		endDate: filters.endDate,
	});

	// Auto-refresh every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 30000);

		return () => clearInterval(interval);
	}, [refetch]);

	// Event handlers
	const handleFiltersChange = (newFilters: OrderFilters) => {
		setFilters(newFilters);
	};

	const handleResetFilters = () => {
		setFilters({
			page: 1,
			limit: 10,
			status: '',
			sortBy: 'orderDate',
			sortOrder: 'desc',
		});
	};

	const handleTabChange = (status: string) => {
		setFilters((prev) => ({ ...prev, status, page: 1 }));
	};

	const handleViewDetails = (order: Order) => {
		setSelectedOrder(order);
		setIsDetailModalOpen(true);
	};

	const handleCloseDetailModal = () => {
		setSelectedOrder(null);
		setIsDetailModalOpen(false);
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const handleRefresh = () => {
		refetch();
	};

	// Get tab counts from stats
	const getTabCount = (status: string) => {
		if (!statsData) return 0;
		if (status === '') return statsData.totalOrders;
		return statsData.statusBreakdown.find((s) => s._id === status)?.count || 0;
	};

	return (
		<div className="space-y-6 py-8 px-4 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Quản lý đơn hàng
					</h1>
					<p className="text-gray-500 mt-2">
						Quản lý và theo dõi tất cả đơn hàng của khách hàng
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => setShowFilters(!showFilters)}
						className="hidden md:flex"
					>
						<Package className="h-4 w-4 mr-2" />
						{showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
					</Button>
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={isLoading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
						/>
						Làm mới
					</Button>
				</div>
			</div>

			{/* Order Statistics */}
			<OrderStats stats={statsData || null} isLoading={isStatsLoading} />

			{/* Filters */}
			{showFilters && (
				<OrderFiltersComponent
					filters={filters}
					onFiltersChange={handleFiltersChange}
					onReset={handleResetFilters}
					isLoading={isLoading}
				/>
			)}

			{/* Status Tabs */}
			<div className="space-y-4">
				{/* Tab Headers */}
				<div className="flex border-b border-gray-200">
					{statusTabs.map((tab) => {
						const Icon = tab.icon;
						const count = getTabCount(tab.value);
						const isActive = (filters.status || '') === tab.value;

						return (
							<button
								key={tab.value}
								onClick={() => handleTabChange(tab.value)}
								className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
									isActive
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								<Icon className="h-4 w-4" />
								<span className="hidden sm:inline">{tab.label}</span>
								{count > 0 && (
									<Badge variant="secondary" className="ml-1">
										{count}
									</Badge>
								)}
							</button>
						);
					})}
				</div>

				{/* Tab Content */}
				<div className="space-y-4">
					{/* Orders Table */}
					<div className="bg-white rounded-lg border">
						<OrdersTable
							orders={ordersData?.orders || []}
							isLoading={isLoading}
							onViewDetails={handleViewDetails}
						/>

						{/* Pagination */}
						{ordersData && ordersData.totalPages > 1 && (
							<OrderPagination
								currentPage={ordersData.page}
								totalPages={ordersData.totalPages}
								totalItems={ordersData.total}
								pageSize={ordersData.limit}
								onPageChange={handlePageChange}
								isLoading={isLoading}
							/>
						)}
					</div>
				</div>
			</div>

			{/* Order Detail Modal */}
			<OrderDetailModal
				order={selectedOrder}
				isOpen={isDetailModalOpen}
				onClose={handleCloseDetailModal}
			/>
		</div>
	);
};

export default OrderPage;
