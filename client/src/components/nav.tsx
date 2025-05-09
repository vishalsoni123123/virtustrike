import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export default function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between py-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold">
          VirtuStrike
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/games" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Games
          </Link>
          <Link href="/booking" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Book Now
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/profile">
              <Button variant="outline">Profile</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>Logout</Button>
          </>
        ) : (
          <Link href="/auth">
            <Button variant="outline">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}