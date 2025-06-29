import axiosInstance from '@/configs/instances/axios';

// Types
export interface Voucher {
	_id: string;
	discountCode: string;
	discountName: string;
	discountType: 'Percentage' | 'FixedAmount';
	discountValue: number;
	startDate: string;
	endDate: string;
	minOrderValue: number;
	maxDiscountAmount?: number;
	usageLimit?: number;
	usedCount: number;
	isActive: boolean;
	createdBy: {
		_id: string;
		username: string;
		email: string;
	};
	description?: string;
	createdAt: string;
	updatedAt: string;
}

export interface VouchersResponse {
	vouchers: Voucher[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface VoucherFilters {
	page?: number;
	limit?: number;
	isActive?: boolean;
	discountType?: 'Percentage' | 'FixedAmount';
	search?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface CreateVoucherDto {
	discountCode: string;
	discountName: string;
	discountType: 'Percentage' | 'FixedAmount';
	discountValue: number;
	startDate: string;
	endDate: string;
	minOrderValue?: number;
	maxDiscountAmount?: number;
	usageLimit?: number;
	isActive?: boolean;
	description?: string;
	createdBy?: string;
}

export interface UpdateVoucherDto extends Partial<CreateVoucherDto> {}

export interface ValidateVoucherDto {
	voucherCode: string;
	orderValue: number;
}

export interface VoucherValidationResponse {
	isValid: boolean;
	message: string;
	discountAmount?: number;
	voucher?: Voucher;
}

export interface VoucherStats {
	totalVouchers: number;
	activeVouchers: number;
	expiredVouchers: number;
	totalUsed: number;
	totalDiscountAmount: number;
	typeBreakdown: Array<{
		_id: string;
		count: number;
		totalUsed: number;
	}>;
}

// API Functions
export const vouchersApi = {
	/**
	 * Lấy danh sách vouchers với filters
	 */
	async getVouchers(filters: VoucherFilters = {}): Promise<VouchersResponse> {
		try {
			const params = new URLSearchParams();

			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params.append(key, value.toString());
				}
			});

			const response = await axiosInstance.get<VouchersResponse>(
				`/vouchers?${params.toString()}`
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get vouchers:', error);
			throw error;
		}
	},

	/**
	 * Lấy chi tiết voucher
	 */
	async getVoucherById(voucherId: string): Promise<Voucher> {
		try {
			const response = await axiosInstance.get<Voucher>(
				`/vouchers/${voucherId}`
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get voucher details:', error);
			throw error;
		}
	},

	/**
	 * Lấy voucher theo mã
	 */
	async getVoucherByCode(code: string): Promise<Voucher> {
		try {
			const response = await axiosInstance.get<Voucher>(
				`/vouchers/code/${code}`
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get voucher by code:', error);
			throw error;
		}
	},

	/**
	 * Tạo voucher mới
	 */
	async createVoucher(data: CreateVoucherDto): Promise<Voucher> {
		try {
			const response = await axiosInstance.post<Voucher>('/vouchers', data);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to create voucher:', error);
			throw error;
		}
	},

	/**
	 * Cập nhật voucher
	 */
	async updateVoucher(
		voucherId: string,
		data: UpdateVoucherDto
	): Promise<Voucher> {
		try {
			const response = await axiosInstance.patch<Voucher>(
				`/vouchers/${voucherId}`,
				data
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to update voucher:', error);
			throw error;
		}
	},

	/**
	 * Xóa voucher
	 */
	async deleteVoucher(voucherId: string): Promise<void> {
		try {
			await axiosInstance.delete(`/vouchers/${voucherId}`);
		} catch (error) {
			console.error('❌ Failed to delete voucher:', error);
			throw error;
		}
	},

	/**
	 * Lấy danh sách vouchers đang hoạt động
	 */
	async getActiveVouchers(): Promise<Voucher[]> {
		try {
			const response = await axiosInstance.get<Voucher[]>('/vouchers/active');
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get active vouchers:', error);
			throw error;
		}
	},

	/**
	 * Validate voucher
	 */
	async validateVoucher(
		data: ValidateVoucherDto
	): Promise<VoucherValidationResponse> {
		try {
			const response = await axiosInstance.post<VoucherValidationResponse>(
				'/vouchers/validate',
				data
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to validate voucher:', error);
			throw error;
		}
	},

	/**
	 * Lấy thống kê vouchers (tạm thời fake data vì backend chưa có)
	 */
	async getVoucherStats(): Promise<VoucherStats> {
		try {
			// Tạm thời fake data, có thể implement thêm endpoint trong backend sau
			const vouchersData = await this.getVouchers({ limit: 1000 });
			const vouchers = vouchersData.vouchers;

			const stats: VoucherStats = {
				totalVouchers: vouchers.length,
				activeVouchers: vouchers.filter(
					(v) => v.isActive && new Date(v.endDate) > new Date()
				).length,
				expiredVouchers: vouchers.filter(
					(v) => new Date(v.endDate) <= new Date()
				).length,
				totalUsed: vouchers.reduce((sum, v) => sum + v.usedCount, 0),
				totalDiscountAmount: 0, // Tính toán sau
				typeBreakdown: [
					{
						_id: 'Percentage',
						count: vouchers.filter((v) => v.discountType === 'Percentage')
							.length,
						totalUsed: vouchers
							.filter((v) => v.discountType === 'Percentage')
							.reduce((sum, v) => sum + v.usedCount, 0),
					},
					{
						_id: 'FixedAmount',
						count: vouchers.filter((v) => v.discountType === 'FixedAmount')
							.length,
						totalUsed: vouchers
							.filter((v) => v.discountType === 'FixedAmount')
							.reduce((sum, v) => sum + v.usedCount, 0),
					},
				],
			};

			return stats;
		} catch (error) {
			console.error('❌ Failed to get voucher stats:', error);
			throw error;
		}
	},
};

// Helper functions
export const voucherHelpers = {
	/**
	 * Format currency
	 */
	formatCurrency(amount: number): string {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(amount);
	},

	/**
	 * Format date
	 */
	formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
		});
	},

	/**
	 * Format discount type
	 */
	getDiscountTypeText(type: string): string {
		const typeMap: Record<string, string> = {
			Percentage: 'Phần trăm',
			FixedAmount: 'Số tiền cố định',
		};
		return typeMap[type] || type;
	},

	/**
	 * Format discount value
	 */
	formatDiscountValue(type: string, value: number): string {
		if (type === 'Percentage') {
			return `${value}%`;
		}
		return this.formatCurrency(value);
	},

	/**
	 * Check if voucher is expired
	 */
	isVoucherExpired(endDate: string): boolean {
		return new Date(endDate) <= new Date();
	},

	/**
	 * Check if voucher is active
	 */
	isVoucherActive(voucher: Voucher): boolean {
		const now = new Date();
		const startDate = new Date(voucher.startDate);
		const endDate = new Date(voucher.endDate);

		return voucher.isActive && startDate <= now && now <= endDate;
	},

	/**
	 * Get voucher status
	 */
	getVoucherStatus(voucher: Voucher): {
		status: 'active' | 'inactive' | 'expired' | 'upcoming';
		text: string;
		color: string;
	} {
		const now = new Date();
		const startDate = new Date(voucher.startDate);
		const endDate = new Date(voucher.endDate);

		if (!voucher.isActive) {
			return {
				status: 'inactive',
				text: 'Tạm dừng',
				color: 'bg-gray-100 text-gray-800',
			};
		}

		if (endDate <= now) {
			return {
				status: 'expired',
				text: 'Hết hạn',
				color: 'bg-red-100 text-red-800',
			};
		}

		if (startDate > now) {
			return {
				status: 'upcoming',
				text: 'Sắp diễn ra',
				color: 'bg-blue-100 text-blue-800',
			};
		}

		return {
			status: 'active',
			text: 'Đang hoạt động',
			color: 'bg-green-100 text-green-800',
		};
	},

	/**
	 * Get usage percentage
	 */
	getUsagePercentage(voucher: Voucher): number {
		if (!voucher.usageLimit) return 0;
		return Math.round((voucher.usedCount / voucher.usageLimit) * 100);
	},
};
