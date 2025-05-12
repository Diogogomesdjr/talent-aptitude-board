
import { Progress } from "@/components/ui/progress";
import { CircleCheck, AlertTriangle } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface CollaboratorProgressBarProps {
  aptitudePercentage: number;
}

const CollaboratorProgressBar = ({ aptitudePercentage }: CollaboratorProgressBarProps) => {
  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-sm font-medium">Aptidão: {aptitudePercentage}%</span>
          {aptitudePercentage >= 75 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleCheck size={16} className="text-green-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Apto para função e conhecimento</p>
              </TooltipContent>
            </Tooltip>
          )}
          {aptitudePercentage < 50 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle size={16} className="text-amber-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Não apto</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <Progress 
          value={aptitudePercentage} 
          className={`h-2 w-full ${
            aptitudePercentage >= 75 ? "bg-green-100" : 
            aptitudePercentage < 50 ? "bg-red-100" : ""
          }`}
        />
      </div>
    </TooltipProvider>
  );
};

export default CollaboratorProgressBar;
