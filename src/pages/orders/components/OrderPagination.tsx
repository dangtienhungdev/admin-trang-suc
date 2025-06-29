import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import React from 'react';

interface OrderPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
}

export const OrderPagination: React.FC<OrderPaginationProps> = ({
	currentPage,
	totalPages,
	totalItems,
	pageSize,
	onPageChange,
	isLoading = false,
}) => {
	const startItem = (currentPage - 1) * pageSize + 1;
	const endItem = Math.min(currentPage * pageSize, totalItems);

	const getVisiblePages = () => {
		const visiblePages: (number | string)[] = [];
		const maxVisible = 7;

		if (totalPages <= maxVisible) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				visiblePages.push(i);
			}
		} else {
			// Always show first page
			visiblePages.push(1);

			if (currentPage <= 4) {
				// Show first 5 pages
				for (let i = 2; i <= 5; i++) {
					visiblePages.push(i);
				}
				visiblePages.push('...');
				visiblePages.push(totalPages);
			} else if (currentPage >= totalPages - 3) {
				// Show last 5 pages
				visiblePages.push('...');
				for (let i = totalPages - 4; i <= totalPages; i++) {
					visiblePages.push(i);
				}
			} else {
				// Show current page and neighbors
				visiblePages.push('...');
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					visiblePages.push(i);
				}
				visiblePages.push('...');
				visiblePages.push(totalPages);
			}
		}

		return visiblePages;
	};

	if (totalPages <= 1) {
		return (
			<div className="flex items-center justify-between px-2 py-4">
				<div className="text-sm text-gray-700">
					Hiển thị {startItem} đến {endItem} trong tổng {totalItems} kết quả
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="text-sm text-gray-700">
				Hiển thị <span className="font-medium">{startItem}</span> đến{' '}
				<span className="font-medium">{endItem}</span> trong tổng{' '}
				<span className="font-medium">{totalItems}</span> kết quả
			</div>

			<div className="flex items-center space-x-2">
				{/* Previous button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1 || isLoading}
				>
					<ChevronLeft className="h-4 w-4" />
					Trước
				</Button>

				{/* Page numbers */}
				<div className="flex items-center space-x-1">
					{getVisiblePages().map((page, index) => (
						<React.Fragment key={index}>
							{page === '...' ? (
								<div className="px-3 py-2">
									<MoreHorizontal className="h-4 w-4" />
								</div>
							) : (
								<Button
									variant={currentPage === page ? 'default' : 'outline'}
									size="sm"
									onClick={() => onPageChange(page as number)}
									disabled={isLoading}
									className={`min-w-[40px] ${
										currentPage === page
											? 'bg-blue-600 text-white hover:bg-blue-700'
											: 'text-gray-500 hover:text-gray-700'
									}`}
								>
									{page}
								</Button>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Next button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages || isLoading}
				>
					Tiếp
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
