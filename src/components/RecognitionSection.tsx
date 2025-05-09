import { useSkillContext } from "@/context/SkillContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { CircleCheck, AlertTriangle, Flag, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const RecognitionSection = () => {
  const { collaborators, skills, getTeam, getSkill } = useSkillContext();
  const [filter, setFilter] = useState<string>("all");
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [collapsedStates, setCollapsedStates] = useState<Record<string, boolean>>({});

  // Initialize collapsed states
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    collaborators.forEach(c => {
      initialStates[c.id] = allCollapsed;
    });
    setCollapsedStates(initialStates);
  }, [collaborators, allCollapsed]);

  const toggleAllCollapsed = () => {
    const newAllCollapsed = !allCollapsed;
    setAllCollapsed(newAllCollapsed);
    
    // Update all individual collapsed states
    const newStates: Record<string, boolean> = {};
    collaborators.forEach(c => {
      newStates[c.id] = newAllCollapsed;
    });
    setCollapsedStates(newStates);
  };

  const toggleCollapsed = (id: string) => {
    setCollapsedStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculateAptitudePercentage = (collaboratorId: string) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (!collaborator) return 0;
    
    const skillsCount = Object.keys(collaborator.skills).length;
    if (skillsCount === 0) return 0;
    
    const aptSkills = Object.values(collaborator.skills).filter(skill => skill.isApt).length;
    return Math.round((aptSkills / skillsCount) * 100);
  };

  const getCollaboratorLevelCount = (collaboratorId: string) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (!collaborator) return { total: 0, levels: {} };
    
    const levels: Record<string, number> = {
      "N/A": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0
    };
    
    Object.values(collaborator.skills).forEach(skill => {
      const rating = skill.rating.toString();
      if (levels[rating] !== undefined) {
        levels[rating]++;
      }
    });
    
    return {
      total: Object.keys(collaborator.skills).length,
      levels
    };
  };

  const isEligibleForRecognition = (collaboratorId: string) => {
    const percentage = calculateAptitudePercentage(collaboratorId);
    return percentage >= 75;
  };

  const needsAttention = (collaboratorId: string) => {
    const percentage = calculateAptitudePercentage(collaboratorId);
    return percentage < 50;
  };

  const filteredCollaborators = collaborators.filter(collab => {
    if (filter === "eligible") return isEligibleForRecognition(collab.id);
    if (filter === "attention") return needsAttention(collab.id);
    return true;
  });
  
  return (
    <TooltipProvider>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Reconhecimento</h2>
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
              variant={filter === "attention" ? "default" : "outline"}
              onClick={() => setFilter("attention")}
              className="flex items-center gap-1 text-sm"
              size="sm"
            >
              <AlertTriangle size={16} />
              Precisam de Atenção
            </Button>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="mb-2"><strong>Regras de Reconhecimento:</strong></p>
          <ul className="list-disc list-inside space-y-2">
            <li>Colaboradores com <strong>mais de 75% de aptidão</strong> nas habilidades são elegíveis para reconhecimento.</li>
            <li>A aptidão é medida pela capacidade de executar tarefas de forma independente, ensinar ou ser referência em uma habilidade.</li>
            <li>Colaboradores com <strong>menos de 50% de aptidão</strong> podem precisar de atenção e desenvolvimento adicional.</li>
          </ul>
        </div>
        
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={toggleAllCollapsed}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {allCollapsed ? 
              <><ChevronDown size={16} /> Expandir Todos</> : 
              <><ChevronUp size={16} /> Recolher Todos</>
            }
          </Button>
        </div>
        
        {filteredCollaborators.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhum colaborador encontrado para os critérios selecionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCollaborators.map(collaborator => {
              const aptitudePercentage = calculateAptitudePercentage(collaborator.id);
              const team = collaborator.teamId ? getTeam(collaborator.teamId) : undefined;
              const levelCount = getCollaboratorLevelCount(collaborator.id);
              const isCollapsed = collapsedStates[collaborator.id] ?? false;
              
              const skillsWithLevels = Object.entries(collaborator.skills)
                .filter(([skillId]) => getSkill(skillId))  // Ensure skill exists
                .map(([skillId, skillData]) => {
                  const skill = getSkill(skillId)!;
                  return {
                    ...skill,
                    ...skillData
                  };
                });
              
              const highLevelSkills = skillsWithLevels.filter(skill => 
                typeof skill.rating === 'number' && skill.rating >= 4 && skill.isApt
              );

              return (
                <Card 
                  key={collaborator.id}
                  className={`${needsAttention(collaborator.id) ? "border-red-200" : isEligibleForRecognition(collaborator.id) ? "border-green-200" : ""}`}
                >
                  <CardContent className="p-0">
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={collaborator.photoUrl} alt={collaborator.name} />
                          <AvatarFallback>{collaborator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{collaborator.name}</h3>
                            {collaborator.isPontoCentral && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Flag className="h-4 w-4 text-blue-500" aria-label="Ponto Focal" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Ponto Focal</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          {team && <p className="text-sm text-gray-500">Equipe: {team.name}</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium">Aptidão: {aptitudePercentage}%</span>
                            {aptitudePercentage >= 75 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <CircleCheck size={16} className="text-green-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Apto para função e conhecimento</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {aptitudePercentage < 50 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle size={16} className="text-amber-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Não apto</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <Progress 
                            value={aptitudePercentage} 
                            className={`h-2 w-32 ${
                              aptitudePercentage >= 75 ? "bg-green-100" : 
                              aptitudePercentage < 50 ? "bg-red-100" : ""
                            }`}
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500" 
                          onClick={() => toggleCollapsed(collaborator.id)}
                        >
                          {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        </Button>
                      </div>
                    </div>
                    
                    {!isCollapsed && (
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Níveis de Habilidade</h4>
                            <div className="space-y-2">
                              {skillsWithLevels.length > 0 ? (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                  {skillsWithLevels.map(skill => (
                                    <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                      <div>
                                        <div className="flex items-center gap-1">
                                          <span className="font-medium">{skill.name}</span>
                                          {skill.isApt && (
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <CircleCheck size={14} className="text-green-500" />
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Apto para função e conhecimento</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          )}
                                        </div>
                                        <Badge variant="outline" className="text-xs mt-1">{skill.category}</Badge>
                                      </div>
                                      <div 
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                        style={{ 
                                          backgroundColor: skill.rating === "N/A" ? "#8E9196" :
                                            skill.rating === 1 ? "#ea384c" : 
                                            skill.rating === 2 ? "#FFDEE2" : 
                                            skill.rating === 3 ? "#FEF7CD" : 
                                            skill.rating === 4 ? "#F2FCE2" : 
                                            "#83c76f",
                                          color: (skill.rating === 2 || skill.rating === 3 || skill.rating === 4) ? "#444" : "#fff"
                                        }}
                                      >
                                        {skill.rating === "N/A" ? "NA" : skill.rating}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500">Nenhuma habilidade atribuída.</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Status de Reconhecimento</h4>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <div className="mb-4">
                                <div 
                                  className={`inline-block py-1 px-3 rounded-full text-white ${
                                    isEligibleForRecognition(collaborator.id) ? "bg-green-500" : "bg-gray-500"
                                  }`}
                                >
                                  {isEligibleForRecognition(collaborator.id) ? "Elegível para Reconhecimento" : "Não Elegível"}
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
                                    <div className="font-bold">{levelCount.levels["5"] || 0}</div>
                                    <div className="text-gray-500">Nível 5</div>
                                  </div>
                                  <div className="bg-white p-2 rounded">
                                    <div className="font-bold">{levelCount.levels["4"] || 0}</div>
                                    <div className="text-gray-500">Nível 4</div>
                                  </div>
                                  <div className="bg-white p-2 rounded">
                                    <div className="font-bold">{Object.values(collaborator.skills).filter(s => s.isApt).length}</div>
                                    <div className="text-gray-500">Habilidades Aptas</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default RecognitionSection;
