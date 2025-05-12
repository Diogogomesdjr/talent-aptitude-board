
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import ImageEditor from "@/components/shared/ImageEditor";

interface AddCollaboratorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCollaboratorDialog = ({ isOpen, onOpenChange }: AddCollaboratorDialogProps) => {
  const { teams, addCollaborator } = useSkillContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);

  const handleAddCollaborator = () => {
    if (!name.trim()) {
      toast({
        title: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    // Use a URL da foto ou o placeholder
    const finalPhotoUrl = photoUrl || "/placeholder.svg";
    
    addCollaborator(name, finalPhotoUrl, teamId);
    
    toast({
      title: "Colaborador adicionado com sucesso!"
    });
    
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPhotoUrl(null);
    setTeamId(undefined);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
          <DialogDescription>
            Preencha os dados do colaborador e ajuste a foto conforme necessário.
          </DialogDescription>
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
            <ImageEditor 
              onImageChange={setPhotoUrl}
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
  );
};

export default AddCollaboratorDialog;
