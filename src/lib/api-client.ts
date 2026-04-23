import { Project, NewProject, Filter, HeroSettings, SiteContent } from "@/types";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url, options);
    
    if (res.status === 204) return {};
    
    const json = await res.json();
    
    if (!res.ok) {
      return { error: json.error || "Something went wrong" };
    }
    
    return { data: json.data };
  } catch {
    return { error: "Network error occurred" };
  }
}

export const ProjectService = {
  getAll: async (isAdmin = false, params?: { page?: number; limit?: number; category?: string; featured?: boolean; search?: string }) => {
    try {
      const query = new URLSearchParams();
      if (isAdmin) query.set("admin", "true");
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.category) query.set("category", params.category);
      if (params?.featured) query.set("featured", "true");
      if (params?.search) query.set("search", params.search);
      
      const res = await fetch(`/api/projects?${query.toString()}`);
      const json: ApiResponse<Project[]> = await res.json();
      
      if (!res.ok) return { data: [], error: json.data as unknown as string };
      
      return { 
        data: Array.isArray(json.data) ? json.data : [], 
        meta: json.meta 
      };
    } catch (err) {
      return { data: [], error: String(err) };
    }
  },
  getById: async (id: string) => apiRequest<Project>(`/api/projects/${id}`),
  getBySlug: async (slug: string) => apiRequest<Project>(`/api/projects/${slug}`),
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

export interface LeadData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  offerType: "general" | "free_audit";
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: string;
  updatedAt: string;
}

export const LeadService = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    try {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.status) query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      
      const res = await fetch(`/api/leads?${query.toString()}`);
      const json: ApiResponse<LeadData[]> = await res.json();
      
      if (!res.ok) return { data: [], error: json.data as unknown as string };
      
      return { 
        data: Array.isArray(json.data) ? json.data : [], 
        meta: json.meta 
      };
    } catch (err) {
      return { data: [], error: String(err) };
    }
  },
  updateStatus: async (id: string, status: string) => {
    return apiRequest<LeadData>(`/api/leads`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  },
};

export const FilterService = {
  getAll: (isAdmin = false, params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (isAdmin) query.set("admin", "true");
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    return apiRequest<Filter[]>(`/api/filters?${query.toString()}`);
  },
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