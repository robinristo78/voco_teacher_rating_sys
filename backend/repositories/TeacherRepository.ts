import { Teacher } from "../models/TeacherModel";
import { Rating } from "../models/RatingsModel";

export interface CreateTeacherDTO {
	name: string;
	role: string;
	unit: string;
	address?: string;
	room?: string;
	email?: string;
	phone?: string;
	image?: string;
}

export interface UpdateTeacherDTO {
	name?: string;
	role?: string;
	unit?: string;
	address?: string;
	room?: string;
	email?: string;
	phone?: string;
	image?: string;
	avgRating?: number;
}

class TeacherRepository {
	async findAll(): Promise<Teacher[]> {
		return Teacher.findAll();
	}

	async findById(id: number): Promise<Teacher | null> {
		return Teacher.findByPk(id);
	}

	async findByName(name: string): Promise<Teacher | null> {
		return Teacher.findOne({ where: { name } });
	}

	async create(data: CreateTeacherDTO): Promise<Teacher> {
		return Teacher.create(data);
	}

	async update(id: number, data: UpdateTeacherDTO): Promise<Teacher | null> {
		const teacher = await this.findById(id);
		if (!teacher) return null;

		await teacher.update(data);
		return teacher;
	}

	async delete(id: number): Promise<boolean> {
		const teacher = await this.findById(id);
		if (!teacher) return false;

		await teacher.destroy();
		return true;
	}

	async updateAvgRating(
		id: number,
		avgRating: number
	): Promise<Teacher | null> {
		return this.update(id, { avgRating });
	}

	async getRatingCount(teacherId: number): Promise<number> {
		const count = await Rating.count({ where: { teacherId } });
		return count;
	}
}

export default new TeacherRepository();
