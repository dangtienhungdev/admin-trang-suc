import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCategory } from '@/hooks/categories/useCategory';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
	categoryName: z.string().min(1, 'Tên danh mục không được để trống'),
	description: z.string().min(1, 'Mô tả không được để trống'),
	isActive: z.boolean(),
});

type FormSchema = z.infer<typeof formSchema>;

const CreateCategoryPage = () => {
	const navigate = useNavigate();
	const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryName: '',
			description: '',
			isActive: true,
		},
	});

	const onSubmit = (values: FormSchema) => {
		createCategory(values, {
			onSuccess: () => {
				navigate('/categories');
			},
		});
	};

	return (
		<div className="py-8 px-4 sm:px-6 lg:px-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Thêm mới danh mục
				</h1>
				<p className="text-gray-600">Tạo danh mục sản phẩm mới</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="categoryName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Tên danh mục *</FormLabel>
									<FormControl>
										<Input
											placeholder="Nhập tên danh mục (ví dụ: Nhẫn Kim cương)"
											className="w-full h-14"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Trạng thái hoạt động</FormLabel>
									<FormControl>
										<div className="flex items-center space-x-2">
											<Switch
												checked={field.value ?? true}
												onCheckedChange={field.onChange}
											/>
											<span className="text-sm text-gray-600">
												{field.value ? 'Hoạt động' : 'Không hoạt động'}
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
									<FormLabel>Mô tả danh mục *</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Nhập mô tả chi tiết về danh mục..."
											{...field}
											className="w-full h-40 resize-none"
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
								onClick={() => navigate('/categories')}
								className="flex-1 h-14"
								disabled={isCreating}
							>
								Hủy
							</Button>
							<Button
								type="submit"
								disabled={isCreating}
								className="flex-1 h-14 flex items-center justify-center"
							>
								{isCreating && <Loader className="animate-spin mr-2 h-4 w-4" />}
								{isCreating ? 'Đang tạo...' : 'Tạo danh mục'}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default CreateCategoryPage;
