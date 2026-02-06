export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export interface SubmissionUser {
  id: string;
  name: string;
  email: string;
  affiliation?: string;
}

export interface SubmissionResult {
  success: boolean;
  paperId?: string;
  error?: string;
}

export interface CategoriesResult {
  success: boolean;
  categories?: Category[];
  error?: string;
}
