
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Upload, ZoomIn, ZoomOut, Crop, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  
  // Novos estados para ajuste de imagem
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        // Reset adjustments for new image
        setScale(1);
        setRotation(0);
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
    // Reset adjustments
    setScale(1);
    setRotation(0);
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

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Foto do Colaborador</DialogTitle>
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
                <div className="space-y-4">
                  {/* Controles de ajuste */}
                  <div className="flex justify-center gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={handleRotate}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Zoom</span>
                      <span>{Math.round(scale * 100)}%</span>
                    </div>
                    <Slider
                      value={[scale * 100]}
                      min={50}
                      max={200}
                      step={5}
                      onValueChange={(value) => setScale(value[0] / 100)}
                    />
                  </div>
                  
                  {/* Preview container */}
                  <div className="flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <img 
                          ref={imageRef}
                          src={photoPreview || photoUrl} 
                          alt="Preview" 
                          style={{
                            transform: `scale(${scale}) rotate(${rotation}deg)`,
                            transition: "transform 0.2s ease",
                            objectFit: "cover",
                            width: "100%",
                            height: "100%"
                          }}
                          onError={() => toast({
                            title: "Erro ao carregar imagem",
                            description: "Verifique a URL fornecida",
                            variant: "destructive"
                          })}
                        />
                      </div>
                    </div>
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
