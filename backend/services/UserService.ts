import UserRepository, {
	CreateUserDTO,
	UpdateUserDTO,
} from "../repositories/UserRepository";
import { User } from "../models/UserModel";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail } from "./EmailService";

export class UserServiceError extends Error {
	constructor(message: string, public code: string) {
		super(message);
		this.name = "UserServiceError";
	}
}

const SALT_ROUNDS = 10;

class UserService {
	async getAllUsers(): Promise<User[]> {
		return UserRepository.findAll();
	}

	async getUserById(id: number): Promise<User> {
		const user = await UserRepository.findById(id);
		if (!user) {
			throw new UserServiceError("Kasutajat ei leitud", "USER_NOT_FOUND");
		}
		return user;
	}

	async getUserByEmail(email: string): Promise<User | null> {
		return UserRepository.findByEmail(email);
	}

	async createUser(data: CreateUserDTO): Promise<User> {
		// Valideerimine
		if (!data.name || data.name.trim().length === 0) {
			throw new UserServiceError(
				"Kasutaja nimi on kohustuslik",
				"VALIDATION_ERROR"
			);
		}

		if (data.name.length > 100) {
			throw new UserServiceError(
				"Nimi ei tohi olla pikem kui 100 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (!data.email || data.email.trim().length === 0) {
			throw new UserServiceError("E-post on kohustuslik", "VALIDATION_ERROR");
		}

		// Email validatsioon
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			throw new UserServiceError(
				"E-posti aadress on vigane",
				"VALIDATION_ERROR"
			);
		}

		if (data.email.length > 100) {
			throw new UserServiceError(
				"E-post ei tohi olla pikem kui 100 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (!data.password || data.password.length < 6) {
			throw new UserServiceError(
				"Parool peab olema vähemalt 6 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		// Kontrolli, kas sama emailiga kasutaja juba eksisteerib
		const existingUser = await UserRepository.findByEmail(data.email);
		if (existingUser) {
			throw new UserServiceError(
				"Selle e-postiga kasutaja juba eksisteerib",
				"DUPLICATE_EMAIL"
			);
		}

		// Hashida parool
		const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

		const verificationToken = crypto.randomUUID();
		const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

		const user = await UserRepository.create({
			name: data.name.trim(),
			email: data.email.trim().toLowerCase(),
			password: hashedPassword,
			isVerified: false,
			verificationToken,
			verificationExpires,
		});

		// Send verification email; log warning if it fails but don't block registration
		try {
			await sendVerificationEmail(user.email, user.name, verificationToken);
		} catch (emailError) {
			console.error("Verification email send failed:", emailError);
		}

		return user;
	}

	async verifyEmail(token: string): Promise<User> {
		const user = await UserRepository.findByEmailToken(token);
		if (!user || !user.verificationToken || user.verificationToken !== token) {
			throw new UserServiceError("Vigane või aegunud kinnituslink", "INVALID_TOKEN");
		}

		if (user.verificationExpires && user.verificationExpires < new Date()) {
			throw new UserServiceError("Kinnituslink on aegunud", "TOKEN_EXPIRED");
		}

		user.isVerified = true;
		user.verificationToken = null;
		user.verificationExpires = null;
		await user.save();

		return user;
	}

	async updateUser(id: number, data: UpdateUserDTO): Promise<User> {
		// Kontrolli, kas kasutaja eksisteerib
		await this.getUserById(id);

		// Valideerimine
		if (data.name !== undefined) {
			if (data.name.trim().length === 0) {
				throw new UserServiceError(
					"Kasutaja nimi on kohustuslik",
					"VALIDATION_ERROR"
				);
			}
			if (data.name.length > 100) {
				throw new UserServiceError(
					"Nimi ei tohi olla pikem kui 100 tähemärki",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.email !== undefined) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(data.email)) {
				throw new UserServiceError(
					"E-posti aadress on vigane",
					"VALIDATION_ERROR"
				);
			}

			// Kontrolli duplikaate
			const existingUser = await UserRepository.findByEmail(data.email);
			if (existingUser && existingUser.id !== id) {
				throw new UserServiceError(
					"Selle e-postiga kasutaja juba eksisteerib",
					"DUPLICATE_EMAIL"
				);
			}
		}

		const updateData: UpdateUserDTO = {};

		if (data.name) updateData.name = data.name.trim();
		if (data.email) updateData.email = data.email.trim().toLowerCase();
		if (data.password) {
			if (data.password.length < 6) {
				throw new UserServiceError(
					"Parool peab olema vähemalt 6 tähemärki",
					"VALIDATION_ERROR"
				);
			}
			updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
		}

		const updatedUser = await UserRepository.update(id, updateData);
		return updatedUser!;
	}

	async deleteUser(id: number): Promise<void> {
		// Kontrolli, kas kasutaja eksisteerib
		await this.getUserById(id);

		await UserRepository.delete(id);
	}

	async verifyPassword(email: string, password: string): Promise<User | null> {
		const user = await UserRepository.findByEmail(email);
		if (!user) {
			return null;
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return null;
		}

		console.log("DEBUG: User object:", {
			id: user.id,
			email: user.email,
			isVerified: user.isVerified,
			isVerifiedType: typeof user.isVerified,
			dataValues: user.dataValues,
		});

		if (!user.isVerified) {
			throw new UserServiceError(
				"Palun kinnita oma email enne sisselogimist",
				"NOT_VERIFIED"
			);
		}

		return user;
	}
}

export default new UserService();
