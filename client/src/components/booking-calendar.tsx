
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Game } from "@shared/schema";

const LOCATIONS = [
  { id: "mumbai", name: "Mumbai - Andheri West" },
  { id: "bangalore", name: "Bangalore - Indiranagar" },
  { id: "delhi", name: "Delhi - Connaught Place" },
];

const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:30 AM - 11:30 AM",
  "12:00 PM - 01:00 PM",
  "01:30 PM - 02:30 PM",
  "03:00 PM - 04:00 PM",
  "04:30 PM - 05:30 PM",
  "06:00 PM - 07:00 PM",
  "07:30 PM - 08:30 PM",
];

const LOCATIONS = [
  { id: "malad", name: "Malad West" },
  { id: "andheri", name: "Andheri East" },
  { id: "bandra", name: "Bandra West" },
  { id: "thane", name: "Thane" },
  { id: "powai", name: "Powai" },
];

export function BookingCalendar() {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>();
  const [players, setPlayers] = useState<string>("2");
  const [location, setLocation] = useState<string>();
  const [gameId, setGameId] = useState<string>();
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    queryFn: async () => {
      const response = await fetch('/api/games', {
        headers: {
          'X-Username': localStorage.getItem('username') || ''
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      return response.json();
    }
  });

  const handleBook = async () => {
    if (!date || !timeSlot || !location || !gameId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a game, date, time, and location",
      });
      return;
    }

    setIsBooking(true);

    try {
      // Here we would make the booking API call
      const bookingDateTime = new Date(date);
      // Check if timeSlot is properly formatted
      if (!timeSlot) {
        throw new Error("Time slot is required");
      }
      
      // Parse time from the format "09:00 AM - 10:00 AM" to get hours and minutes
      const timeSlotStart = timeSlot.split(' - ')[0]; // "09:00 AM"
      const [timeComponent, ampm] = timeSlotStart.split(' '); // ["09:00", "AM"]
      const [hours, minutes] = timeComponent.split(':'); // ["09", "00"]
      
      // Calculate hours in 24-hour format
      let hoursValue = parseInt(hours);
      if (ampm === 'PM' && hoursValue !== 12) {
        hoursValue += 12;
      } else if (ampm === 'AM' && hoursValue === 12) {
        hoursValue = 0;
      }
      
      bookingDateTime.setHours(hoursValue, parseInt(minutes));
      
      const bookingData = {
        userId: 1, // This should come from auth context in a real app
        gameId: parseInt(gameId),
        date: bookingDateTime.toISOString(),
        teamSize: parseInt(players),
        totalAmount: parseInt(players) * 500, // Basic pricing
        isPaid: false,
        location: location,
        status: 'pending'
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Username': localStorage.getItem('username') || '' // Add username from localStorage if available
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
      }
      
      const result = await response.json();
      console.log("Booking created:", result);

      toast({
        title: "Success",
        description: "Your booking has been confirmed!",
      });
      
      // Redirect to profile page after successful booking
      setTimeout(() => {
        window.location.href = '/profile';
      }, 2000);
      
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to complete booking. Please try again.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
          <CardDescription>Choose your preferred date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
          />
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Complete your booking information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Game</label>
                <Select value={gameId} onValueChange={setGameId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games?.map((game) => (
                      <SelectItem key={game.id} value={game.id.toString()}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Slot</label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Players</label>
                <Select value={players} onValueChange={setPlayers}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select players" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "player" : "players"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {players} {parseInt(players) === 1 ? "player" : "players"}
                    </span>
                  </div>
                  <div className="text-lg font-bold">
                    ₹{parseInt(players) * 500}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleBook} 
                disabled={isBooking || !date || !timeSlot || !location || !gameId}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Book Now'
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
