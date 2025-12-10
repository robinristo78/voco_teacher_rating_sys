import { createContext, useContext } from "react";
import React, { useState, useEffect, useCallback } from "react";

interface AuthContextType {
	user: {
		id: number;
		name: string;
		email: string;
		createdAt: string;
		isVerified?: boolean;
	} | null;
	isLoggedIn: boolean;
	login: (user: AuthContextType["user"]) => void;
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
	user: null,
	isLoggedIn: false,
	login: () => {},
	logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<AuthContextType["user"]>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Load user from localStorage on mount
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		const loggedInStatus = localStorage.getItem("isLoggedIn");
		if (storedUser && loggedInStatus === "true") {
			try {
				const parsedUser = JSON.parse(storedUser);
				setUser(parsedUser);
				setIsLoggedIn(true);
			} catch (error) {
				console.error("Failed to parse user from localStorage:", error);
				localStorage.removeItem("user");
				localStorage.removeItem("isLoggedIn");
			}
		}
	}, []);

	// Login function - updates state and localStorage
	const login = useCallback((userData: AuthContextType["user"]) => {
		setUser(userData);
		setIsLoggedIn(true);
		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("isLoggedIn", "true");
	}, []);

	// Logout function - clears state and localStorage
	const logout = useCallback(() => {
		setUser(null);
		setIsLoggedIn(false);
		localStorage.removeItem("user");
		localStorage.removeItem("isLoggedIn");
	}, []);

	return (
		<AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
