
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import CollaboratorCard from "@/components/CollaboratorCard";
import { Flag, ArrowDown, ArrowUp, Upload } from "lucide-react";

const CollaboratorsSection = () => {
  const { collaborators, teams, skills, addCollaborator, addCollaboratorSkill } = useSkillContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);
  
  // For adding skills to existing collaborator
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<"Conhecimento" | "HardSkill" | "SoftSkill">("Conhecimento");
  const [isAddingNewSkill, setIsAddingNewSkill] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
      };
      reader.readAsDataURL(file);
      
      // Clear the URL input since we're using a file now
      setPhotoUrl("");
    }
  };

  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoUrl(e.target.value);
    // Clear file selection
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddCollaborator = () => {
    if (!name.trim()) {
      toast({
        title: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    // Use either the file preview or the URL
    const finalPhotoUrl = photoPreview || photoUrl || "/placeholder.svg";
    
    addCollaborator(name, finalPhotoUrl, teamId);
    
    toast({
      title: "Colaborador adicionado com sucesso!"
    });
    
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPhotoUrl("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setTeamId(undefined);
    setIsDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleAllCollapsed = () => {
    setAllCollapsed(!allCollapsed);
  };

  const handleAddSkillToCollaborator = () => {
    if (!selectedCollaboratorId) return;
    
    if (isAddingNewSkill) {
      // First we need to add the skill to the system
      // This would be handled by the SkillContext
      // For now, let's just close the dialog
      setIsAddingNewSkill(false);
    } else {
      // Add existing skills to collaborator
      selectedSkillIds.forEach(skillId => {
        addCollaboratorSkill(selectedCollaboratorId, skillId);
      });
      
      toast({
        title: `${selectedSkillIds.length} habilidade(s) adicionada(s) com sucesso!`
      });
      
      // Reset and close
      setSelectedSkillIds([]);
      setIsAddSkillDialogOpen(false);
    }
  };

  const openAddSkillDialog = (collaboratorId: string) => {
    setSelectedCollaboratorId(collaboratorId);
    setSelectedSkillIds([]);
    setIsAddSkillDialogOpen(true);
  };

  // Get skills that the collaborator doesn't have yet
  const getAvailableSkills = (collaboratorId: string) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (!collaborator) return [];
    
    const collaboratorSkillIds = Object.keys(collaborator.skills);
    return skills.filter(skill => !collaboratorSkillIds.includes(skill.id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Colaboradores</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={toggleAllCollapsed}
            className="flex items-center gap-2"
          >
            {allCollapsed ? 
              <><ArrowDown size={16} /> Expandir Todos</> : 
              <><ArrowUp size={16} /> Recolher Todos</>
            }
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Colaborador</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome do colaborador"
                  />
                </div>
                
                <div>
                  <Label>Foto</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={photoUrl}
                        onChange={handlePhotoUrlChange}
                        placeholder="URL da foto"
                        disabled={!!photoFile}
                      />
                      <Label 
                        htmlFor="photo-upload" 
                        className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                      >
                        <Upload className="w-4 h-4" />
                      </Label>
                      <Input
                        id="photo-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                    
                    {(photoPreview || photoUrl) && (
                      <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                          <img 
                            src={photoPreview || photoUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={() => toast({
                              title: "Erro ao carregar imagem",
                              description: "Verifique a URL fornecida",
                              variant: "destructive"
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="team">Equipe</Label>
                  <Select value={teamId} onValueChange={setTeamId}>
                    <SelectTrigger id="team">
                      <SelectValue placeholder="Selecione uma equipe (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddCollaborator} className="w-full">
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-medium">Legenda:</h3>
        </div>
        <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-md">
          <LegendItem color="#ea384c" text="Nível 1 - Conhecimento Básico" />
          <LegendItem color="#FFDEE2" text="Nível 2 - Conhecimento Intermediário" />
          <LegendItem color="#FEF7CD" text="Nível 3 - Aplicação com Supervisão" />
          <LegendItem color="#F2FCE2" text="Nível 4 - Aplicação Independente" />
          <LegendItem color="#83c76f" text="Nível 5 - Ensina e é Referência" />
          <LegendItem color="#8E9196" text="N/A - Não Aplicável" />
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-blue-500" aria-label="Ponto focal" />
            <span>Ponto Focal</span>
          </div>
        </div>
      </div>
      
      {collaborators.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum colaborador adicionado.</p>
          <Button 
            variant="link" 
            onClick={() => setIsDialogOpen(true)}
            className="mt-2"
          >
            Adicionar um colaborador
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex flex-col gap-2">
              <CollaboratorCard 
                collaborator={collaborator} 
                defaultCollapsed={allCollapsed}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="self-end"
                onClick={() => openAddSkillDialog(collaborator.id)}
              >
                Adicionar Habilidades
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
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
                  {selectedCollaboratorId && getAvailableSkills(selectedCollaboratorId).length > 0 ? (
                    getAvailableSkills(selectedCollaboratorId).map(skill => (
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
                  onClick={() => {
                    // Logic to add new skill - would be connected to SkillContext
                    // For now, just close the dialog
                    setIsAddingNewSkill(false);
                  }}
                  disabled={!newSkillName.trim()}
                >
                  Adicionar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LegendItem = ({ color, text }: { color: string; text: string }) => (
  <div className="flex items-center gap-2">
    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }}></div>
    <span>{text}</span>
  </div>
);

export default CollaboratorsSection;
