export interface TokenData {
  access_token: string;
  refresh_token: string;
}

export interface AuthenticatedUserData {
  access_token: string;
  refresh_token: string;
  groups: string[] | [];
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Language {
  id: number;
  name: string;
  language_code: string;
  modified_at: string;
  created_at: string;
}

export interface Sentence {
  id: number;
  project_id: number;
  original_sentence: string;
  annotated_sentence: string;
  modified_at: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  article_name: string;
  language_id: Language;
  is_completed: boolean;
  created_by: UserData;
  annotated_by: UserData;
  modified_at: string;
  created_at: string;
}

export interface DetailedProject {
  id: number;
  name: string;
  article_name: string;
  language_id: Language;
  is_completed: boolean;
  created_by: UserData;
  annotated_by: UserData;
  sentences: Sentence[] | [];
  modified_at: string;
  created_at: string;
}
