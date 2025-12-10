import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyEmail } from "../api/auth";

export default function VerifyEmailPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
	const token = searchParams.get("token");
	const pendingEmail = searchParams.get("email");

	const [status, setStatus] = useState<"idle" | "pending" | "success" | "error" | "info">(
		token ? "pending" : "info"
	);
	const [message, setMessage] = useState<string>("");
	const verificationAttempted = useRef(false);

	useEffect(() => {
		if (!token || verificationAttempted.current) return;
		verificationAttempted.current = true;

		const doVerify = async () => {
			try {
				const result = await verifyEmail(token);
				setStatus("success");
				setMessage(result.message || "Email kinnitatud. Saad nüüd sisse logida.");
				toast.success(result.message || "Email kinnitatud!");
			} catch (error: any) {
				setStatus("error");
				setMessage(error?.message || "Kinnitus ebaõnnestus");
				toast.error(error?.message || "Kinnitus ebaõnnestus");
			}
		};
		doVerify();
	}, [token]);

	const heading = token
		? "Kinnitame sinu emaili"
		: "Kontrolli oma postkasti";

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4'>
			<div className='max-w-lg w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center space-y-4'>
				<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>{heading}</h1>
				{status === "info" && (
					<p className='text-gray-700 dark:text-gray-300'>
						{pendingEmail
							? `Saatsime kinnituslingi aadressile ${pendingEmail}.`
							: "Saatsime kinnituslingi sinu emailile."}
						<br />
						Jätka sisselogimisega pärast kinnitamist.
					</p>
				)}

				{status === "pending" && (
					<p className='text-gray-700 dark:text-gray-300'>Kinnitame linki...</p>
				)}

				{status === "success" && (
					<p className='text-green-600 dark:text-green-400 font-semibold'>{message}</p>
				)}

				{status === "error" && (
					<p className='text-red-600 dark:text-red-400 font-semibold'>{message}</p>
				)}

				<div className='flex gap-3 justify-center pt-2'>
					<button
						onClick={() => navigate("/login")}
						className='bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700'
					>
						Mine sisselogimisele
					</button>
				</div>
			</div>
		</div>
	);
}
