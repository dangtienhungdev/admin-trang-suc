import { type OrderFilters as OrderFiltersType } from '@/apis/orders.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar, Filter, RefreshCw, Search } from 'lucide-react';
import React from 'react';

interface OrderFiltersProps {
	filters: OrderFiltersType;
	onFiltersChange: (filters: OrderFiltersType) => void;
	onReset: () => void;
	isLoading?: boolean;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
	filters,
	onFiltersChange,
	onReset,
	isLoading = false,
}) => {
	const handleFilterChange = (key: keyof OrderFiltersType, value: any) => {
		// Convert 'all' back to empty string for status filter
		const processedValue = key === 'status' && value === 'all' ? '' : value;

		onFiltersChange({
			...filters,
			[key]: processedValue,
			page: 1, // Reset to first page when filter changes
		});
	};

	const statusOptions = [
		{ value: 'all', label: 'Tất cả trạng thái' },
		{ value: 'pending', label: 'Chờ xử lý' },
		{ value: 'confirmed', label: 'Đã xác nhận' },
		{ value: 'shipping', label: 'Đang giao' },
		{ value: 'success', label: 'Hoàn thành' },
		{ value: 'failed', label: 'Đã hủy' },
	];

	const sortOptions = [
		{ value: 'orderDate', label: 'Ngày đặt hàng' },
		{ value: 'finalAmount', label: 'Tổng tiền' },
		{ value: 'status', label: 'Trạng thái' },
		{ value: 'customerId?.fullName', label: 'Tên khách hàng' },
	];

	const sortOrderOptions = [
		{ value: 'desc', label: 'Giảm dần' },
		{ value: 'asc', label: 'Tăng dần' },
	];

	return (
		<div className="bg-white p-6 rounded-lg border shadow-sm">
			<div className="flex items-center gap-2 mb-4">
				<Filter className="h-5 w-5" />
				<h3 className="text-lg font-semibold">Bộ lọc đơn hàng</h3>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Search */}
				<div className="space-y-2">
					<Label htmlFor="search">Tìm kiếm</Label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							id="search"
							placeholder="Mã đơn hàng, tên khách hàng..."
							value={filters.search || ''}
							onChange={(e) => handleFilterChange('search', e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Status Filter */}
				<div className="space-y-2">
					<Label>Trạng thái</Label>
					<Select
						value={filters.status || 'all'}
						onValueChange={(value) => handleFilterChange('status', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn trạng thái" />
						</SelectTrigger>
						<SelectContent>
							{statusOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Start Date */}
				<div className="space-y-2">
					<Label htmlFor="startDate">Từ ngày</Label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							id="startDate"
							type="date"
							value={filters.startDate || ''}
							onChange={(e) => handleFilterChange('startDate', e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* End Date */}
				<div className="space-y-2">
					<Label htmlFor="endDate">Đến ngày</Label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							id="endDate"
							type="date"
							value={filters.endDate || ''}
							onChange={(e) => handleFilterChange('endDate', e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Sort By */}
				<div className="space-y-2">
					<Label>Sắp xếp theo</Label>
					<Select
						value={filters.sortBy || 'orderDate'}
						onValueChange={(value) => handleFilterChange('sortBy', value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn cách sắp xếp" />
						</SelectTrigger>
						<SelectContent>
							{sortOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Sort Order */}
				<div className="space-y-2">
					<Label>Thứ tự</Label>
					<Select
						value={filters.sortOrder || 'desc'}
						onValueChange={(value) =>
							handleFilterChange('sortOrder', value as 'asc' | 'desc')
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn thứ tự" />
						</SelectTrigger>
						<SelectContent>
							{sortOrderOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Page Size */}
				<div className="space-y-2">
					<Label>Số dòng/trang</Label>
					<Select
						value={filters.limit?.toString() || '10'}
						onValueChange={(value) =>
							handleFilterChange('limit', parseInt(value))
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Chọn số dòng" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="5">5</SelectItem>
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Reset Button */}
				<div className="space-y-2">
					<Label>&nbsp;</Label>
					<Button
						variant="outline"
						onClick={onReset}
						className="w-full"
						disabled={isLoading}
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
						/>
						Đặt lại
					</Button>
				</div>
			</div>

			{/* Quick Filters */}
			<div className="mt-6 pt-4 border-t">
				<Label className="text-sm font-medium mb-3 block">Bộ lọc nhanh:</Label>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleFilterChange('status', 'pending')}
						className={
							filters.status === 'pending'
								? 'bg-yellow-100 border-yellow-300'
								: ''
						}
					>
						Chờ xử lý
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleFilterChange('status', 'confirmed')}
						className={
							filters.status === 'confirmed'
								? 'bg-blue-100 border-blue-300'
								: ''
						}
					>
						Đã xác nhận
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleFilterChange('status', 'shipping')}
						className={
							filters.status === 'shipping'
								? 'bg-purple-100 border-purple-300'
								: ''
						}
					>
						Đang giao
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleFilterChange('status', 'success')}
						className={
							filters.status === 'success'
								? 'bg-green-100 border-green-300'
								: ''
						}
					>
						Hoàn thành
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleFilterChange('status', 'failed')}
						className={
							filters.status === 'failed' ? 'bg-red-100 border-red-300' : ''
						}
					>
						Đã hủy
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() =>
							onFiltersChange({
								...filters,
								startDate: new Date().toISOString().split('T')[0],
								endDate: new Date().toISOString().split('T')[0],
							})
						}
					>
						Hôm nay
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							const today = new Date();
							const weekAgo = new Date(
								today.getTime() - 7 * 24 * 60 * 60 * 1000
							);
							onFiltersChange({
								...filters,
								startDate: weekAgo.toISOString().split('T')[0],
								endDate: today.toISOString().split('T')[0],
							});
						}}
					>
						7 ngày qua
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							const today = new Date();
							const monthAgo = new Date(
								today.getTime() - 30 * 24 * 60 * 60 * 1000
							);
							onFiltersChange({
								...filters,
								startDate: monthAgo.toISOString().split('T')[0],
								endDate: today.toISOString().split('T')[0],
							});
						}}
					>
						30 ngày qua
					</Button>
				</div>
			</div>
		</div>
	);
};
