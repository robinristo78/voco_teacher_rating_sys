const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface RatingPayload {
  rating: number;
  description: string;
  teacherId: number;
  userId?: number;
}

export async function createRating(payload: RatingPayload) {
  console.log("Creating rating with payload:", payload);
  
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();
  console.log("Rating response:", responseData, "Status:", response.status);

  if (!response.ok) {
    throw new Error(responseData.error || `Failed to submit rating: ${response.status}`);
  }

  return responseData;
}

export async function getTeacher(id: string) {
  const response = await fetch(`${API_BASE_URL}/teachers/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch teacher");
  }

  return response.json();
}

export async function getRatingsByTeacher(teacherId: string) {
  const response = await fetch(`${API_BASE_URL}/teachers/${teacherId}/ratings`);

  if (!response.ok) {
    throw new Error("Failed to fetch ratings");
  }

  return response.json();
}

export async function deleteRating(id: number) {
  const response = await fetch(`${API_BASE_URL}/ratings/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    // Try to parse error message, fallback to generic text
    const errorData = await response.json().catch(() => ({})); 
    throw new Error(errorData.error || "Failed to delete rating");
  }

  return response.json();
}