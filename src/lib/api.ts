/**
 * API service layer — all calls go through here.
 */

import type { Employee, CodeEntry, WeeklySubmission } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

// ── Employees ──
export const fetchEmployees = () => request<Employee[]>("/api/employees");
export const createEmployee = (emp: Omit<Employee, "id">) =>
  request<Employee>("/api/employees", { method: "POST", body: JSON.stringify(emp) });
export const updateEmployee = (id: string, emp: Partial<Employee>) =>
  request<Employee>(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(emp) });

// ── Codes ──
export const fetchCodes = () => request<CodeEntry[]>("/api/codes");
export const createCode = (code: Omit<CodeEntry, "id">) =>
  request<CodeEntry>("/api/codes", { method: "POST", body: JSON.stringify(code) });
export const updateCode = (id: string, code: Partial<CodeEntry>) =>
  request<CodeEntry>(`/api/codes/${id}`, { method: "PUT", body: JSON.stringify(code) });

// ── Locations ──
export const fetchLocations = () => request<string[]>("/api/locations");
export const createLocation = (location: string) =>
  request<void>("/api/locations", { method: "POST", body: JSON.stringify({ location }) });
export const deleteLocation = (loc: string) =>
  request<void>(`/api/locations/${encodeURIComponent(loc)}`, { method: "DELETE" });

// ── Submissions ──
export const fetchSubmissions = (params?: { dateFrom?: string; dateTo?: string }) => {
  const query = new URLSearchParams();
  if (params?.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params?.dateTo) query.set("dateTo", params.dateTo);
  const qs = query.toString();
  return request<WeeklySubmission[]>(`/api/submissions${qs ? `?${qs}` : ""}`);
};
export const upsertSubmission = (submission: WeeklySubmission) =>
  request<WeeklySubmission>("/api/submissions", { method: "POST", body: JSON.stringify(submission) });
