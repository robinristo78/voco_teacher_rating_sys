import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import {
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

import type { Review, Teacher } from "../lib/types";

// Helper: render stars
const renderStars = (
	rating: number,
	interactive = false,
	onRatingChange?: (rating: number) => void
) => {
	const stars = [];
	for (let i = 1; i <= 5; i++) {
		const isFilled = i <= rating;
		const StarComponent = isFilled ? StarIcon : StarOutlineIcon;

		stars.push(
			<button
				key={i}
				type={interactive ? "button" : undefined}
				onClick={interactive ? () => onRatingChange?.(i) : undefined}
				className={`w-5 h-5 ${
					interactive
						? "hover:scale-110 transition-transform cursor-pointer"
						: ""
				} ${isFilled ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
				disabled={!interactive}
			>
				<StarComponent className='w-full h-full' />
			</button>
		);
	}
	return stars;
};

export default function TeacherProfile() {
	const { id } = useParams<{ id: string }>();
	const [initialTeacher, setInitialTeacher] = useState<Teacher>({
		id: "",
		name: "",
		role: "",
		address: "",
		room: "",
		unit: "",
		email: "",
		phone: "",
		image: "",
		avgRating: 0,
		updatedAt: "",
		reviews: [],
	});
	const [showReviewForm, setShowReviewForm] = useState(false);

	const [reviewForm, setReviewForm] = useState({
		studentName: "",
		rating: 5,
		comment: "",
		subject: "",
	});

	useEffect(() => {
		async function fetchTeacher() {
			try {
				const response = await fetch(`/api/teachers/${id}`);
				const data = await response.json();
				console.log("Fetched teacher data:", data);

				if (data.reviews === null) {
					data.reviews = [];
				}

				setInitialTeacher(data);
			} catch (error) {
				console.error("Failed to fetch teacher:", error);
			}
		}

		if (id) {
			console.log("Fetching teacher with ID:", id);
			fetchTeacher();
		}
	}, [id]);

	const averageRating = useMemo(() => {
		if (!initialTeacher?.reviews || initialTeacher.reviews.length === 0) {
			return 0;
		}
		const totalRating = initialTeacher.reviews.reduce(
			(acc, r) => acc + r.rating,
			0
		);
		return totalRating / initialTeacher.reviews.length;
	}, [initialTeacher]);

	if (!initialTeacher || !initialTeacher.id) {
		return (
			<div className='text-center text-red-600 dark:text-red-400 mt-20'>
				Teacher not found.
			</div>
		);
	}

	const totalReviews = initialTeacher.reviews?.length || 0;

	const handleSubmitReview = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Submitting review:", reviewForm);
		if (!reviewForm.comment) {
			toast.error("Please fill in all fields");
			return;
		}

		// Create a new review object conforming to the Review type
		const newReview: Review = {
			...reviewForm,
			description: reviewForm.comment,
			teacherId: initialTeacher.id,
			userId: "anonymous", // In real app, get from auth context
			id: Date.now().toString(),
			createdAt: new Date().toISOString(),
		};

		// Update component state instead of mutating props
		/* 	const updatedTeacher = {
			...initialTeacher,
			reviews: [...initialTeacher.reviews, newReview],
		};
		setInitialTeacher(updatedTeacher); */

		fetch(`/api/ratings`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newReview),
		})
			.then(() => {
				toast.success("Review submitted!");
				setShowReviewForm(false);
				setReviewForm({ studentName: "", rating: 5, comment: "", subject: "" });
			})
			.catch((error) => {
				console.error("Failed to submit review:", error);
			});
	};

	return (
		<div className='max-w-4xl mx-auto px-4 py-8'>
			{/* Teacher Info */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8'>
				<div className='flex flex-col md:flex-row gap-6'>
					<div className='w-32 h-32 mx-auto md:mx-0 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700'>
						{initialTeacher.image ? (
							<img
								src={initialTeacher.image}
								alt={initialTeacher.name}
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-gray-500 text-3xl'>
								{initialTeacher.name
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</div>
						)}
					</div>

					<div className='flex-1 text-center md:text-left'>
						<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
							{initialTeacher.name}
						</h1>
						<p className='text-lg text-gray-600 dark:text-gray-300 mb-2'>
							{initialTeacher.role}
						</p>
						<p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
							{initialTeacher.unit} – {initialTeacher.room}
						</p>

						{/* Ratings */}
						<div className='flex items-center justify-center md:justify-start gap-1 mb-4'>
							{renderStars(averageRating)}
							<span className='ml-2 text-lg font-semibold text-gray-900 dark:text-white'>
								{averageRating.toFixed(1)}
							</span>
							<span className='text-gray-600 dark:text-gray-300'>
								({totalReviews} review{totalReviews !== 1 ? "s" : ""})
							</span>
						</div>

						{/* Contact */}
						<div className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
							<div className='flex items-center gap-2'>
								<EnvelopeIcon className='w-4 h-4' />
								<span>{initialTeacher.email}</span>
							</div>

							{initialTeacher.phone && (
								<div className='flex items-center gap-2'>
									<PhoneIcon className='w-4 h-4' />
									<span>{initialTeacher.phone}</span>
								</div>
							)}

							<div className='flex items-center gap-2'>
								<MapPinIcon className='w-4 h-4' />
								<span>{initialTeacher.address}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Reviews */}
			{/* <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8'>
				<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
					Hinnangud ({totalReviews})
				</h2>

				{initialTeacher?.reviews.length === 0 ? (
					<p className='text-gray-600 dark:text-gray-300 text-center py-8'>
						Keegi pole veel hinnanud. Ole esimene!
					</p>
				) : (
					<div className='space-y-6'>
						{initialTeacher.reviews.map((review) => (
							<div
								key={review.id}
								className='border-b border-gray-200 dark:border-gray-700 pb-6'
							>
								<div className='flex items-start justify-between mb-2'>
									<div>
										<h4 className='font-semibold text-gray-900 dark:text-white'>
											{review.studentName}
										</h4>
										{review.subject && (
											<p className='text-sm text-gray-600 dark:text-gray-300'>
												{review.subject}
											</p>
										)}
									</div>
									<div className='flex items-center gap-1'>
										{renderStars(review.rating)}
									</div>
								</div>
								<p className='text-gray-700 dark:text-gray-300'>
									{review.comment}
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
									{new Date(review.createdAt).toLocaleDateString()}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
 */}
			{/* Add Review Button */}
			<div className='mb-8'>
				<button
					onClick={() => setShowReviewForm(!showReviewForm)}
					className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700'
				>
					{showReviewForm ? "Tühista" : "Hinda Õpetajat"}
				</button>
			</div>

			{/* Review Form */}
			{showReviewForm && (
				<form
					onSubmit={handleSubmitReview}
					className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8'
				>
					<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
						Kirjuta hinnang
					</h2>

					<div className='flex gap-1 mb-4'>
						{renderStars(reviewForm.rating, true, (rating) =>
							setReviewForm({ ...reviewForm, rating })
						)}
					</div>

					<textarea
						placeholder='Ütle välja, mida sa arvad...'
						rows={4}
						value={reviewForm.comment}
						onChange={(e) =>
							setReviewForm({ ...reviewForm, comment: e.target.value })
						}
						className='w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
					/>

					<button
						type='submit'
						className='bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700'
					>
						Esita
					</button>
				</form>
			)}
		</div>
	);
}
