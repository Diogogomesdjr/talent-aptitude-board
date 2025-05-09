
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CollaboratorsSection from "@/components/CollaboratorsSection";
import TeamsSection from "@/components/TeamsSection";
import SkillsSection from "@/components/SkillsSection";
import RecognitionSection from "@/components/RecognitionSection";
import { SkillProvider } from "@/context/SkillContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("collaborators");
  
  return (
    <SkillProvider>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Matriz de Habilidades</h1>
        
        <Tabs 
          defaultValue="collaborators" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="collaborators">Colaboradores</TabsTrigger>
            <TabsTrigger value="teams">Equipes</TabsTrigger>
            <TabsTrigger value="skills">Habilidades</TabsTrigger>
            <TabsTrigger value="recognition">Reconhecimento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collaborators">
            <CollaboratorsSection />
          </TabsContent>
          
          <TabsContent value="teams">
            <TeamsSection />
          </TabsContent>
          
          <TabsContent value="skills">
            <SkillsSection />
          </TabsContent>
          
          <TabsContent value="recognition">
            <RecognitionSection />
          </TabsContent>
        </Tabs>
      </div>
    </SkillProvider>
  );
};

export default Index;
