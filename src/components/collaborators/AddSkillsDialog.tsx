
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { SkillCategory } from "@/types/skills";

interface AddSkillsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId: string | null;
}

const AddSkillsDialog = ({ isOpen, onOpenChange, collaboratorId }: AddSkillsDialogProps) => {
  const { skills, collaborators, addSkill, addCollaboratorSkill } = useSkillContext();
  const { toast } = useToast();
  
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Conhecimento");
  
  // Get skills that the collaborator doesn't have yet
  const getAvailableSkills = (collaboratorId: string) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (!collaborator) return [];
    
    const collaboratorSkillIds = Object.keys(collaborator.skills);
    return skills.filter(skill => !collaboratorSkillIds.includes(skill.id));
  };
  
  const handleAddSkillToCollaborator = () => {
    if (!collaboratorId) return;
    
    if (isAddingNewSkill) {
      if (!newSkillName.trim()) {
        toast({
          title: "Nome da habilidade é obrigatório",
          variant: "destructive"
        });
        return;
      }
      
      // First we add the skill to the system
      addSkill(newSkillName, newSkillCategory);
      
      toast({
        title: "Habilidade adicionada com sucesso!"
      });
      
      // Reset form and close dialog
      setNewSkillName("");
      setIsAddingNewSkill(false);
      onOpenChange(false);
    } else {
      // Add existing skills to collaborator
      if (selectedSkillIds.length === 0) {
        toast({
          title: "Selecione pelo menos uma habilidade",
          variant: "destructive"
        });
        return;
      }
      
      selectedSkillIds.forEach(skillId => {
        addCollaboratorSkill(collaboratorId, skillId);
      });
      
      toast({
        title: `${selectedSkillIds.length} habilidade(s) adicionada(s) com sucesso!`
      });
      
      // Reset and close
      setSelectedSkillIds([]);
      onOpenChange(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Adicionar Habilidades ao Colaborador
          </DialogTitle>
        </DialogHeader>
        {!isAddingNewSkill ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selecione as habilidades</Label>
              <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
                {collaboratorId && getAvailableSkills(collaboratorId).length > 0 ? (
                  getAvailableSkills(collaboratorId).map(skill => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`skill-${skill.id}`} 
                        value={skill.id}
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSkillIds([...selectedSkillIds, skill.id]);
                          } else {
                            setSelectedSkillIds(selectedSkillIds.filter(id => id !== skill.id));
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={`skill-${skill.id}`} className="cursor-pointer flex gap-2 items-center">
                        {skill.name}
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          {skill.category}
                        </span>
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Não há habilidades disponíveis para adicionar.</p>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingNewSkill(true)}
              >
                Nova Habilidade
              </Button>
              <Button 
                onClick={handleAddSkillToCollaborator}
                disabled={selectedSkillIds.length === 0}
              >
                Adicionar Selecionadas
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-skill-name">Nome da Nova Habilidade</Label>
              <Input
                id="new-skill-name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Nome da habilidade"
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button 
                  variant={newSkillCategory === "Conhecimento" ? "default" : "outline"} 
                  onClick={() => setNewSkillCategory("Conhecimento")}
                  className="w-full"
                >
                  Conhecimento
                </Button>
                <Button 
                  variant={newSkillCategory === "HardSkill" ? "default" : "outline"} 
                  onClick={() => setNewSkillCategory("HardSkill")}
                  className="w-full"
                >
                  Hard Skill
                </Button>
                <Button 
                  variant={newSkillCategory === "SoftSkill" ? "default" : "outline"} 
                  onClick={() => setNewSkillCategory("SoftSkill")}
                  className="w-full"
                >
                  Soft Skill
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsAddingNewSkill(false)}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleAddSkillToCollaborator}
                disabled={!newSkillName.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddSkillsDialog;
