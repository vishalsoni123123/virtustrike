
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import type { Game, User } from "@backend/schema";
import { useEffect, useState } from "react";

export default function GameDetail() {
  const params = useParams<{ id: string }>();
  const gameId = parseInt(params.id);
  const [, setLocation] = useLocation();
  const [videoPlaying, setVideoPlaying] = useState(true);

  // Game video URLs - in a real app, these would come from your database
  const gameVideos: Record<number, string> = {
    1: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Zombie Apocalypse
    2: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Space Explorer  
    3: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Medieval Quest
    4: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Future Racing
    5: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Cyber Arena
    6: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Island Escape
  };

  // Game stories - in a real app, these would come from your database
  const gameStories: Record<number, string> = {
    1: "Zombie Apocalypse is an intense 4v4 multiplayer VR experience where teams compete to survive waves of undead hordes. With realistic weapons and environmental interactions, players must work together to barricade, defend, and complete objectives while the zombie threat escalates. This game offers a perfect blend of cooperative strategy and heart-pounding action.",
    2: "Space Explorer puts you in command of an interstellar vessel with up to 6 crew members working together. Navigate through zero gravity environments, conduct repairs on your ship, and explore mysterious alien structures. Each player has a specialized role, making teamwork essential for mission success in this immersive multiplayer experience.",
    3: "Medieval Quest transports players to a richly detailed fantasy world where teams of 2-8 adventurers embark on epic quests. Wield magic, swords, and bows as you face mythical creatures and solve ancient puzzles. The game features different character classes and progression systems, encouraging repeated play with different strategies.",
    4: "Future Racing is a high-octane VR racing experience where up to 6 players can compete simultaneously on futuristic tracks. Master anti-gravity vehicles, deploy tactical weapons, and find shortcuts through neon-lit cityscapes. With customizable vehicles and multiple racing modes, it offers endless competitive fun.",
    5: "Cyber Arena is a team-based 4v4 competitive game set in a digital battleground. Players choose from specialized character classes with unique abilities to capture objectives and outmaneuver opponents. Strategic coordination is essential as teams must balance offense and defense while adapting to a constantly changing battlefield.",
    6: "Island Escape challenges 2-6 players to work together to solve intricate puzzles and escape a mysterious tropical island before time runs out. Players must communicate effectively to decode clues, find hidden objects, and overcome environmental challenges. With procedurally generated elements, each escape attempt offers a fresh challenge.",
  };

  const { data: game, isLoading: isLoadingGame } = useQuery<Game>({
    queryKey: [`/api/games/${gameId}`],
    enabled: !isNaN(gameId),
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/profile"],
  });

  const handleBookClick = () => {
    if (!user) {
      setLocation("/auth");
    } else {
      setLocation(`/booking?gameId=${gameId}`);
    }
  };

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  if (isLoadingGame) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <Button className="mt-4" onClick={() => setLocation("/games")}>
          Back to Games
        </Button>
      </div>
    );
  }

  return (
    <div className="container space-y-8 py-8">
      {/* Video Section */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {gameVideos[game.id] ? (
          <iframe
            width="100%"
            height="100%"
            src={`${gameVideos[game.id]}?autoplay=${videoPlaying ? 1 : 0}&mute=1`}
            title={`${game.name} gameplay video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={game.imageUrl}
              alt={game.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-xl text-white">Video not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold">{game.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{game.minPlayers}-{game.maxPlayers} Players</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Game Story</h2>
            <p className="text-lg leading-relaxed">
              {gameStories[game.id] || game.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Game Description</h2>
            <p className="text-lg leading-relaxed">{game.description}</p>
          </div>
        </div>

        <div>
          <div className="sticky top-24 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Ready to Play?</h2>
            <p className="mb-6 text-muted-foreground">
              Book your session now and experience the thrill of {game.name} with your friends!
            </p>
            <div className="rounded-lg bg-muted p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {game.minPlayers}-{game.maxPlayers} players
                  </span>
                </div>
                <div className="text-lg font-bold">
                  From ₹{game.minPlayers * 500}
                </div>
              </div>
            </div>
            <Button className="w-full" size="lg" onClick={handleBookClick}>
              Book This Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
