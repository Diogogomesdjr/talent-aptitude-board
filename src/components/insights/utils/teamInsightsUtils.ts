
import { Collaborator, Team } from "@/context/SkillContext";
import { TeamInsight } from "./insightsUtils";

// Function to generate insights about teams
export const generateTeamInsights = (
  teams: Team[],
  collaborators: Collaborator[],
  getSkill: (id: string) => { name: string, category: string } | undefined
): TeamInsight[] => {
  const teamInsights: Record<string, TeamInsight> = {};
  
  // Initialize data for each team
  teams.forEach(team => {
    teamInsights[team.id] = {
      teamId: team.id,
      teamName: team.name,
      skillGaps: [],
      strengths: [],
      memberCount: 0
    };
  });
  
  // Group collaborators by team
  collaborators.forEach(collaborator => {
    if (!collaborator.teamId || !teamInsights[collaborator.teamId]) return;
    
    teamInsights[collaborator.teamId].memberCount++;
    
    // Analyze skills
    Object.entries(collaborator.skills).forEach(([skillId, skillData]) => {
      const skill = getSkill(skillId);
      if (!skill) return;
      
      // Check skill gaps (low rating)
      if (typeof skillData.rating === "number" && skillData.rating <= 2) {
        const existingGap = teamInsights[collaborator.teamId].skillGaps.find(gap => gap.skillId === skillId);
        
        if (existingGap) {
          existingGap.gapCount++;
        } else {
          teamInsights[collaborator.teamId].skillGaps.push({
            skillId,
            skillName: skill.name,
            category: skill.category,
            gapCount: 1
          });
        }
      }
      
      // Check strengths (high rating)
      if (typeof skillData.rating === "number" && skillData.rating >= 4) {
        const existingStrength = teamInsights[collaborator.teamId].strengths.find(s => s.skillId === skillId);
        
        if (existingStrength) {
          existingStrength.strengthCount++;
        } else {
          teamInsights[collaborator.teamId].strengths.push({
            skillId,
            skillName: skill.name,
            category: skill.category,
            strengthCount: 1
          });
        }
      }
    });
  });
  
  // Sort gaps and strengths by count
  Object.values(teamInsights).forEach(team => {
    team.skillGaps.sort((a, b) => b.gapCount - a.gapCount);
    team.strengths.sort((a, b) => b.strengthCount - a.strengthCount);
  });
  
  // Filter teams with no members
  return Object.values(teamInsights).filter(team => team.memberCount > 0);
};
