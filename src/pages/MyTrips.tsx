import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, Wallet, MapPin, Plus, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Trip {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    total_budget: number;
    budget_currency: string;
    cover_photo_url: string | null;
    destinations_count?: number; // Optional, if we want to fetch this
}

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const { data, error } = await supabase
                    .from("trips" as any)
                    .select("*, trip_destinations(count)")
                    .order("start_date", { ascending: true });

                if (error) throw error;

                // Transform data to include count properly if needed, though supabase returns it in a specific way
                // For simplicity with "as any", we might just get the raw data.
                // Let's assume basic fields for now.
                setTrips((data as any[])?.map(t => ({
                    ...t,
                    destinations_count: t.trip_destinations?.[0]?.count || 0
                })) || []);

            } catch (error) {
                console.error("Error fetching trips:", error);
                toast.error("Could not load your trips.");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-ocean" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-ocean to-purple-600">
                        My Trips
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your planned adventures and booked packages.
                    </p>
                </div>
                <Button onClick={() => navigate("/trips/new")} className="gap-2 bg-ocean hover:bg-ocean/90">
                    <Plus className="w-4 h-4" />
                    Plan New Trip
                </Button>
            </div>

            {trips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <Card
                            key={trip.id}
                            className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm"
                            onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={trip.cover_photo_url || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80"}
                                    alt={trip.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-xl mb-1">{trip.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-white/90">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(trip.start_date), "MMM d, yyyy")}
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                    {trip.description || "No description provided."}
                                </p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Wallet className="w-4 h-4 text-ocean" />
                                            <span>{trip.budget_currency} {trip.total_budget.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent text-ocean font-medium">
                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                    <div className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-ocean" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No trips found</h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        You haven't created any trips yet. Start planning your next adventure!
                    </p>
                    <Button onClick={() => navigate("/trips/new")} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Your First Trip
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MyTrips;
