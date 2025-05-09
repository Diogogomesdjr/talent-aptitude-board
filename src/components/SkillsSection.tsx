
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext } from "@/context/SkillContext";
import { Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skill, SkillCategory } from "@/types/skills";

const SkillsSection = () => {
  const { skills, collaborators, addSkill, updateSkill, deleteSkill } = useSkillContext();
  const { toast } = useToast();
  
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Conhecimento");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast({
        title: "Nome da habilidade é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    addSkill(newSkillName, newSkillCategory);
    
    toast({
      title: "Habilidade adicionada com sucesso!"
    });
    
    setNewSkillName("");
    setNewSkillCategory("Conhecimento");
    setIsDialogOpen(false);
  };

  const handleEditSkill = () => {
    if (!editingSkill || !editingSkill.name.trim()) {
      toast({
        title: "Nome da habilidade é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    updateSkill(editingSkill.id, editingSkill.name, editingSkill.category);
    
    toast({
      title: "Habilidade atualizada com sucesso!"
    });
    
    setEditingSkill(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteSkill = (id: string) => {
    const skillUsage = getSkillUsage(id);
    
    if (skillUsage > 0) {
      toast({
        title: `Essa habilidade está sendo usada por ${skillUsage} colaborador(es)`,
        description: "Remova primeiro a habilidade dos colaboradores antes de excluí-la.",
        variant: "destructive"
      });
      return;
    }
    
    deleteSkill(id);
    toast({
      title: "Habilidade excluída com sucesso!"
    });
  };

  const getSkillUsage = (skillId: string) => {
    return collaborators.filter(collab => 
      Object.keys(collab.skills).includes(skillId)
    ).length;
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Habilidades</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          Adicionar Habilidade
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => {
          const usageCount = getSkillUsage(skill.id);
          
          return (
            <Card key={skill.id} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingSkill(skill);
                        setIsEditDialogOpen(true);
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSkill(skill.id)}
                      className="hover:bg-gray-100"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`
                    ${skill.category === 'Conhecimento' ? 'bg-blue-50 text-blue-700' : ''}
                    ${skill.category === 'HardSkill' ? 'bg-green-50 text-green-700' : ''}
                    ${skill.category === 'SoftSkill' ? 'bg-purple-50 text-purple-700' : ''}
                  `}>
                    {skill.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Utilizada por {usageCount} colaborador{usageCount === 1 ? '' : 'es'}
                </p>
              </CardContent>
            </Card>
          );
        })}
        
        {skills.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-3">Nenhuma habilidade adicionada.</p>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Adicionar uma habilidade
            </Button>
          </div>
        )}
      </div>
      
      {/* Modal para adicionar nova habilidade */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Habilidade</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para adicionar uma nova habilidade.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Nome da habilidade"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="block mb-2">Categoria</Label>
              <RadioGroup 
                value={newSkillCategory} 
                onValueChange={(value) => setNewSkillCategory(value as SkillCategory)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="Conhecimento" id="conhecimento" />
                  <Label htmlFor="conhecimento" className="cursor-pointer flex-1">Conhecimento</Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="HardSkill" id="hardskill" />
                  <Label htmlFor="hardskill" className="cursor-pointer flex-1">Hard Skill</Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="SoftSkill" id="softskill" />
                  <Label htmlFor="softskill" className="cursor-pointer flex-1">Soft Skill</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleAddSkill} 
                className="w-full"
              >
                Adicionar Habilidade
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modal para editar habilidade */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Habilidade</DialogTitle>
            <DialogDescription>
              Atualize as informações da habilidade abaixo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editingSkill?.name || ""}
                onChange={(e) => setEditingSkill(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="Nome da habilidade"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="block mb-2">Categoria</Label>
              <RadioGroup 
                value={editingSkill?.category || "Conhecimento"} 
                onValueChange={(value) => setEditingSkill(prev => prev ? {...prev, category: value as SkillCategory} : null)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="Conhecimento" id="edit-conhecimento" />
                  <Label htmlFor="edit-conhecimento" className="cursor-pointer flex-1">Conhecimento</Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="HardSkill" id="edit-hardskill" />
                  <Label htmlFor="edit-hardskill" className="cursor-pointer flex-1">Hard Skill</Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-gray-50">
                  <RadioGroupItem value="SoftSkill" id="edit-softskill" />
                  <Label htmlFor="edit-softskill" className="cursor-pointer flex-1">Soft Skill</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleEditSkill} className="w-full">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsSection;
