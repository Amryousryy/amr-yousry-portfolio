export async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const json = await res.json();
    if (Array.isArray(json)) return json as T;
    if (json && typeof json === 'object' && 'data' in json) {
      return (json.data as T) ?? fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export async function safeFetchArray<T>(url: string): Promise<T[]> {
  return safeFetch<T[]>(url, []);
}

export async function safeFetchObject<T>(url: string, fallback: T): Promise<T> {
  return safeFetch<T>(url, fallback);
}