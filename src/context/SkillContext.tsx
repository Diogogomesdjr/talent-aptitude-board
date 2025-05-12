
import { createContext, useContext, ReactNode } from "react";
import { 
  SkillCategory, 
  Skill, 
  CollaboratorSkill, 
  FunctionRole, 
  Collaborator, 
  Team 
} from "@/types/skills";
import { useSkillsData } from "@/hooks/useSkillsData";
import { useCollaboratorsData } from "@/hooks/useCollaboratorsData";
import { useTeamsData } from "@/hooks/useTeamsData";
import { useFunctionRolesData } from "@/hooks/useFunctionRolesData";

interface SkillContextType {
  skills: Skill[];
  collaborators: Collaborator[];
  teams: Team[];
  functionRoles: FunctionRole[];
  addSkill: (name: string, category: SkillCategory) => void;
  updateSkill: (id: string, name: string, category: SkillCategory) => void;
  deleteSkill: (id: string) => void;
  addCollaborator: (name: string, photoUrl: string, teamId?: string) => void;
  updateCollaborator: (id: string, data: Partial<Omit<Collaborator, "id" | "skills">>) => void;
  deleteCollaborator: (id: string) => void;
  addCollaboratorSkill: (collaboratorId: string, skillId: string) => void;
  updateCollaboratorSkill: (collaboratorId: string, skillId: string, data: Partial<CollaboratorSkill>) => void;
  removeCollaboratorSkill: (collaboratorId: string, skillId: string) => void;
  addTeam: (name: string) => void;
  updateTeam: (id: string, name: string) => void;
  deleteTeam: (id: string) => void;
  togglePontoCentral: (id: string) => void;
  toggleCollaboratorAptForRole: (id: string) => void;
  getSkill: (id: string) => Skill | undefined;
  getTeam: (id: string) => Team | undefined;
  getFunctionRole: (id: string) => FunctionRole | undefined;
  addFunctionRole: (name: string, description?: string) => void;
  updateFunctionRole: (id: string, name: string, description?: string) => void;
  deleteFunctionRole: (id: string) => void;
  assignFunctionRole: (collaboratorId: string, functionRoleId: string) => void;
  // Add missing methods that are used in MonthlyComparison.tsx
  saveMonthlySnapshot: (date?: Date) => boolean;
  getPreviousMonthData: (currentDate: Date) => any;
  calculateCurrentMetrics: (filteredCollabs?: Collaborator[]) => {
    skillAverage: number;
    aptitudePercentage: number;
    totalSkills: number;
    totalSkillsByCategory: Record<string, number>;
  };
  historicalData: Record<string, any>;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const useSkillContext = () => {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error("useSkillContext must be used within a SkillProvider");
  }
  return context;
};

interface SkillProviderProps {
  children: ReactNode;
}

export const SkillProvider = ({ children }: SkillProviderProps) => {
  const skillsData = useSkillsData();
  const collaboratorsData = useCollaboratorsData();
  const teamsData = useTeamsData();
  const functionRolesData = useFunctionRolesData();

  // Wire up the hooks to handle dependencies between entities
  const deleteSkill = (id: string) => {
    skillsData.deleteSkill(id);
    collaboratorsData.handleSkillDeleted(id);
  };

  const deleteTeam = (id: string) => {
    teamsData.deleteTeam(id);
    collaboratorsData.handleTeamDeleted(id);
  };

  const deleteFunctionRole = (id: string) => {
    functionRolesData.deleteFunctionRole(id);
    collaboratorsData.handleFunctionRoleDeleted(id);
  };

  const value = {
    ...skillsData,
    ...collaboratorsData,
    ...teamsData,
    ...functionRolesData,
    // Override methods that need to handle dependencies
    deleteSkill,
    deleteTeam,
    deleteFunctionRole,
    // Explicitly add methods used in MonthlyComparison.tsx
    saveMonthlySnapshot: collaboratorsData.saveMonthlySnapshot,
    getPreviousMonthData: collaboratorsData.getPreviousMonthData,
    calculateCurrentMetrics: collaboratorsData.calculateCurrentMetrics,
    historicalData: collaboratorsData.historicalData
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};

// Re-export types
export type { SkillCategory, Skill, CollaboratorSkill, FunctionRole, Collaborator, Team };
