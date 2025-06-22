import CategoriesPage from './pages/categories/page';
import CreateCategoryPage from './pages/categories/create/page';
import CreateProductPage from './pages/products/create/page';
import EditCategoryPage from './pages/categories/edit/[categoryId]/page';
import HomePage from './pages/home/page';
import ProductsPage from './pages/products/page';
import RootLayout from './layouts/root-layout';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: 'products',
				element: <ProductsPage />,
			},
			{
				path: 'categories',
				element: <CategoriesPage />,
			},
			{
				path: 'categories/create',
				element: <CreateCategoryPage />,
			},
			{
				path: 'categories/edit/:categoryId',
				element: <EditCategoryPage />,
			},
			{
				path: 'products/create',
				element: <CreateProductPage />,
			},
		],
	},
]);
