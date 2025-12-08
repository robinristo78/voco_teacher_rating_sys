import { Link } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/solid";
import type { Teacher } from "../lib/types";

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  return (
    <Link
      to={`/teacher/${teacher.id}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {teacher.image ? (
            <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">
              {teacher.name.split(" ").map((n) => n[0]).join("")}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{teacher.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{teacher.unit}</p>
          <div className="flex items-center mt-2">
            <StarIcon className="w-5 h-5 text-yellow-400" />
            <span className="ml-1 text-gray-700 dark:text-gray-200 font-semibold">
              {teacher.avgRating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeacherCard;
