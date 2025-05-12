
const RecognitionRules = () => {
  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <p className="mb-2"><strong>Regras de Reconhecimento:</strong></p>
      <ul className="list-disc list-inside space-y-2">
        <li>Colaboradores com <strong>mais de 75% de aptidão</strong> nas habilidades são elegíveis para reconhecimento.</li>
        <li>Colaboradores com <strong>todas as habilidades entre níveis 4 e 5</strong> são considerados de Alto Potencial.</li>
        <li>A aptidão é medida pela capacidade de executar tarefas de forma independente, ensinar ou ser referência em uma habilidade.</li>
        <li>Colaboradores com <strong>menos de 50% de aptidão</strong> podem precisar de atenção e desenvolvimento adicional.</li>
      </ul>
    </div>
  );
};

export default RecognitionRules;
