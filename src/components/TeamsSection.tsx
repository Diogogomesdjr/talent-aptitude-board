
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Flag } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TeamsSection = () => {
  const { teams, collaborators, addTeam, updateTeam, deleteTeam } = useSkillContext();
  const { toast } = useToast();
  
  const [newTeamName, setNewTeamName] = useState("");
  const [editingTeam, setEditingTeam] = useState<{id: string, name: string} | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Nome da equipe é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    addTeam(newTeamName);
    
    toast({
      title: "Equipe adicionada com sucesso!"
    });
    
    setNewTeamName("");
    setIsAddDialogOpen(false);
  };

  const handleEditTeam = () => {
    if (!editingTeam || !editingTeam.name.trim()) {
      toast({
        title: "Nome da equipe é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    updateTeam(editingTeam.id, editingTeam.name);
    
    toast({
      title: "Equipe atualizada com sucesso!"
    });
    
    setEditingTeam(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTeam = (id: string) => {
    deleteTeam(id);
    toast({
      title: "Equipe excluída com sucesso!"
    });
  };

  const getTeamMembers = (teamId: string) => {
    return collaborators.filter(collab => collab.teamId === teamId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Equipes</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Equipe</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Equipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Nome da equipe"
                />
              </div>
              <Button onClick={handleAddTeam} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const members = getTeamMembers(team.id);
          const pontoFocal = members.find(member => member.isPontoCentral);
          
          return (
            <Card key={team.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingTeam(team);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <Badge className="w-fit mt-2">
                  {members.length} colaboradores
                </Badge>
              </CardHeader>
              <CardContent className="p-4">
                {members.length > 0 ? (
                  <div className="space-y-4">
                    {pontoFocal && (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Flag size={16} className="text-blue-500" />
                          <h4 className="font-medium">Ponto Focal</h4>
                        </div>
                        <div className="flex items-center gap-2 mt-2 pl-6">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={pontoFocal.photoUrl} alt={pontoFocal.name} />
                            <AvatarFallback>{pontoFocal.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{pontoFocal.name}</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Membros da Equipe</h4>
                      <div className="space-y-2">
                        {members.filter(m => m.id !== pontoFocal?.id).map(member => (
                          <div key={member.id} className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.photoUrl} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum colaborador nesta equipe.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {teams.length === 0 && (
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma equipe adicionada.</p>
            <Button 
              variant="link" 
              onClick={() => setIsAddDialogOpen(true)}
              className="mt-2"
            >
              Adicionar uma equipe
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Equipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                value={editingTeam?.name || ""}
                onChange={(e) => setEditingTeam(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="Nome da equipe"
              />
            </div>
            <Button onClick={handleEditTeam} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamsSection;
