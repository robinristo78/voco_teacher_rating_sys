import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../database";

interface UserAttributes {
	id?: number;
	name: string;
	email: string;
	password: string;
	isVerified?: boolean;
	verificationToken?: string | null;
	verificationExpires?: Date | null;
	createdAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public name!: string;
	public email!: string;
	public password!: string;
	public isVerified?: boolean;
	public verificationToken?: string | null;
	public verificationExpires?: Date | null;
	public createdAt?: Date;
}

User.init(
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
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		verificationToken: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		verificationExpires: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		tableName: "users",
		sequelize,
		timestamps: true,
		updatedAt: false,
	}
);

export { User };
