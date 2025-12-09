import { Request, Response } from "express";
import RatingService, { RatingServiceError } from "../services/RatingService";

export const createRating = async (req: Request, res: Response) => {
	console.log("Received rating data:", req.body); // Log the incoming request body
	try {
		const rating = await RatingService.createRating(req.body);
		res.status(201).json(rating);
	} catch (error: any) {
		if (error instanceof RatingServiceError) {
			if (error.code === "VALIDATION_ERROR")
				return res.status(400).json({ error: error.message });
			if (error.code === "TEACHER_NOT_FOUND" || error.code === "USER_NOT_FOUND")
				return res.status(404).json({ error: error.message });
			if (error.code === "DUPLICATE_RATING")
				return res.status(409).json({ error: error.message });
		}
		res.status(500).json({ error: "Serveri viga" });
	}
};

export const getRatingsByTeacher = async (req: Request, res: Response) => {
	try {
		const ratings = await RatingService.getRatingsByTeacherId(
			Number(req.params.teacherId)
		);
		res.json(ratings);
	} catch (error: any) {
		if (
			error instanceof RatingServiceError &&
			error.code === "TEACHER_NOT_FOUND"
		) {
			return res.status(404).json({ error: error.message });
		}
		res.status(500).json({ error: "Serveri viga" });
	}
};
