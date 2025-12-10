export interface Rating {
	id: number;
	rating: number;
	description: string;
	teacherId: number;
	userId: number | null;
	createdAt: string;
	user?: {
		id: number;
		name: string;
		email: string;
	};
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
	reviews: Rating[];
	ratingCount?: number;
}
