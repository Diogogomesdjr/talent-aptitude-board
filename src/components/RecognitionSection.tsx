
import { useSkillContext } from "@/context/SkillContext";
import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import RecognitionFilters from "./recognition/RecognitionFilters";
import RecognitionRules from "./recognition/RecognitionRules";
import RecognitionCollapseButton from "./recognition/RecognitionCollapseButton";
import CollaboratorCard from "./recognition/CollaboratorCard";
import NoCollaboratorsFound from "./recognition/NoCollaboratorsFound";
import { 
  calculateAptitudePercentage,
  getCollaboratorLevelCount,
  isEligibleForRecognition,
  needsAttention,
  isHighPotential
} from "./recognition/utils/collaboratorUtils";

const RecognitionSection = () => {
  const { collaborators, skills, getTeam, getSkill } = useSkillContext();
  const [filter, setFilter] = useState<string>("all");
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});

  // Initialize collapsed states
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    collaborators.forEach(c => {
      initialStates[c.id] = allCollapsed;
    });
    setCollapsedStates(initialStates);
  }, [allCollapsed, collaborators]);

  const toggleAllCollapsed = () => {
    const newAllCollapsed = !allCollapsed;
    setAllCollapsed(newAllCollapsed);
    
    // Update all individual collapsed states
    const newStates: Record<string, boolean> = {};
    collaborators.forEach(c => {
      newStates[c.id] = newAllCollapsed;
    });
    setCollapsedStates(newStates);
  };

  const toggleCollapsed = (id: string) => {
    setCollapsedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredCollaborators = collaborators.filter(collab => {
    if (filter === "eligible") return isEligibleForRecognition(collab);
    if (filter === "attention") return needsAttention(collab);
    if (filter === "highpotential") return isHighPotential(collab);
    return true;
  });
  
  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Reconhecimento</h2>
          <RecognitionFilters filter={filter} setFilter={setFilter} />
        </div>
        
        <RecognitionRules />
        
        <div className="flex justify-end mb-4">
          <RecognitionCollapseButton 
            allCollapsed={allCollapsed} 
            onClick={toggleAllCollapsed} 
          />
        </div>
        
        {filteredCollaborators.length === 0 ? (
          <NoCollaboratorsFound />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCollaborators.map(collaborator => {
              const aptitudePercentage = calculateAptitudePercentage(collaborator);
              const team = collaborator.teamId ? getTeam(collaborator.teamId) : undefined;
              const levelCount = getCollaboratorLevelCount(collaborator);
              const isCollapsed = collapsedStates[collaborator.id] ?? false;
              const isHighPotentialCollaborator = isHighPotential(collaborator);
              
              const skillsWithLevels = Object.entries(collaborator.skills)
                .filter(([skillId]) => getSkill(skillId))
                .map(([skillId, skillData]) => {
                  const skill = getSkill(skillId)!;
                  return {
                    ...skill,
                    ...skillData
                  };
                });
              
              const highLevelSkills = skillsWithLevels.filter(skill => 
                typeof skill.rating === 'number' && skill.rating >= 4 && skill.isApt
              );

              return (
                <CollaboratorCard
                  key={collaborator.id}
                  collaborator={collaborator}
                  isCollapsed={isCollapsed}
                  toggleCollapsed={toggleCollapsed}
                  team={team}
                  aptitudePercentage={aptitudePercentage}
                  isEligibleForRecognition={isEligibleForRecognition(collaborator)}
                  isHighPotential={isHighPotentialCollaborator}
                  needsAttention={needsAttention(collaborator)}
                  skillsWithLevels={skillsWithLevels}
                  highLevelSkills={highLevelSkills}
                  levelCount={levelCount}
                />
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default RecognitionSection;
