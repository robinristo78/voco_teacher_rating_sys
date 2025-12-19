import { Request, Response } from "express";
import UserService, { UserServiceError } from "../services/UserService";

export const register = async (req: Request, res: Response) => {
	try {
		const user = await UserService.createUser(req.body);

		const { password: _pw, ...safeUser } = user.toJSON();

		res.status(201).json({
			message: "Konto loodud.",
			user: safeUser,
		});
	} catch (error: any) {
		if (error instanceof UserServiceError) {
			if (error.code === "VALIDATION_ERROR")
				return res.status(400).json({ error: error.message });
			if (error.code === "DUPLICATE_EMAIL")
				return res.status(409).json({ error: error.message });
		}
		res.status(500).json({ error: "Serveri viga" });
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await UserService.verifyPassword(email, password);

		if (!user) {
			return res.status(401).json({ error: "Vale e-post või parool" });
		}

		// Eemaldame parooli vastusest
		const { password: _, ...userData } = user.dataValues;
		res.json({ message: "Sisselogimine edukas", user: userData });
	} catch (error) {
		res.status(500).json({ error: "Serveri viga" });
	}
};
