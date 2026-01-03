import {
  Map,
  Calendar,
  Wallet,
  Share2,
  Search,
  Sparkles,
  Globe,
  Users
} from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Multi-City Itineraries",
    description: "Plan complex trips across multiple destinations with our intuitive itinerary builder.",
    color: "ocean",
  },
  {
    icon: Calendar,
    title: "Visual Timeline",
    description: "See your entire journey on a beautiful calendar view with drag-and-drop scheduling.",
    color: "coral",
  },
  {
    icon: Wallet,
    title: "Smart Budgeting",
    description: "Track expenses automatically with cost breakdowns by category and daily averages.",
    color: "ocean",
  },
  {
    icon: Search,
    title: "Activity Discovery",
    description: "Explore thousands of activities, attractions, and hidden gems at each destination.",
    color: "coral",
  },
  {
    icon: Share2,
    title: "Share & Collaborate",
    description: "Invite friends to plan together or share your itinerary with the community.",
    color: "ocean",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Get personalized suggestions based on your interests and travel style.",
    color: "coral",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-sand/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean/10 text-ocean text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Why GoVenture
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="text-gradient-ocean"> Plan Perfectly</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From inspiration to execution, we've got every step of your journey covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isOcean = feature.color === "ocean";

            return (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-6 border border-border hover:border-ocean/30 transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${isOcean ? 'bg-ocean/10' : 'bg-coral/10'
                  }`}>
                  <Icon className={`w-7 h-7 ${isOcean ? 'text-ocean' : 'text-coral'}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-ocean transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isOcean ? 'bg-ocean/5' : 'bg-coral/5'
                  }`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-border shadow-soft">
            <Users className="w-5 h-5 text-ocean" />
            <span className="text-muted-foreground">
              Join <span className="font-semibold text-foreground">50,000+</span> travelers already planning with GoVenture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
