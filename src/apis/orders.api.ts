import axiosInstance from '@/configs/instances/axios';

// Types
export interface OrderDetail {
	productId: string;
	quantity: number;
	priceAtPurchase: number;
	discountApplied: number;
}

export interface AppliedDiscount {
	discountId: string;
	discountAmount: number;
}

export interface Order {
	_id: string;
	orderCode: string;
	customerId: {
		_id: string;
		fullName: string;
		email: string;
		phone: string;
	};
	orderDate: string;
	totalAmount: number;
	discountAmount: number;
	finalAmount: number;
	shippingFee: number;
	status: 'pending' | 'confirmed' | 'shipping' | 'success' | 'failed';
	shippingAddress: string;
	recipientName: string;
	recipientPhone: string;
	orderDetails: OrderDetail[];
	appliedDiscounts: AppliedDiscount[];
	notes?: string;
	processedBy?: {
		_id: string;
		username: string;
		email: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface OrdersResponse {
	orders: Order[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface OrderFilters {
	page?: number;
	limit?: number;
	status?: string;
	customerId?: string;
	search?: string;
	startDate?: string;
	endDate?: string;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface UpdateOrderStatusDto {
	status: 'pending' | 'confirmed' | 'shipping' | 'success' | 'failed';
	notes?: string;
}

export interface OrderStats {
	totalOrders: number;
	totalRevenue: number;
	statusBreakdown: Array<{
		_id: string;
		count: number;
		totalAmount: number;
	}>;
}

// API Functions
export const ordersApi = {
	/**
	 * Lấy danh sách đơn hàng với filters
	 */
	async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
		try {
			const params = new URLSearchParams();

			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params.append(key, value.toString());
				}
			});

			const response = await axiosInstance.get<OrdersResponse>(
				`/orders?${params.toString()}`
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get orders:', error);
			throw error;
		}
	},

	/**
	 * Lấy chi tiết đơn hàng
	 */
	async getOrderById(orderId: string): Promise<Order> {
		try {
			const response = await axiosInstance.get<Order>(`/orders/${orderId}`);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get order details:', error);
			throw error;
		}
	},

	/**
	 * Cập nhật trạng thái đơn hàng
	 */
	async updateOrderStatus(
		orderId: string,
		data: UpdateOrderStatusDto
	): Promise<Order> {
		try {
			const response = await axiosInstance.patch<Order>(
				`/orders/${orderId}`,
				data
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to update order status:', error);
			throw error;
		}
	},

	/**
	 * Hủy đơn hàng
	 */
	async cancelOrder(orderId: string, reason?: string): Promise<Order> {
		try {
			const response = await axiosInstance.patch<Order>(
				`/orders/${orderId}/cancel`,
				{
					reason,
				}
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to cancel order:', error);
			throw error;
		}
	},

	/**
	 * Lấy thống kê đơn hàng
	 */
	async getOrderStats(
		filters: Pick<OrderFilters, 'startDate' | 'endDate'> = {}
	): Promise<OrderStats> {
		try {
			const params = new URLSearchParams();

			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null && value !== '') {
					params.append(key, value.toString());
				}
			});

			const response = await axiosInstance.get<OrderStats>(
				`/orders/stats?${params.toString()}`
			);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get order stats:', error);
			throw error;
		}
	},

	/**
	 * Lấy payments của đơn hàng
	 */
	async getOrderPayments(orderId: string): Promise<any[]> {
		try {
			const response = await axiosInstance.get(`/orders/${orderId}/payments`);
			return response.data;
		} catch (error) {
			console.error('❌ Failed to get order payments:', error);
			throw error;
		}
	},

	/**
	 * Xóa đơn hàng
	 */
	async deleteOrder(orderId: string): Promise<void> {
		try {
			await axiosInstance.delete(`/orders/${orderId}`);
		} catch (error) {
			console.error('❌ Failed to delete order:', error);
			throw error;
		}
	},
};

// Helper functions
export const orderHelpers = {
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
	 * Get status text in Vietnamese
	 */
	getStatusText(status: string): string {
		const statusMap: Record<string, string> = {
			pending: 'Chờ xử lý',
			confirmed: 'Đã xác nhận',
			shipping: 'Đang giao',
			success: 'Hoàn thành',
			failed: 'Đã hủy',
		};
		return statusMap[status] || status;
	},

	/**
	 * Get status color
	 */
	getStatusColor(status: string): string {
		const colorMap: Record<string, string> = {
			pending: 'bg-yellow-100 text-yellow-800',
			confirmed: 'bg-blue-100 text-blue-800',
			shipping: 'bg-purple-100 text-purple-800',
			success: 'bg-green-100 text-green-800',
			failed: 'bg-red-100 text-red-800',
		};
		return colorMap[status] || 'bg-gray-100 text-gray-800';
	},

	/**
	 * Get status badge icon
	 */
	getStatusIcon(status: string): string {
		const iconMap: Record<string, string> = {
			pending: 'fas fa-clock',
			confirmed: 'fas fa-check-circle',
			shipping: 'fas fa-truck',
			success: 'fas fa-check-double',
			failed: 'fas fa-times-circle',
		};
		return iconMap[status] || 'fas fa-question-circle';
	},
};
