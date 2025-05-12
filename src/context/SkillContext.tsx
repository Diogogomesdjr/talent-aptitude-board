import React, { createContext, useContext, useState, useEffect } from "react";
import { Skill, Collaborator, Team, SkillCategory, CollaboratorSkill, FunctionRole } from "@/types/skills";
import { useSkillsData } from "@/hooks/useSkillsData";
import { useCollaboratorsData } from "@/hooks/useCollaboratorsData";
import { useTeamsData } from "@/hooks/useTeamsData";
import { useFunctionRolesData } from "@/hooks/useFunctionRolesData";

interface SkillContextType {
  // Skills methods
  skills: Skill[];
  addSkill: (name: string, category: SkillCategory) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  getSkill: (id: string) => Skill | undefined;

  // Teams methods
  teams: Team[];
  addTeam: (name: string) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  getTeam: (id: string) => Team | undefined;

  // Function Role methods
  functionRoles: FunctionRole[];
  addFunctionRole: (name: string, description?: string) => void;
  updateFunctionRole: (id: string, data: Partial<FunctionRole>) => void;
  deleteFunctionRole: (id: string) => void;
  getFunctionRole: (id: string) => FunctionRole | undefined;
  
  // Collaborators methods
  collaborators: Collaborator[];
  addCollaborator: (name: string, photoUrl: string, teamId?: string) => void;
  updateCollaborator: (id: string, data: Partial<Omit<Collaborator, "id" | "skills">>) => void;
  deleteCollaborator: (id: string) => void;
  addCollaboratorSkill: (collaboratorId: string, skillId: string) => void;
  updateCollaboratorSkill: (collaboratorId: string, skillId: string, data: Partial<CollaboratorSkill>) => void;
  removeCollaboratorSkill: (collaboratorId: string, skillId: string) => void;
  togglePontoCentral: (id: string) => void;
  toggleCollaboratorAptForRole: (id: string) => void;
  assignFunctionRole: (collaboratorId: string, functionRoleId: string) => void;
  updateImprovementOpportunities: (
    collaboratorId: string, 
    opportunities: {
      hardSkills?: string;
      softSkills?: string;
      nextChallenges?: string;
    }
  ) => void;
  
  // Historical methods
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

export const SkillProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    getSkill
  } = useSkillsData();

  const {
    teams,
    addTeam,
    updateTeam,
    deleteTeam,
    getTeam
  } = useTeamsData();

  const {
    functionRoles,
    addFunctionRole,
    updateFunctionRole,
    deleteFunctionRole,
    getFunctionRole
  } = useFunctionRolesData();
  
  const {
    collaborators,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator,
    addCollaboratorSkill,
    updateCollaboratorSkill,
    removeCollaboratorSkill,
    togglePontoCentral,
    toggleCollaboratorAptForRole,
    assignFunctionRole,
    saveMonthlySnapshot,
    getPreviousMonthData,
    calculateCurrentMetrics,
    historicalData,
    handleTeamDeleted,
    handleSkillDeleted,
    handleFunctionRoleDeleted,
    updateImprovementOpportunities
  } = useCollaboratorsData();
  
  useEffect(() => {
    // Update collaborators when a team is deleted
    handleTeamDeleted;
    
    // Update collaborators when a skill is deleted
    handleSkillDeleted;

    // Update collaborators when a function role is deleted
    handleFunctionRoleDeleted;
  }, [handleTeamDeleted, handleSkillDeleted, handleFunctionRoleDeleted]);
  
  return (
    <SkillContext.Provider
      value={{
        // Skills
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        getSkill,

        // Teams
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        getTeam,

        // Function Roles
        functionRoles,
        addFunctionRole,
        updateFunctionRole,
        deleteFunctionRole,
        getFunctionRole,
        
        // Collaborators
        collaborators,
        addCollaborator,
        updateCollaborator,
        deleteCollaborator,
        addCollaboratorSkill,
        updateCollaboratorSkill,
        removeCollaboratorSkill,
        togglePontoCentral,
        toggleCollaboratorAptForRole,
        assignFunctionRole,
        updateImprovementOpportunities,
        
        // Historical data
        saveMonthlySnapshot,
        getPreviousMonthData,
        calculateCurrentMetrics,
        historicalData
      }}
    >
      {children}
    </SkillContext.Provider>
  );
};
