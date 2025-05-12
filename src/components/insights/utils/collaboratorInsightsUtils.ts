
import { Collaborator, Skill } from "@/context/SkillContext";
import { TrendingUp, TrendingDown, BarChart } from "lucide-react";
import { CollaboratorInsight } from "./insightsUtils";

// Function to generate insights about collaborators
export const generateCollaboratorInsights = (
  collaborators: Collaborator[],
  getSkill: (id: string) => Skill | undefined,
  getTeam: (id: string) => { name: string } | undefined
): CollaboratorInsight[] => {
  const insights: CollaboratorInsight[] = [];
  
  collaborators.forEach(collaborator => {
    const collaboratorInsights = [];
    const skillEntries = Object.entries(collaborator.skills);
    const team = collaborator.teamId ? getTeam(collaborator.teamId) : undefined;
    
    // Skip collaborators without skills
    if (skillEntries.length === 0) return;
    
    // Leadership potential
    const leadershipSkills = skillEntries.filter(([skillId, skillData]) => {
      const skill = getSkill(skillId);
      return (
        (skill?.category === "SoftSkill" && 
         (skill?.name.toLowerCase().includes("lideran") || 
          skill?.name.toLowerCase().includes("comunica") ||
          skill?.name.toLowerCase().includes("gestão"))) &&
        typeof skillData.rating === "number" && 
        skillData.rating >= 4
      );
    });
    
    if (leadershipSkills.length >= 2) {
      const details = leadershipSkills.map(([skillId]) => {
        const skill = getSkill(skillId);
        return skill ? `${skill.name}` : '';
      }).filter(Boolean);
      
      collaboratorInsights.push({
        type: "Liderança",
        description: "Potencial para liderança",
        score: (leadershipSkills.length / skillEntries.length) * 5,
        icon: { type: TrendingUp, props: { className: "h-4 w-4 text-green-500" } },
        details
      });
    }
    
    // Technical expertise
    const technicalSkills = skillEntries.filter(([skillId, skillData]) => {
      const skill = getSkill(skillId);
      return (
        skill?.category === "HardSkill" && 
        typeof skillData.rating === "number" && 
        skillData.rating >= 4
      );
    });
    
    if (technicalSkills.length >= 3) {
      const details = technicalSkills.map(([skillId]) => {
        const skill = getSkill(skillId);
        return skill ? `${skill.name}` : '';
      }).filter(Boolean);
      
      collaboratorInsights.push({
        type: "Técnico",
        description: "Especialista técnico",
        score: (technicalSkills.length / skillEntries.length) * 5,
        icon: { type: BarChart, props: { className: "h-4 w-4 text-blue-500" } },
        details
      });
    }
    
    // Areas for improvement
    const improvementAreas = skillEntries.filter(([skillId, skillData]) => {
      return typeof skillData.rating === "number" && skillData.rating <= 2;
    });
    
    if (improvementAreas.length >= 2) {
      const details = improvementAreas.map(([skillId]) => {
        const skill = getSkill(skillId);
        return skill ? `${skill.name} (precisa desenvolver)` : '';
      }).filter(Boolean);
      
      collaboratorInsights.push({
        type: "Desenvolvimento",
        description: "Áreas para desenvolvimento",
        score: (improvementAreas.length / skillEntries.length) * 5,
        icon: { type: TrendingDown, props: { className: "h-4 w-4 text-amber-500" } },
        details
      });
    }
    
    // Add only if there are insights
    if (collaboratorInsights.length > 0) {
      insights.push({
        collaboratorId: collaborator.id,
        collaboratorName: collaborator.name,
        teamName: team?.name,
        insights: collaboratorInsights
      });
    }
  });
  
  return insights;
};
