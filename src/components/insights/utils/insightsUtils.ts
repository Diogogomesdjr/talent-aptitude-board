
import { Collaborator, Skill } from "@/context/SkillContext";

export interface TeamInsight {
  teamId: string;
  teamName: string;
  skillGaps: { skillId: string, skillName: string, category: string, gapCount: number }[];
  strengths: { skillId: string, skillName: string, category: string, strengthCount: number }[];
  memberCount: number;
}

export interface CollaboratorInsight {
  collaboratorId: string;
  collaboratorName: string;
  teamName?: string;
  insights: {
    type: string;
    description: string;
    score: number;
    icon: JSX.Element;
    details?: string[];
  }[];
}

export interface SkillDevelopmentData {
  skillId: string;
  skillName: string;
  category: string;
  needsImprovement: number;
  totalAssigned: number;
  collaboratorsNeeding: { id: string, name: string, rating: number | "N/A" }[];
}

// Function to get grouped skills needing development by category
export const getSkillsNeedingDevelopment = (
  collaborators: Collaborator[], 
  skills: Skill[], 
  getSkill: (id: string) => Skill | undefined
): Record<string, SkillDevelopmentData[]> => {
  // Group skills by category and count collaborators needing improvement
  const skillsByCategory: Record<string, SkillDevelopmentData[]> = {};
  
  // Initialize categories
  skills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
  });
  
  // For each collaborator, check skills with low ratings (1-2)
  collaborators.forEach(collaborator => {
    Object.entries(collaborator.skills).forEach(([skillId, skillData]) => {
      const skill = getSkill(skillId);
      if (skill) {
        // Find or create the skill item in the grouped object
        let skillItem = skillsByCategory[skill.category].find(item => item.skillId === skillId);
        
        if (!skillItem) {
          skillItem = {
            skillId,
            skillName: skill.name,
            category: skill.category,
            needsImprovement: 0,
            totalAssigned: 0,
            collaboratorsNeeding: []
          };
          skillsByCategory[skill.category].push(skillItem);
        }
        
        // Increment total count
        skillItem.totalAssigned++;
        
        // Check if this skill needs improvement for this collaborator
        if (typeof skillData.rating === 'number' && skillData.rating <= 2) {
          skillItem.needsImprovement++;
          skillItem.collaboratorsNeeding.push({
            id: collaborator.id,
            name: collaborator.name,
            rating: skillData.rating
          });
        }
      }
    });
  });
  
  // Sort by improvement need percentage
  Object.keys(skillsByCategory).forEach(category => {
    skillsByCategory[category].sort((a, b) => {
      const aPercent = a.totalAssigned > 0 ? (a.needsImprovement / a.totalAssigned) : 0;
      const bPercent = b.totalAssigned > 0 ? (b.needsImprovement / b.totalAssigned) : 0;
      return bPercent - aPercent;
    });
  });
  
  return skillsByCategory;
};
