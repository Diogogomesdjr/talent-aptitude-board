
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Upload, ZoomIn, ZoomOut, RotateCcw, MoveLeft, MoveRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  
  // Estados para ajuste de imagem
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionX, setPositionX] = useState(0); // Novo estado para posição horizontal
  
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
        setPositionX(0); // Resetar posição horizontal
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
    setPositionX(0); // Resetar posição horizontal
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
    setScale(1);
    setRotation(0);
    setPositionX(0); // Resetar posição horizontal
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
  
  // Funções para mover a imagem horizontalmente
  const handleMoveLeft = () => {
    setPositionX(prev => Math.max(prev - 10, -100));
  };
  
  const handleMoveRight = () => {
    setPositionX(prev => Math.min(prev + 10, 100));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
                    <Button type="button" size="sm" variant="outline" onClick={handleMoveLeft}>
                      <MoveLeft className="h-4 w-4" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={handleMoveRight}>
                      <MoveRight className="h-4 w-4" />
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
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Posição Horizontal</span>
                      <span>{positionX}px</span>
                    </div>
                    <Slider
                      value={[positionX + 100]}
                      min={0}
                      max={200}
                      step={5}
                      onValueChange={(value) => setPositionX(value[0] - 100)}
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
                            transform: `translateX(${positionX}px) scale(${scale}) rotate(${rotation}deg)`,
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
