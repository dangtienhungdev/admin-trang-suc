import {
	createSearchParams,
	useNavigate,
	useSearchParams,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { TableAdmin } from './components/table';
import { useAdmins } from '@/hooks/admins/useAdmin';

export default function AdminsPage() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const page = params.get('page') ?? 1;
	const limit = params.get('limit') ?? 10;

	const { admins, pagination, isLoading, isFetching, error } = useAdmins({
		limit: Number(limit),
		page: Number(page),
	});

	const handleNextPage = () => {
		navigate({
			pathname: '/admins',
			search: createSearchParams({
				page: (Number(page) + 1).toString(),
				limit: limit.toString(),
			}).toString(),
		});
	};

	const handlePrevPage = () => {
		navigate({
			pathname: '/admins',
			search: createSearchParams({
				page: (Number(page) - 1).toString(),
				limit: limit.toString(),
			}).toString(),
		});
	};

	const handleChangePage = (page: number) => {
		navigate({
			pathname: '/admins',
			search: createSearchParams({
				page: page.toString(),
				limit: limit.toString(),
			}).toString(),
		});
	};

	if (error) {
		return (
			<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="text-center text-red-600">
					<h2 className="text-2xl font-bold">Lỗi tải dữ liệu</h2>
					<p>Không thể tải danh sách quản trị viên. Vui lòng thử lại.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Danh sách quản trị viên
				</h1>
				<p className="text-gray-600">
					Quản lý tài khoản quản trị viên hệ thống
				</p>
			</div>

			<div className="bg-white rounded-lg shadow">
				<div className="px-6 py-4 border-b border-gray-200">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-medium text-gray-900">
							Quản trị viên ({pagination?.total || 0})
						</h2>
						<div className="flex items-center gap-4">
							{isFetching && (
								<div className="text-sm text-blue-600">Đang tải...</div>
							)}
							<Button onClick={() => navigate('/admins/create')}>
								Thêm quản trị viên
							</Button>
						</div>
					</div>
				</div>

				{isLoading ? (
					<div className="p-6 text-center">
						<div className="text-gray-500">Đang tải dữ liệu...</div>
					</div>
				) : (
					<TableAdmin admins={admins} />
				)}

				{/* Pagination */}
				{pagination && pagination.totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-500">
								Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{' '}
								{Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
								trong tổng số {pagination.total} quản trị viên
							</div>
							<div className="flex space-x-2">
								<Button
									variant="outline"
									size="sm"
									disabled={!pagination.hasPrevPage}
									onClick={() => handlePrevPage()}
								>
									Trước
								</Button>
								<div className="flex items-center space-x-1">
									{Array.from({ length: pagination.totalPages }, (_, i) => (
										<Button
											key={i + 1}
											variant={
												pagination.page === i + 1 ? 'default' : 'outline'
											}
											size="sm"
											className="w-8 h-8 p-0"
											onClick={() => handleChangePage(i + 1)}
										>
											{i + 1}
										</Button>
									))}
								</div>
								<Button
									variant="outline"
									size="sm"
									disabled={!pagination.hasNextPage}
									onClick={() => handleNextPage()}
								>
									Tiếp
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
