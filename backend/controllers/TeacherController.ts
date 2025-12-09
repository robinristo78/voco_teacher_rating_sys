import { Request, Response } from "express";
import TeacherService, {
	TeacherServiceError,
} from "../services/TeacherService";

export const getAllTeachers = async (req: Request, res: Response) => {
	try {
		const teachers = await TeacherService.getAllTeachers();
		res.json(teachers);
	} catch (error) {
		res.status(500).json({ error: "Serveri viga" });
	}
};

export const createTeacher = async (req: Request, res: Response) => {
	try {
		const teacher = await TeacherService.createTeacher(req.body);
		res.status(201).json(teacher);
	} catch (error: any) {
		// Püüame kinni Service-is visatud vead ja muudame need HTTP koodideks
		if (error instanceof TeacherServiceError) {
			if (error.code === "VALIDATION_ERROR")
				return res.status(400).json({ error: error.message });
			if (error.code === "DUPLICATE_TEACHER")
				return res.status(409).json({ error: error.message });
		}
		res.status(500).json({ error: "Serveri viga" });
	}
};

export const getTeacherById = async (req: Request, res: Response) => {
	console.log("Getting teacher by ID:", req.params.id);
	try {
		const teacher = await TeacherService.getTeacherById(Number(req.params.id));
		res.json(teacher);
	} catch (error: any) {
		if (
			error instanceof TeacherServiceError &&
			error.code === "TEACHER_NOT_FOUND"
		) {
			return res.status(404).json({ error: error.message });
		}
		res.status(500).json({ error: "Serveri viga" });
	}
};
