
import React from "react";
import { Collaborator, Skill, Team, CollaboratorSkill } from "@/types/skills";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import RecognitionStatus from "./RecognitionStatus";
import CollaboratorProgressBar from "./CollaboratorProgressBar";
import CollaboratorSkillsList from "./CollaboratorSkillsList";

interface CollaboratorCardProps {
  collaborator: Collaborator;
  isCollapsed: boolean;
  toggleCollapsed: (id: string) => void;
  team?: Team;
  aptitudePercentage: number;
  isEligibleForRecognition: boolean;
  isHighPotential: boolean;
  needsAttention: boolean;
  skillsWithLevels: (Skill & CollaboratorSkill)[];
  highLevelSkills: (Skill & CollaboratorSkill)[];
  levelCount: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
    notRated: number;
  };
  improvementSection?: React.ReactNode;
}

const CollaboratorCard = ({
  collaborator,
  isCollapsed,
  toggleCollapsed,
  team,
  aptitudePercentage,
  isEligibleForRecognition,
  isHighPotential,
  needsAttention,
  skillsWithLevels,
  highLevelSkills,
  levelCount,
  improvementSection
}: CollaboratorCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={collaborator.photoUrl} />
              <AvatarFallback>{collaborator.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">{collaborator.name}</h3>
                {collaborator.isPontoCentral && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">Ponto Central</Badge>
                )}
                <RecognitionStatus 
                  isEligible={isEligibleForRecognition}
                  highLevelSkills={highLevelSkills}
                  skillStats={{
                    level5Count: levelCount.level5,
                    level4Count: levelCount.level4,
                    aptSkillsCount: Object.values(collaborator.skills).filter(skill => skill.isApt).length
                  }}
                />
              </div>
              <div className="text-sm text-gray-500">
                {team?.name || "Sem time"} • {aptitudePercentage.toFixed(0)}% de aptidão
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleCollapsed(collaborator.id)}
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="space-y-4">
            <div>
              <CollaboratorProgressBar 
                aptitudePercentage={aptitudePercentage}
              />
            </div>
            
            <CollaboratorSkillsList 
              skills={skillsWithLevels}
            />
            
            {improvementSection && (
              <div className="mt-4">
                {improvementSection}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorCard;
