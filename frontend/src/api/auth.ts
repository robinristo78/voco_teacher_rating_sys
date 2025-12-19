const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface AuthResponse {
	message?: string;
	user?: {
		id: number;
		name: string;
		email: string;
		createdAt: string;
		isVerified?: boolean;
	};
	error?: string;
}

export async function register(
	payload: RegisterPayload
): Promise<AuthResponse> {
	console.log("Registering user:", payload.email);

	const response = await fetch(`${API_BASE_URL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await response.json();
	console.log("Register response:", data, "Status:", response.status);

	if (!response.ok) {
		throw new Error(data.error || `Registration failed: ${response.status}`);
	}

	return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
	console.log("Logging in user:", payload.email);

	const response = await fetch(`${API_BASE_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = await response.json();
	console.log("Login response:", data, "Status:", response.status);

	if (!response.ok) {
		throw new Error(data.error || `Login failed: ${response.status}`);
	}

	return data;
}
