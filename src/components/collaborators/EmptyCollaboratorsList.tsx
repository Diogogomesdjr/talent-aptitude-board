
import { Button } from "@/components/ui/button";

interface EmptyCollaboratorsListProps {
  onAddClick: () => void;
}

const EmptyCollaboratorsList = ({ onAddClick }: EmptyCollaboratorsListProps) => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-500">Nenhum colaborador adicionado.</p>
      <Button 
        variant="link" 
        onClick={onAddClick}
        className="mt-2"
      >
        Adicionar um colaborador
      </Button>
    </div>
  );
};

export default EmptyCollaboratorsList;
