
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Upload } from "lucide-react";

interface EditPhotoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  collaboratorId: string;
  currentPhotoUrl: string;
}

const EditPhotoDialog = ({ isOpen, onOpenChange, collaboratorId, currentPhotoUrl }: EditPhotoDialogProps) => {
  const { updateCollaborator } = useSkillContext();
  const { toast } = useToast();
  
  const [photoUrl, setPhotoUrl] = useState(currentPhotoUrl);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
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

  const handleUpdatePhoto = () => {
    // Use either the file preview or the URL
    const finalPhotoUrl = photoPreview || photoUrl || currentPhotoUrl;
    
    updateCollaborator(collaboratorId, { photoUrl: finalPhotoUrl });
    
    toast({
      title: "Foto do colaborador atualizada com sucesso!"
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar Foto do Colaborador</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Foto Atual</Label>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
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
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={photoUrl}
                  onChange={handlePhotoUrlChange}
                  placeholder="URL da foto"
                  disabled={!!photoFile}
                />
                <Label 
                  htmlFor="photo-edit-upload" 
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
                >
                  <Upload className="w-4 h-4" />
                </Label>
                <Input
                  id="photo-edit-upload"
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
          
          <Button onClick={handleUpdatePhoto} className="w-full">
            Atualizar Foto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPhotoDialog;
