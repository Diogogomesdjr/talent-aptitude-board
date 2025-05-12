
import { Collaborator } from "@/types/skills";

export const calculateAptitudePercentage = (collaborator: Collaborator) => {
  const skillsCount = Object.keys(collaborator.skills).length;
  if (skillsCount === 0) return 0;
  
  const aptSkills = Object.values(collaborator.skills).filter(skill => skill.isApt).length;
  return Math.round((aptSkills / skillsCount) * 100);
};

export const getCollaboratorLevelCount = (collaborator: Collaborator) => {
  if (!collaborator) return { total: 0, levels: {} };
  
  const levels: Record<string, number> = {
    "N/A": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0
  };
  
  Object.values(collaborator.skills).forEach(skill => {
    const rating = skill.rating.toString();
    if (levels[rating] !== undefined) {
      levels[rating]++;
    }
  });
  
  return {
    total: Object.keys(collaborator.skills).length,
    levels
  };
};

export const isEligibleForRecognition = (collaborator: Collaborator) => {
  const percentage = calculateAptitudePercentage(collaborator);
  return percentage >= 75;
};

export const needsAttention = (collaborator: Collaborator) => {
  const percentage = calculateAptitudePercentage(collaborator);
  return percentage < 50;
};

export const isHighPotential = (collaborator: Collaborator) => {
  if (!collaborator || Object.keys(collaborator.skills).length === 0) return false;
  
  const allSkills = Object.values(collaborator.skills);
  if (allSkills.length < 3) return false;
  
  return allSkills.every(skill => 
    typeof skill.rating === 'number' && (skill.rating === 4 || skill.rating === 5)
  );
};
