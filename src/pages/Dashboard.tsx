
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
        <div className="flex w-full min-h-svh">
          <Sidebar>
            <SidebarHeader className="flex flex-col items-start">
              <h1 className="text-xl font-bold py-4 px-2">Matriz de Habilidades</h1>
              <div className="w-full flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={logout}>
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
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Colaboradores</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("teams")} 
                    isActive={activeSection === "teams"}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Equipes</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("skills")} 
                    isActive={activeSection === "skills"}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    <span>Habilidades</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("functionRoles")} 
                    isActive={activeSection === "functionRoles"}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Funções</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("recognition")} 
                    isActive={activeSection === "recognition"}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Reconhecimento</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("insights")} 
                    isActive={activeSection === "insights"}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Insights</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveSection("users")} 
                    isActive={activeSection === "users"}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    <span>Gerenciar Usuários</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 p-6 overflow-y-auto">
            {renderSection()}
          </div>
        </div>
      </SidebarProvider>
    </SkillProvider>
  );
};

export default Dashboard;
