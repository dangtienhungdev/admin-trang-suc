import { categoriesApi, type GetCategoriesParams } from '@/apis/categories.api';
import type { Category } from '@/types/category.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useCategories = (params?: GetCategoriesParams) => {
	const result = useQuery({
		queryKey: [categoriesApi.getCategories.name, params],
		queryFn: () => categoriesApi.getCategories(params),
	});
	const { data: categoriesResponse } = result;

	const categories = categoriesResponse?.data.items || [];
	const pagination = categoriesResponse?.data;

	return {
		...result,
		categories,
		pagination,
	};
};

export const useCategory = () => {
	const { categoryId } = useParams();

	const result = useQuery({
		queryKey: [categoriesApi.getCategory.name, categoryId],
		queryFn: () => categoriesApi.getCategory(categoryId as string),
	});

	const { data: category } = result;

	return {
		...result,
		category,
	};
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (category: Partial<Category>) =>
			categoriesApi.createCategory(category),
		onSuccess: () => {
			// Refetch categories list
			queryClient.invalidateQueries({
				queryKey: [categoriesApi.getCategories.name],
			});
			toast.success('Tạo danh mục thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục';
			toast.error(errorMessage);
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => categoriesApi.deleteCategory(id),
		onSuccess: () => {
			// Refetch categories list
			queryClient.invalidateQueries({
				queryKey: [categoriesApi.getCategories.name],
			});
			toast.success('Xóa danh mục thành công!');
		},
		onError: (error: any) => {
			const errorMessage =
				error?.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục';
			toast.error(errorMessage);
		},
	});
};
