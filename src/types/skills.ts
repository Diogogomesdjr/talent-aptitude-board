
export type SkillCategory = "Conhecimento" | "HardSkill" | "SoftSkill";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface CollaboratorSkill {
  skillId: string;
  rating: number | "N/A";
  isApt: boolean;
}

export interface FunctionRole {
  id: string;
  name: string;
  description?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  photoUrl: string;
  isPontoCentral: boolean;
  isAptForRole: boolean;
  functionRoleId?: string;
  teamId?: string;
  skills: Record<string, CollaboratorSkill>;
}

export interface Team {
  id: string;
  name: string;
}
