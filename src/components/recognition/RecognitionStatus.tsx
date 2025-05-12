
import { Badge } from "@/components/ui/badge";

interface RecognitionStatusProps {
  isEligible: boolean;
  highLevelSkills: Array<{
    id: string;
    name: string;
    rating: number | "N/A";
  }>;
  skillStats: {
    level5Count: number;
    level4Count: number;
    aptSkillsCount: number;
  };
}

const RecognitionStatus = ({ isEligible, highLevelSkills, skillStats }: RecognitionStatusProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <div className="mb-4">
        <div 
          className={`inline-block py-1 px-3 rounded-full text-white ${
            isEligible ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          {isEligible ? "Elegível para Reconhecimento" : "Não Elegível"}
        </div>
      </div>
      
      {/* Highlight areas of excellence */}
      {highLevelSkills.length > 0 && (
        <div className="mb-4">
          <h5 className="font-medium mb-2">Áreas de Excelência</h5>
          <div className="flex flex-wrap gap-2">
            {highLevelSkills.map(skill => (
              <Badge key={skill.id} className="bg-green-100 text-green-800 hover:bg-green-200">
                {skill.name} (Nível {skill.rating})
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Stats summary */}
      <div>
        <h5 className="font-medium mb-2">Estatísticas de Habilidades</h5>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white p-2 rounded">
            <div className="font-bold">{skillStats.level5Count}</div>
            <div className="text-gray-500">Nível 5</div>
          </div>
          <div className="bg-white p-2 rounded">
            <div className="font-bold">{skillStats.level4Count}</div>
            <div className="text-gray-500">Nível 4</div>
          </div>
          <div className="bg-white p-2 rounded">
            <div className="font-bold">{skillStats.aptSkillsCount}</div>
            <div className="text-gray-500">Habilidades Aptas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionStatus;
