
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
import { Tabs, TabsContent } from "@/components/ui/tabs";

const CollaboratorsSection = () => {
  const { collaborators, teams, functionRoles } = useSkillContext();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(true); // Inicialmente todos estão recolhidos
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Aba ativa (atual ou comparativo)
  const [activeTab, setActiveTab] = useState("current");
  
  // Para adicionar skills a um colaborador existente
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);

  // Inicializa os estados de collapse para todos os colaboradores como true (recolhidos)
  // apenas na primeira renderização ou quando navigando para esta seção
  useEffect(() => {
    if (!hasUserInteracted && collaborators.length > 0) {
      const newStates: Record<string, boolean> = {};
      collaborators.forEach(c => {
        newStates[c.id] = true; // Inicialmente todos estão recolhidos
      });
      setCollapsedStates(newStates);
    }
  }, [collaborators, hasUserInteracted]);

  // Sincroniza os estados de collapse com o estado geral
  // apenas quando o botão de colapsar todos for clicado
  const toggleAllCollapsed = () => {
    setHasUserInteracted(true);
    const newAllCollapsed = !allCollapsed;
    setAllCollapsed(newAllCollapsed);
    
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

  const openAddSkillDialog = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    setIsAddSkillDialogOpen(true);
  };
  
  // Filtra os colaboradores com base nos critérios
  const filteredCollaborators = collaborators.filter(collaborator => {
    // Filtra por nome
    const nameMatches = collaborator.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtra por equipe
    const teamMatches = teamFilter === "all" || collaborator.teamId === teamFilter;
    
    // Filtra por função
    const roleMatches = roleFilter === "all" || collaborator.functionRoleId === roleFilter;
    
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                      defaultCollapsed={collapsedStates[collaborator.id] || true}
                      isCollapsed={collapsedStates[collaborator.id] || false}
                      toggleCollapsed={() => toggleCollapsed(collaborator.id)}
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
        </Tabs>
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
