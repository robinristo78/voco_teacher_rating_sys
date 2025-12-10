import { Request, Response } from "express";
import UserService, { UserServiceError } from "../services/UserService";

export const register = async (req: Request, res: Response) => {
    try {
        const user = await UserService.createUser(req.body);

        const { password: _pw, verificationToken, verificationExpires, ...safeUser } = user.toJSON();

        res.status(201).json({
            message: "Konto loodud. Palun kinnita oma emaili aadress.",
            user: safeUser,
        });
    } catch (error: any) {
        if (error instanceof UserServiceError) {
            if (error.code === "VALIDATION_ERROR") return res.status(400).json({ error: error.message });
            if (error.code === "DUPLICATE_EMAIL") return res.status(409).json({ error: error.message });
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
        if (error instanceof UserServiceError && error.code === "NOT_VERIFIED") {
            return res.status(403).json({ error: error.message });
        }
        res.status(500).json({ error: "Serveri viga" });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const token = req.query.token as string | undefined;
        if (!token) {
            return res.status(400).json({ error: "Kinnituslink puudub" });
        }

        const user = await UserService.verifyEmail(token);
        const { password: _pw, ...safeUser } = user.toJSON();
        res.json({ message: "Email kinnitatud. Saad nüüd sisse logida.", user: safeUser });
    } catch (error: any) {
        if (error instanceof UserServiceError) {
            if (error.code === "INVALID_TOKEN") return res.status(400).json({ error: error.message });
            if (error.code === "TOKEN_EXPIRED") return res.status(410).json({ error: error.message });
        }
        res.status(500).json({ error: "Serveri viga" });
    }
};