import { BookingCalendar } from "@/components/booking-calendar";

export default function Booking() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Book Your Session</h1>
        <p className="mt-2 text-muted-foreground">
          Select your preferred date and time
        </p>
      </div>

      <BookingCalendar />
    </div>
  );
}
