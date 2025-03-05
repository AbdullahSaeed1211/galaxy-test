import React from "react";
import { ReactNode } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

interface PdfToolCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  trending?: boolean;
}

export function PdfToolCard({
  icon,
  title,
  description,
  trending,
}: PdfToolCardProps) {
  return (
    <Card className="relative transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      {trending && (
        <div className="absolute z-10 -top-2 -right-2">
          <Badge
            variant="default"
            className={cn(
              "bg-indigo-500 hover:bg-indigo-500",
              "text-white font-medium px-2 py-0.5",
              "animate-pulse-subtle",
              "flex items-center gap-1"
            )}
          >
            <TrendingUp className="w-3 h-3" />
            Trending
          </Badge>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start">
          <div className="p-2 rounded-lg bg-primary/10 mr-4">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Card>
  );
} 