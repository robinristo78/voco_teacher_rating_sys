import { User } from "../models/UserModel";


export interface CreateUserDTO {
	name: string;
	email: string;
	password: string;
	isVerified?: boolean;
	verificationToken?: string | null;
	verificationExpires?: Date | null;
}


export interface UpdateUserDTO {
	name?: string;
	email?: string;
	password?: string;
	isVerified?: boolean;
	verificationToken?: string | null;
	verificationExpires?: Date | null;
}

class UserRepository {
	async findAll(): Promise<User[]> {
		return User.findAll();
	}

	async findById(id: number): Promise<User | null> {
		return User.findByPk(id);
	}

	async findByEmail(email: string): Promise<User | null> {
		return User.findOne({ where: { email } });
	}

	async findByEmailToken(token: string): Promise<User | null> {
		return User.findOne({ where: { verificationToken: token } });
	}

	       async create(data: CreateUserDTO): Promise<User> {
		       // Explicitly pass all fields to User.create
		       return User.create({
			       name: data.name,
			       email: data.email,
			       password: data.password,
			       isVerified: data.isVerified ?? false,
			       verificationToken: data.verificationToken ?? null,
			       verificationExpires: data.verificationExpires ?? null,
		       });
	       }

	async update(id: number, data: UpdateUserDTO): Promise<User | null> {
		const user = await this.findById(id);
		if (!user) return null;

		await user.update(data);
		return user;
	}

	async delete(id: number): Promise<boolean> {
		const user = await this.findById(id);
		if (!user) return false;

		await user.destroy();
		return true;
	}
}

export default new UserRepository();
