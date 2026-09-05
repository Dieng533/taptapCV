export interface PersonalInfo {
  photoUrl?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  city?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  city?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer?: string;
  issuedDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  technologies?: string;
  link?: string;
}

export interface Interest {
  id: string;
  name: string;
  description?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  email?: string;
  phone?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: { id: string; label: string; value: string }[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  interests: Interest[];
  references: ReferenceItem[];
  customSections: CustomSection[];
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template_id: string;
  data: ResumeData;
  primary_color: string;
  font_family: string;
  photo_shape: "circle" | "square" | "none";
  section_order: string[];
  is_public: boolean;
  public_slug?: string | null;
  created_at: string;
  updated_at: string;
}

export const EMPTY_RESUME_DATA: ResumeData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    phone: "",
  },
  summary: "",
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  interests: [],
  references: [],
  customSections: [],
};

export const DEFAULT_SECTION_ORDER = [
  "profile",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "projects",
  "interests",
  "references",
];
