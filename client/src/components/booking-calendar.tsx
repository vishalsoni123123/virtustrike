import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const TIME_SLOTS = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9;
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export function BookingCalendar() {
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>();
  const [players, setPlayers] = useState<string>("2");
  const { toast } = useToast();

  const handleBook = () => {
    if (!date || !timeSlot) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and time",
      });
      return;
    }

    // Here we would normally make the booking API call
    toast({
      title: "Success",
      description: "Your booking has been confirmed!",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book Your Session</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Input
              type="number"
              min="2"
              max="8"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Total Price</label>
            <p className="text-2xl font-bold">₹{Number(players) * 500}</p>
          </div>

          <Button className="w-full" onClick={handleBook}>
            Book Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
