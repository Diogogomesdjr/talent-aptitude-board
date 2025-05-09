
import { useState, useEffect } from "react";
import { Team } from "@/types/skills";
import { generateId } from "@/utils/skillUtils";

export const useTeamsData = () => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem("teams");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: generateId(),
      name
    };
    setTeams([...teams, newTeam]);
  };

  const updateTeam = (id: string, name: string) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, name } : team
    ));
  };

  const deleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  const getTeam = (id: string) => {
    return teams.find(team => team.id === id);
  };

  return {
    teams,
    addTeam,
    updateTeam,
    deleteTeam,
    getTeam,
  };
};
