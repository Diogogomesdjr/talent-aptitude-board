
import React, { useState } from "react";
import { useSkillContext } from "@/context/SkillContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";

interface ImprovementOpportunitiesSectionProps {
  collaboratorId: string;
  initialValues?: {
    hardSkills?: string;
    softSkills?: string;
    nextChallenges?: string;
  };
}

const ImprovementOpportunitiesSection = ({
  collaboratorId,
  initialValues
}: ImprovementOpportunitiesSectionProps) => {
  const { updateImprovementOpportunities } = useSkillContext();
  const { toast } = useToast();
  
  const [hardSkills, setHardSkills] = useState(initialValues?.hardSkills || "");
  const [softSkills, setSoftSkills] = useState(initialValues?.softSkills || "");
  const [nextChallenges, setNextChallenges] = useState(initialValues?.nextChallenges || "");
  
  const handleSave = () => {
    updateImprovementOpportunities(collaboratorId, {
      hardSkills,
      softSkills,
      nextChallenges
    });
    
    toast({
      title: "Oportunidades de melhoria salvas",
      description: "As informações foram atualizadas com sucesso."
    });
  };
  
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-md border">
      <h3 className="text-md font-medium">Oportunidades de Melhoria</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="hardSkills">Hard Skills para Desenvolver</Label>
          <Textarea 
            id="hardSkills"
            value={hardSkills}
            onChange={(e) => setHardSkills(e.target.value)}
            placeholder="Exemplo: Python avançado, AWS, Data Analysis..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="softSkills">Soft Skills para Desenvolver</Label>
          <Textarea 
            id="softSkills"
            value={softSkills}
            onChange={(e) => setSoftSkills(e.target.value)}
            placeholder="Exemplo: Liderança, comunicação, gestão de tempo..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="nextChallenges">Próximos Desafios</Label>
          <Textarea 
            id="nextChallenges"
            value={nextChallenges}
            onChange={(e) => setNextChallenges(e.target.value)}
            placeholder="Exemplo: Liderar projeto X, aprender tecnologia Y..."
            className="mt-1"
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          className="flex gap-2 items-center"
        >
          <Save size={16} />
          Salvar Oportunidades
        </Button>
      </div>
    </div>
  );
};

export default ImprovementOpportunitiesSection;
