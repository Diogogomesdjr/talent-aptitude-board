
interface NoCollaboratorsFoundProps {
  message?: string;
}

const NoCollaboratorsFound = ({ message }: NoCollaboratorsFoundProps) => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-500">
        {message || "Nenhum colaborador encontrado para os critérios selecionados."}
      </p>
    </div>
  );
};

export default NoCollaboratorsFound;
