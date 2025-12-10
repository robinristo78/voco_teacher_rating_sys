import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const auth = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Palun sisesta email ja parool");
			return;
		}

		setLoading(true);

		try {
			console.log("Attempting login:", { email });
			const result = await login({
				email: email.trim(),
				password,
			});

			console.log("Login successful:", result);

			// Update auth context
			if (result.user) {
				auth.login(result.user);
			}

			toast.success("Sisselogimine edukas!");

			// Redirect to home after 1 second
			setTimeout(() => {
				navigate("/");
			}, 1500);
		} catch (error) {
			console.error("Login error:", error);
			const message =
				error instanceof Error ? error.message : "Sisselogimine ebaõnnestus";
			toast.error(message);
			if (message.toLowerCase().includes("kinnita")) {
				navigate(`/verify?email=${encodeURIComponent(email.trim())}`);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4'>
			<div className='max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg'>
				<h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center'>
					Logi sisse
				</h1>

				<form className='space-y-4' onSubmit={handleSubmit}>
					<div>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-1'
							htmlFor='email'
						>
							Email
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500'
							placeholder='sisesta oma email'
						/>
					</div>

					<div>
						<label
							className='block text-gray-700 dark:text-gray-300 mb-1'
							htmlFor='password'
						>
							Parool
						</label>
						<input
							type='password'
							id='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500'
							placeholder='sisesta oma parool'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
					>
						{loading ? "Logime sisse..." : "Logi sisse"}
					</button>
				</form>

				<p className='mt-4 text-center text-gray-600 dark:text-gray-400'>
					Sul pole kontot?{" "}
					<Link to='/signup' className='text-purple-500 hover:underline'>
						Registreeru
					</Link>
				</p>
			</div>
		</div>
	);
}
