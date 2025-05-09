
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import CollaboratorCard from "@/components/CollaboratorCard";
import { Flag, ArrowDown, ArrowUp } from "lucide-react";

const CollaboratorsSection = () => {
  const { collaborators, teams, addCollaborator } = useSkillContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);

  const handleAddCollaborator = () => {
    if (!name.trim()) {
      toast({
        title: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    addCollaborator(name, photoUrl || "/placeholder.svg", teamId);
    
    toast({
      title: "Colaborador adicionado com sucesso!"
    });
    
    setName("");
    setPhotoUrl("");
    setTeamId(undefined);
    setIsDialogOpen(false);
  };

  const toggleAllCollapsed = () => {
    setAllCollapsed(!allCollapsed);
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
                  <Label htmlFor="photo">URL da Foto</Label>
                  <Input
                    id="photo"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="URL da foto (opcional)"
                  />
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
            <CollaboratorCard 
              key={collaborator.id} 
              collaborator={collaborator} 
              defaultCollapsed={allCollapsed}
            />
          ))}
        </div>
      )}
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
