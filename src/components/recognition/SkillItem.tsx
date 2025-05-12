
import { Skill, CollaboratorSkill } from "@/types/skills";
import { Badge } from "@/components/ui/badge";
import { CircleCheck } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface SkillItemProps {
  skill: Skill & CollaboratorSkill;
}

const SkillItem = ({ skill }: SkillItemProps) => {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{skill.name}</span>
            {skill.isApt && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleCheck size={14} className="text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Apto para função e conhecimento</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <Badge variant="outline" className="text-xs mt-1">{skill.category}</Badge>
        </div>
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ 
            backgroundColor: skill.rating === "N/A" ? "#8E9196" :
              skill.rating === 1 ? "#ea384c" : 
              skill.rating === 2 ? "#FFDEE2" : 
              skill.rating === 3 ? "#FEF7CD" : 
              skill.rating === 4 ? "#F2FCE2" : 
              "#83c76f",
            color: (skill.rating === 2 || skill.rating === 3 || skill.rating === 4) ? "#444" : "#fff"
          }}
        >
          {skill.rating === "N/A" ? "NA" : skill.rating}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SkillItem;
