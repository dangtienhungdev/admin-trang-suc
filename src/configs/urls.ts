export const urls = {
	home: '/',
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
	orders: '/orders',
};
