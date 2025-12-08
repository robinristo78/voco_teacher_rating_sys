import { Link } from "react-router-dom";
import TeacherCard from "../components/TeacherCard"; // import the TeacherCard component
import { teachers } from "../lib/data"; // import the teachers data

// At the top of your component file, before the HomePage function:
const topTeachers = [...teachers]
  .sort((a, b) => b.avgRating - a.avgRating) // Sort descending by rating
  .slice(0, 6); // Take top 6 teachers

export default function HomePage() {

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Teretulemast ÕpetajateRate'i
          </h1>
          <p className="text-base sm:text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
            Pane hinnang oma õpetajatele ja ütle ausalt välja, mida sa neist arvad!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/teachers"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Leia oma õpetaja
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Loe meist rohkem
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Kuidas see käib?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
            Pane hinnang oma õpetajatele, jaga oma kogemusi ja vaata, mida teised arvavad!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Leia õige õpetaja</h3>
              <p className="text-gray-600 dark:text-gray-300">Otsi õpetaja nime järgi</p>
            </div>
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pane hinnang</h3>
              <p className="text-gray-600 dark:text-gray-300">Anna aus hinnang ja jaga oma kogemust</p>
            </div>
            <div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Vaata teiste arvamust</h3>
              <p className="text-gray-600 dark:text-gray-300">Vaata mida kaasõpilased arvavad</p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Teachers */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Kõige kõrgema hinnanguga õpetajad</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Avasta selle kooli parimad õpetajad, keda teised õpilased on kõrgelt hinnanud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/teachers"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Vaata kõiki õpetajaid
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
