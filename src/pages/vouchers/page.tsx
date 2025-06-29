import {
	CalendarIcon,
	Edit,
	Eye,
	Filter,
	Plus,
	RefreshCw,
	Search,
	TicketIcon,
	Trash2,
} from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	useDeleteVoucher,
	useVoucherStats,
	useVouchers,
} from '@/hooks/vouchers/useVouchers';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { VoucherFilters } from '@/apis/vouchers.api';
import { VoucherStats } from './components/VoucherStats';
import { useNavigate } from 'react-router-dom';
import { voucherHelpers } from '@/apis/vouchers.api';

const VouchersPage: React.FC = () => {
	const navigate = useNavigate();

	// State management
	const [filters, setFilters] = useState<VoucherFilters>({
		page: 1,
		limit: 10,
		sortBy: 'createdAt',
		sortOrder: 'desc',
	});

	const [showFilters, setShowFilters] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [voucherToDelete, setVoucherToDelete] = useState<{
		id: string;
		name: string;
	} | null>(null);

	// API hooks
	const { data: vouchersData, isLoading, refetch } = useVouchers(filters);
	const { data: statsData, isLoading: isStatsLoading } = useVoucherStats();
	const deleteVoucherMutation = useDeleteVoucher();

	// Auto-refresh every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			refetch();
		}, 30000);

		return () => clearInterval(interval);
	}, [refetch]);

	// Event handlers
	const handleFiltersChange = (newFilters: VoucherFilters) => {
		setFilters(newFilters);
	};

	const handleResetFilters = () => {
		setFilters({
			page: 1,
			limit: 10,
			sortBy: 'createdAt',
			sortOrder: 'desc',
		});
	};

	const handleRefresh = () => {
		refetch();
	};

	const handleDeleteVoucher = (voucherId: string, voucherName: string) => {
		setVoucherToDelete({ id: voucherId, name: voucherName });
		setDeleteDialogOpen(true);
	};

	const confirmDeleteVoucher = async () => {
		if (voucherToDelete) {
			await deleteVoucherMutation.mutateAsync(voucherToDelete.id);
			setDeleteDialogOpen(false);
			setVoucherToDelete(null);
		}
	};

	const handlePageChange = (page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	};

	const handleFilterChange = (key: keyof VoucherFilters, value: any) => {
		// Convert 'all' back to undefined for some filters
		const processedValue =
			(key === 'isActive' && value === 'all') ||
			(key === 'discountType' && value === 'all')
				? undefined
				: value;

		setFilters((prev) => ({
			...prev,
			[key]: processedValue,
			page: 1, // Reset to first page when filter changes
		}));
	};

	const handleCreateVoucher = () => {
		navigate('/vouchers/create');
	};

	const statusOptions = [
		{ value: 'all', label: 'Tất cả trạng thái' },
		{ value: 'true', label: 'Đang hoạt động' },
		{ value: 'false', label: 'Tạm dừng' },
	];

	const typeOptions = [
		{ value: 'all', label: 'Tất cả loại' },
		{ value: 'Percentage', label: 'Phần trăm' },
		{ value: 'FixedAmount', label: 'Số tiền cố định' },
	];

	const sortOptions = [
		{ value: 'createdAt', label: 'Ngày tạo' },
		{ value: 'discountName', label: 'Tên voucher' },
		{ value: 'discountCode', label: 'Mã voucher' },
		{ value: 'discountValue', label: 'Giá trị giảm' },
		{ value: 'usedCount', label: 'Lượt sử dụng' },
	];

	return (
		<div className="space-y-6 py-8 px-4 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Quản lý Vouchers
					</h1>
					<p className="text-gray-500 mt-2">
						Quản lý mã giảm giá và khuyến mãi
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={() => setShowFilters(!showFilters)}
						className="hidden md:flex"
					>
						<Filter className="h-4 w-4 mr-2" />
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
					<Button onClick={handleCreateVoucher}>
						<Plus className="h-4 w-4 mr-2" />
						Tạo voucher mới
					</Button>
				</div>
			</div>

			{/* Voucher Statistics */}
			<VoucherStats stats={statsData || null} isLoading={isStatsLoading} />

			{/* Filters */}
			{showFilters && (
				<div className="bg-white p-6 rounded-lg border shadow-sm">
					<div className="flex items-center gap-2 mb-4">
						<Filter className="h-5 w-5" />
						<h3 className="text-lg font-semibold">Bộ lọc vouchers</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Search */}
						<div className="space-y-2">
							<Label htmlFor="search">Tìm kiếm</Label>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
								<Input
									id="search"
									placeholder="Mã voucher, tên voucher..."
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
								value={
									filters.isActive !== undefined
										? filters.isActive.toString()
										: 'all'
								}
								onValueChange={(value) =>
									handleFilterChange(
										'isActive',
										value === 'all' ? undefined : value === 'true'
									)
								}
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

						{/* Type Filter */}
						<div className="space-y-2">
							<Label>Loại giảm giá</Label>
							<Select
								value={filters.discountType || 'all'}
								onValueChange={(value) =>
									handleFilterChange('discountType', value)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Chọn loại" />
								</SelectTrigger>
								<SelectContent>
									{typeOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Sort By */}
						<div className="space-y-2">
							<Label>Sắp xếp theo</Label>
							<Select
								value={filters.sortBy || 'createdAt'}
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
					</div>

					{/* Quick Filters */}
					<div className="mt-6 pt-4 border-t">
						<Label className="text-sm font-medium mb-3 block">
							Bộ lọc nhanh:
						</Label>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleFilterChange('isActive', true)}
								className={
									filters.isActive === true
										? 'bg-green-100 border-green-300'
										: ''
								}
							>
								<TicketIcon className="h-4 w-4 mr-1" />
								Đang hoạt động
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleFilterChange('isActive', false)}
								className={
									filters.isActive === false ? 'bg-red-100 border-red-300' : ''
								}
							>
								<TicketIcon className="h-4 w-4 mr-1" />
								Tạm dừng
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleFilterChange('discountType', 'Percentage')}
								className={
									filters.discountType === 'Percentage'
										? 'bg-blue-100 border-blue-300'
										: ''
								}
							>
								Phần trăm
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									handleFilterChange('discountType', 'FixedAmount')
								}
								className={
									filters.discountType === 'FixedAmount'
										? 'bg-purple-100 border-purple-300'
										: ''
								}
							>
								Số tiền cố định
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Vouchers Table */}
			<div className="bg-white rounded-lg border">
				<div className="px-6 py-4 border-b">
					<h3 className="text-lg font-semibold">Danh sách Vouchers</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Mã Voucher
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tên & Loại
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Giá trị
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Thời gian
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sử dụng
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Trạng thái
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Thao tác
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{isLoading ? (
								[...Array(5)].map((_, index) => (
									<tr key={index} className="animate-pulse">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="h-4 bg-gray-200 rounded w-24"></div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="h-4 bg-gray-200 rounded w-32"></div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="h-4 bg-gray-200 rounded w-20"></div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="h-4 bg-gray-200 rounded w-28"></div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="h-4 bg-gray-200 rounded w-16"></div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="h-6 bg-gray-200 rounded w-20"></div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex space-x-2">
												<div className="h-8 w-8 bg-gray-200 rounded"></div>
												<div className="h-8 w-8 bg-gray-200 rounded"></div>
												<div className="h-8 w-8 bg-gray-200 rounded"></div>
											</div>
										</td>
									</tr>
								))
							) : vouchersData?.vouchers.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="px-6 py-8 text-center text-gray-500"
									>
										Không có vouchers nào
									</td>
								</tr>
							) : (
								vouchersData?.vouchers.map((voucher) => {
									const status = voucherHelpers.getVoucherStatus(voucher);
									const usagePercentage =
										voucherHelpers.getUsagePercentage(voucher);

									return (
										<tr key={voucher._id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="font-medium text-gray-900">
													{voucher.discountCode}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{voucher.discountName}
												</div>
												<div className="text-sm text-gray-500">
													{voucherHelpers.getDiscountTypeText(
														voucher.discountType
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-gray-900">
													{voucherHelpers.formatDiscountValue(
														voucher.discountType,
														voucher.discountValue
													)}
												</div>
												{voucher.minOrderValue > 0 && (
													<div className="text-xs text-gray-500">
														Đơn tối thiểu:{' '}
														{voucherHelpers.formatCurrency(
															voucher.minOrderValue
														)}
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												<div>
													<CalendarIcon className="inline h-3 w-3 mr-1" />
													{new Date(voucher.startDate).toLocaleDateString(
														'vi-VN'
													)}
												</div>
												<div>
													đến{' '}
													{new Date(voucher.endDate).toLocaleDateString(
														'vi-VN'
													)}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{voucher.usedCount}
													{voucher.usageLimit && ` / ${voucher.usageLimit}`}
												</div>
												{voucher.usageLimit && (
													<div className="w-full bg-gray-200 rounded-full h-1 mt-1">
														<div
															className="bg-blue-600 h-1 rounded-full"
															style={{ width: `${usagePercentage}%` }}
														/>
													</div>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<Badge className={status.color}>{status.text}</Badge>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<div className="flex space-x-2">
													<Button
														variant="ghost"
														size="sm"
														className="text-blue-600 hover:text-blue-900"
													>
														<Eye className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-green-600 hover:text-green-900"
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-red-600 hover:text-red-900"
														onClick={() =>
															handleDeleteVoucher(
																voucher._id,
																voucher.discountName
															)
														}
														disabled={deleteVoucherMutation.isPending}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{vouchersData && vouchersData.totalPages > 1 && (
					<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
						<div className="flex-1 flex justify-between sm:hidden">
							<Button
								variant="outline"
								onClick={() => handlePageChange(vouchersData.page - 1)}
								disabled={vouchersData.page <= 1}
							>
								Trước
							</Button>
							<Button
								variant="outline"
								onClick={() => handlePageChange(vouchersData.page + 1)}
								disabled={vouchersData.page >= vouchersData.totalPages}
							>
								Sau
							</Button>
						</div>
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Hiển thị{' '}
									<span className="font-medium">
										{(vouchersData.page - 1) * vouchersData.limit + 1}
									</span>{' '}
									đến{' '}
									<span className="font-medium">
										{Math.min(
											vouchersData.page * vouchersData.limit,
											vouchersData.total
										)}
									</span>{' '}
									trong{' '}
									<span className="font-medium">{vouchersData.total}</span> kết
									quả
								</p>
							</div>
							<div>
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handlePageChange(vouchersData.page - 1)}
										disabled={vouchersData.page <= 1}
									>
										Trước
									</Button>
									{Array.from(
										{ length: Math.min(5, vouchersData.totalPages) },
										(_, i) => {
											const page = i + 1;
											return (
												<Button
													key={page}
													variant={
														page === vouchersData.page ? 'default' : 'outline'
													}
													size="sm"
													onClick={() => handlePageChange(page)}
												>
													{page}
												</Button>
											);
										}
									)}
									<Button
										variant="outline"
										size="sm"
										onClick={() => handlePageChange(vouchersData.page + 1)}
										disabled={vouchersData.page >= vouchersData.totalPages}
									>
										Sau
									</Button>
								</nav>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog
				open={deleteDialogOpen}
				onOpenChange={() => setDeleteDialogOpen(false)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác nhận xóa voucher</DialogTitle>
						<DialogDescription>
							Bạn có chắc chắn muốn xóa voucher này?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Hủy
						</Button>
						<Button variant="destructive" onClick={confirmDeleteVoucher}>
							Xóa
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default VouchersPage;
