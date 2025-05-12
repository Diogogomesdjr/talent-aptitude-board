
import { Button } from "@/components/ui/button";
import { Star, AlertTriangle } from "lucide-react";

interface RecognitionFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const RecognitionFilters = ({ filter, setFilter }: RecognitionFiltersProps) => {
  return (
    <div className="flex gap-2 flex-wrap justify-end">
      <Button 
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
        className="text-sm"
        size="sm"
      >
        Todos
      </Button>
      <Button 
        variant={filter === "eligible" ? "default" : "outline"}
        onClick={() => setFilter("eligible")}
        className="text-sm"
        size="sm"
      >
        Elegíveis para Reconhecimento
      </Button>
      <Button 
        variant={filter === "highpotential" ? "default" : "outline"}
        onClick={() => setFilter("highpotential")}
        className="flex items-center gap-1 text-sm"
        size="sm"
      >
        <Star size={16} className="text-yellow-500" />
        Alto Potencial
      </Button>
      <Button 
        variant={filter === "attention" ? "default" : "outline"}
        onClick={() => setFilter("attention")}
        className="flex items-center gap-1 text-sm"
        size="sm"
      >
        <AlertTriangle size={16} />
        Precisam de Atenção
      </Button>
    </div>
  );
};

export default RecognitionFilters;
