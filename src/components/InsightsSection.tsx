
import { useState } from "react";
import { useSkillContext } from "@/context/SkillContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import newly created components
import NoInsightsFound from "./insights/NoInsightsFound";
import CollaboratorInsightCard from "./insights/CollaboratorInsightCard";
import SkillDevelopmentCard from "./insights/SkillDevelopmentCard";
import TeamInsightCard from "./insights/TeamInsightCard";

// Import utility functions
import { getSkillsNeedingDevelopment } from "./insights/utils/insightsUtils";
import { generateCollaboratorInsights } from "./insights/utils/collaboratorInsightsUtils";
import { generateTeamInsights } from "./insights/utils/teamInsightsUtils";

const InsightsSection = () => {
  const { collaborators, skills, getSkill, teams, getTeam } = useSkillContext();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Calculate insights data using the utility functions
  const skillsNeedingDevelopment = getSkillsNeedingDevelopment(collaborators, skills, getSkill);
  const collaboratorInsights = generateCollaboratorInsights(collaborators, getSkill, getTeam);
  const teamInsights = generateTeamInsights(teams, collaborators, getSkill);
  
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
              <NoInsightsFound message="Não há insights disponíveis. Adicione mais habilidades aos colaboradores." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collaboratorInsights.map((collaboratorInsight) => (
                  <CollaboratorInsightCard 
                    key={collaboratorInsight.collaboratorId}
                    {...collaboratorInsight}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Tab de desenvolvimento - mostra habilidades que precisam ser desenvolvidas */}
          <TabsContent value="development">
            <div className="space-y-8">
              {Object.keys(skillsNeedingDevelopment).length === 0 ? (
                <NoInsightsFound message="Não há dados suficientes para análise. Adicione mais habilidades aos colaboradores." />
              ) : (
                Object.entries(skillsNeedingDevelopment).map(([category, skills]) => (
                  <SkillDevelopmentCard 
                    key={category}
                    category={category}
                    skills={skills}
                  />
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Tab de equipes - mostra insights por equipe */}
          <TabsContent value="team">
            {teamInsights.length === 0 ? (
              <NoInsightsFound message="Não há equipes com dados suficientes para análise." />
            ) : (
              <div className="space-y-8">
                {teamInsights.map(team => (
                  <TeamInsightCard
                    key={team.teamId}
                    {...team}
                  />
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
