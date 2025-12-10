import * as dotenv from "dotenv";

dotenv.config();

import { Sequelize, DataTypes } from "@sequelize/core";
import { MariaDbDialect } from "@sequelize/mariadb";

const sequelize = new Sequelize({
	dialect: MariaDbDialect,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST || "localhost",
	port: Number(process.env.DB_PORT) || 3306,
	showWarnings: true,
	connectTimeout: 1000,
});

export const initDb = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		// Import models after sequelize is ready to avoid circular dependency
		const { initializeDatabase } = await import("./models");
		initializeDatabase(sequelize);

		// Sync all models with the database
		await sequelize.sync();

		// Add verification columns if they don't exist (for existing tables)
		try {
			await sequelize.getQueryInterface().addColumn("users", "isVerified", {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			});
			console.log("Added isVerified column to users table.");
		} catch (columnError: any) {
			if (!columnError.message.includes("Duplicate")) {
				console.error("Error adding isVerified column:", columnError.message);
			}
		}

		try {
			await sequelize.getQueryInterface().addColumn("users", "verificationToken", {
				type: DataTypes.STRING(255),
				allowNull: true,
			});
			console.log("Added verificationToken column to users table.");
		} catch (columnError: any) {
			if (!columnError.message.includes("Duplicate")) {
				console.error("Error adding verificationToken column:", columnError.message);
			}
		}

		try {
			await sequelize.getQueryInterface().addColumn("users", "verificationExpires", {
				type: DataTypes.DATE,
				allowNull: true,
			});
			console.log("Added verificationExpires column to users table.");
		} catch (columnError: any) {
			if (!columnError.message.includes("Duplicate")) {
				console.error("Error adding verificationExpires column:", columnError.message);
			}
		}
		console.log("All models were synchronized successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		throw error;
	}
};

export default sequelize;
