
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

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

const generateId = () => Math.random().toString(36).substring(2, 9);

export const SkillProvider = ({ children }: SkillProviderProps) => {
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem("skills");
    return saved ? JSON.parse(saved) : [];
  });

  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem("collaborators");
    return saved ? JSON.parse(saved) : [];
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem("teams");
    return saved ? JSON.parse(saved) : [];
  });

  const [functionRoles, setFunctionRoles] = useState<FunctionRole[]>(() => {
    const saved = localStorage.getItem("functionRoles");
    return saved ? JSON.parse(saved) : [
      { id: generateId(), name: "Aplicação", description: "Aplicação prática da habilidade" },
      { id: generateId(), name: "Especificação Técnica", description: "Criação de documentação e especificações técnicas" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem("collaborators", JSON.stringify(collaborators));
  }, [collaborators]);

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("functionRoles", JSON.stringify(functionRoles));
  }, [functionRoles]);

  const addSkill = (name: string, category: SkillCategory) => {
    const newSkill: Skill = {
      id: generateId(),
      name,
      category
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, name: string, category: SkillCategory) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, name, category } : skill
    ));
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    
    // Remove this skill from all collaborators
    setCollaborators(collaborators.map(collaborator => {
      const updatedSkills = { ...collaborator.skills };
      if (updatedSkills[id]) {
        delete updatedSkills[id];
      }
      return { ...collaborator, skills: updatedSkills };
    }));
  };

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

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: generateId(),
      name
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, name: string) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, name } : team
    ));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
    
    // Set teamId to undefined for collaborators in this team
    setCollaborators(collaborators.map(collaborator => 
      collaborator.teamId === id ? { ...collaborator, teamId: undefined } : collaborator
    ));
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

  const getSkill = (id: string) => {
    return skills.find(skill => skill.id === id);
  };

  const getTeam = (id: string) => {
    return teams.find(team => team.id === id);
  };

  // Function Role Management
  const getFunctionRole = (id: string) => {
    return functionRoles.find(role => role.id === id);
  };

  const addFunctionRole = (name: string, description?: string) => {
    const newRole: FunctionRole = {
      id: generateId(),
      name,
      description
    };
    setFunctionRoles([...functionRoles, newRole]);
  };

  const updateFunctionRole = (id: string, name: string, description?: string) => {
    setFunctionRoles(functionRoles.map(role => 
      role.id === id ? { ...role, name, description } : role
    ));
  };

  const deleteFunctionRole = (id: string) => {
    setFunctionRoles(functionRoles.filter(role => role.id !== id));
    
    // Remove functionRoleId from collaborators with this role
    setCollaborators(collaborators.map(collaborator => 
      collaborator.functionRoleId === id ? { ...collaborator, functionRoleId: undefined } : collaborator
    ));
  };

  const assignFunctionRole = (collaboratorId: string, functionRoleId: string) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.id === collaboratorId ? { ...collaborator, functionRoleId } : collaborator
    ));
  };

  const value = {
    skills,
    collaborators,
    teams,
    functionRoles,
    addSkill,
    updateSkill,
    deleteSkill,
    addCollaborator,
    updateCollaborator,
    deleteCollaborator,
    addCollaboratorSkill,
    updateCollaboratorSkill,
    removeCollaboratorSkill,
    addTeam,
    updateTeam,
    deleteTeam,
    togglePontoCentral,
    toggleCollaboratorAptForRole,
    getSkill,
    getTeam,
    getFunctionRole,
    addFunctionRole,
    updateFunctionRole,
    deleteFunctionRole,
    assignFunctionRole
  };

  return <SkillContext.Provider value={value}>{children}</SkillContext.Provider>;
};
