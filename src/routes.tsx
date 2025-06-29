import AdminDetailPage from './pages/manager/admins/detail/[adminId]/page';
import AdminsPage from './pages/manager/admins/page';
import CategoriesPage from './pages/categories/page';
import ChangePasswordPage from './pages/manager/admins/change-password/[adminId]/page';
import CreateAdminPage from './pages/manager/admins/create/page';
import CreateCategoryPage from './pages/categories/create/page';
import CreateCustomerPage from './pages/manager/customers/create/page';
import CreateProductPage from './pages/products/create/page';
import CreateVoucherPage from './pages/vouchers/create/page';
import CustomerDetailPage from './pages/manager/customers/detail/[customerId]/page';
import CustomersPage from './pages/manager/customers/page';
import EditAdminPage from './pages/manager/admins/edit/[adminId]/page';
import EditCategoryPage from './pages/categories/edit/[categoryId]/page';
import EditCustomerPage from './pages/manager/customers/edit/[customerId]/page';
import EditProductPage from './pages/products/edit/[productId]/page';
import HomePage from './pages/home/page';
import LoginPage from './pages/login/page';
import OrderPage from './pages/orders/page';
import ProductDetailPage from './pages/products/detail/[productId]/page';
import ProductsPage from './pages/products/page';
import RootLayout from './layouts/root-layout';
import VouchersPage from './pages/vouchers/page';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
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
				path: 'vouchers',
				element: <VouchersPage />,
			},
			{
				path: 'vouchers/create',
				element: <CreateVoucherPage />,
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
			{
				path: 'admins',
				element: <AdminsPage />,
			},
			{
				path: 'admins/create',
				element: <CreateAdminPage />,
			},
			{
				path: 'admins/edit/:adminId',
				element: <EditAdminPage />,
			},
			{
				path: 'admins/detail/:adminId',
				element: <AdminDetailPage />,
			},
			{
				path: 'admins/change-password/:adminId',
				element: <ChangePasswordPage />,
			},
			{
				path: 'orders',
				element: <OrderPage />,
			},
		],
	},
]);
