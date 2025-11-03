import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, changeType, icon: Icon }: StatsCardProps) {
  const changeColor = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-muted-foreground",
  }[changeType];

  return (
    <Card className="pet-card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-roboto font-medium text-muted-foreground">
                {title}
              </p>
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-poppins font-bold text-foreground">
              {value}
            </p>
            <p className={`text-sm font-roboto ${changeColor}`}>
              {change} vs mes anterior
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}