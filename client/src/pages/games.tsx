import { useQuery } from "@tanstack/react-query";
import { GameCard } from "@/components/game-card";
import type { Game } from "@shared/schema";

export default function Games() {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[400px] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Our Games</h1>
        <p className="mt-2 text-muted-foreground">
          Choose from our selection of immersive VR experiences
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
