import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../database";
import { Rating } from "./RatingsModel";

interface TeacherAttributes {
	id?: number;
	name: string;
	role: string;
	address?: string;
	room?: string;
	unit: string;
	email?: string;
	phone?: string;
	image?: string;
	avgRating?: number;
	updatedAt?: Date;
	Ratings?: Rating[];
	ratingCount?: number;
}

class Teacher extends Model<TeacherAttributes> implements TeacherAttributes {
	public id!: number;
	public name!: string;
	public role!: string;
	public address?: string;
	public room?: string;
	public unit!: string;
	public email?: string;
	public phone?: string;
	public image?: string;
	public avgRating?: number;
	public updatedAt?: Date;
	public Ratings?: Rating[];
	public ratingCount?: number;
}

Teacher.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		role: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		room: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		unit: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		image: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		avgRating: {
			type: DataTypes.DECIMAL(3, 2),
			allowNull: false,
			defaultValue: 0.0,
		},
	},
	{
		tableName: "teachers",
		sequelize,
		timestamps: true,
		createdAt: false,
	}
);

export { Teacher };
