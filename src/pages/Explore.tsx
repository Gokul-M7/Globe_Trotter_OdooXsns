import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const CATEGORIES = [
    "Wildlife",
    "Hill Station",
    "Pilgrimage",
    "Heritage",
    "Beach",
    "Honeymoon",
    "Adventure",
    "Trekking"
];

// Comprehensive mock data
const ALL_PACKAGES = {
    Wildlife: [
        { id: "wildlife-1", title: "India Tiger Tour", duration: "13 Nights - 14 Days", image: "/packages/wildlife.png", price: 45000, rating: 4.8 },
        { id: "wildlife-2", title: "Golden Triangle with Tigers", duration: "9 Nights - 10 Days", image: "/packages/wildlife.png", price: 32000, rating: 4.7 },
        { id: "wildlife-3", title: "Rhino & Tigers Tour", duration: "13 Nights - 14 Days", image: "/packages/wildlife.png", price: 48000, rating: 4.9 },
        { id: "wildlife-4", title: "Tiger Safari Expedition", duration: "10 Nights - 11 Days", image: "/packages/wildlife.png", price: 41000, rating: 4.8 },
        { id: "wildlife-5", title: "Corbett Wilderness", duration: "4 Nights - 5 Days", image: "/packages/wildlife.png", price: 15000, rating: 4.6 }
    ],
    "Hill Station": [
        { id: "hill-1", title: "Best of Kumaon Hills", duration: "5 Nights - 6 Days", image: "/packages/hillstation.png", price: 18000, rating: 4.5 },
        { id: "hill-2", title: "Best of Kashmir", duration: "5 Nights - 6 Days", image: "/packages/hillstation.png", price: 25000, rating: 4.9 },
        { id: "hill-3", title: "Ooty & Munnar Escape", duration: "6 Nights - 7 Days", image: "/packages/hillstation.png", price: 22000, rating: 4.7 },
        { id: "hill-4", title: "Shimla & Manali Delight", duration: "7 Nights - 8 Days", image: "/packages/hillstation.png", price: 28000, rating: 4.6 },
        { id: "hill-5", title: "Darjeeling Tea Trails", duration: "4 Nights - 5 Days", image: "/packages/hillstation.png", price: 16000, rating: 4.8 }
    ],
    Pilgrimage: [
        { id: "pilgrimage-1", title: "Chardham Tour", duration: "11 Nights - 12 Days", image: "/packages/pilgrimage.png", price: 35000, rating: 4.8 },
        { id: "pilgrimage-2", title: "12 Jyotirlinga Tour", duration: "23 Nights - 24 Days", image: "/packages/pilgrimage.png", price: 85000, rating: 5.0 },
        { id: "pilgrimage-3", title: "Varanasi & Gaya", duration: "4 Nights - 5 Days", image: "/packages/pilgrimage.png", price: 12000, rating: 4.7 },
        { id: "pilgrimage-4", title: "Rameswaram Temple Tour", duration: "3 Nights - 4 Days", image: "/packages/pilgrimage.png", price: 10000, rating: 4.6 },
        { id: "pilgrimage-5", title: "Golden Temple & Wagah", duration: "2 Nights - 3 Days", image: "/packages/pilgrimage.png", price: 8000, rating: 4.9 }
    ],
    Heritage: [
        { id: "heritage-1", title: "Rajasthan Royal Tour", duration: "9 Nights - 10 Days", image: "/packages/heritage.png", price: 38000, rating: 4.8 },
        { id: "heritage-2", title: "Hampi Ruins Exploration", duration: "3 Nights - 4 Days", image: "/packages/heritage.png", price: 15000, rating: 4.7 },
        { id: "heritage-3", title: "Khajuraho & Orchha", duration: "4 Nights - 5 Days", image: "/packages/heritage.png", price: 18000, rating: 4.6 },
        { id: "heritage-4", title: "Ajanta & Ellora Caves", duration: "3 Nights - 4 Days", image: "/packages/heritage.png", price: 14000, rating: 4.9 },
        { id: "heritage-5", title: "Mysore Palace & Coorg", duration: "5 Nights - 6 Days", image: "/packages/heritage.png", price: 20000, rating: 4.7 }
    ],
    Beach: [
        { id: "beach-1", title: "Goa Beach Party", duration: "4 Nights - 5 Days", image: "/packages/beach.png", price: 15000, rating: 4.8 },
        { id: "beach-2", title: "Andaman Island hopping", duration: "6 Nights - 7 Days", image: "/packages/beach.png", price: 35000, rating: 4.9 },
        { id: "beach-3", title: "Kerala Coastal Vibe", duration: "5 Nights - 6 Days", image: "/packages/beach.png", price: 25000, rating: 4.7 },
        { id: "beach-4", title: "Pondicherry French Colony", duration: "3 Nights - 4 Days", image: "/packages/beach.png", price: 12000, rating: 4.6 },
        { id: "beach-5", title: "Lakshadweep Coral Reef", duration: "5 Nights - 6 Days", image: "/packages/beach.png", price: 40000, rating: 4.8 }
    ],
    Honeymoon: [
        { id: "honeymoon-1", title: "Romantic Kashmir", duration: "6 Nights - 7 Days", image: "/packages/honeymoon.png", price: 55000, rating: 4.9 },
        { id: "honeymoon-2", title: "Kerala Houseboat Bliss", duration: "5 Nights - 6 Days", image: "/packages/honeymoon.png", price: 45000, rating: 4.8 },
        { id: "honeymoon-3", title: "Udaipur Royal Romance", duration: "3 Nights - 4 Days", image: "/packages/honeymoon.png", price: 30000, rating: 4.7 },
        { id: "honeymoon-4", title: "Andaman Luxury Escape", duration: "5 Nights - 6 Days", image: "/packages/honeymoon.png", price: 60000, rating: 4.9 },
        { id: "honeymoon-5", title: "Manali Snow Love", duration: "4 Nights - 5 Days", image: "/packages/honeymoon.png", price: 25000, rating: 4.6 }
    ],
    Adventure: [
        { id: "adventure-1", title: "Rishikesh River Rafting", duration: "2 Nights - 3 Days", image: "/packages/adventure.png", price: 8000, rating: 4.8 },
        { id: "adventure-2", title: "Bir Billing Paragliding", duration: "3 Nights - 4 Days", image: "/packages/adventure.png", price: 12000, rating: 4.9 },
        { id: "adventure-3", title: "Scuba Diving in Malvan", duration: "4 Nights - 5 Days", image: "/packages/adventure.png", price: 18000, rating: 4.7 },
        { id: "adventure-4", title: "Jim Corbett Jungle Safari", duration: "2 Nights - 3 Days", image: "/packages/adventure.png", price: 10000, rating: 4.6 },
        { id: "adventure-5", title: "Skiing in Auli", duration: "5 Nights - 6 Days", image: "/packages/adventure.png", price: 25000, rating: 4.8 }
    ],
    Trekking: [
        { id: "trekking-1", title: "Kedarkantha Trek", duration: "5 Nights - 6 Days", image: "/packages/trekking.png", price: 12000, rating: 4.9 },
        { id: "trekking-2", title: "Hampta Pass Trek", duration: "4 Nights - 5 Days", image: "/packages/trekking.png", price: 14000, rating: 4.8 },
        { id: "trekking-3", title: "Valley of Flowers", duration: "6 Nights - 7 Days", image: "/packages/trekking.png", price: 16000, rating: 4.9 },
        { id: "trekking-4", title: "Triund Trek", duration: "2 Nights - 3 Days", image: "/packages/trekking.png", price: 6000, rating: 4.7 },
        { id: "trekking-5", title: "Roopkund Trek", duration: "8 Nights - 9 Days", image: "/packages/trekking.png", price: 20000, rating: 4.8 }
    ]
};

const Explore = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState("Wildlife");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPackages = useMemo(() => {
        let currentPackages: any[] = [];

        // If searching, search across ALL categories
        if (searchQuery.trim().length > 0) {
            Object.values(ALL_PACKAGES).forEach(catPkgs => {
                currentPackages = [...currentPackages, ...catPkgs];
            });

            return currentPackages.filter(pkg =>
                pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.duration.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Otherwise, matched by category
        return ALL_PACKAGES[activeCategory as keyof typeof ALL_PACKAGES] || [];
    }, [searchQuery, activeCategory]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 text-primary">Packages By Interest</h1>
                <p className="text-muted-foreground text-lg">Destinations that match your passion.</p>

                {/* Search */}
                <div className="mt-6 relative max-w-xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                        placeholder="Search packages (e.g., Tiger, Beach, 5 Days)..."
                        className="pl-10 h-12 bg-white shadow-sm border-slate-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Tabs - Hide if searching to avoid confusion */}
            {!searchQuery && (
                <Tabs defaultValue="Wildlife" value={activeCategory} onValueChange={setActiveCategory} className="space-y-8">
                    <div className="relative">
                        <TabsList className="h-auto p-1 bg-transparent gap-2 overflow-x-auto w-full justify-start no-scrollbar">
                            {CATEGORIES.map((category) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:border-orange-500 border border-slate-200 rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:border-orange-300 bg-white"
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </Tabs>
            )}

            {/* Search Results / Category Content */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                            onClick={() => navigate(`/explore/${pkg.id}`)}
                        >
                            <div className="relative h-48 overflow-hidden rounded-t-xl">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-orange-600 shadow-sm">
                                    <Star className="w-3 h-3 fill-orange-600" />
                                    {pkg.rating}
                                </div>
                            </div>

                            <CardContent className="p-4">
                                <h3 className="font-bold text-lg mb-2 text-primary group-hover:text-ocean transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {pkg.title}
                                </h3>

                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                    <Clock className="w-4 h-4" />
                                    {pkg.duration}
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <div>
                                        <span className="text-xs text-muted-foreground block">Starting from</span>
                                        <span className="font-bold text-lg text-primary">₹{pkg.price.toLocaleString()}</span>
                                    </div>

                                    <Button size="icon" className="rounded-full w-8 h-8 bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-xl text-muted-foreground">No packages found for "{searchQuery}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
