import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MapPin,
  Calendar,
  Wallet,
  ChevronRight,
  Globe,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Traveler";

  // Demo trips data (Indian Context)
  const recentTrips = [
    {
      id: 1,
      name: "Kerala Backwaters",
      dates: "Jan 10 - Jan 15, 2026",
      cities: 3,
      budget: 45000,
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80",
    },
    {
      id: 2,
      name: "Rajasthan Royal Tour",
      dates: "Feb 1 - Feb 7, 2026",
      cities: 4,
      budget: 85000,
      image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80",
    },
  ];

  const quickStats = [
    { label: "Total Trips", value: "3", icon: Globe },
    { label: "Cities Visited", value: "12", icon: MapPin },
    { label: "Total Budget", value: "₹1,45,000", icon: Wallet },
  ];

  const recommendedDestinations = [
    "Kashmir", "Munnar", "Goa", "Varkala", "Mysore", "Taj Mahal", "Kodaikanal"
  ];

  return (
    <div className="container mx-auto px-4 max-w-6xl py-4">
      {/* Welcome Section */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, <span className="text-gradient-ocean">{firstName}</span>! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to plan your next adventure across incredible India?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-slide-up">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 border border-border shadow-soft flex items-center gap-4 hover:shadow-medium transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-ocean/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-ocean" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create New Trip CTA */}
      <div className="relative overflow-hidden rounded-2xl hero-gradient p-8 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Plan Your Next Trip
            </h2>
            <p className="text-white/80 max-w-md">
              Create a new itinerary, discover activities, and manage your budget all in one place.
            </p>
          </div>
          <Button
            variant="glass"
            size="lg"
            className="shrink-0 group"
            onClick={() => navigate('/trips/new')}
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            Create New Trip
          </Button>
        </div>
      </div>

      {/* Analytics Section - Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-border shadow-soft">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-ocean" />
            Expense Distribution
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Accommodation", value: 45000, color: "#0088FE" },
                    { name: "Flights", value: 35000, color: "#00C49F" },
                    { name: "Food", value: 15000, color: "#FFBB28" },
                    { name: "Activities", value: 25000, color: "#FF8042" },
                    { name: "Shopping", value: 10000, color: "#8884d8" },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: "Accommodation", value: 45000, color: "#3b82f6" }, // Blue
                    { name: "Flights", value: 35000, color: "#10b981" }, // Emerald
                    { name: "Food", value: 15000, color: "#f59e0b" }, // Amber
                    { name: "Activities", value: 25000, color: "#f97316" }, // Orange
                    { name: "Shopping", value: 10000, color: "#8b5cf6" }, // Violet
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Recent Trip List (To fit side by side or just keep analytics separate? Let's keep distinct) */}
        <div className="bg-ocean/5 rounded-2xl p-6 border border-ocean/10 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-ocean/20 rounded-full flex items-center justify-center mb-4 text-ocean">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-ocean mb-2">Spending Insights</h3>
          <p className="text-sm text-slate-600 mb-6">
            Your biggest expense is Accommodation (35%). Consider booking early to save up to 15%.
          </p>
          <Button variant="outline" className="border-ocean text-ocean hover:bg-ocean hover:text-white">
            View Full Report
          </Button>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Trips</h2>
          <Button variant="ghost" size="sm" className="text-ocean hover:text-ocean-dark">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {recentTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {recentTrips.map((trip) => (
              <div
                key={trip.id}
                className="group bg-white rounded-2xl overflow-hidden border border-border shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{trip.name}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {trip.dates}
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4" />
                      {trip.cities} Stops
                    </div>
                    <div className="flex items-center gap-2 font-medium text-ocean">
                      <Wallet className="w-4 h-4" />
                      ₹{trip.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-border">
            <div className="w-16 h-16 rounded-full bg-ocean/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-ocean" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">
              Start planning your first adventure!
            </p>
          </div>
        )}
      </div>

      {/* Trending Destinations */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-coral" />
          <h2 className="text-2xl font-bold text-foreground">Trending Destinations</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommendedDestinations.map((city) => (
            <div
              key={city}
              className="flex-shrink-0 px-6 py-4 rounded-xl bg-white border border-border hover:border-ocean/30 hover:shadow-soft transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="font-medium text-foreground">{city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
