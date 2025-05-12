
import { useState } from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { SkillProvider } from "@/context/SkillContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Users, BarChart, TrendingUp, Briefcase, UserCog } from "lucide-react";
import CollaboratorsSection from "@/components/collaborators/CollaboratorsSection";
import TeamsSection from "@/components/TeamsSection";
import SkillsSection from "@/components/SkillsSection";
import RecognitionSection from "@/components/RecognitionSection";
import InsightsSection from "@/components/InsightsSection";
import FunctionRolesSection from "@/components/FunctionRolesSection";
import UsersManagementSection from "@/components/UsersManagementSection";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("collaborators");
  const { user, logout } = useAuth();

  const renderSection = () => {
    switch (activeSection) {
      case "collaborators":
        return <CollaboratorsSection />;
      case "teams":
        return <TeamsSection />;
      case "skills":
        return <SkillsSection />;
      case "recognition":
        return <RecognitionSection />;
      case "insights":
        return <InsightsSection />;
      case "functionRoles":
        return <FunctionRolesSection />;
      case "users":
        return <UsersManagementSection />;
      default:
        return <CollaboratorsSection />;
    }
  };

  return (
    <SkillProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen bg-gray-50">
          <Sidebar className="border-r">
            <SidebarHeader className="border-b">
              <h1 className="text-xl font-bold py-4 px-4">Matriz de Habilidades</h1>
              <div className="w-full flex items-center justify-between p-4 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Sair">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("collaborators")} 
                    isActive={activeSection === "collaborators"}
                    className="w-full text-left"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    <span>Colaboradores</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("teams")} 
                    isActive={activeSection === "teams"}
                    className="w-full text-left"
                  >
                    <User className="mr-2 h-5 w-5" />
                    <span>Equipes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("skills")} 
                    isActive={activeSection === "skills"}
                    className="w-full text-left"
                  >
                    <BarChart className="mr-2 h-5 w-5" />
                    <span>Habilidades</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("functionRoles")} 
                    isActive={activeSection === "functionRoles"}
                    className="w-full text-left"
                  >
                    <Briefcase className="mr-2 h-5 w-5" />
                    <span>Funções</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("recognition")} 
                    isActive={activeSection === "recognition"}
                    className="w-full text-left"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    <span>Reconhecimento</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("insights")} 
                    isActive={activeSection === "insights"}
                    className="w-full text-left"
                  >
                    <BarChart className="mr-2 h-5 w-5" />
                    <span>Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("users")} 
                    isActive={activeSection === "users"}
                    className="w-full text-left"
                  >
                    <UserCog className="mr-2 h-5 w-5" />
                    <span>Gerenciar Usuários</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {renderSection()}
          </div>
        </div>
      </SidebarProvider>
    </SkillProvider>
  );
};

export default Dashboard;
