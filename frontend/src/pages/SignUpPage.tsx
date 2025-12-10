import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { register } from "../api/auth";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!value.endsWith("@voco.ee")) {
      setEmailError("Email peab lõppema @voco.ee");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailError) return; // Do not submit if email is invalid

    setLoading(true);

    try {
      console.log("Attempting registration:", { name, email });
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      console.log("Registration successful:", result);
      toast.success("Registreerimine edukas! Kontrolli oma emaili kinnituslingi jaoks.");

      navigate(`/verify?email=${encodeURIComponent(email.trim())}`);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Registreerimine ebaõnnestus");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    name.trim() !== "" &&
    password.trim() !== "" &&
    email.endsWith("@voco.ee");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Loo konto
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* NAME */}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="name"
            >
              Nimi
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="täisnimi, hüüdnimi või ema neiupõlvenimi"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="email"
            >
              Email (@voco.ee)
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-purple-500"
              }
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 
                focus:outline-none focus:ring-2`}
              placeholder="sisesta email"
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="password"
            >
              Parool
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="sisesta parool"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full text-white py-2 rounded-lg font-semibold transition-colors
              ${
                isFormValid && !loading
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Registreerin..." : "Registreeru"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Sul juba on konto?{" "}
          <Link to="/login" className="text-purple-500 hover:underline">
            Logi sisse
          </Link>
        </p>
      </div>
    </div>
  );
}
