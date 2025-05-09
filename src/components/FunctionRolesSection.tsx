
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Edit, Trash2 } from "lucide-react";

const FunctionRolesSection = () => {
  const { functionRoles, collaborators, addFunctionRole, updateFunctionRole, deleteFunctionRole } = useSkillContext();
  const { toast } = useToast();
  
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [editingRole, setEditingRole] = useState<{id: string, name: string, description?: string} | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Nome da função é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    addFunctionRole(newRoleName, newRoleDescription);
    
    toast({
      title: "Função adicionada com sucesso!"
    });
    
    resetForm();
  };

  const resetForm = () => {
    setNewRoleName("");
    setNewRoleDescription("");
    setIsDialogOpen(false);
  };

  const handleEditRole = () => {
    if (!editingRole || !editingRole.name.trim()) {
      toast({
        title: "Nome da função é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    updateFunctionRole(editingRole.id, editingRole.name, editingRole.description);
    
    toast({
      title: "Função atualizada com sucesso!"
    });
    
    setEditingRole(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    deleteFunctionRole(id);
    toast({
      title: "Função excluída com sucesso!"
    });
  };

  const getRoleUsage = (roleId: string) => {
    return collaborators.filter(collab => collab.functionRoleId === roleId).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Funções</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Função</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Função</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Nome da função"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Descrição da função"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddRole} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {functionRoles.map((role) => {
          const usageCount = getRoleUsage(role.id);
          
          return (
            <Card key={role.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{role.name}</h3>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingRole(role);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteRole(role.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                {role.description && (
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Atribuída a {usageCount} colaborador{usageCount === 1 ? '' : 'es'}
                </p>
              </CardContent>
            </Card>
          );
        })}
        
        {functionRoles.length === 0 && (
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma função adicionada.</p>
            <Button 
              variant="link" 
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              Adicionar uma função
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Função</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editingRole?.name || ""}
                onChange={(e) => setEditingRole(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="Nome da função"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição (opcional)</Label>
              <Textarea
                id="edit-description"
                value={editingRole?.description || ""}
                onChange={(e) => setEditingRole(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="Descrição da função"
                rows={3}
              />
            </div>
            <Button onClick={handleEditRole} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FunctionRolesSection;
