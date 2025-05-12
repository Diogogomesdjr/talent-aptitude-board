
interface NoInsightsFoundProps {
  message: string;
}

const NoInsightsFound = ({ message }: NoInsightsFoundProps) => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default NoInsightsFound;
