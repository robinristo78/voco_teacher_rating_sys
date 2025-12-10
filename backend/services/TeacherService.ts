import TeacherRepository, {
	CreateTeacherDTO,
	UpdateTeacherDTO,
} from "../repositories/TeacherRepository";
import { Teacher } from "../models/TeacherModel";

export class TeacherServiceError extends Error {
	constructor(message: string, public code: string) {
		super(message);
		this.name = "TeacherServiceError";
	}
}

class TeacherService {
	async getAllTeachers(): Promise<any[]> {
		const teachers = await TeacherRepository.findAll();
		
		// Add ratingCount to each teacher
		const teachersWithCounts = await Promise.all(
			teachers.map(async (teacher) => {
				const ratingCount = await TeacherRepository.getRatingCount(teacher.id);
				const teacherObj = teacher.toJSON ? teacher.toJSON() : teacher;
				return {
					...teacherObj,
					ratingCount,
				};
			})
		);
		
		return teachersWithCounts;
	}

	async getTeacherById(id: number): Promise<any> {
		const teacher = await TeacherRepository.findById(id);
		if (!teacher) {
			throw new TeacherServiceError("Õpetajat ei leitud", "TEACHER_NOT_FOUND");
		}
		
		const ratingCount = await TeacherRepository.getRatingCount(id);
		const teacherObj = teacher.toJSON ? teacher.toJSON() : teacher;
		return {
			...teacherObj,
			ratingCount,
		};
	}

	async createTeacher(data: CreateTeacherDTO): Promise<Teacher> {
		// Valideerimine
		if (!data.name || data.name.trim().length === 0) {
			throw new TeacherServiceError(
				"Õpetaja nimi on kohustuslik",
				"VALIDATION_ERROR"
			);
		}

		if (data.name.length > 100) {
			throw new TeacherServiceError(
				"Õpetaja nimi ei tohi olla pikem kui 100 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (!data.role || data.role.trim().length === 0) {
			throw new TeacherServiceError(
				"Õpetaja roll on kohustuslik",
				"VALIDATION_ERROR"
			);
		}

		if (data.role.length > 100) {
			throw new TeacherServiceError(
				"Roll ei tohi olla pikem kui 100 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (!data.unit || data.unit.trim().length === 0) {
			throw new TeacherServiceError(
				"Õpetaja üksus on kohustuslik",
				"VALIDATION_ERROR"
			);
		}

		if (data.unit.length > 100) {
			throw new TeacherServiceError(
				"Üksus ei tohi olla pikem kui 100 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (data.address && data.address.length > 0) {
			if (data.address.length > 500) {
				throw new TeacherServiceError(
					"Aadress ei tohi olla pikem kui 500 tähemärki",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.room && data.room.length > 50) {
			throw new TeacherServiceError(
				"Ruum ei tohi olla pikem kui 50 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (data.email && data.email.length > 0) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(data.email)) {
				throw new TeacherServiceError(
					"E-posti aadress on vigane",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.phone && data.phone.length > 50) {
			throw new TeacherServiceError(
				"Telefon ei tohi olla pikem kui 50 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		// Kontrolli, kas sama nimega õpetaja juba eksisteerib
		const existingTeacher = await TeacherRepository.findByName(data.name);
		if (existingTeacher) {
			throw new TeacherServiceError(
				"Sama nimega õpetaja juba eksisteerib",
				"DUPLICATE_TEACHER"
			);
		}

		return TeacherRepository.create({
			name: data.name.trim(),
			role: data.role.trim(),
			unit: data.unit.trim(),
			address: data.address?.trim(),
			room: data.room?.trim(),
			email: data.email?.trim(),
			phone: data.phone?.trim(),
			image: data.image?.trim(),
		});
	}

	async updateTeacher(id: number, data: UpdateTeacherDTO): Promise<Teacher> {
		// Kontrolli, kas õpetaja eksisteerib
		await this.getTeacherById(id);

		// Valideerimine
		if (data.name !== undefined) {
			if (data.name.trim().length === 0) {
				throw new TeacherServiceError(
					"Õpetaja nimi on kohustuslik",
					"VALIDATION_ERROR"
				);
			}
			if (data.name.length > 100) {
				throw new TeacherServiceError(
					"Õpetaja nimi ei tohi olla pikem kui 100 tähemärki",
					"VALIDATION_ERROR"
				);
			}

			// Kontrolli duplikaate
			const existingTeacher = await TeacherRepository.findByName(data.name);
			if (existingTeacher && existingTeacher.id !== id) {
				throw new TeacherServiceError(
					"Sama nimega õpetaja juba eksisteerib",
					"DUPLICATE_TEACHER"
				);
			}
		}

		if (data.role !== undefined) {
			if (data.role.trim().length === 0) {
				throw new TeacherServiceError(
					"Õpetaja roll on kohustuslik",
					"VALIDATION_ERROR"
				);
			}
			if (data.role.length > 100) {
				throw new TeacherServiceError(
					"Roll ei tohi olla pikem kui 100 tähemärki",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.unit !== undefined) {
			if (data.unit.trim().length === 0) {
				throw new TeacherServiceError(
					"Õpetaja üksus on kohustuslik",
					"VALIDATION_ERROR"
				);
			}
			if (data.unit.length > 100) {
				throw new TeacherServiceError(
					"Üksus ei tohi olla pikem kui 100 tähemärki",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.address !== undefined && data.address.length > 500) {
			throw new TeacherServiceError(
				"Aadress ei tohi olla pikem kui 500 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (data.room !== undefined && data.room.length > 50) {
			throw new TeacherServiceError(
				"Ruum ei tohi olla pikem kui 50 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		if (data.email !== undefined && data.email.length > 0) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(data.email)) {
				throw new TeacherServiceError(
					"E-posti aadress on vigane",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.phone !== undefined && data.phone.length > 50) {
			throw new TeacherServiceError(
				"Telefon ei tohi olla pikem kui 50 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		const updateData: UpdateTeacherDTO = {};
		if (data.name) updateData.name = data.name.trim();
		if (data.role) updateData.role = data.role.trim();
		if (data.unit) updateData.unit = data.unit.trim();
		if (data.address !== undefined) updateData.address = data.address?.trim();
		if (data.room !== undefined) updateData.room = data.room?.trim();
		if (data.email !== undefined) updateData.email = data.email?.trim();
		if (data.phone !== undefined) updateData.phone = data.phone?.trim();
		if (data.image !== undefined) updateData.image = data.image?.trim();
		if (data.avgRating !== undefined) updateData.avgRating = data.avgRating;

		const updatedTeacher = await TeacherRepository.update(id, updateData);
		return updatedTeacher!;
	}

	async deleteTeacher(id: number): Promise<void> {
		// Kontrolli, kas õpetaja eksisteerib
		await this.getTeacherById(id);

		await TeacherRepository.delete(id);
	}

	async updateTeacherAvgRating(
		id: number,
		avgRating: number
	): Promise<Teacher> {
		await this.getTeacherById(id);

		const updatedTeacher = await TeacherRepository.updateAvgRating(
			id,
			avgRating
		);
		return updatedTeacher!;
	}
}

export default new TeacherService();
