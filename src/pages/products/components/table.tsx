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
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import type { Product } from '@/types/product.type';
import { formatPrice } from '@/lib/format-currency';
import { useDeleteProduct } from '@/hooks/products/useProduct';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface TableProductProps {
	products: Product[];
}

export const TableProduct = ({ products }: TableProductProps) => {
	const navigate = useNavigate();
	const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleViewDetail = (productId: string) => {
		navigate(`/products/detail/${productId}`);
	};

	const handleEditProduct = (productId: string) => {
		navigate(`/products/edit/${productId}`);
	};

	const handleDeleteProduct = (productId: string) => {
		setDeletingId(productId);
		deleteProduct(productId, {
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
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead>Tên sản phẩm</TableHead>
						<TableHead>Danh mục</TableHead>
						<TableHead>Giá</TableHead>
						<TableHead>Trọng lượng</TableHead>
						<TableHead>Tồn kho</TableHead>
						<TableHead>Chất liệu</TableHead>
						<TableHead className="text-right">Thao tác</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{products.map((product: Product, index: number) => (
						<TableRow key={product.id}>
							<TableCell className="font-mono text-xs">#{index + 1}</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<img
										src={product.images[0]}
										alt={product.productName}
										className="w-20 h-20 rounded-md object-cover flex-shrink-0 border border-gray-300"
									/>
									<div>
										<div className="font-medium text-gray-900 truncate line-clamp-1 text-sm">
											{product.productName.slice(0, 40) + '...'}
										</div>
										<div className="text-sm text-gray-500 truncate line-clamp-2">
											{product.description.slice(0, 30) + '...'}
										</div>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									{product.category.categoryName}
								</span>
							</TableCell>
							<TableCell className="font-medium">
								{formatPrice(product.price)}
							</TableCell>
							<TableCell className="text-sm text-gray-600">
								{product.weight}g
							</TableCell>
							<TableCell>
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
										product.stockQuantity <= 10
											? 'bg-red-100 text-red-800'
											: product.stockQuantity <= 50
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-green-100 text-green-800'
									}`}
								>
									{product.stockQuantity}
								</span>
							</TableCell>
							<TableCell className="text-sm text-gray-600">
								{product.material}
							</TableCell>
							<TableCell className="text-right">
								<div className="flex items-center justify-end gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleViewDetail(product.id)}
										className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
									>
										<EyeIcon className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEditProduct(product.id)}
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
													Xác nhận xóa sản phẩm
												</AlertDialogTitle>
												<AlertDialogDescription>
													Bạn có chắc chắn muốn xóa sản phẩm "
													{product.productName}"? Hành động này không thể hoàn
													tác.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Hủy</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDeleteProduct(product.id)}
													disabled={isDeleting && deletingId === product.id}
													className="bg-red-600 hover:bg-red-700"
												>
													{isDeleting && deletingId === product.id
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
