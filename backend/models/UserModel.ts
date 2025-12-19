import { DataTypes, Model } from "@sequelize/core";
import sequelize from "../database";

interface UserAttributes {
	id?: number;
	name: string;
	email: string;
	password: string;
	createdAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public name!: string;
	public email!: string;
	public password!: string;
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
	},
	{
		tableName: "users",
		sequelize,
		timestamps: true,
		updatedAt: false,
	}
);

export { User };
