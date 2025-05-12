
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserCog, User, Key } from "lucide-react";

// Esta componente seria conectada a uma API real em produção.
// Por enquanto, usamos dados de exemplo.
const UsersManagementSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Dados de exemplo - em uma aplicação real, viriam do backend
  const [users] = useState([
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      lastLogin: "2023-05-10T14:30:00Z",
      status: "ativo",
      avatar: "/placeholder.svg"
    },
    {
      id: "2",
      name: user?.name || "Current User", 
      email: user?.email || "user@example.com",
      role: "usuário",
      lastLogin: "2023-05-12T09:15:00Z",
      status: "ativo",
      avatar: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Maria Silva",
      email: "maria@example.com",
      role: "gestor",
      lastLogin: "2023-05-08T11:20:00Z",
      status: "ativo",
      avatar: "/placeholder.svg"
    },
    {
      id: "4",
      name: "João Souza",
      email: "joao@example.com",
      role: "usuário",
      lastLogin: "2023-05-01T08:45:00Z",
      status: "inativo",
      avatar: "/placeholder.svg"
    }
  ]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleResetPassword = (user: any) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  const handleSaveUserEdit = () => {
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas com sucesso."
    });
    setIsEditDialogOpen(false);
  };
  
  const handleConfirmPasswordReset = () => {
    toast({
      title: "Senha redefinida",
      description: "Um email de redefinição de senha foi enviado para o usuário."
    });
    setIsResetPasswordDialogOpen(false);
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
        <div className="relative w-64">
          <Input 
            placeholder="Buscar usuários..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        </div>
      </div>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <p>Esta é uma visão de demonstração. Em uma aplicação real, os dados seriam carregados de um banco de dados com autenticação apropriada.</p>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-4 px-6 text-left">Usuário</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Papel</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Último login</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "admin" ? "bg-purple-100 text-purple-800" : 
                      user.role === "gestor" ? "bg-blue-100 text-blue-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "ativo" ? "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">{formatDate(user.lastLogin)}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetPassword(user)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Redefinir senha
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Dialog para edição de usuário */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={selectedUser.name} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={selectedUser.email} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <select 
                  id="role" 
                  defaultValue={selectedUser.role}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="admin">Administrador</option>
                  <option value="gestor">Gestor</option>
                  <option value="usuário">Usuário</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  defaultValue={selectedUser.status}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              
              <Button onClick={handleSaveUserEdit} className="w-full">Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog para redefinição de senha */}
      {selectedUser && (
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Redefinir Senha</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="mb-4">Você está prestes a enviar um email de redefinição de senha para:</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-600">{selectedUser.email}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">O usuário receberá um email com instruções para criar uma nova senha.</p>
              
              <Button 
                variant="default" 
                onClick={handleConfirmPasswordReset}
                className="w-full"
              >
                Enviar Email de Redefinição
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UsersManagementSection;
