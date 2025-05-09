
import { Flag } from "lucide-react";

interface LegendItemProps {
  color: string;
  text: string;
}

const LegendItem = ({ color, text }: LegendItemProps) => (
  <div className="flex items-center gap-2">
    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }}></div>
    <span>{text}</span>
  </div>
);

const CollaboratorLegend = () => {
  return (
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
  );
};

export default CollaboratorLegend;
