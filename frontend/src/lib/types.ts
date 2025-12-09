export interface Review {
	id: string;
	studentName: string;
	rating: number;
	comment: string;
	subject: string;
	createdAt: string;
	description?: string;
	teacherId?: string;
	userId?: string;
}

export interface Teacher {
	id: string;
	name: string;
	role: string;
	address: string;
	room: string;
	unit: string;
	email: string;
	phone: string;
	image: string;
	avgRating: number;
	updatedAt: string;
	reviews: Review[];
}
