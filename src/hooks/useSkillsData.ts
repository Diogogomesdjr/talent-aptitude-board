
import { useState, useEffect } from "react";
import { Skill, SkillCategory } from "@/types/skills";
import { generateId } from "@/utils/skillUtils";

export const useSkillsData = () => {
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem("skills");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const addSkill = (name: string, category: SkillCategory) => {
    const newSkill: Skill = {
      id: generateId(),
      name,
      category
    };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (id: string, name: string, category: SkillCategory) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, name, category } : skill
    ));
  };

  const deleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const getSkill = (id: string) => {
    return skills.find(skill => skill.id === id);
  };

  return {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    getSkill,
  };
};
