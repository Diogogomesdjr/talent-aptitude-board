
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSkillContext } from "@/context/SkillContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border mb-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="current">Avaliação Atual</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={teamFilter} onValueChange={setTeamFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por equipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as equipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as funções</SelectItem>
            {functionRoles.map((role) => (
              <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="justify-start"
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
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CollaboratorsFilters;
