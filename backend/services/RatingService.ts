import RatingRepository, {
	CreateRatingDTO,
	UpdateRatingDTO,
} from "../repositories/RatingRepository";
import TeacherRepository from "../repositories/TeacherRepository";
import UserRepository from "../repositories/UserRepository";
import { Rating } from "../models/RatingsModel";

export class RatingServiceError extends Error {
	constructor(message: string, public code: string) {
		super(message);
		this.name = "RatingServiceError";
	}
}

class RatingService {
	async getAllRatings(): Promise<Rating[]> {
		return RatingRepository.findAll();
	}

	async getRatingById(id: number): Promise<Rating> {
		const rating = await RatingRepository.findById(id);
		if (!rating) {
			throw new RatingServiceError("Hinnangut ei leitud", "RATING_NOT_FOUND");
		}
		return rating;
	}

	async getRatingsByTeacherId(teacherId: number): Promise<Rating[]> {
		try {
			// Kontrolli, kas õpetaja eksisteerib
			const teacher = await TeacherRepository.findById(teacherId);
			if (!teacher) {
				throw new RatingServiceError("Õpetajat ei leitud", "TEACHER_NOT_FOUND");
			}

			return await RatingRepository.findByTeacherId(teacherId);
		} catch (error) {
			console.error("RatingService.getRatingsByTeacherId error:", error);
			throw error;
		}
	}

	async getRatingsByUserId(userId: number): Promise<Rating[]> {
		// Kontrolli, kas kasutaja eksisteerib
		const user = await UserRepository.findById(userId);
		if (!user) {
			throw new RatingServiceError("Kasutajat ei leitud", "USER_NOT_FOUND");
		}

		return RatingRepository.findByUserId(userId);
	}

	async createRating(data: CreateRatingDTO): Promise<Rating> {
		console.log("RatingService.createRating called with:", data);
		// Valideerimine
		if (!data.rating || data.rating < 1 || data.rating > 5) {
			throw new RatingServiceError(
				"Hinnang peab olema 1 kuni 5",
				"VALIDATION_ERROR"
			);
		}

		if (!Number.isInteger(data.rating)) {
			throw new RatingServiceError(
				"Hinnang peab olema täisarv",
				"VALIDATION_ERROR"
			);
		}

		if (!data.description || data.description.trim().length === 0) {
			throw new RatingServiceError(
				"Kirjeldus on kohustuslik",
				"VALIDATION_ERROR"
			);
		}

		if (data.description.length > 400) {
			throw new RatingServiceError(
				"Kirjeldus ei tohi olla pikem kui 400 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		// Kontrolli, kas õpetaja eksisteerib
		const teacher = await TeacherRepository.findById(data.teacherId);
        if (!teacher) {
            throw new RatingServiceError("Õpetajat ei leitud", "TEACHER_NOT_FOUND");
        }

		// Validate user only if userId is provided
		if (data.userId) {
            const user = await UserRepository.findById(data.userId);
            if (!user) {
                throw new RatingServiceError("Kasutajat ei leitud", "USER_NOT_FOUND");
            }

            // Check if user has already rated this teacher
            const existingRating = await RatingRepository.findByTeacherAndUser(
                data.teacherId,
                data.userId
            );

            // --- MUUDATUS (CHANGE): UPDATE INSTEAD OF ERROR ---
            if (existingRating) {
                console.log(`User ${data.userId} already rated teacher ${data.teacherId}. Updating existing rating ID ${existingRating.id}.`);
                
                // Update the existing rating
                const updatedRating = await RatingRepository.update(existingRating.id, {
                    rating: data.rating,
                    description: data.description.trim(),
                });

                // Update teacher average
                await this.updateTeacherAvgRating(data.teacherId);

                return updatedRating!;
            }
        }

		// Loo hinnang
		const createData = {
			rating: data.rating,
			description: data.description.trim(),
			teacherId: data.teacherId,
			userId: data.userId === undefined ? null : (data.userId || null),
		};
		console.log("Creating rating with data:", createData);
		const rating = await RatingRepository.create(createData);

		// Uuenda õpetaja keskmist hinnangut
		await this.updateTeacherAvgRating(data.teacherId);

		return rating;
	}

	async updateRating(
		id: number,
		userId: number,
		data: UpdateRatingDTO
	): Promise<Rating> {
		const rating = await this.getRatingById(id);

		// Kontrolli, kas kasutaja on hinnangu autor
		if (rating.userId !== userId) {
			throw new RatingServiceError(
				"Sul pole õigust seda hinnangut muuta",
				"FORBIDDEN"
			);
		}

		// Valideerimine
		if (data.rating !== undefined) {
			if (data.rating < 1 || data.rating > 5) {
				throw new RatingServiceError(
					"Hinnang peab olema 1 kuni 5",
					"VALIDATION_ERROR"
				);
			}
			if (!Number.isInteger(data.rating)) {
				throw new RatingServiceError(
					"Hinnang peab olema täisarv",
					"VALIDATION_ERROR"
				);
			}
		}

		if (data.description !== undefined && data.description.length > 400) {
			throw new RatingServiceError(
				"Kirjeldus ei tohi olla pikem kui 400 tähemärki",
				"VALIDATION_ERROR"
			);
		}

		const updatedRating = await RatingRepository.update(id, data);

		// Uuenda õpetaja keskmist hinnangut
		if (data.rating !== undefined && rating.teacherId) {
			await this.updateTeacherAvgRating(rating.teacherId);
		}

		return updatedRating!;
	}

	async deleteRating(id: number): Promise<void> {
        const rating = await this.getRatingById(id);
        
        const teacherId = rating.teacherId;

        // Perform the delete
        await RatingRepository.delete(id);

        // Update the teacher's average rating
        if (teacherId) {
            await this.updateTeacherAvgRating(teacherId);
        }
    }

	private async updateTeacherAvgRating(teacherId: number): Promise<void> {
		const avgRating = await RatingRepository.getAverageRatingForTeacher(
			teacherId
		);
		await TeacherRepository.updateAvgRating(teacherId, avgRating);
	}
}

export default new RatingService();
