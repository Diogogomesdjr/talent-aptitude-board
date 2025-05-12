import { useState, useEffect } from "react";
import { Collaborator, CollaboratorSkill } from "@/types/skills";
import { generateId } from "@/utils/skillUtils";
import { format } from "date-fns";

// Tipo para versão simplificada do colaborador para armazenamento
interface SimpleCollaborator {
  id: string;
  name: string;
  photoUrl: string;
  isPontoCentral: boolean;
  isAptForRole: boolean;
  teamId?: string;
  functionRoleId?: string;
  skills: Record<string, CollaboratorSkill>;
  improvementOpportunities?: {
    hardSkills?: string;
    softSkills?: string;
    nextChallenges?: string;
  };
}

// Tipo para armazenar dados históricos por mês
interface MonthlyData {
  collaborators: SimpleCollaborator[];
  metrics: {
    skillAverage: number;
    aptitudePercentage: number;
    totalSkills: number;
    totalSkillsByCategory: Record<string, number>;
  };
}

// Helper function to safely parse JSON with fallback
const safeJSONParse = (str: string | null, fallback: any): any => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Error parsing JSON from localStorage:", e);
    return fallback;
  }
};

// Helper function to safely store data in localStorage
const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (e) {
    console.error(`Error storing data in localStorage (${key}):`, e);
    return false;
  }
};

// Maximum number of months to keep in history
const MAX_HISTORY_MONTHS = 6;

export const useCollaboratorsData = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem("collaborators");
    return safeJSONParse(saved, []);
  });

  // Estado para armazenar dados históricos por mês
  const [historicalData, setHistoricalData] = useState<Record<string, MonthlyData>>(() => {
    const saved = localStorage.getItem("historicalSkillsData");
    return safeJSONParse(saved, {});
  });

  // Salva colaboradores atuais no localStorage com tratamento de erro
  useEffect(() => {
    try {
      // For large datasets, consider storing only essential data
      const essentialData = collaborators.map(c => ({
        id: c.id,
        name: c.name,
        photoUrl: c.photoUrl,
        isPontoCentral: c.isPontoCentral,
        isAptForRole: c.isAptForRole,
        teamId: c.teamId,
        functionRoleId: c.functionRoleId,
        skills: c.skills,
        improvementOpportunities: c.improvementOpportunities
      }));
      
      safeLocalStorageSet("collaborators", essentialData);
    } catch (error) {
      console.error("Failed to save collaborators to localStorage:", error);
      // Consider showing a user-friendly notification here
    }
  }, [collaborators]);

  // Salva dados históricos no localStorage com limite de meses
  useEffect(() => {
    try {
      // Limit the number of months stored in history
      const monthKeys = Object.keys(historicalData).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      
      // Keep only the MAX_HISTORY_MONTHS most recent months
      if (monthKeys.length > MAX_HISTORY_MONTHS) {
        const trimmedData = {} as Record<string, MonthlyData>;
        monthKeys.slice(0, MAX_HISTORY_MONTHS).forEach(key => {
          trimmedData[key] = historicalData[key];
        });
        
        safeLocalStorageSet("historicalSkillsData", trimmedData);
        setHistoricalData(trimmedData);
      } else {
        safeLocalStorageSet("historicalSkillsData", historicalData);
      }
    } catch (error) {
      console.error("Failed to save historical data to localStorage:", error);
    }
  }, [historicalData]);

  // Calcula métricas atuais baseadas nos colaboradores
  const calculateCurrentMetrics = (filteredCollabs = collaborators) => {
    let totalRating = 0;
    let totalSkills = 0;
    let totalAptSkills = 0;
    const skillsByCategory: Record<string, number> = {
      "Conhecimento": 0,
      "HardSkill": 0,
      "SoftSkill": 0
    };
    
    filteredCollabs.forEach(collaborator => {
      Object.values(collaborator.skills).forEach((skill: any) => {
        if (skill.rating !== 'N/A' && typeof skill.rating === 'number') {
          totalRating += skill.rating;
          totalSkills++;
          
          if (skill.isApt) {
            totalAptSkills++;
          }

          // Incrementa contador por categoria (simulado)
          const category = ["Conhecimento", "HardSkill", "SoftSkill"][Math.floor(Math.random() * 3)];
          skillsByCategory[category] = (skillsByCategory[category] || 0) + 1;
        }
      });
    });
    
    return {
      skillAverage: totalSkills > 0 ? totalRating / totalSkills : 0,
      aptitudePercentage: totalSkills > 0 ? (totalAptSkills / totalSkills) * 100 : 0,
      totalSkills,
      totalSkillsByCategory: skillsByCategory
    };
  };

  // Salva um snapshot dos dados do mês atual
  const saveMonthlySnapshot = (date = new Date()) => {
    const monthKey = format(date, "yyyy-MM");
    
    // Se já existe um snapshot para este mês, não sobrescreve
    if (historicalData[monthKey]) {
      return false;
    }
    
    const metrics = calculateCurrentMetrics();
    
    try {
      // Create a simplified version of collaborators for storage
      // to reduce localStorage size
      const simplifiedCollabs: SimpleCollaborator[] = collaborators.map(c => ({
        id: c.id,
        name: c.name,
        photoUrl: c.photoUrl,
        isPontoCentral: c.isPontoCentral,
        isAptForRole: c.isAptForRole,
        teamId: c.teamId,
        functionRoleId: c.functionRoleId,
        skills: c.skills
      }));
      
      // Create the new monthly data entry
      const newMonthlyData: MonthlyData = {
        collaborators: simplifiedCollabs,
        metrics
      };
      
      setHistoricalData(prev => {
        // Remove oldest month if we're exceeding our limit
        const updatedData = { ...prev };
        const monthKeys = Object.keys(updatedData).sort();
        
        if (monthKeys.length >= MAX_HISTORY_MONTHS) {
          // Remove oldest month
          delete updatedData[monthKeys[0]];
        }
        
        // Add new month
        return {
          ...updatedData,
          [monthKey]: newMonthlyData
        };
      });
      
      return true;
    } catch (error) {
      console.error("Error saving monthly snapshot:", error);
      return false;
    }
  };

  // Obtém dados do mês anterior para comparação
  const getPreviousMonthData = (currentDate: Date) => {
    const currentMonthKey = format(currentDate, "yyyy-MM");
    
    // Encontra a chave do mês anterior disponível nos dados históricos
    const monthKeys = Object.keys(historicalData).sort();
    const currentMonthIndex = monthKeys.indexOf(currentMonthKey);
    
    let previousMonthKey;
    
    if (currentMonthIndex > 0) {
      // Pega o mês anterior na ordem cronológica
      previousMonthKey = monthKeys[currentMonthIndex - 1];
    } else if (monthKeys.length > 0 && currentMonthIndex === -1) {
      // Se o mês atual não tem dados, pega o último mês disponível
      previousMonthKey = monthKeys[monthKeys.length - 1];
    } else {
      // Não há dados históricos
      return null;
    }
    
    return {
      key: previousMonthKey,
      month: previousMonthKey.split("-")[1],
      year: previousMonthKey.split("-")[0],
      ...historicalData[previousMonthKey]?.metrics
    };
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

  // Atualiza oportunidades de melhoria para um colaborador
  const updateImprovementOpportunities = (
    collaboratorId: string, 
    opportunities: {
      hardSkills?: string;
      softSkills?: string;
      nextChallenges?: string;
    }
  ) => {
    setCollaborators(collaborators.map(collaborator => 
      collaborator.id === collaboratorId 
        ? { 
            ...collaborator, 
            improvementOpportunities: {
              ...collaborator.improvementOpportunities,
              ...opportunities
            }
          } 
        : collaborator
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
    handleFunctionRoleDeleted,
    updateImprovementOpportunities,
    // Novos métodos
    saveMonthlySnapshot,
    getPreviousMonthData,
    calculateCurrentMetrics,
    historicalData
  };
};
