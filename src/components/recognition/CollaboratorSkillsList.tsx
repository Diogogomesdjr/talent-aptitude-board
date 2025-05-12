
import SkillItem from "./SkillItem";
import { Skill } from "@/context/SkillContext";

interface CollaboratorSkillsListProps {
  skills: Array<Skill & { 
    rating: number | "N/A";
    isApt: boolean;
  }>;
}

const CollaboratorSkillsList = ({ skills }: CollaboratorSkillsListProps) => {
  if (skills.length === 0) {
    return <p className="text-gray-500">Nenhuma habilidade atribuída.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {skills.map(skill => (
        <SkillItem key={skill.id} skill={skill} />
      ))}
    </div>
  );
};

export default CollaboratorSkillsList;
