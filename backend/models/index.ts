import { Sequelize } from "@sequelize/core";

import { Rating } from "./RatingsModel";
import { Teacher } from "./TeacherModel";
import { User } from "./UserModel";

const db = {} as any;

export const initializeDatabase = (sequelize: Sequelize) => {
	db.Rating = Rating;
	db.Teacher = Teacher;
	db.User = User;

	// Set up associations
	db.Teacher.hasMany(db.Rating, { foreignKey: "teacherId", as: "Ratings" });
	db.Rating.belongsTo(db.Teacher, { foreignKey: "teacherId", as: "Teacher" });

	db.User.hasMany(db.Rating, { foreignKey: "userId", as: "Ratings" });
	db.Rating.belongsTo(db.User, { foreignKey: "userId", as: "User" });

	db.sequelize = sequelize;

	return db;
};

export { Rating, Teacher, User };

export default db;
