
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Flag, ChevronUp, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Collaborator, Skill } from "@/context/SkillContext";
import CollaboratorProgressBar from "./CollaboratorProgressBar";
import CollaboratorSkillsList from "./CollaboratorSkillsList";
import RecognitionStatus from "./RecognitionStatus";

interface CollaboratorCardProps {
  collaborator: Collaborator;
  isCollapsed: boolean;
  toggleCollapsed: (id: string) => void;
  team?: { name: string };
  aptitudePercentage: number;
  isEligibleForRecognition: boolean;
  isHighPotential: boolean;
  needsAttention: boolean;
  skillsWithLevels: Array<Skill & { 
    rating: number | "N/A";
    isApt: boolean;
  }>;
  highLevelSkills: Array<Skill & { 
    rating: number | "N/A";
    isApt: boolean;
  }>;
  levelCount: {
    total: number;
    levels: Record<string, number>;
  };
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
  levelCount
}: CollaboratorCardProps) => {
  return (
    <Card 
      className={`${
        needsAttention ? "border-red-200" : 
        isHighPotential ? "border-yellow-200" : 
        isEligibleForRecognition ? "border-green-200" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={collaborator.photoUrl} alt={collaborator.name} />
              <AvatarFallback>{collaborator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{collaborator.name}</h3>
                {collaborator.isPontoCentral && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Flag className="h-4 w-4 text-blue-500" aria-label="Ponto Focal" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ponto Focal</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {isHighPotential && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Star className="h-4 w-4 text-yellow-500" aria-label="Alto Potencial" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Alto Potencial</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              {team && <p className="text-sm text-gray-500">Equipe: {team.name}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <CollaboratorProgressBar aptitudePercentage={aptitudePercentage} />
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500" 
              onClick={() => toggleCollapsed(collaborator.id)}
            >
              {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </Button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Níveis de Habilidade</h4>
                <div className="space-y-2">
                  <CollaboratorSkillsList skills={skillsWithLevels} />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Status de Reconhecimento</h4>
                <RecognitionStatus 
                  isEligible={isEligibleForRecognition} 
                  highLevelSkills={highLevelSkills}
                  skillStats={{
                    level5Count: levelCount.levels["5"] || 0,
                    level4Count: levelCount.levels["4"] || 0,
                    aptSkillsCount: Object.values(collaborator.skills).filter(s => s.isApt).length
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaboratorCard;
