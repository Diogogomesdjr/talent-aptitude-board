
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CollaboratorNeedingSkill {
  id: string;
  name: string;
  rating: number | "N/A";
}

interface SkillNeedingDevelopment {
  skillId: string;
  skillName: string;
  category: string;
  needsImprovement: number;
  totalAssigned: number;
  collaboratorsNeeding: CollaboratorNeedingSkill[];
}

interface SkillDevelopmentCardProps {
  category: string;
  skills: SkillNeedingDevelopment[];
}

const SkillDevelopmentCard = ({ category, skills }: SkillDevelopmentCardProps) => {
  return (
    <Card key={category} className="overflow-hidden">
      <CardHeader>
        <CardTitle>Categoria: {category}</CardTitle>
        <CardDescription>
          Habilidades que necessitam desenvolvimento nesta categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <p className="text-gray-500">Não há habilidades que necessitam desenvolvimento nesta categoria.</p>
        ) : (
          <div className="space-y-6">
            {skills.filter(skill => skill.needsImprovement > 0).map(skill => (
              <div key={skill.skillId} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{skill.skillName}</h3>
                  <Badge variant={skill.needsImprovement > skill.totalAssigned / 2 ? "destructive" : "outline"}>
                    {skill.needsImprovement} de {skill.totalAssigned} ({Math.round(skill.needsImprovement / skill.totalAssigned * 100)}%)
                  </Badge>
                </div>
                <Progress 
                  value={skill.needsImprovement / skill.totalAssigned * 100}
                  className="h-2 mb-4"
                />
                <div>
                  <p className="text-sm font-medium mb-2">Colaboradores que precisam desenvolver esta habilidade:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {skill.collaboratorsNeeding.map(collab => (
                      <div key={collab.id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span>{collab.name}</span>
                        <Badge variant={collab.rating === 1 ? "destructive" : "outline"}>
                          Nível {collab.rating}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillDevelopmentCard;
