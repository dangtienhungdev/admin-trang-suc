export interface Customer {
	_id: string;
	fullName: string;
	phone: string;
	email: string;
	address: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateCustomerRequest {
	fullName: string;
	phone: string;
	email: string;
	password: string;
	address: string;
}

export interface UpdateCustomerRequest {
	fullName?: string;
	phone?: string;
	address?: string;
}
