export const urls = {
	home: '/',
	login: '/login',
	products: {
		list: '/products',
		create: '/products/create',
		edit: (id: string) => `/products/edit/${id}`,
		detail: (id: string) => `/products/detail/${id}`,
	},
	categories: {
		list: '/categories',
		create: '/categories/create',
		edit: (id: string) => `/categories/edit/${id}`,
	},
	vouchers: {
		list: '/vouchers',
		create: '/vouchers/create',
		edit: (id: string) => `/vouchers/edit/${id}`,
		detail: (id: string) => `/vouchers/detail/${id}`,
	},
	customers: {
		list: '/customers',
		create: '/customers/create',
		edit: (id: string) => `/customers/edit/${id}`,
		detail: (id: string) => `/customers/detail/${id}`,
	},
	admins: {
		list: '/admins',
		create: '/admins/create',
		edit: (id: string) => `/admins/edit/${id}`,
		detail: (id: string) => `/admins/detail/${id}`,
		changePassword: (id: string) => `/admins/change-password/${id}`,
	},
	orders: '/orders',
};
