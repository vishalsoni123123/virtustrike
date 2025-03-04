import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";

import Nav from "./components/nav";
import Home from "./pages/home";
import Games from "./pages/games";
import Booking from "./pages/booking";
import Profile from "./pages/profile";
import Auth from "./pages/auth";
import { AuthProvider } from "./contexts/auth-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      queryFn: async ({ queryKey }) => {
        if (typeof queryKey[0] === "string" && queryKey[0].startsWith("/")) {
          const res = await fetch(queryKey[0] as string);
          if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
          }
          return res.json();
        }
        throw new Error(`Invalid QueryKey: ${queryKey[0]}`);
      },
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Nav />
          <main className="py-8">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/games" component={Games} />
              <Route path="/booking" component={Booking} />
              <Route path="/profile" component={Profile} />
              <Route path="/auth" component={Auth} />
            </Switch>
          </main>
          <footer className="border-t py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} VirtuStrike. All rights reserved.
          </footer>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}