import { Project, NewProject, HeroSettings, SiteContent } from "@/types";

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

export interface BulkResult {
  successCount: number;
  failCount: number;
  failedIds: string[];
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
    
    return { data: json.data !== undefined ? json.data : json };
  } catch {
    return { error: "Network error occurred" };
  }
}

export const ProjectService = {
  getAll: async (
    isAdmin = false,
    params?: {
      page?: number;
      limit?: number;
      category?: string;
      featured?: boolean;
      search?: string;
      sort?: string;
      order?: "asc" | "desc";
      status?: string;
    }
  ) => {
    try {
      const query = new URLSearchParams();
      if (isAdmin) query.set("admin", "true");
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      if (params?.category) query.set("category", params.category);
      if (params?.featured) query.set("featured", "true");
      if (params?.search) query.set("search", params.search);
      if (params?.sort) query.set("sort", params.sort);
      if (params?.order) query.set("order", params.order);
      if (params?.status) query.set("status", params.status);
      
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

  bulkAction: async (action: "delete" | "publish" | "unpublish", ids: string[]) => {
    const { data, error } = await apiRequest<BulkResult>("/api/projects/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids }),
    });
    if (error) throw new Error(error);
    return data as BulkResult;
  },

  getById: async (id: string, isAdmin = false) => {
    const url = isAdmin ? `/api/projects/${id}?admin=true` : `/api/projects/${id}`;
    return apiRequest<Project>(url);
  },
  getBySlug: async (slug: string) => apiRequest<Project>(`/api/projects/${slug}`),
  create: async (data: NewProject) => {
    const { data: result, error } = await apiRequest<Project>("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (error) throw new Error(typeof error === "string" ? error : "Failed to save project");
    return result as Project;
  },
  update: async (id: string, data: Partial<Project>) => {
    const { data: result, error } = await apiRequest<Project>(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (error) {
      throw new Error(typeof error === "string" ? error : "Failed to update project");
    }
    return result as Project;
  },
  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/api/projects/${id}`, { method: "DELETE" }),
  publish: (id: string) =>
    apiRequest<Project>(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    }),
  unpublish: (id: string) =>
    apiRequest<Project>(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "draft" }),
    }),
};


export const SettingsService = {
  getHero: (isAdmin = false) => {
    const endpoint = isAdmin ? '/api/settings/hero?admin=true' : '/api/settings/hero';
    return apiRequest<HeroSettings>(endpoint);
  },
  updateHero: (data: Partial<HeroSettings>) =>
    apiRequest<HeroSettings>("/api/settings/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
  getContent: (isAdmin = false) => {
    const endpoint = isAdmin ? '/api/settings/content?admin=true' : '/api/settings/content';
    return apiRequest<SiteContent>(endpoint);
  },
  getContentPreview: () => apiRequest<SiteContent>("/api/settings/content?preview=true"),
  updateContent: (data: Partial<SiteContent>) =>
    apiRequest<SiteContent>("/api/settings/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};
