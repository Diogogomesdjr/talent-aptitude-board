
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSkillContext } from "@/context/SkillContext";
import CollaboratorCard from "@/components/CollaboratorCard";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import CollaboratorLegend from "./CollaboratorLegend";
import AddCollaboratorDialog from "./AddCollaboratorDialog";
import AddSkillsDialog from "./AddSkillsDialog";
import EmptyCollaboratorsList from "./EmptyCollaboratorsList";
import RecognitionCollapseButton from "../recognition/RecognitionCollapseButton";

const CollaboratorsSection = () => {
  const { collaborators } = useSkillContext();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  
  // For adding skills to existing collaborator
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);

  // Sincronizar estados de colapso com o estado geral
  useEffect(() => {
    const newStates: Record<string, boolean> = {};
    collaborators.forEach(c => {
      newStates[c.id] = allCollapsed;
    });
    setCollapsedStates(newStates);
  }, [allCollapsed, collaborators]);

  const toggleAllCollapsed = () => {
    setAllCollapsed(!allCollapsed);
  };

  const openAddSkillDialog = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    setIsAddSkillDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Colaboradores</h2>
        <div className="flex gap-2">
          <RecognitionCollapseButton 
            allCollapsed={allCollapsed} 
            onClick={toggleAllCollapsed} 
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            Adicionar Colaborador
          </Button>
        </div>
      </div>
      
      <CollaboratorLegend />
      
      {collaborators.length === 0 ? (
        <EmptyCollaboratorsList onAddClick={() => setIsDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex flex-col gap-2">
              <CollaboratorCard 
                collaborator={collaborator} 
                defaultCollapsed={collapsedStates[collaborator.id] || false}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end"
                onClick={() => openAddSkillDialog(collaborator.id)}
              >
                <Plus size={16} className="mr-2" />
                Adicionar Habilidades
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <AddCollaboratorDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      
      <AddSkillsDialog 
        isOpen={isAddSkillDialogOpen}
        onOpenChange={setIsAddSkillDialogOpen}
        collaboratorId={selectedCollaboratorId}
      />
    </div>
  );
};

export default CollaboratorsSection;
