import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky via-background to-sand-dark/30" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-32 left-10 w-64 h-64 rounded-full bg-ocean/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-coral/10 blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-pulse-soft" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-border shadow-soft mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium text-muted-foreground">Plan your dream adventure</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
            <span className="text-foreground">Your Journey,</span>
            <br />
            <span className="text-gradient-ocean">Perfectly Planned</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Create personalized multi-city itineraries, discover hidden gems, manage your budget, and share your travel plans with the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl">
              Start Planning Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              View Demo Trip
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">10k+</div>
              <div className="text-sm text-muted-foreground">Trips Planned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>

        {/* Preview Cards - Floating Trip Cards */}
        <div className="relative max-w-5xl mx-auto mt-16">
          {/* Main Preview Card */}
          <div className="relative glass-card rounded-3xl p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">European Adventure</h3>
                <p className="text-muted-foreground">12 days • 5 cities • $3,200 budget</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-ocean flex items-center justify-center text-white text-sm font-medium">P</div>
                <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white text-sm font-medium">R</div>
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-sm font-medium">+2</div>
              </div>
            </div>

            {/* Cities Timeline */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['Paris', 'Amsterdam', 'Berlin', 'Prague', 'Vienna'].map((city, index) => (
                <div key={city} className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border shadow-soft">
                    <MapPin className="w-4 h-4 text-ocean" />
                    <span className="font-medium text-sm">{city}</span>
                    <span className="text-xs text-muted-foreground">2d</span>
                  </div>
                  {index < 4 && <div className="w-8 h-0.5 bg-border flex-shrink-0" />}
                </div>
              ))}
            </div>

            {/* Bottom Info */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Jun 15 - Jun 27, 2024</span>
              </div>
              <div className="flex-1" />
              <Button variant="soft" size="sm">View Itinerary</Button>
            </div>
          </div>

          {/* Floating Mini Cards */}
          <div className="absolute -left-4 top-1/4 hidden lg:block animate-float">
            <div className="glass-card rounded-xl p-4 shadow-medium">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center">
                  <span className="text-2xl">🗼</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">Eiffel Tower</div>
                  <div className="text-xs text-muted-foreground">Paris, Day 1</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/3 hidden lg:block animate-float-delayed">
            <div className="glass-card rounded-xl p-4 shadow-medium">
              <div className="text-center">
                <div className="text-2xl font-bold text-coral">$267</div>
                <div className="text-xs text-muted-foreground">avg. per day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
