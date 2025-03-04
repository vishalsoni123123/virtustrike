import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-lg px-6 py-24 text-center lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}attached_assets/game1.jpg)`,
            filter: "brightness(0.3)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%'
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Welcome to VirtuStrike
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Experience the future of gaming with our state-of-the-art VR arena.
            Book your session today and immerse yourself in extraordinary virtual worlds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/games">
              <Button size="lg">Explore Games</Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="secondary">Book Now</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Experience Next-Gen VR Gaming</h2>
            <p className="text-muted-foreground">
              Step into our cutting-edge VR arena and immerse yourself in incredible virtual worlds. 
              Whether you're battling zombies, exploring space, or racing through futuristic cities, 
              our high-end VR equipment ensures an unparalleled gaming experience.
            </p>
            <div className="flex gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xl font-bold">6+</p>
                  <p className="text-muted-foreground">Unique Games</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xl font-bold">2-8</p>
                  <p className="text-muted-foreground">Players</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-xl font-bold">3</p>
                  <p className="text-muted-foreground">Locations</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}attached_assets/game2.jpg`}
              alt="VR Gaming Experience"
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Why Choose VirtuStrike?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 text-xl font-bold">Latest Technology</h3>
              <p className="text-muted-foreground">
                Experience VR gaming on cutting-edge equipment for the most immersive experience.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 text-xl font-bold">Multiple Games</h3>
              <p className="text-muted-foreground">
                Choose from 6 different exciting games suitable for all skill levels.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 text-xl font-bold">Team Building</h3>
              <p className="text-muted-foreground">
                Perfect for groups of 2-8 players. Great for friends, family, or corporate events.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}