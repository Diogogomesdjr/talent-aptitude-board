
import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // This is just a mock implementation
      if (!email || !password) {
        throw new Error("Email e senha são obrigatórios");
      }
      
      // Check if user exists in localStorage (our "database" for now)
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser) {
        throw new Error("Usuário não encontrado");
      }
      
      if (foundUser.password !== password) {
        throw new Error("Senha incorreta");
      }
      
      // Don't store password in the session
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage (session)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!name || !email || !password) {
        throw new Error("Todos os campos são obrigatórios");
      }
      
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email is already registered
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Este email já está cadastrado");
      }
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        password // In a real app, this should be hashed
      };
      
      // Add user to "database"
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      // Login the user
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
