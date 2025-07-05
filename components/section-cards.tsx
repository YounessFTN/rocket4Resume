import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type Card = {
  title: string;
  number: number;
  tag: number;
  description_tag: string;
  description: string;
};
export function SectionCards({ cards }: { cards: Card[] }) {
  const getTagIcon = (tag: number) => {
    if (tag > 0) return <IconTrendingUp className="size-4" />;
    if (tag < 0) return <IconTrendingDown className="size-4" />;
    return null;
  };

  const getTagDisplay = (tag: number) => {
    if (tag > 0) return `+${tag}%`;
    if (tag < 0) return `${tag}%`;
    return `${tag}%`;
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.number}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="flex items-center gap-1">
                {getTagIcon(card.tag)}
                {getTagDisplay(card.tag)}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.description_tag}{" "}
              {getTagIcon(card.tag) && (
                <span className="size-4">{getTagIcon(card.tag)}</span>
              )}
            </div>
            <div className="text-muted-foreground">{card.description}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
