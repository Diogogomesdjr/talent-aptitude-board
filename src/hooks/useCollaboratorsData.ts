
import { useState, useEffect } from "react";
import { Collaborator, CollaboratorSkill } from "@/types/skills";
import { generateId } from "@/utils/skillUtils";

export const useCollaboratorsData = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem("collaborators");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("collaborators", JSON.stringify(collaborators));
  }, [collaborators]);

  const addCollaborator = (name: string, photoUrl: string, teamId?: string) => {
    const newCollaborator: Collaborator = {
      id: generateId(),
      name,
      photoUrl,
      isPontoCentral: false,
      isAptForRole: true,
      teamId,
      skills: {}
    };
    setCollaborators([...collaborators, newCollaborator]);
  };

  const updateCollaborator = (id: string, data: Partial<Omit<Collaborator, "id" | "skills">>) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.id === id ? { ...collaborator, ...data } : collaborator
    ));
  };

  const deleteCollaborator = (id: string) => {
    setCollaborators(collaborators.filter(collaborator => collaborator.id !== id));
  };

  const addCollaboratorSkill = (collaboratorId: string, skillId: string) => {
    setCollaborators(collaborators.map(collaborator => {
      if (collaborator.id === collaboratorId) {
        return {
          ...collaborator,
          skills: {
            ...collaborator.skills,
            [skillId]: { skillId, rating: "N/A", isApt: false }
          }
        };
      }
      return collaborator;
    }));
  };

  const updateCollaboratorSkill = (collaboratorId: string, skillId: string, data: Partial<CollaboratorSkill>) => {
    setCollaborators(collaborators.map(collaborator => {
      if (collaborator.id === collaboratorId && collaborator.skills[skillId]) {
        return {
          ...collaborator,
          skills: {
            ...collaborator.skills,
            [skillId]: {
              ...collaborator.skills[skillId],
              ...data
            }
          }
        };
      }
      return collaborator;
    }));
  };

  const removeCollaboratorSkill = (collaboratorId: string, skillId: string) => {
    setCollaborators(collaborators.map(collaborator => {
      if (collaborator.id === collaboratorId) {
        const updatedSkills = { ...collaborator.skills };
        delete updatedSkills[skillId];
        return {
          ...collaborator,
          skills: updatedSkills
        };
      }
      return collaborator;
    }));
  };

  const togglePontoCentral = (id: string) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.id === id ? { ...collaborator, isPontoCentral: !collaborator.isPontoCentral } : collaborator
    ));
  };

  const toggleCollaboratorAptForRole = (id: string) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.id === id ? { ...collaborator, isAptForRole: !collaborator.isAptForRole } : collaborator
    ));
  };

  // For function role changes to collaborators
  const assignFunctionRole = (collaboratorId: string, functionRoleId: string) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.id === collaboratorId ? { ...collaborator, functionRoleId } : collaborator
    ));
  };

  // Update collaborators when a team is deleted
  const handleTeamDeleted = (teamId: string) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.teamId === teamId ? { ...collaborator, teamId: undefined } : collaborator
    ));
  };

  // Update collaborators when a skill is deleted
  const handleSkillDeleted = (skillId: string) => {
    setCollaborators(collaborators.map(collaborator => {
      const updatedSkills = { ...collaborator.skills };
      if (updatedSkills[skillId]) {
        delete updatedSkills[skillId];
      }
      return { ...collaborator, skills: updatedSkills };
    }));
  };

  // Update collaborators when a function role is deleted
  const handleFunctionRoleDeleted = (functionRoleId: string) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.functionRoleId === functionRoleId ? { ...collaborator, functionRoleId: undefined } : collaborator
    ));
  };

  return {
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
    handleTeamDeleted,
    handleSkillDeleted,
    handleFunctionRoleDeleted
  };
};
