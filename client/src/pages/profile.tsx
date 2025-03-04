
import { useEffect } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Booking } from "@shared/schema";
import { useAuth } from "@/contexts/auth-context";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ["/api/user/bookings"],
    enabled: !!user,
  });

  useEffect(() => {
    // Redirect to auth page if not logged in
    if (!isLoading && !user) {
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and bookings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Username</div>
                <div>{user.username}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{user.phoneNumber}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!bookings || bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings yet</p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Game Session</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.date), "PPP p")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {booking.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Team Size: {booking.teamSize} players
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{booking.totalAmount}</p>
                        <span className={`text-sm ${booking.isPaid ? 'text-green-500' : 'text-orange-500'}`}>
                          {booking.isPaid ? 'Paid' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
