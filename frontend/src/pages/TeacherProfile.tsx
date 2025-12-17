import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { createRating, getRatingsByTeacher, getTeacher, deleteRating } from "../api/ratings";
import type { Rating, Teacher } from "../lib/types";

export default function TeacherProfile() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [teacher, setTeacher] = useState<Teacher | null>(null);
	const [ratings, setRatings] = useState<Rating[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showReviewForm, setShowReviewForm] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
	const [user, setUser] = useState<{ id: number; name: string } | null>(null);
	const [deleteConfirm, setDeleteConfirm] = useState(false);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			try {
				const parsed = JSON.parse(storedUser);
				setUser({ id: parsed.id, name: parsed.name });
			} catch (parseError) {
				console.error("Kasutaja lugemine ebaõnnestus:", parseError);
			}
		}
	}, []);

	useEffect(() => {
		if (!id) {
			setError("Õpetaja ID puudub");
			setLoading(false);
			return;
		}

		const loadData = async () => {
			setLoading(true);
			setError(null);
			try {
				const [teacherData, ratingsData] = await Promise.all([
					getTeacher(id),
					getRatingsByTeacher(id),
				]);
				setTeacher(teacherData);
				setRatings(ratingsData);
			} catch (fetchError: any) {
				console.error("Õpetaja laadimine ebaõnnestus:", fetchError);
				setError(fetchError?.message || "Andmete laadimine ebaõnnestus");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [id]);

	const averageRating = useMemo(() => {
		if (ratings.length > 0) {
			const sum = ratings.reduce((acc, item) => acc + item.rating, 0);
			return Number((sum / ratings.length).toFixed(2));
		}
		return Number(teacher?.avgRating ?? 0);
	}, [ratings, teacher?.avgRating]);

	// Separate user's review from others
    const userRating = useMemo(() => {
        if (!user) return null;
        return ratings.find((r) => r.userId === user.id);
    }, [ratings, user]);

	const renderStars = (value: number, interactive = false, onSelect?: (val: number) => void) => (
		<div className='flex gap-1'>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					type='button'
					key={star}
					onClick={() => interactive && onSelect?.(star)}
					className={`${
						star <= value ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
					} ${interactive ? "hover:scale-105 transition-transform" : ""}`}
					aria-label={`Hinnang ${star} tähte`}
				>
					<StarIcon className='w-6 h-6' />
				</button>
			))}
		</div>
	);

	// Handle opening/closing the form with pre-fill logic
    const toggleReviewForm = () => {
        if (!showReviewForm && userRating) {
            // If opening the form and user has a rating, pre-fill it
            setReviewForm({ 
                rating: userRating.rating, 
                comment: userRating.description 
            });
        } else if (!showReviewForm) {
            // If opening fresh, reset it
            setReviewForm({ rating: 0, comment: "" });
        }
        setShowReviewForm(!showReviewForm);
    };

	const handleSubmitReview = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!id) {
			toast.error("Õpetaja ID puudub");
			return;
		}
		if (!user) {
			toast.error("Palun logi sisse, et hinnangut anda");
			navigate("/login");
			return;
		}
		if (!reviewForm.rating) {
			toast.error("Vali hinnang vahemikus 1-5");
			return;
		}
		if (!reviewForm.comment.trim()) {
			toast.error("Lisa palun lühike kommentaar");
			return;
		}

		setSubmitting(true);
		try {
			await createRating({
				rating: reviewForm.rating,
				description: reviewForm.comment.trim(),
				teacherId: Number(id),
				userId: user.id,
			});
			toast.success(userRating ? "Hinnang muudetud!" : "Hinnang lisatud!");
			setReviewForm({ rating: 0, comment: "" });
			setShowReviewForm(false);
			const [teacherData, ratingsData] = await Promise.all([
				getTeacher(id),
				getRatingsByTeacher(id),
			]);
			setTeacher(teacherData);
			setRatings(ratingsData);
		} catch (submitError: any) {
			console.error("Hinnangu salvestamine ebaõnnestus:", submitError);
			toast.error(submitError?.message || "Hinnangu lisamine ebaõnnestus");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!userRating) return;
	
		// Step 1: First click just changes state
		if (!deleteConfirm) {
			setDeleteConfirm(true);
			return;
		}
	
		// Step 2: Second click performs the action
		try {
			await deleteRating(userRating.id);
			toast.success("Hinnang kustutatud!");
			
			// Refresh data
			const [teacherData, ratingsData] = await Promise.all([
				getTeacher(id!),
				getRatingsByTeacher(id!),
			]);
			setTeacher(teacherData);
			setRatings(ratingsData);
			setDeleteConfirm(false); // Reset state
		} catch (err: any) {
			toast.error("Kustutamine ebaõnnestus");
			console.error(err);
		}
	};

	if (loading) {
		return (
			<div className='max-w-5xl mx-auto px-4 py-12 text-center text-gray-700 dark:text-gray-200'>
				Laen õpetaja andmeid...
			</div>
		);
	}

	if (error || !teacher) {
		return (
			<div className='max-w-4xl mx-auto px-4 py-12 text-center'>
				<p className='text-red-600 dark:text-red-400 font-semibold'>
					{error || "Õpetajat ei leitud"}
				</p>
				<button
					onClick={() => navigate("/teachers")}
					className='mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700'
				>
					Tagasi õpetajate nimekirja
				</button>
			</div>
		);
	}

	return (
		<div className='max-w-5xl mx-auto px-4 py-10'>
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col gap-6 md:flex-row'>
				<div className='w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 self-start'>
					{teacher.image ? (
						<img src={teacher.image} alt={teacher.name} className='w-full h-full object-cover' />
					) : (
						<div className='w-full h-full flex items-center justify-center text-gray-500 text-2xl font-semibold'>
							{teacher.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</div>
					)}
				</div>

				<div className='flex-1 space-y-3'>
					<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>{teacher.unit}</p>
							<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{teacher.name}</h1>
							<p className='text-gray-700 dark:text-gray-200'>{teacher.role}</p>
						</div>
						<div className='bg-blue-50 dark:bg-blue-900/40 px-4 py-3 rounded-lg text-center'>
							<div className='flex items-center justify-center gap-2 text-xl font-semibold text-blue-700 dark:text-blue-200'>
								<StarIcon className='w-6 h-6 text-yellow-400' />
								<span>{averageRating.toFixed(2)}</span>
							</div>
							<p className='text-sm text-gray-600 dark:text-gray-300'>Keskmine hinnang</p>
							<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>({ratings.length} hinnang{ratings.length !== 1 ? 'ut' : ''})</p>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200'>
						{teacher.email && (
							<p><span className='font-semibold'>Email:</span> {teacher.email}</p>
						)}
						{teacher.phone && (
							<p><span className='font-semibold'>Telefon:</span> {teacher.phone}</p>
						)}
						{teacher.address && (
							<p><span className='font-semibold'>Aadress:</span> {teacher.address}</p>
						)}
						{teacher.room && (
							<p><span className='font-semibold'>Kabinet:</span> {teacher.room}</p>
						)}
					</div>
				</div>
			</div>

			<div className='mt-10 flex items-center justify-between'>
				<h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Hinnangud ({ratings.length})</h2>
				<button
					onClick={toggleReviewForm}
					className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700'
				>
					{showReviewForm 
						? "Tühista" 
						: (userRating ? "Hinda uuesti õpetajat" : "Hinda õpetajat")
					}
				</button>
			</div>

			{/* HIGHLIGHTED USER REVIEW */}
            {userRating && (
                <div className='mt-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg shadow-sm p-5'>
                    <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-800 dark:text-blue-100 font-bold'>
                                {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
                            </div>
                            <div>
                                <p className='text-sm font-bold text-gray-900 dark:text-white'>
                                    {user?.name} <span className="font-normal text-gray-500 dark:text-gray-400">(Sinu hinnang)</span>
                                </p>
                                <p className='text-xs text-gray-500'>
                                    {new Date(userRating.createdAt).toLocaleDateString("et-EE")}
                                </p>
                            </div>
                        </div>
                        {renderStars(userRating.rating)}
                    </div>
                    <p className='text-gray-800 dark:text-gray-100 whitespace-pre-line mt-2 pl-1'>
                        {userRating.description}
                    </p>

					{/* DELETE BUTTON */}
					<div className="flex justify-end mt-2">
						<button
							onClick={handleDelete}
							className={`bottom-2 right-4 text-xs font-semibold text-gray-400 hover:text-gray-600 hover:underline transition-colors`}>
							{deleteConfirm ? "Kinnita kustutamine" : "Kustuta"}
						</button>
					</div>
                </div>
            )}

			{showReviewForm && (
				<form
					onSubmit={handleSubmitReview}
					className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6'
				>
					<h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>{userRating ? "Muuda hinnang" : "Kirjuta hinnang"}</h3>
					<div className='flex gap-2 mb-4'>
						{renderStars(reviewForm.rating, true, (ratingValue) =>
							setReviewForm((prev) => ({ ...prev, rating: ratingValue }))
						)}
					</div>
					<textarea
						placeholder='Ütle välja, mida sa arvad...'
						rows={4}
						value={reviewForm.comment}
						onChange={(event) =>
							setReviewForm((prev) => ({ ...prev, comment: event.target.value }))
						}
						className='w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
					/>
					<button
						type='submit'
						disabled={submitting}
						className='mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60'
					>
						{submitting ? "Salvestan..." : "Esita"}
					</button>
				</form>
			)}

			<div className='mt-8 space-y-4'>
				{ratings.length === 0 && (
					<p className='text-gray-600 dark:text-gray-300'>Sellel õpetajal pole veel hinnanguid.</p>
				)}

				{ratings.map((rating) => (
					<div key={rating.id} className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5'>
						<div className='flex items-center justify-between mb-2'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 font-semibold'>
									{rating.user?.name ? rating.user.name.charAt(0).toUpperCase() : "?"}
								</div>
								<div>
									<p className='text-sm font-semibold text-gray-900 dark:text-white'>
										{rating.user?.name || "Anonüümne"}
									</p>
									<p className='text-xs text-gray-500'>
										{new Date(rating.createdAt).toLocaleDateString("et-EE")}
									</p>
								</div>
							</div>
							{renderStars(rating.rating)}
						</div>
						<p className='text-gray-700 dark:text-gray-200 whitespace-pre-line'>{rating.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
