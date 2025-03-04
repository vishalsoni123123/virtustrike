import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export default function Nav() {
  const [location] = useLocation();
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/profile"],
  });

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href="/">
          <a className="text-2xl font-bold text-primary">VirtuStrike</a>
        </Link>
        <div className="ml-auto flex gap-4">
          <Link href="/games">
            <Button variant={location === "/games" ? "default" : "ghost"}>
              Games
            </Button>
          </Link>
          <Link href="/booking">
            <Button variant={location === "/booking" ? "default" : "ghost"}>
              Book Now
            </Button>
          </Link>
          {user ? (
            <Link href="/profile">
              <Button variant={location === "/profile" ? "default" : "ghost"}>
                My Profile
              </Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button variant="secondary">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}