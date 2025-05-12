
import { Button } from "@/components/ui/button";
import { Star, AlertTriangle } from "lucide-react";

interface RecognitionFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const RecognitionFilters = ({ filter, setFilter }: RecognitionFiltersProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-4 rounded-lg shadow-sm border mb-4">
      <Button 
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => setFilter("all")}
        className="text-sm w-full"
        size="sm"
      >
        Todos
      </Button>
      <Button 
        variant={filter === "eligible" ? "default" : "outline"}
        onClick={() => setFilter("eligible")}
        className="text-sm w-full"
        size="sm"
      >
        Elegíveis
      </Button>
      <Button 
        variant={filter === "highpotential" ? "default" : "outline"}
        onClick={() => setFilter("highpotential")}
        className="flex items-center justify-center gap-1 text-sm w-full"
        size="sm"
      >
        <Star size={16} className="text-yellow-500" />
        Alto Potencial
      </Button>
      <Button 
        variant={filter === "attention" ? "default" : "outline"}
        onClick={() => setFilter("attention")}
        className="flex items-center justify-center gap-1 text-sm w-full"
        size="sm"
      >
        <AlertTriangle size={16} className="text-red-500" />
        Atenção
      </Button>
    </div>
  );
};

export default RecognitionFilters;
