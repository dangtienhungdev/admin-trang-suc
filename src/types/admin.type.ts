export interface Admin {
	_id: string;
	username: string;
	email: string;
	role: 'SuperAdmin' | 'Staff';
	lastLogin: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAdminRequest {
	username: string;
	email: string;
	password: string;
	role: 'SuperAdmin' | 'Staff';
}

export interface UpdateAdminRequest {
	username?: string;
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}
