
import { useState, useEffect } from "react";
import { FunctionRole } from "@/types/skills";
import { generateId } from "@/utils/skillUtils";

export const useFunctionRolesData = () => {
  const [functionRoles, setFunctionRoles] = useState<FunctionRole[]>(() => {
    const saved = localStorage.getItem("functionRoles");
    return saved ? JSON.parse(saved) : [
      { id: generateId(), name: "Aplicação", description: "Aplicação prática da habilidade" },
      { id: generateId(), name: "Especificação Técnica", description: "Criação de documentação e especificações técnicas" }
    ];
  });

  useEffect(() => {
    localStorage.setItem("functionRoles", JSON.stringify(functionRoles));
  }, [functionRoles]);

  const addFunctionRole = (name: string, description?: string) => {
    const newRole: FunctionRole = {
      id: generateId(),
      name,
      description
    };
    setFunctionRoles([...functionRoles, newRole]);
  };

  const updateFunctionRole = (id: string, name: string, description?: string) => {
    setFunctionRoles(functionRoles.map(role => 
      role.id === id ? { ...role, name, description } : role
    ));
  };

  const deleteFunctionRole = (id: string) => {
    setFunctionRoles(functionRoles.filter(role => role.id !== id));
  };

  const getFunctionRole = (id: string) => {
    return functionRoles.find(role => role.id === id);
  };

  return {
    functionRoles,
    addFunctionRole,
    updateFunctionRole,
    deleteFunctionRole,
    getFunctionRole,
  };
};
