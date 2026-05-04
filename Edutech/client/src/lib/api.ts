import { useQuery, useMutation } from "@tanstack/react-query";

async function apiFetch(url: string, options?: RequestInit) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const res = await fetch(`${baseUrl}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const getListCoursesQueryKey = (params?: object) => ["/api/courses", params];
export const getGetCourseQueryKey = (id: number) => ["/api/courses", id];
export const getListLessonsQueryKey = (courseId: number) => ["/api/courses", courseId, "lessons"];
export const getListEnrollmentsQueryKey = () => ["/api/enrollments"];
export const getDashboardStatsQueryKey = () => ["/api/dashboard/stats"];
export const getRecentActivityQueryKey = () => ["/api/dashboard/recent-activity"];
export const getCourseAnalyticsQueryKey = () => ["/api/dashboard/course-analytics"];

export function useListCourses(params?: { search?: string; category?: string; level?: string }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.category) qs.set("category", params.category);
  if (params?.level) qs.set("level", params.level);
  const q = qs.toString();
  return useQuery({
    queryKey: getListCoursesQueryKey(params),
    queryFn: () => apiFetch(`/api/courses${q ? `?${q}` : ""}`),
  });
}

export function useGetCourse(id: number, options?: { query?: { enabled?: boolean } }) {
  return useQuery({
    queryKey: getGetCourseQueryKey(id),
    queryFn: () => apiFetch(`/api/courses/${id}`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateCourse() {
  return useMutation({
    mutationFn: ({ data }: { data: object }) =>
      apiFetch("/api/courses", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useUpdateCourse() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      apiFetch(`/api/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  });
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiFetch(`/api/courses/${id}`, { method: "DELETE" }),
  });
}

export function useListLessons(courseId: number, options?: { query?: { enabled?: boolean } }) {
  return useQuery({
    queryKey: getListLessonsQueryKey(courseId),
    queryFn: () => apiFetch(`/api/courses/${courseId}/lessons`),
    enabled: options?.query?.enabled ?? true,
  });
}

export function useCreateLesson() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      apiFetch(`/api/courses/${id}/lessons`, { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useUpdateLesson() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) =>
      apiFetch(`/api/lessons/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  });
}

export function useDeleteLesson() {
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiFetch(`/api/lessons/${id}`, { method: "DELETE" }),
  });
}

export function useListEnrollments() {
  return useQuery({
    queryKey: getListEnrollmentsQueryKey(),
    queryFn: () => apiFetch("/api/enrollments"),
  });
}

export function useCreateEnrollment() {
  return useMutation({
    mutationFn: ({ data }: { data: object }) =>
      apiFetch("/api/enrollments", { method: "POST", body: JSON.stringify(data) }),
  });
}

export function useDeleteEnrollment() {
  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      apiFetch(`/api/enrollments/${id}`, { method: "DELETE" }),
  });
}

export function useGetDashboardStats() {
  return useQuery({
    queryKey: getDashboardStatsQueryKey(),
    queryFn: () => apiFetch("/api/dashboard/stats"),
  });
}

export function useGetRecentActivity() {
  return useQuery({
    queryKey: getRecentActivityQueryKey(),
    queryFn: () => apiFetch("/api/dashboard/recent-activity"),
  });
}

export function useGetCourseAnalytics() {
  return useQuery({
    queryKey: getCourseAnalyticsQueryKey(),
    queryFn: () => apiFetch("/api/dashboard/course-analytics"),
  });
}
