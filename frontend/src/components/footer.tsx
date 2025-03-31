import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8 mt-8">
      <div className="container mx-auto grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold mb-4">VirtuStrike</h3>
          <p className="text-sm text-muted-foreground">
            Experience premium VR gaming with our state-of-the-art facilities and exciting game library.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Near, Scheme 78, Vijay Nagar, Indore</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2" />
              <span>+91 86024 47245</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2" />
              <span>vishal@virtustrike.com</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">Hours</h3>
          <p className="text-sm">Monday - Friday: 10AM - 11PM</p>
          <p className="text-sm">Saturday - Sunday: 9AM - 11:30PM</p>
        </div>
      </div>
      <div className="text-center text-sm text-muted-foreground mt-8">
        © {new Date().getFullYear()} VirtuStrike. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;