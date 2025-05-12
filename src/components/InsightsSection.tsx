import { useState } from "react";
import { useSkillContext } from "@/context/SkillContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, TrendingUp, TrendingDown, AlertTriangle, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const InsightsSection = () => {
  const { collaborators, skills, getSkill, teams, getTeam } = useSkillContext();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Função para buscar as habilidades que precisam ser desenvolvidas
  const getSkillsNeedingDevelopment = () => {
    // Agrupa as habilidades pela categoria e conta quantos colaboradores precisam melhorar nelas
    const skillsByCategory: Record<string, { 
      skillId: string, 
      skillName: string, 
      category: string,
      needsImprovement: number,
      totalAssigned: number,
      collaboratorsNeeding: { id: string, name: string, rating: number | "N/A" }[]
    }[]> = {};
    
    // Inicializar categorias
    skills.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
    });
    
    // Para cada colaborador, verificar as habilidades com baixo nível (1-2)
    collaborators.forEach(collaborator => {
      Object.entries(collaborator.skills).forEach(([skillId, skillData]) => {
        const skill = getSkill(skillId);
        if (skill) {
          // Encontrar ou criar o item da habilidade no objeto agrupado
          let skillItem = skillsByCategory[skill.category].find(item => item.skillId === skillId);
          
          if (!skillItem) {
            skillItem = {
              skillId,
              skillName: skill.name,
              category: skill.category,
              needsImprovement: 0,
              totalAssigned: 0,
              collaboratorsNeeding: []
            };
            skillsByCategory[skill.category].push(skillItem);
          }
          
          // Incrementar o total
          skillItem.totalAssigned++;
          
          // Verificar se precisa melhorar nessa habilidade
          if (typeof skillData.rating === 'number' && skillData.rating <= 2) {
            skillItem.needsImprovement++;
            skillItem.collaboratorsNeeding.push({
              id: collaborator.id,
              name: collaborator.name,
              rating: skillData.rating
            });
          }
        }
      });
    });
    
    // Ordenar por porcentagem de necessidade de melhoria
    Object.keys(skillsByCategory).forEach(category => {
      skillsByCategory[category].sort((a, b) => {
        const aPercent = a.totalAssigned > 0 ? (a.needsImprovement / a.totalAssigned) : 0;
        const bPercent = b.totalAssigned > 0 ? (b.needsImprovement / b.totalAssigned) : 0;
        return bPercent - aPercent;
      });
    });
    
    return skillsByCategory;
  };
  
  // Função para gerar insights sobre colaboradores
  const generateCollaboratorInsights = () => {
    const insights: {
      collaboratorId: string;
      collaboratorName: string;
      teamName?: string;
      insights: {
        type: string;
        description: string;
        score: number;
        icon: JSX.Element;
        details?: string[];
      }[];
    }[] = [];
    
    collaborators.forEach(collaborator => {
      const collaboratorInsights = [];
      const skillEntries = Object.entries(collaborator.skills);
      const team = collaborator.teamId ? getTeam(collaborator.teamId) : undefined;
      
      // Pular colaboradores sem habilidades
      if (skillEntries.length === 0) return;
      
      // Potencial de liderança
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
        const details = leadershipSkills.map(([skillId]) => {
          const skill = getSkill(skillId);
          return skill ? `${skill.name}` : '';
        }).filter(Boolean);
        
        collaboratorInsights.push({
          type: "Liderança",
          description: "Potencial para liderança",
          score: (leadershipSkills.length / skillEntries.length) * 5,
          icon: <TrendingUp className="h-4 w-4 text-green-500" />,
          details
        });
      }
      
      // Expertise técnica
      const technicalSkills = skillEntries.filter(([skillId, skillData]) => {
        const skill = getSkill(skillId);
        return (
          skill?.category === "HardSkill" && 
          typeof skillData.rating === "number" && 
          skillData.rating >= 4
        );
      });
      
      if (technicalSkills.length >= 3) {
        const details = technicalSkills.map(([skillId]) => {
          const skill = getSkill(skillId);
          return skill ? `${skill.name}` : '';
        }).filter(Boolean);
        
        collaboratorInsights.push({
          type: "Técnico",
          description: "Especialista técnico",
          score: (technicalSkills.length / skillEntries.length) * 5,
          icon: <BarChart className="h-4 w-4 text-blue-500" />,
          details
        });
      }
      
      // Áreas para melhoria 
      const improvementAreas = skillEntries.filter(([skillId, skillData]) => {
        return typeof skillData.rating === "number" && skillData.rating <= 2;
      });
      
      if (improvementAreas.length >= 2) {
        const details = improvementAreas.map(([skillId]) => {
          const skill = getSkill(skillId);
          return skill ? `${skill.name} (precisa desenvolver)` : '';
        }).filter(Boolean);
        
        collaboratorInsights.push({
          type: "Desenvolvimento",
          description: "Áreas para desenvolvimento",
          score: (improvementAreas.length / skillEntries.length) * 5,
          icon: <TrendingDown className="h-4 w-4 text-amber-500" />,
          details
        });
      }
      
      // Adicionar apenas se houver insights
      if (collaboratorInsights.length > 0) {
        insights.push({
          collaboratorId: collaborator.id,
          collaboratorName: collaborator.name,
          teamName: team?.name,
          insights: collaboratorInsights
        });
      }
    });
    
    return insights;
  };

  // Função para gerar insights sobre equipes
  const generateTeamInsights = () => {
    const teamInsights: Record<string, {
      teamId: string;
      teamName: string;
      skillGaps: { skillId: string, skillName: string, category: string, gapCount: number }[];
      strengths: { skillId: string, skillName: string, category: string, strengthCount: number }[];
      memberCount: number;
    }> = {};
    
    // Inicializar dados das equipes
    teams.forEach(team => {
      teamInsights[team.id] = {
        teamId: team.id,
        teamName: team.name,
        skillGaps: [],
        strengths: [],
        memberCount: 0
      };
    });
    
    // Agrupar colaboradores por equipe
    collaborators.forEach(collaborator => {
      if (!collaborator.teamId || !teamInsights[collaborator.teamId]) return;
      
      teamInsights[collaborator.teamId].memberCount++;
      
      // Analisar habilidades
      Object.entries(collaborator.skills).forEach(([skillId, skillData]) => {
        const skill = getSkill(skillId);
        if (!skill) return;
        
        // Verificar lacunas de habilidade (rating baixo)
        if (typeof skillData.rating === "number" && skillData.rating <= 2) {
          const existingGap = teamInsights[collaborator.teamId].skillGaps.find(gap => gap.skillId === skillId);
          
          if (existingGap) {
            existingGap.gapCount++;
          } else {
            teamInsights[collaborator.teamId].skillGaps.push({
              skillId,
              skillName: skill.name,
              category: skill.category,
              gapCount: 1
            });
          }
        }
        
        // Verificar pontos fortes (rating alto)
        if (typeof skillData.rating === "number" && skillData.rating >= 4) {
          const existingStrength = teamInsights[collaborator.teamId].strengths.find(s => s.skillId === skillId);
          
          if (existingStrength) {
            existingStrength.strengthCount++;
          } else {
            teamInsights[collaborator.teamId].strengths.push({
              skillId,
              skillName: skill.name,
              category: skill.category,
              strengthCount: 1
            });
          }
        }
      });
    });
    
    // Ordenar lacunas e pontos fortes por contagem
    Object.values(teamInsights).forEach(team => {
      team.skillGaps.sort((a, b) => b.gapCount - a.gapCount);
      team.strengths.sort((a, b) => b.strengthCount - a.strengthCount);
    });
    
    // Filtrar equipes sem membros
    return Object.values(teamInsights).filter(team => team.memberCount > 0);
  };

  // Store the results of these functions in variables to use in the JSX
  const skillsNeedingDevelopment = getSkillsNeedingDevelopment();
  const collaboratorInsights = generateCollaboratorInsights();
  const teamInsights = generateTeamInsights();
  
  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Insights</h2>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">Visão Geral</TabsTrigger>
            <TabsTrigger value="development">Áreas de Desenvolvimento</TabsTrigger>
            <TabsTrigger value="team">Insights por Equipe</TabsTrigger>
          </TabsList>
          
          {/* Tab de visão geral - mostra insights por colaborador */}
          <TabsContent value="all">
            {collaboratorInsights.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Não há insights disponíveis. Adicione mais habilidades aos colaboradores.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collaboratorInsights.map((collaboratorInsight) => (
                  <Card key={collaboratorInsight.collaboratorId} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-2">
                      <CardTitle>{collaboratorInsight.collaboratorName}</CardTitle>
                      <CardDescription>
                        {collaboratorInsight.teamName && `Equipe: ${collaboratorInsight.teamName} • `}
                        {collaboratorInsight.insights.length} insight{collaboratorInsight.insights.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {collaboratorInsight.insights.map((insight, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between mb-2">
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
                            {insight.details && insight.details.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Detalhes:</p>
                                <div className="flex flex-wrap gap-1">
                                  {insight.details.map((detail, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{detail}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Tab de desenvolvimento - mostra habilidades que precisam ser desenvolvidas */}
          <TabsContent value="development">
            <div className="space-y-8">
              {Object.keys(skillsNeedingDevelopment).length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Não há dados suficientes para análise. Adicione mais habilidades aos colaboradores.</p>
                </div>
              ) : (
                Object.entries(skillsNeedingDevelopment).map(([category, skills]) => (
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
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Tab de equipes - mostra insights por equipe */}
          <TabsContent value="team">
            {teamInsights.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Não há equipes com dados suficientes para análise.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {teamInsights.map(team => (
                  <Card key={team.teamId}>
                    <CardHeader>
                      <CardTitle>{team.teamName}</CardTitle>
                      <CardDescription>{team.memberCount} membros</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pontos fortes da equipe */}
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <CircleCheck className="h-5 w-5 text-green-500" />
                            Pontos Fortes da Equipe
                          </h3>
                          
                          {team.strengths.length === 0 ? (
                            <p className="text-gray-500">Não há pontos fortes identificados.</p>
                          ) : (
                            <div className="space-y-3">
                              {team.strengths.slice(0, 6).map(strength => (
                                <div key={strength.skillId} className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                                  <div>
                                    <p className="font-medium">{strength.skillName}</p>
                                    <p className="text-xs text-gray-600">{strength.category}</p>
                                  </div>
                                  <Badge variant="outline" className="bg-green-100">
                                    {strength.strengthCount} de {team.memberCount}
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
                          
                          {team.skillGaps.length === 0 ? (
                            <p className="text-gray-500">Não há lacunas de habilidade identificadas.</p>
                          ) : (
                            <div className="space-y-3">
                              {team.skillGaps.slice(0, 6).map(gap => (
                                <div key={gap.skillId} className="flex justify-between items-center p-3 bg-amber-50 rounded-md">
                                  <div>
                                    <p className="font-medium">{gap.skillName}</p>
                                    <p className="text-xs text-gray-600">{gap.category}</p>
                                  </div>
                                  <Badge variant="outline" className="bg-amber-100">
                                    {gap.gapCount} de {team.memberCount}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default InsightsSection;
