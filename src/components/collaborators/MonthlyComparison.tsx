
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkillContext } from "@/context/SkillContext";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, TrendingDown, Minus, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EmptyCollaboratorsList from "./EmptyCollaboratorsList";

interface MonthlyComparisonProps {
  selectedDate: Date;
  filteredCollaborators: any[];
}

const MonthlyComparison = ({ selectedDate, filteredCollaborators }: MonthlyComparisonProps) => {
  const { 
    getPreviousMonthData, 
    calculateCurrentMetrics, 
    saveMonthlySnapshot 
  } = useSkillContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [previousMonthData, setPreviousMonthData] = useState<any>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Pequeno timeout para simular carregamento
    const timer = setTimeout(() => {
      // Buscar dados históricos reais
      const historicalData = getPreviousMonthData(selectedDate);
      setPreviousMonthData(historicalData);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedDate, getPreviousMonthData]);
  
  // Calcula métricas atuais com base nos colaboradores filtrados
  const currentMetrics = calculateCurrentMetrics(filteredCollaborators);
  
  // Salva snapshot do mês atual
  const handleSaveSnapshot = () => {
    const success = saveMonthlySnapshot(selectedDate);
    
    if (success) {
      toast.success("Dados do mês atual salvos com sucesso!");
    } else {
      toast.info("Já existem dados salvos para este mês.");
    }
  };
  
  // Se não houverem colaboradores, mostra mensagem de lista vazia
  if (filteredCollaborators.length === 0) {
    return <EmptyCollaboratorsList onAddClick={() => {}} />;
  }
  
  // Calcula as diferenças entre os meses
  const calculateDiff = (current: number, previous: number) => {
    if (previous === undefined || isNaN(previous)) return { value: "0.0", direction: "same" };
    
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

  // Formata o mês para exibição
  const formatMonthDisplay = (monthNum: string | undefined) => {
    if (!monthNum) return "mês anterior";
    
    const monthDate = parse(monthNum, "MM", new Date());
    return format(monthDate, "MMMM", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Comparativo Mensal</h3>
        <Button 
          onClick={handleSaveSnapshot} 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Dados do Mês Atual
        </Button>
      </div>
      
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
                  Comparado a {previousMonthData ? formatMonthDisplay(previousMonthData.month) : "mês anterior"}
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
                  Comparado a {previousMonthData ? formatMonthDisplay(previousMonthData.month) : "mês anterior"}
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
                  Comparado a {previousMonthData ? formatMonthDisplay(previousMonthData.month) : "mês anterior"}
                </p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {Object.entries(currentMetrics.totalSkillsByCategory).map(([category, count], i) => (
                    <Card key={category} className="p-2">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {category === "HardSkill" ? "Hard Skills" : 
                           category === "SoftSkill" ? "Soft Skills" : "Conhecimento"}
                        </div>
                        <div className="text-lg font-bold">
                          {count}
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
    </div>
  );
};

export default MonthlyComparison;
