import { productsApi, type GetProductsParams } from '@/apis/products.api';
import type { Product } from '@/types/product.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useProduct = (params?: GetProductsParams) => {
	const result = useQuery({
		queryKey: [productsApi.getProducts.name, params],
		queryFn: () => productsApi.getProducts(params),
	});
	const { data: productsResponse } = result;

	const products = productsResponse?.data.items || [];
	const pagination = productsResponse?.data;

	return {
		...result,
		products,
		pagination,
	};
};

export const useProductDetail = () => {
	const { productId } = useParams();

	const result = useQuery({
		queryKey: [productsApi.getProduct.name, productId],
		queryFn: () => productsApi.getProduct(productId as string),
		enabled: !!productId,
	});

	const { data: productResponse } = result;
	const product = productResponse;

	return {
		...result,
		product,
	};
};

export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (product: Partial<Product>) =>
			productsApi.createProduct(product),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [productsApi.getProducts.name],
			});
			toast.success('Tạo sản phẩm thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi tạo sản phẩm';
			toast.error(errorMessage);
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
			productsApi.updateProduct(id, product),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [productsApi.getProducts.name],
			});
			queryClient.invalidateQueries({
				queryKey: [productsApi.getProduct.name],
			});
			toast.success('Cập nhật sản phẩm thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm';
			toast.error(errorMessage);
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productsApi.deleteProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [productsApi.getProducts.name],
			});
			toast.success('Xóa sản phẩm thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
			toast.error(errorMessage);
		},
	});
};
