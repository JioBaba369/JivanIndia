
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  trend: ReactNode;
}

export default function AnalyticsCard({ title, value, change, icon, trend }: AnalyticsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {trend}
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
