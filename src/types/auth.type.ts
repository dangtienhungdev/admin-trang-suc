export interface LoginRequest {
	usernameOrEmail: string;
	password: string;
}

export interface LoginResponse {
	admin: {
		_id: string;
		username: string;
		email: string;
		role: 'SuperAdmin' | 'Staff';
		lastLogin: string | null;
		createdAt: string;
		updatedAt: string;
	};
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface AuthContextType {
	admin: LoginResponse['admin'] | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => void;
}
