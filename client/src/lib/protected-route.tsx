import { useQuery } from "@tanstack/react-query";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";
import type { User } from "@shared/schema";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user/profile"],
  });

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : user ? (
        <Component />
      ) : (
        <Redirect to="/auth" />
      )}
    </Route>
  );
}
