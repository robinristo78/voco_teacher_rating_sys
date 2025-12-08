import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import TeacherCard from "../components/TeacherCard";

interface Teacher {
  _id: string;
  name: string;
  department: string;
  subjects: string[];
  averageRating: number;
  totalReviews: number;
  profilePicture?: string;
}

const dummyTeachers: Teacher[] = [
  {
    _id: "1",
    name: "Alice Johnson",
    department: "Math",
    subjects: ["Algebra", "Calculus"],
    averageRating: 4.8,
    totalReviews: 12,
  },
  {
    _id: "2",
    name: "Bob Smith",
    department: "Physics",
    subjects: ["Mechanics", "Thermodynamics"],
    averageRating: 4.5,
    totalReviews: 8,
  },
  {
    _id: "3",
    name: "Carol Lee",
    department: "Chemistry",
    subjects: ["Organic Chemistry", "Inorganic Chemistry"],
    averageRating: 4.9,
    totalReviews: 15,
  },
  {
    _id: "4",
    name: "David Kim",
    department: "Biology",
    subjects: ["Genetics", "Ecology"],
    averageRating: 4.3,
    totalReviews: 5,
  },
  {
    _id: "5",
    name: "Eva Green",
    department: "History",
    subjects: ["World History", "Modern History"],
    averageRating: 4.7,
    totalReviews: 10,
  },
  {
    _id: "6",
    name: "Frank Liu",
    department: "English",
    subjects: ["Literature", "Grammar"],
    averageRating: 4.6,
    totalReviews: 7,
  },
];


export default function TeacherList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating">("name");
  const [showFilters, setShowFilters] = useState(false);

  const filteredTeachers = dummyTeachers
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.averageRating - a.averageRating;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Leia õpetaja keda tahad hinnata
        </h1>
        
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Otsi õpetajat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FunnelIcon className="w-5 h-5" />
            Filtrid
          </button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-4">
            

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "rating")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-4">
            

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "rating")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="name">Nime järgi</option>
              <option value="rating">Hinnangu järgi</option>
            </select>
          </div>
        )}
      </div>

      {/* Teacher Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            NÕpetajat ei leitud. Proovi oma otsingut muuta.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher._id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
}
