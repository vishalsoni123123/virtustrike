import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import type { Game } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/profile"],
  });

  const handleBookClick = () => {
    if (!user) {
      setLocation("/auth");
    } else {
      setLocation("/booking");
    }
  };

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
        <Button className="w-full" onClick={handleBookClick}>
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}