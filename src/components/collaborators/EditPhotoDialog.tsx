
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import ImageEditor from "@/components/shared/ImageEditor";

interface EditPhotoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId: string;
  currentPhotoUrl: string;
}

const EditPhotoDialog = ({ isOpen, onOpenChange, collaboratorId, currentPhotoUrl }: EditPhotoDialogProps) => {
  const { updateCollaborator } = useSkillContext();
  const { toast } = useToast();
  
  const [finalPhotoUrl, setFinalPhotoUrl] = useState<string | null>(currentPhotoUrl);
  
  const handleUpdatePhoto = () => {
    // Use a URL final ou mantenha a atual
    const photoToUse = finalPhotoUrl || currentPhotoUrl;
    
    updateCollaborator(collaboratorId, { photoUrl: photoToUse });
    
    toast({
      title: "Foto do colaborador atualizada com sucesso!"
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Foto do Colaborador</DialogTitle>
          <DialogDescription>
            Ajuste a posição, zoom e rotação da imagem conforme necessário.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Foto Atual</Label>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border">
                <img 
                  src={currentPhotoUrl} 
                  alt="Foto Atual" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label>Nova Foto</Label>
            <ImageEditor 
              initialPhotoUrl={currentPhotoUrl} 
              onImageChange={setFinalPhotoUrl}
            />
          </div>
          
          <Button onClick={handleUpdatePhoto} className="w-full">
            Atualizar Foto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPhotoDialog;
