
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSkillContext } from "@/context/SkillContext";
import CollaboratorCard from "@/components/CollaboratorCard";
import { Plus } from "lucide-react";
import CollaboratorLegend from "./CollaboratorLegend";
import AddCollaboratorDialog from "./AddCollaboratorDialog";
import AddSkillsDialog from "./AddSkillsDialog";
import EmptyCollaboratorsList from "./EmptyCollaboratorsList";
import RecognitionCollapseButton from "../recognition/RecognitionCollapseButton";
import CollaboratorsFilters from "./CollaboratorsFilters";
import MonthlyComparison from "./MonthlyComparison";
import { TabsContent } from "@/components/ui/tabs";

const CollaboratorsSection = () => {
  const { collaborators, teams, functionRoles } = useSkillContext();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Aba ativa (atual ou comparativo)
  const [activeTab, setActiveTab] = useState("current");
  
  // Para adicionar skills a um colaborador existente
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);

  // Sincroniza os estados de collapse com o estado geral
  useEffect(() => {
    if (collaborators.length > 0) {
      const newStates: Record<string, boolean> = {};
      collaborators.forEach(c => {
        newStates[c.id] = allCollapsed;
      });
      setCollapsedStates(newStates);
    }
  }, [allCollapsed, collaborators]);

  const toggleAllCollapsed = () => {
    setAllCollapsed(!allCollapsed);
  };

  const openAddSkillDialog = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    setIsAddSkillDialogOpen(true);
  };
  
  // Filtra os colaboradores com base nos critérios
  const filteredCollaborators = collaborators.filter(collaborator => {
    // Filtra por nome
    const nameMatches = collaborator.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtra por equipe
    const teamMatches = !teamFilter || collaborator.teamId === teamFilter;
    
    // Filtra por função
    const roleMatches = !roleFilter || collaborator.functionRoleId === roleFilter;
    
    return nameMatches && teamMatches && roleMatches;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Colaboradores</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <RecognitionCollapseButton 
            allCollapsed={allCollapsed} 
            onClick={toggleAllCollapsed} 
          />
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={16} className="mr-2" />
            Adicionar Colaborador
          </Button>
        </div>
      </div>
      
      <CollaboratorsFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        teamFilter={teamFilter}
        setTeamFilter={setTeamFilter}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="mt-6">
        <TabsContent value="current">
          <CollaboratorLegend />
          
          {filteredCollaborators.length === 0 ? (
            <EmptyCollaboratorsList onAddClick={() => setIsDialogOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-4">
              {filteredCollaborators.map((collaborator) => (
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
        </TabsContent>
        
        <TabsContent value="comparison">
          <MonthlyComparison 
            selectedDate={selectedDate}
            filteredCollaborators={filteredCollaborators} 
          />
        </TabsContent>
      </div>
      
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
