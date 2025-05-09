
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Upload } from "lucide-react";

interface AddCollaboratorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCollaboratorDialog = ({ isOpen, onOpenChange }: AddCollaboratorDialogProps) => {
  const { teams, addCollaborator } = useSkillContext();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | undefined>(undefined);
  
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
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  );
};

export default AddCollaboratorDialog;
