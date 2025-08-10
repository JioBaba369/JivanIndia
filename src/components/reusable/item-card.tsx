
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ItemCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="flex flex-grow flex-col p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2 flex-grow" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-5/6" />
        </div>
      </CardContent>
    </Card>
  );
}
