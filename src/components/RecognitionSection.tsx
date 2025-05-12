
import { useSkillContext } from "@/context/SkillContext";
import { useState, useEffect } from "react";
import RecognitionFilters from "./recognition/RecognitionFilters";
import RecognitionRules from "./recognition/RecognitionRules";
import RecognitionCollapseButton from "./recognition/RecognitionCollapseButton";
import CollaboratorCard from "./recognition/CollaboratorCard";
import NoCollaboratorsFound from "./recognition/NoCollaboratorsFound";
import ImprovementOpportunitiesSection from "./recognition/ImprovementOpportunitiesSection";
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
  const [allCollapsed, setAllCollapsed] = useState(true);
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Initialize collapsed states only on first render, not after user interactions
  useEffect(() => {
    if (!hasUserInteracted) {
      const initialStates: Record<string, boolean> = {};
      collaborators.forEach(c => {
        initialStates[c.id] = allCollapsed;
      });
      setCollapsedStates(initialStates);
    }
  }, [allCollapsed, collaborators, hasUserInteracted]);

  const toggleAllCollapsed = () => {
    const newAllCollapsed = !allCollapsed;
    setAllCollapsed(newAllCollapsed);
    setHasUserInteracted(true);
    
    // Update all individual collapsed states
    const newStates: Record<string, boolean> = {};
    collaborators.forEach(c => {
      newStates[c.id] = newAllCollapsed;
    });
    setCollapsedStates(newStates);
  };

  const toggleCollapsed = (id: string) => {
    setHasUserInteracted(true);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Reconhecimento</h2>
        <RecognitionCollapseButton 
          allCollapsed={allCollapsed} 
          onClick={toggleAllCollapsed}
        />
      </div>
      
      <RecognitionFilters filter={filter} setFilter={setFilter} />
      
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <RecognitionRules />
      </div>
      
      {filteredCollaborators.length === 0 ? (
        <NoCollaboratorsFound />
      ) : (
        <div className="space-y-4">
          {filteredCollaborators.map(collaborator => {
            const aptitudePercentage = calculateAptitudePercentage(collaborator);
            const team = collaborator.teamId ? getTeam(collaborator.teamId) : undefined;
            const collabLevelCount = getCollaboratorLevelCount(collaborator);
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
                levelCount={{
                  level1: collabLevelCount.levels["1"] || 0,
                  level2: collabLevelCount.levels["2"] || 0,
                  level3: collabLevelCount.levels["3"] || 0,
                  level4: collabLevelCount.levels["4"] || 0,
                  level5: collabLevelCount.levels["5"] || 0,
                  notRated: collabLevelCount.levels["N/A"] || 0
                }}
                improvementSection={
                  !isCollapsed && (
                    <ImprovementOpportunitiesSection 
                      collaboratorId={collaborator.id}
                      initialValues={collaborator.improvementOpportunities}
                    />
                  )
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecognitionSection;
