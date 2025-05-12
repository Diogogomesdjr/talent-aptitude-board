
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CircleCheck } from "lucide-react";

interface SkillData {
  skillId: string;
  skillName: string;
  category: string;
  strengthCount?: number;
  gapCount?: number;
}

interface TeamInsightCardProps {
  teamId: string;
  teamName: string;
  memberCount: number;
  strengths: SkillData[];
  skillGaps: SkillData[];
}

const TeamInsightCard = ({ teamId, teamName, memberCount, strengths, skillGaps }: TeamInsightCardProps) => {
  return (
    <Card key={teamId}>
      <CardHeader>
        <CardTitle>{teamName}</CardTitle>
        <CardDescription>{memberCount} membros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pontos fortes da equipe */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <CircleCheck className="h-5 w-5 text-green-500" />
              Pontos Fortes da Equipe
            </h3>
            
            {strengths.length === 0 ? (
              <p className="text-gray-500">Não há pontos fortes identificados.</p>
            ) : (
              <div className="space-y-3">
                {strengths.slice(0, 6).map(strength => (
                  <div key={strength.skillId} className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <div>
                      <p className="font-medium">{strength.skillName}</p>
                      <p className="text-xs text-gray-600">{strength.category}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100">
                      {strength.strengthCount} de {memberCount}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Lacunas de habilidade */}
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Lacunas de Habilidade
            </h3>
            
            {skillGaps.length === 0 ? (
              <p className="text-gray-500">Não há lacunas de habilidade identificadas.</p>
            ) : (
              <div className="space-y-3">
                {skillGaps.slice(0, 6).map(gap => (
                  <div key={gap.skillId} className="flex justify-between items-center p-3 bg-amber-50 rounded-md">
                    <div>
                      <p className="font-medium">{gap.skillName}</p>
                      <p className="text-xs text-gray-600">{gap.category}</p>
                    </div>
                    <Badge variant="outline" className="bg-amber-100">
                      {gap.gapCount} de {memberCount}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamInsightCard;
