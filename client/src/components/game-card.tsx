import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Game } from "@shared/schema";
import { Link } from "wouter";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={game.imageUrl}
          alt={game.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{game.description}</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{game.minPlayers}-{game.maxPlayers} Players</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/booking">
          <Button className="w-full">Book Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
