import { Project, NewProject, Filter, HeroSettings, SiteContent } from "@/types";

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    
    // Handle empty responses
    if (res.status === 204) return {};
    
    const json = await res.json();
    
    if (!res.ok) {
      return { error: json.error || "Something went wrong" };
    }
    
    return { data: json };
  } catch {
    return { error: "Network error occurred" };
  }
}

export const ProjectService = {
  getAll: async (isAdmin = false) => {
    return apiRequest<Project[]>(`/api/projects${isAdmin ? "?admin=true" : ""}`);
  },
  getById: async (id: string) => {
    return apiRequest<Project>(`/api/projects/${id}`);
  },
  getBySlug: async (slug: string) => {
    return apiRequest<Project>(`/api/projects/${slug}`);
  },
  create: (data: NewProject) =>
    apiRequest<Project>("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Project>) =>
    apiRequest<Project>(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/projects/${id}`, { method: "DELETE" }),
};

export const FilterService = {
  getAll: (isAdmin = false) => apiRequest<Filter[]>(`/api/filters${isAdmin ? "?admin=true" : ""}`),
  create: (data: Partial<Filter>) =>
    apiRequest<Filter>("/api/filters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Filter>) =>
    apiRequest<Filter>(`/api/filters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/filters/${id}`, { method: "DELETE" }),
};

export const SettingsService = {
  getHero: () => apiRequest<HeroSettings>("/api/settings/hero"),
  updateHero: (data: Partial<HeroSettings>) =>
    apiRequest<HeroSettings>("/api/settings/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  getContent: () => apiRequest<SiteContent>("/api/settings/content"),
  updateContent: (data: Partial<SiteContent>) =>
    apiRequest<SiteContent>("/api/settings/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};
