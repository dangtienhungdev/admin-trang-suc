import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	useProductDetail,
	useUpdateProduct,
} from '@/hooks/products/useProduct';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/hooks/categories/useCategory';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
	productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
	description: z.string().min(1, 'Mô tả không được để trống'),
	price: z.number().min(0, 'Giá phải lớn hơn 0'),
	weight: z.number().min(0, 'Trọng lượng phải lớn hơn 0'),
	material: z.string().min(1, 'Chất liệu không được để trống'),
	stockQuantity: z.number().min(0, 'Số lượng tồn kho phải lớn hơn hoặc bằng 0'),
	categoryId: z.string().min(1, 'Vui lòng chọn danh mục'),
	isFeatured: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const EditProductPage = () => {
	const navigate = useNavigate();
	const { product, isLoading: isLoadingProduct } = useProductDetail();
	const { categories } = useCategories({ limit: 100 });
	const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			productName: '',
			description: '',
			price: 0,
			weight: 0,
			material: '',
			stockQuantity: 0,
			categoryId: '',
			isFeatured: false,
		},
	});

	const onSubmit = (values: FormSchema) => {
		if (!product) return;

		updateProduct(
			{ id: product.id, product: values },
			{
				onSuccess: () => {
					navigate('/products');
				},
			}
		);
	};

	useEffect(() => {
		if (product) {
			form.setValue('productName', product.productName);
			form.setValue('description', product.description);
			form.setValue('price', product.price);
			form.setValue('weight', product.weight);
			form.setValue('material', product.material);
			form.setValue('stockQuantity', product.stockQuantity);
			form.setValue('categoryId', product.categoryId);
			form.setValue('isFeatured', product.isFeatured);
		}
	}, [form, product]);

	if (isLoadingProduct) {
		return (
			<div className="py-8 px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<Loader className="animate-spin mx-auto mb-4" />
					<p>Đang tải thông tin sản phẩm...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="py-8 px-4 sm:px-6 lg:px-8">
				<div className="text-center text-red-600">
					<h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
					<p>Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Chỉnh sửa sản phẩm
				</h1>
				<p className="text-gray-600">Cập nhật thông tin sản phẩm</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="productName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tên sản phẩm *</FormLabel>
										<FormControl>
											<Input
												placeholder="Nhập tên sản phẩm"
												className="w-full h-12"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="categoryId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Danh mục sản phẩm</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full !h-14">
													<SelectValue placeholder="Chọn danh mục" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories &&
													categories.length > 0 &&
													categories.map((category) => (
														<SelectItem key={category.id} value={category.id}>
															{category?.categoryName}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Giá *</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="0"
												className="w-full h-12"
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="weight"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Trọng lượng (gram) *</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.1"
												placeholder="0.0"
												className="w-full h-12"
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="material"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Chất liệu *</FormLabel>
										<FormControl>
											<Input
												placeholder="Vàng 18K, Bạc 925..."
												className="w-full h-12"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="stockQuantity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Số lượng tồn kho *</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="0"
												className="w-full h-12"
												{...field}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sản phẩm nổi bật</FormLabel>
									<FormControl>
										<div className="flex items-center space-x-2">
											<Switch
												checked={field.value ?? false}
												onCheckedChange={field.onChange}
											/>
											<span className="text-sm text-gray-600">
												{field.value ? 'Có' : 'Không'}
											</span>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mô tả sản phẩm *</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Nhập mô tả chi tiết về sản phẩm..."
											{...field}
											className="w-full h-32 resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-4 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate('/products')}
								className="flex-1 h-14"
								disabled={isUpdating}
							>
								Hủy
							</Button>
							<Button
								type="submit"
								disabled={isUpdating}
								className="flex-1 h-14 flex items-center justify-center"
							>
								{isUpdating && <Loader className="animate-spin mr-2 h-4 w-4" />}
								{isUpdating ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default EditProductPage;
