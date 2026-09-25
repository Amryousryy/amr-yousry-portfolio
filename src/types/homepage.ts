export interface HomepageProject {
  _id: string;
  title: string;
  slug: string;
  category: string;
  image: string;
  shortDescription: string;
}

export interface HomepageState {
  limit: number;
  featured: HomepageProject[];
  available: HomepageProject[];
}