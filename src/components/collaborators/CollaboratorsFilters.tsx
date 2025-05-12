
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSkillContext } from "@/context/SkillContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CollaboratorsFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  teamFilter: string;
  setTeamFilter: (teamId: string) => void;
  roleFilter: string;
  setRoleFilter: (roleId: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CollaboratorsFilters = ({
  searchTerm,
  setSearchTerm,
  teamFilter,
  setTeamFilter,
  roleFilter,
  setRoleFilter,
  selectedDate,
  setSelectedDate,
  activeTab,
  setActiveTab,
}: CollaboratorsFiltersProps) => {
  const { teams, functionRoles } = useSkillContext();
  
  const formatMonthYear = (date: Date) => {
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="current">Avaliação Atual</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo Mensal</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start sm:w-auto text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatMonthYear(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as equipes</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as funções</SelectItem>
              {functionRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorsFilters;
