
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ElementType } from "react";

interface IconData {
  type: ElementType;
  props: {
    className: string;
  };
}

interface InsightDetail {
  type: string;
  description: string;
  score: number;
  icon: IconData;
  details?: string[];
}

interface CollaboratorInsightCardProps {
  collaboratorId: string;
  collaboratorName: string;
  teamName?: string;
  insights: InsightDetail[];
}

const CollaboratorInsightCard = ({
  collaboratorId,
  collaboratorName,
  teamName,
  insights,
}: CollaboratorInsightCardProps) => {
  return (
    <Card key={collaboratorId} className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-2">
        <CardTitle>{collaboratorName}</CardTitle>
        <CardDescription>
          {teamName && `Equipe: ${teamName} • `}
          {insights.length} insight{insights.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon.type;
            
            return (
              <div key={index} className="p-2 bg-gray-50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <IconComponent {...insight.icon.props} />
                    <div>
                      <p className="font-medium">{insight.type}</p>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium">{insight.score.toFixed(1)}</span>
                  </div>
                </div>
                {insight.details && insight.details.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Detalhes:</p>
                    <div className="flex flex-wrap gap-1">
                      {insight.details.map((detail, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{detail}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaboratorInsightCard;
