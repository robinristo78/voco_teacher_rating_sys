import { useState } from "react";
import { teachers } from "../lib/data";
import TeacherCard from "../components/TeacherCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Kõik Õpetajad
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Otsi ja leia oma õpetajaid.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Otsi õpetaja nime..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Teacher List */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300 mt-12">
          Õpetajaid ei leitud. Muuda otsingut.
        </p>
      )}
    </div>
  );
}
