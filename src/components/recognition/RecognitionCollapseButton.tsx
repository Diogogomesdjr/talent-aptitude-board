
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RecognitionCollapseButtonProps {
  allCollapsed: boolean;
  onClick: () => void;
}

const RecognitionCollapseButton = ({ allCollapsed, onClick }: RecognitionCollapseButtonProps) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className="flex items-center gap-2 w-full sm:w-auto"
    >
      {allCollapsed ? 
        <><ChevronDown size={16} /> Expandir Todos</> : 
        <><ChevronUp size={16} /> Recolher Todos</>
      }
    </Button>
  );
};

export default RecognitionCollapseButton;
