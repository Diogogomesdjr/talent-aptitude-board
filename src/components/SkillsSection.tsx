
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useSkillContext, SkillCategory } from "@/context/SkillContext";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SkillsSection = () => {
  const { skills, collaborators, addSkill, updateSkill, deleteSkill } = useSkillContext();
  const { toast } = useToast();
  
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Conhecimento");
  const [isAddStepTwo, setIsAddStepTwo] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [editingSkill, setEditingSkill] = useState<{id: string, name: string, category: SkillCategory} | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleAddSkillStepOne = () => {
    if (!newSkillName.trim()) {
      toast({
        title: "Nome da habilidade é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    setIsAddStepTwo(true);
  };

  const handleAddSkillStepTwo = () => {
    addSkill(newSkillName, newSkillCategory);
    
    toast({
      title: "Habilidade adicionada com sucesso!"
    });
    
    setNewSkillName("");
    setNewSkillCategory("Conhecimento");
    setIsAddStepTwo(false);
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

  const handleDialogClose = () => {
    setIsAddStepTwo(false);
    setNewSkillName("");
    setNewSkillCategory("Conhecimento");
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Habilidades</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>Adicionar Habilidade</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isAddStepTwo ? "Selecione a Categoria" : "Adicionar Nova Habilidade"}
              </DialogTitle>
            </DialogHeader>
            {!isAddStepTwo ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Nome da habilidade"
                  />
                </div>
                <Button onClick={handleAddSkillStepOne} className="w-full">
                  Próximo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p>Habilidade: <strong>{newSkillName}</strong></p>
                <RadioGroup 
                  value={newSkillCategory} 
                  onValueChange={(value) => setNewSkillCategory(value as SkillCategory)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Conhecimento" id="conhecimento" />
                    <Label htmlFor="conhecimento">Conhecimento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="HardSkill" id="hardskill" />
                    <Label htmlFor="hardskill">Hard Skill</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SoftSkill" id="softskill" />
                    <Label htmlFor="softskill">Soft Skill</Label>
                  </div>
                </RadioGroup>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddStepTwo(false)}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleAddSkillStepTwo} 
                    className="flex-1"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => {
          const usageCount = getSkillUsage(skill.id);
          
          return (
            <Card key={skill.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingSkill(skill);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-gray-50">
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
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Nenhuma habilidade adicionada.</p>
            <Button 
              variant="link" 
              onClick={() => setIsDialogOpen(true)}
              className="mt-2"
            >
              Adicionar uma habilidade
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Habilidade</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome</Label>
              <Input
                id="edit-name"
                value={editingSkill?.name || ""}
                onChange={(e) => setEditingSkill(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="Nome da habilidade"
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <RadioGroup 
                value={editingSkill?.category || "Conhecimento"} 
                onValueChange={(value) => setEditingSkill(prev => prev ? {...prev, category: value as SkillCategory} : null)}
                className="space-y-3 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Conhecimento" id="edit-conhecimento" />
                  <Label htmlFor="edit-conhecimento">Conhecimento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HardSkill" id="edit-hardskill" />
                  <Label htmlFor="edit-hardskill">Hard Skill</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SoftSkill" id="edit-softskill" />
                  <Label htmlFor="edit-softskill">Soft Skill</Label>
                </div>
              </RadioGroup>
            </div>
            <Button onClick={handleEditSkill} className="w-full">
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillsSection;
