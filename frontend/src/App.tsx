import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import HomePage from "./pages/HomePage.tsx";
import TeachersPage from "./pages/TeachersPage.tsx";
import TeacherProfile from "./pages/TeacherProfile.tsx";
import About from "./pages/About.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teachers" element={<TeachersPage />} />
            <Route path="/teacher/:id" element={<TeacherProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
