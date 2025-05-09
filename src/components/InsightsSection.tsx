
import { useState } from "react";
import { useSkillContext } from "@/context/SkillContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, TrendingDown } from "lucide-react";

const InsightsSection = () => {
  const { collaborators, skills, getSkill } = useSkillContext();
  
  // Generate insights based on collaborator skills
  const generateInsights = () => {
    const insights: {
      collaboratorId: string;
      collaboratorName: string;
      insights: {
        type: string;
        description: string;
        score: number;
        icon: JSX.Element;
      }[];
    }[] = [];
    
    collaborators.forEach(collaborator => {
      const collaboratorInsights = [];
      const skillEntries = Object.entries(collaborator.skills);
      
      // Skip collaborators with no skills
      if (skillEntries.length === 0) return;
      
      // Leadership potential
      const leadershipSkills = skillEntries.filter(([skillId, skillData]) => {
        const skill = getSkill(skillId);
        return (
          (skill?.category === "SoftSkill" && 
          (skill?.name.toLowerCase().includes("lideran") || 
           skill?.name.toLowerCase().includes("comunica") ||
           skill?.name.toLowerCase().includes("gestão"))) &&
          typeof skillData.rating === "number" && 
          skillData.rating >= 4
        );
      });
      
      if (leadershipSkills.length >= 2) {
        collaboratorInsights.push({
          type: "Liderança",
          description: "Potencial para liderança",
          score: (leadershipSkills.length / skillEntries.length) * 5,
          icon: <TrendingUp className="h-4 w-4 text-green-500" />
        });
      }
      
      // Technical expertise
      const technicalSkills = skillEntries.filter(([skillId, skillData]) => {
        const skill = getSkill(skillId);
        return (
          skill?.category === "HardSkill" && 
          typeof skillData.rating === "number" && 
          skillData.rating >= 4
        );
      });
      
      if (technicalSkills.length >= 3) {
        collaboratorInsights.push({
          type: "Técnico",
          description: "Especialista técnico",
          score: (technicalSkills.length / skillEntries.length) * 5,
          icon: <BarChart className="h-4 w-4 text-blue-500" />
        });
      }
      
      // Areas for improvement
      const improvementAreas = skillEntries.filter(([skillId, skillData]) => {
        return typeof skillData.rating === "number" && skillData.rating <= 2;
      });
      
      if (improvementAreas.length >= 2) {
        collaboratorInsights.push({
          type: "Desenvolvimento",
          description: "Áreas para desenvolvimento",
          score: (improvementAreas.length / skillEntries.length) * 5,
          icon: <TrendingDown className="h-4 w-4 text-amber-500" />
        });
      }
      
      // Only add to insights if there are actually insights
      if (collaboratorInsights.length > 0) {
        insights.push({
          collaboratorId: collaborator.id,
          collaboratorName: collaborator.name,
          insights: collaboratorInsights
        });
      }
    });
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Insights</h2>
      </div>
      
      {insights.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Não há insights disponíveis. Adicione mais habilidades aos colaboradores.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((collaboratorInsight) => (
            <Card key={collaboratorInsight.collaboratorId} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-2">
                <CardTitle>{collaboratorInsight.collaboratorName}</CardTitle>
                <CardDescription>
                  {collaboratorInsight.insights.length} insight{collaboratorInsight.insights.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {collaboratorInsight.insights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        {insight.icon}
                        <div>
                          <p className="font-medium">{insight.type}</p>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium">{insight.score.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsSection;
