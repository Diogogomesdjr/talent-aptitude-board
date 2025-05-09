
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  Flag, 
  X, 
  CircleCheck, 
  ChevronDown, 
  ChevronUp,
  Plus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext, Collaborator as CollaboratorType } from "@/context/SkillContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from "recharts";

interface CollaboratorCardProps {
  collaborator: CollaboratorType;
  defaultCollapsed?: boolean;
}

const CollaboratorCard = ({ collaborator, defaultCollapsed = false }: CollaboratorCardProps) => {
  const { 
    skills, 
    getTeam, 
    getFunctionRole,
    functionRoles,
    assignFunctionRole,
    togglePontoCentral,
    deleteCollaborator,
    toggleCollaboratorAptForRole,
    updateCollaboratorSkill,
    removeCollaboratorSkill,
    addCollaboratorSkill
  } = useSkillContext();
  
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [addSkillDialogOpen, setAddSkillDialogOpen] = useState(false);
  
  const team = collaborator.teamId ? getTeam(collaborator.teamId) : undefined;
  const functionRole = collaborator.functionRoleId ? getFunctionRole(collaborator.functionRoleId) : undefined;
  
  const ratingColors = {
    "1": "#ea384c",
    "2": "#FFDEE2",
    "3": "#FEF7CD",
    "4": "#F2FCE2",
    "5": "#83c76f",
    "N/A": "#8E9196"
  };
  
  const collaboratorSkills = Object.entries(collaborator.skills)
    .map(([id, skillData]) => ({
      skillInfo: skills.find(s => s.id === id),
      skillData
    }))
    .filter(item => item.skillInfo);
  
  const handleDeleteCollaborator = () => {
    deleteCollaborator(collaborator.id);
    toast({
      title: "Colaborador excluído com sucesso!"
    });
  };

  // Create chart data for the radar chart
  const getChartData = () => {
    return collaboratorSkills
      .filter(item => item.skillInfo && item.skillData.rating !== "N/A")
      .map(item => ({
        skill: item.skillInfo!.name,
        value: item.skillData.rating === "N/A" ? 0 : item.skillData.rating,
        category: item.skillInfo!.category,
      }));
  };

  const chartData = getChartData();
  
  const hasSkills = collaboratorSkills.length > 0;

  // Calculate aptitude percentage
  const calculateAptitudePercentage = () => {
    if (collaboratorSkills.length === 0) return 0;
    
    const aptSkills = collaboratorSkills.filter(s => s.skillData.isApt).length;
    return Math.round((aptSkills / collaboratorSkills.length) * 100);
  };

  const aptitudePercentage = calculateAptitudePercentage();
  const availableSkillsForAdd = skills.filter(skill => 
    !Object.keys(collaborator.skills).includes(skill.id)
  );

  return (
    <Card className={`transition-all duration-300 overflow-hidden ${isCollapsed ? "border-l-4" : ""}`} style={isCollapsed ? { borderLeftColor: collaborator.isPontoCentral ? "#3b82f6" : "#e5e7eb" } : {}}>
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
                  <Flag className="h-4 w-4 text-blue-500" aria-label="Ponto Focal" />
                )}
              </div>
              <div className="flex flex-col text-xs text-gray-500">
                {team && <span>Equipe: {team.name}</span>}
                {functionRole && <span>Função: {functionRole.name}</span>}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500" 
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </Button>
          </div>
        </div>
        
        {isCollapsed ? (
          <div className="p-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {collaboratorSkills.map(({ skillInfo, skillData }) => (
                skillInfo && (
                  <div key={skillInfo.id} className="flex items-center gap-2">
                    <span className="text-sm font-medium">{skillInfo.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {skillInfo.category}
                    </span>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: skillData.rating !== "N/A" ? ratingColors[skillData.rating.toString() as keyof typeof ratingColors] : ratingColors["N/A"] }}
                    ></div>
                    {skillData.isApt ? 
                      <CircleCheck size={16} className="text-green-500" /> : 
                      <X size={16} className="text-red-500" />
                    }
                  </div>
                )
              ))}
              {collaboratorSkills.length === 0 && (
                <p className="text-sm text-gray-500">Nenhuma habilidade atribuída.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`ponto-focal-${collaborator.id}`}
                      checked={collaborator.isPontoCentral}
                      onCheckedChange={() => togglePontoCentral(collaborator.id)}
                    />
                    <Label htmlFor={`ponto-focal-${collaborator.id}`}>Ponto Focal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`apt-for-role-${collaborator.id}`}
                      checked={collaborator.isAptForRole}
                      onCheckedChange={() => toggleCollaboratorAptForRole(collaborator.id)}
                    />
                    <Label htmlFor={`apt-for-role-${collaborator.id}`}>Apto para Função</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Função</h4>
                <Select 
                  value={collaborator.functionRoleId} 
                  onValueChange={(value) => assignFunctionRole(collaborator.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    {functionRoles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Dialog open={addSkillDialogOpen} onOpenChange={setAddSkillDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Plus size={16} />
                      Adicionar Habilidades
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Habilidades para {collaborator.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {availableSkillsForAdd.length > 0 ? (
                        <>
                          <p className="text-sm text-gray-500">Selecione as habilidades para adicionar:</p>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {availableSkillsForAdd.map(skill => (
                              <div key={skill.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium">{skill.name}</p>
                                  <p className="text-xs text-gray-500">{skill.category}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  onClick={() => {
                                    addCollaboratorSkill(collaborator.id, skill.id);
                                    toast({
                                      title: `Habilidade ${skill.name} adicionada`
                                    });
                                  }}
                                >
                                  <Plus size={16} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-center py-8 text-gray-500">
                          Todas as habilidades já foram adicionadas a este colaborador ou não existem habilidades cadastradas.
                        </p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={handleDeleteCollaborator}>
                  Excluir Colaborador
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {hasSkills ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Habilidades</h4>
                  <div className="space-y-4">
                    {/* Skills display */}
                    {collaboratorSkills.map(({ skillInfo, skillData }) => (
                      skillInfo && (
                        <div key={skillInfo.id} className="bg-gray-50 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <h5 className="font-medium">{skillInfo.name}</h5>
                              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">{skillInfo.category}</span>
                            </div>
                            <Button
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeCollaboratorSkill(collaborator.id, skillInfo.id)}
                            >
                              <X size={16} className="text-gray-400 hover:text-red-500" />
                            </Button>
                          </div>
                          
                          <div className="space-y-3 mt-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <Label htmlFor={`rating-${skillInfo.id}`}>
                                  Nível: {skillData.rating.toString()}
                                </Label>
                                <Button
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => updateCollaboratorSkill(
                                    collaborator.id, 
                                    skillInfo.id, 
                                    { rating: skillData.rating === "N/A" ? 1 : skillData.rating === 5 ? "N/A" : (skillData.rating as number) + 1 }
                                  )}
                                >
                                  Alternar
                                </Button>
                              </div>
                              <Slider
                                id={`rating-${skillInfo.id}`}
                                min={0}
                                max={5}
                                step={1}
                                value={[skillData.rating === "N/A" ? 0 : skillData.rating as number]}
                                onValueChange={(value) => {
                                  const rating = value[0] === 0 ? "N/A" : value[0];
                                  updateCollaboratorSkill(collaborator.id, skillInfo.id, { rating });
                                }}
                                className="py-2"
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>N/A</span>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                              </div>
                            </div>
                            
                            {/* Aptitude toggle only for habilidades */}
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`apt-${skillInfo.id}`}
                                checked={skillData.isApt}
                                onCheckedChange={(checked) => 
                                  updateCollaboratorSkill(collaborator.id, skillInfo.id, { isApt: checked })
                                }
                              />
                              <Label htmlFor={`apt-${skillInfo.id}`}>
                                {skillData.isApt ? "Apto" : "Não Apto"}
                              </Label>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                {/* Radar Chart */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">
                    Gráfico de Habilidades
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      Aptidão: {aptitudePercentage}%
                    </span>
                  </h4>
                  {chartData.length > 0 ? (
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <Radar
                            name="Habilidades"
                            dataKey="value"
                            stroke="#9b87f5"
                            fill="#9b87f5"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-72 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <BarChart size={36} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">Sem dados para exibir</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-2">Nenhuma habilidade atribuída a este colaborador.</p>
                <Dialog open={addSkillDialogOpen} onOpenChange={setAddSkillDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Adicionar Habilidades</Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollaboratorCard;
