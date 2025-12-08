import { useState, useMemo, useCallback } from "react";
import { teachers as initialTeachers } from "../lib/data";
import { Teacher, Review } from "../lib/types";

// In a real app, this would be a proper state management solution (like Context or Redux).
// For this mock setup, we'll use a mutable singleton to keep data consistent across pages.
let teachersStore: Teacher[] = JSON.parse(JSON.stringify(initialTeachers));

export const useTeacherData = () => {
  // The state is used to trigger re-renders in components.
  const [, setForceUpdate] = useState({});

  const getTeachers = useCallback((): Teacher[] => {
    // Return teachers with dynamically calculated average ratings
    return teachersStore.map((teacher) => ({
      ...teacher,
      avgRating:
        teacher.reviews.length > 0
          ? teacher.reviews.reduce((acc, r) => acc + r.rating, 0) / teacher.reviews.length
          : 0,
    }));
  }, []);

  const findTeacher = useCallback((id: string): Teacher | undefined => {
    const teacher = teachersStore.find((t) => t.id === id);
    if (!teacher) return undefined;

    // Return teacher with dynamically calculated average rating
    return {
      ...teacher,
      avgRating:
        teacher.reviews.length > 0
          ? teacher.reviews.reduce((acc, r) => acc + r.rating, 0) / teacher.reviews.length
          : 0,
    };
  }, []);

  const addReview = useCallback((teacherId: string, reviewData: Omit<Review, "id" | "createdAt">) => {
    const teacherIndex = teachersStore.findIndex((t) => t.id === teacherId);
    if (teacherIndex === -1) {
      throw new Error("Teacher not found");
    }

    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Create a new updated teacher object
    const updatedTeacher = {
      ...teachersStore[teacherIndex],
      reviews: [...teachersStore[teacherIndex].reviews, newReview],
    };

    // Create a new array for the store
    const updatedTeachers = [...teachersStore];
    updatedTeachers[teacherIndex] = updatedTeacher;

    // Replace the store
    teachersStore = updatedTeachers;

    // Trigger re-render in any component using the hook
    setForceUpdate({});
  }, []);

  const topRatedTeachers = useMemo(() => {
    return getTeachers()
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);
  }, [getTeachers]);

  return { getTeachers, findTeacher, addReview, topRatedTeachers };
};
