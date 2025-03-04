import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Booking, User } from "@shared/schema";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user/profile"],
  });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/user/bookings"],
  });

  if (userLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account and view your bookings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><span className="font-medium">Username:</span> {user?.username}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Phone:</span> {user?.phoneNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings?.length === 0 ? (
                <p className="text-muted-foreground">No bookings yet</p>
              ) : (
                bookings?.map((booking) => (
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
                    {!booking.isPaid && (
                      <Button className="mt-4 w-full" variant="outline">
                        Complete Payment
                      </Button>
                    )}
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
