import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PencilIcon, TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import type { Category } from '@/types/category.type';
import { useDeleteCategory } from '@/hooks/categories/useCategory';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TableCategoryProps {
	categories: Category[];
}

export const TableCategory = ({ categories }: TableCategoryProps) => {
	const navigate = useNavigate();
	const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleEditCategory = (categoryId: string) => {
		navigate(`/categories/edit/${categoryId}`);
	};

	const handleDeleteCategory = (categoryId: string) => {
		setDeletingId(categoryId);
		deleteCategory(categoryId, {
			onSettled: () => {
				setDeletingId(null);
			},
		});
	};

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">STT</TableHead>
						<TableHead>Tên danh mục</TableHead>
						<TableHead>Mô tả</TableHead>
						<TableHead>Trạng thái</TableHead>
						<TableHead>Ngày tạo</TableHead>
						<TableHead>Cập nhật</TableHead>
						<TableHead className="text-right">Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{categories.map((category: Category, index: number) => (
						<TableRow key={category.id}>
							<TableCell className="font-mono text-xs">#{index + 1}</TableCell>
							<TableCell>
								<div className="font-medium text-gray-900">
									{category.categoryName}
								</div>
							</TableCell>
							<TableCell>
								<div className="text-sm text-gray-600 max-w-xs">
									{category.description}
								</div>
							</TableCell>
							<TableCell>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										category.isActive
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
									}`}
								>
									{category.isActive ? 'Hoạt động' : 'Không hoạt động'}
								</span>
							</TableCell>
							<TableCell className="text-sm text-gray-600">
								{new Date(category.createdAt).toLocaleDateString('vi-VN')}
							</TableCell>
							<TableCell className="text-sm text-gray-600">
								{new Date(category.updatedAt).toLocaleDateString('vi-VN')}
							</TableCell>
							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEditCategory(category.id)}
									>
										<PencilIcon className="w-4 h-4" />
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<TrashIcon className="w-4 h-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Xác nhận xóa danh mục
												</AlertDialogTitle>
												<AlertDialogDescription>
													Bạn có chắc chắn muốn xóa danh mục "
													{category.categoryName}"? Hành động này không thể hoàn
													tác.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Hủy</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDeleteCategory(category.id)}
													disabled={isDeleting && deletingId === category.id}
													className="bg-red-600 hover:bg-red-700"
												>
													{isDeleting && deletingId === category.id
														? 'Đang xóa...'
														: 'Xóa'}
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
