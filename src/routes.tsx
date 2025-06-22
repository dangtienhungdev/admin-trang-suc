import CategoriesPage from './pages/categories/page';
import CreateCategoryPage from './pages/categories/create/page';
import CreateCustomerPage from './pages/manager/customers/create/page';
import CreateProductPage from './pages/products/create/page';
import CustomerDetailPage from './pages/manager/customers/detail/[customerId]/page';
import CustomersPage from './pages/manager/customers/page';
import EditCategoryPage from './pages/categories/edit/[categoryId]/page';
import EditCustomerPage from './pages/manager/customers/edit/[customerId]/page';
import EditProductPage from './pages/products/edit/[productId]/page';
import HomePage from './pages/home/page';
import ProductDetailPage from './pages/products/detail/[productId]/page';
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
				path: 'products/create',
				element: <CreateProductPage />,
			},
			{
				path: 'products/edit/:productId',
				element: <EditProductPage />,
			},
			{
				path: 'products/detail/:productId',
				element: <ProductDetailPage />,
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
				path: 'customers',
				element: <CustomersPage />,
			},
			{
				path: 'customers/create',
				element: <CreateCustomerPage />,
			},
			{
				path: 'customers/edit/:customerId',
				element: <EditCustomerPage />,
			},
			{
				path: 'customers/detail/:customerId',
				element: <CustomerDetailPage />,
			},
		],
	},
]);
