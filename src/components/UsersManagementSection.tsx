
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Search, UserCog, User, UserPlus, Key, Trash2, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Tipo para usuário
interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  avatar: string;
}

// Componente principal
const UsersManagementSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newUser, setNewUser] = useState<Partial<UserType>>({
    name: "",
    email: "",
    role: "usuário",
    status: "ativo"
  });
  
  // Dados de exemplo - em uma aplicação real, viriam do backend
  const [users, setUsers] = useState<UserType[]>([
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
      lastLogin: new Date().toISOString(),
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
  
  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteUser = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  const handleResetPassword = (user: UserType) => {
    setSelectedUser(user);
    setIsResetPasswordDialogOpen(true);
  };
  
  const handleSaveUserEdit = () => {
    if (selectedUser) {
      setUsers(prev => 
        prev.map(u => u.id === selectedUser.id ? selectedUser : u)
      );
      
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso."
      });
      setIsEditDialogOpen(false);
    }
  };
  
  const handleAddUser = () => {
    const id = Math.random().toString(36).substring(2, 11);
    const newUserComplete = {
      ...newUser,
      id,
      lastLogin: new Date().toISOString(),
      avatar: "/placeholder.svg",
    } as UserType;
    
    setUsers(prev => [...prev, newUserComplete]);
    
    toast({
      title: "Usuário adicionado",
      description: "O novo usuário foi adicionado com sucesso."
    });
    
    setNewUser({
      name: "",
      email: "",
      role: "usuário",
      status: "ativo"
    });
    
    setIsAddDialogOpen(false);
  };
  
  const handleConfirmPasswordReset = () => {
    toast({
      title: "Senha redefinida",
      description: "Um email de redefinição de senha foi enviado para o usuário."
    });
    setIsResetPasswordDialogOpen(false);
  };
  
  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso."
      });
      setIsDeleteDialogOpen(false);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Gerenciamento de Usuários</h2>
        <div className="flex w-full sm:w-auto gap-4">
          <div className="relative flex-1 sm:w-64">
            <Input 
              placeholder="Buscar usuários..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus size={16} className="mr-2" />
            Novo
          </Button>
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
          <div className="min-w-full">
            {/* Visão para desktop */}
            <table className="w-full bg-white rounded-lg overflow-hidden hidden md:table">
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
                          Senha
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Visão para mobile */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredUsers.map(user => (
                <Card key={user.id} className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "ativo" ? "bg-green-100 text-green-800" : 
                        "bg-red-100 text-red-800"
                      }`}>
                        {user.status}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Papel</div>
                        <div className={`px-2 py-1 text-xs rounded-full inline-block mt-1 ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" : 
                          user.role === "gestor" ? "bg-blue-100 text-blue-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {user.role}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Último login</div>
                        <div>{formatDate(user.lastLogin)}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditUser(user)}
                      >
                        <UserCog className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleResetPassword(user)}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Senha
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Dialog para edição de usuário */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
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
                <Input 
                  id="name" 
                  value={selectedUser.name} 
                  onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Papel</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="usuário">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={selectedUser.status} 
                  onValueChange={(value) => setSelectedUser({...selectedUser, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveUserEdit}>Salvar Alterações</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog para adicionar usuário */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback><User size={24} /></AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-name">Nome</Label>
              <Input 
                id="new-name" 
                value={newUser.name} 
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Nome do usuário"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input 
                id="new-email" 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-role">Papel</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger id="new-role">
                  <SelectValue placeholder="Selecione um papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="usuário">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-status">Status</Label>
              <Select 
                value={newUser.status} 
                onValueChange={(value) => setNewUser({...newUser, status: value})}
              >
                <SelectTrigger id="new-status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button 
                onClick={handleAddUser}
                disabled={!newUser.name || !newUser.email}
              >
                Adicionar Usuário
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Dialog para redefinição de senha */}
      {selectedUser && (
        <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
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
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>Cancelar</Button>
                <Button 
                  variant="default" 
                  onClick={handleConfirmPasswordReset}
                >
                  Enviar Email de Redefinição
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Dialog para confirmação de exclusão */}
      {selectedUser && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isto irá remover permanentemente o usuário {selectedUser.name} e remover seus dados do sistema.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UsersManagementSection;
