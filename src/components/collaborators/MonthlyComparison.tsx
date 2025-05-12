
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkillContext } from "@/context/SkillContext";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import EmptyCollaboratorsList from "./EmptyCollaboratorsList";

interface MonthlyComparisonProps {
  selectedDate: Date;
  filteredCollaborators: any[];
}

const MonthlyComparison = ({ selectedDate, filteredCollaborators }: MonthlyComparisonProps) => {
  const { collaborators, getTeam } = useSkillContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulando dados de meses anteriores
  // Em produção, esses dados viriam de um banco de dados com histórico
  const [previousMonthData, setPreviousMonthData] = useState<any>(null);
  
  useEffect(() => {
    // Simula carregamento de dados históricos
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Gera dados simulados do mês anterior com uma variação aleatória
      const simulatedData = {
        month: format(subMonths(selectedDate, 1), "MMMM", { locale: ptBR }),
        skillAverage: Math.max(1, Math.min(5, 3 + (Math.random() * 0.6 - 0.3))),
        aptitudePercentage: Math.min(100, Math.max(0, 65 + (Math.random() * 20 - 10))),
        totalSkills: Math.floor(filteredCollaborators.length * 3.5),
      };
      
      setPreviousMonthData(simulatedData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedDate, filteredCollaborators]);
  
  // Calcula as métricas atuais
  const calculateCurrentMetrics = () => {
    let totalRating = 0;
    let totalSkills = 0;
    let totalAptSkills = 0;
    
    filteredCollaborators.forEach(collaborator => {
      Object.values(collaborator.skills).forEach((skill: any) => {
        if (skill.rating !== 'N/A' && typeof skill.rating === 'number') {
          totalRating += skill.rating;
          totalSkills++;
          
          if (skill.isApt) {
            totalAptSkills++;
          }
        }
      });
    });
    
    return {
      skillAverage: totalSkills > 0 ? totalRating / totalSkills : 0,
      aptitudePercentage: totalSkills > 0 ? (totalAptSkills / totalSkills) * 100 : 0,
      totalSkills
    };
  };
  
  const currentMetrics = calculateCurrentMetrics();
  
  // Se não houverem colaboradores, mostra mensagem de lista vazia
  if (filteredCollaborators.length === 0) {
    return <EmptyCollaboratorsList onAddClick={() => {}} />;
  }
  
  // Calcula as diferenças entre os meses
  const calculateDiff = (current: number, previous: number) => {
    const diff = current - previous;
    return {
      value: Math.abs(diff).toFixed(1),
      direction: diff > 0.1 ? "up" : diff < -0.1 ? "down" : "same"
    };
  };

  // Renderiza o indicador de tendência
  const renderTrend = (direction: string, value: string) => {
    if (direction === "up") {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+{value}</span>
        </div>
      );
    } else if (direction === "down") {
      return (
        <div className="flex items-center text-red-600">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>-{value}</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-gray-600">
          <Minus className="h-4 w-4 mr-1" />
          <span>Sem alteração</span>
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Média de Nível de Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {currentMetrics.skillAverage.toFixed(1)}
                </div>
                {previousMonthData && renderTrend(
                  calculateDiff(currentMetrics.skillAverage, previousMonthData.skillAverage).direction,
                  calculateDiff(currentMetrics.skillAverage, previousMonthData.skillAverage).value
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Comparado a {previousMonthData?.month || "mês anterior"}
              </p>
              <Progress 
                value={currentMetrics.skillAverage * 20} 
                className="mt-2 h-2" 
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Percentual de Aptidão</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {currentMetrics.aptitudePercentage.toFixed(1)}%
                </div>
                {previousMonthData && renderTrend(
                  calculateDiff(currentMetrics.aptitudePercentage, previousMonthData.aptitudePercentage).direction,
                  calculateDiff(currentMetrics.aptitudePercentage, previousMonthData.aptitudePercentage).value
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Comparado a {previousMonthData?.month || "mês anterior"}
              </p>
              <Progress 
                value={currentMetrics.aptitudePercentage} 
                className="mt-2 h-2" 
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Habilidades Avaliadas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {currentMetrics.totalSkills}
                </div>
                {previousMonthData && renderTrend(
                  calculateDiff(currentMetrics.totalSkills, previousMonthData.totalSkills).direction,
                  calculateDiff(currentMetrics.totalSkills, previousMonthData.totalSkills).value
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Comparado a {previousMonthData?.month || "mês anterior"}
              </p>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-2">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {["Conhecimento", "Hard Skills", "Soft Skills"][i]}
                      </div>
                      <div className="text-lg font-bold">
                        {Math.floor(currentMetrics.totalSkills / 3)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyComparison;
