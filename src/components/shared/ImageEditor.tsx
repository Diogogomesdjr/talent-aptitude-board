
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, ZoomIn, ZoomOut, RotateCcw, MoveLeft, MoveRight, MoveUp, MoveDown } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ImageEditorProps {
  initialPhotoUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
}

const ImageEditor = ({ initialPhotoUrl = "", onImageChange }: ImageEditorProps) => {
  const { toast } = useToast();
  
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Estados para ajuste de imagem
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  
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
        setPositionX(0);
        setPositionY(0);
        // Notify parent component
        onImageChange(result);
      };
      reader.readAsDataURL(file);
      
      // Clear the URL input since we're using a file now
      setPhotoUrl("");
    }
  };

  const handlePhotoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPhotoUrl(url);
    // Clear file selection
    setPhotoFile(null);
    setPhotoPreview(null);
    // Reset adjustments
    setScale(1);
    setRotation(0);
    setPositionX(0);
    setPositionY(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Notify parent component
    onImageChange(url || null);
  };

  const handleZoomIn = () => {
    setScale(prev => {
      const newScale = Math.min(prev + 0.1, 2);
      updateParent(newScale, rotation, positionX, positionY);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.1, 0.5);
      updateParent(newScale, rotation, positionX, positionY);
      return newScale;
    });
  };

  const handleRotate = () => {
    setRotation(prev => {
      const newRotation = (prev + 90) % 360;
      updateParent(scale, newRotation, positionX, positionY);
      return newRotation;
    });
  };
  
  // Funções para mover a imagem horizontalmente
  const handleMoveLeft = () => {
    setPositionX(prev => {
      const newPositionX = Math.max(prev - 10, -100);
      updateParent(scale, rotation, newPositionX, positionY);
      return newPositionX;
    });
  };
  
  const handleMoveRight = () => {
    setPositionX(prev => {
      const newPositionX = Math.min(prev + 10, 100);
      updateParent(scale, rotation, newPositionX, positionY);
      return newPositionX;
    });
  };

  // Funções para mover a imagem verticalmente
  const handleMoveUp = () => {
    setPositionY(prev => {
      const newPositionY = Math.max(prev - 10, -100);
      updateParent(scale, rotation, positionX, newPositionY);
      return newPositionY;
    });
  };
  
  const handleMoveDown = () => {
    setPositionY(prev => {
      const newPositionY = Math.min(prev + 10, 100);
      updateParent(scale, rotation, positionX, newPositionY);
      return newPositionY;
    });
  };

  // Atualiza o componente pai com as novas configurações da imagem
  const updateParent = (scale: number, rotation: number, positionX: number, positionY: number) => {
    // Só notifica se tiver uma imagem para ajustar
    if (photoPreview || photoUrl) {
      onImageChange(photoPreview || photoUrl);
    }
  };

  // Função para ajustar escala via slider
  const handleScaleChange = (value: number[]) => {
    const newScale = value[0] / 100;
    setScale(newScale);
    updateParent(newScale, rotation, positionX, positionY);
  };

  // Função para ajustar posição horizontal via slider
  const handlePositionXChange = (value: number[]) => {
    const newPositionX = value[0] - 100;
    setPositionX(newPositionX);
    updateParent(scale, rotation, newPositionX, positionY);
  };

  // Função para ajustar posição vertical via slider
  const handlePositionYChange = (value: number[]) => {
    const newPositionY = value[0] - 100;
    setPositionY(newPositionY);
    updateParent(scale, rotation, positionX, newPositionY);
  };
  
  return (
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
          <div className="flex flex-wrap justify-center gap-2">
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
            <Button type="button" size="sm" variant="outline" onClick={handleMoveUp}>
              <MoveUp className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleMoveDown}>
              <MoveDown className="h-4 w-4" />
            </Button>
          </div>
          
          <ImageAdjustmentSliders 
            scale={scale}
            positionX={positionX}
            positionY={positionY}
            onScaleChange={handleScaleChange}
            onPositionXChange={handlePositionXChange}
            onPositionYChange={handlePositionYChange}
          />
          
          {/* Preview container */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
              <div className="relative w-full h-full">
                <img 
                  ref={imageRef}
                  src={photoPreview || photoUrl} 
                  alt="Preview" 
                  style={{
                    transform: `translateX(${positionX}px) translateY(${positionY}px) scale(${scale}) rotate(${rotation}deg)`,
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
  );
};

// Componente para os sliders de ajustes
interface ImageAdjustmentSlidersProps {
  scale: number;
  positionX: number;
  positionY: number;
  onScaleChange: (value: number[]) => void;
  onPositionXChange: (value: number[]) => void;
  onPositionYChange: (value: number[]) => void;
}

const ImageAdjustmentSliders = ({
  scale,
  positionX,
  positionY,
  onScaleChange,
  onPositionXChange,
  onPositionYChange
}: ImageAdjustmentSlidersProps) => {
  return (
    <>
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
          onValueChange={onScaleChange}
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
          onValueChange={onPositionXChange}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Posição Vertical</span>
          <span>{positionY}px</span>
        </div>
        <Slider
          value={[positionY + 100]}
          min={0}
          max={200}
          step={5}
          onValueChange={onPositionYChange}
        />
      </div>
    </>
  );
};

export default ImageEditor;
