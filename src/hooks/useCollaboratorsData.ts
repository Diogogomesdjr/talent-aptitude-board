
import { useState, useEffect } from "react";
import { Collaborator, CollaboratorSkill } from "@/types/skills";
import { generateId } from "@/utils/skillUtils";
import { format } from "date-fns";

// Tipo para armazenar dados históricos por mês
interface MonthlyData {
  collaborators: Collaborator[];
  metrics: {
    skillAverage: number;
    aptitudePercentage: number;
    totalSkills: number;
    totalSkillsByCategory: Record<string, number>;
  };
}

export const useCollaboratorsData = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(() => {
    const saved = localStorage.getItem("collaborators");
    return saved ? JSON.parse(saved) : [];
  });

  // Estado para armazenar dados históricos por mês
  const [historicalData, setHistoricalData] = useState<Record<string, MonthlyData>>(() => {
    const saved = localStorage.getItem("historicalSkillsData");
    return saved ? JSON.parse(saved) : {};
  });

  // Salva colaboradores atuais no localStorage
  useEffect(() => {
    localStorage.setItem("collaborators", JSON.stringify(collaborators));
  }, [collaborators]);

  // Salva dados históricos no localStorage
  useEffect(() => {
    localStorage.setItem("historicalSkillsData", JSON.stringify(historicalData));
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
    
    // Cria uma cópia profunda dos colaboradores atuais
    const collaboratorsCopy = JSON.parse(JSON.stringify(collaborators));
    
    setHistoricalData(prev => ({
      ...prev,
      [monthKey]: {
        collaborators: collaboratorsCopy,
        metrics
      }
    }));
    
    return true;
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
    // Novos métodos
    saveMonthlySnapshot,
    getPreviousMonthData,
    calculateCurrentMetrics,
    historicalData
  };
};
