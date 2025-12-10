import { Router } from "express";
import * as TeacherController from "../controllers/TeacherController";
import * as RatingController from "../controllers/RatingController";
import * as UserController from "../controllers/UserController";

const router = Router();

// --- ÕPETAJAD ---
router.get("/teachers", TeacherController.getAllTeachers);
router.post("/teachers", TeacherController.createTeacher);
router.get("/teachers/:id", TeacherController.getTeacherById);
// router.put("/teachers/:id", TeacherController.updateTeacher); // Kommenteeri sisse kui olemas
// router.delete("/teachers/:id", TeacherController.deleteTeacher); // Kommenteeri sisse kui olemas

// --- HINNANGUD ---
router.post("/ratings", RatingController.createRating);
router.get("/teachers/:teacherId/ratings", RatingController.getRatingsByTeacher);
// router.delete("/ratings/:id", RatingController.deleteRating); // Kommenteeri sisse kui olemas

// --- KASUTAJAD (AUTH) ---
router.post("/auth/register", UserController.register);
router.post("/auth/login", UserController.login);
router.get("/auth/verify", UserController.verifyEmail);

export default router;