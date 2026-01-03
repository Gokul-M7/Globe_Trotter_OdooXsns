import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Clock,
    Users,
    Calendar as CalendarIcon,
    CheckCircle2,
    XCircle,
    Phone,
    Mail,
    Share2,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

// Mock data (in a real app, this would come from an API based on ID)
const PACKAGE_DETAILS = {
    "wildlife-1": {
        title: "India Tiger Tour",
        duration: "13 Nights - 14 Days",
        price: 45000,
        rating: 4.8,
        reviews: 124,
        location: "Madhya Pradesh, India",
        description: "Experience the thrill of the wild with our comprehensive India Tiger Tour. Visit the famous national parks of Bandhavgarh, Kanha, and Pench to witness the majestic Royal Bengal Tiger in its natural habitat. This tour offers a perfect blend of adventure, photography, and nature walks.",
        images: [
            "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&q=80",
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
            "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80"
        ],
        highlights: [
            "Jeep Safari in Bandhavgarh National Park",
            "Nature walk in Kanha Tiger Reserve",
            "Visit to Pench National Park",
            "Stay in luxury jungle resorts",
            "Professional naturalist guide"
        ],
        itinerary: [
            { day: 1, title: "Arrival in Delhi", desc: "Arrive at Delhi airport. Transfer to hotel. Overnight stay." },
            { day: 2, title: "Delhi to Bandhavgarh", desc: "Fly to Jabalpur and drive to Bandhavgarh. Evening at leisure." },
            { day: 3, title: "Bandhavgarh Safari", desc: "Morning and afternoon jeep safaris. Spot tigers and other wildlife." },
            { day: 4, title: "Bandhavgarh Exploration", desc: "Full day safari. Visit Bandhavgarh Fort." },
            { day: 5, title: "Drive to Kanha", desc: "Scenic drive to Kanha National Park. Check-in to resort." },
            { day: 6, title: "Kanha Jungle Safari", desc: "Explore the dense Sal forests of Kanha. Look for Barasingha." },
        ],
        inclusions: [
            "Accommodation on twin sharing basis",
            "All meals during the stay",
            "All transfers and sightseeing by AC vehicle",
            "Safari charges and entry fees",
            "Guide charges"
        ],
        exclusions: [
            "Airfare / Train fare",
            "Personal expenses like laundry, calls",
            "Tips and gratuities",
            "Any other item not mentioned in inclusions"
        ]
    }
};

const PackageDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>();

    // Fallback data function to handle any ID
    const getPackageData = (pkgId: string | undefined) => {
        const found = PACKAGE_DETAILS[pkgId as keyof typeof PACKAGE_DETAILS];
        if (found) return found;

        // Generate generic data based on ID so every card works
        return {
            title: pkgId?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Amazing Trip",
            duration: "5 Nights - 6 Days",
            price: 25000,
            rating: 4.5,
            reviews: 80,
            location: "India",
            description: "Experience the thrill of this amazing destination. This comprehensive tour offers a perfect blend of adventure, culture, and relaxation, tailored just for you.",
            images: [
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
                "https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80"
            ],
            highlights: [
                "Guided city tour",
                "Luxury accommodation",
                "Cultural show",
                "Local culinary experience",
                "Comfortable transfers"
            ],
            itinerary: [
                { day: 1, title: "Arrival", desc: "Arrive at the destination. Transfer to hotel. Welcome dinner." },
                { day: 2, title: "Sightseeing", desc: "Full day sightseeing tour visiting major attractions." },
                { day: 3, title: "Adventure", desc: "Engage in local adventure activities or leisure." },
                { day: 4, title: "Cultural Immersion", desc: "Immerse yourself in the local culture and markets." },
                { day: 5, title: "Relaxation", desc: "Day at leisure to explore on your own." },
                { day: 6, title: "Departure", desc: "Transfer to airport for onward journey." }
            ],
            inclusions: [
                "Accommodation on twin sharing basis",
                "Daily breakfast",
                "Transfers by AC vehicle",
                "Sightseeing as per itinerary"
            ],
            exclusions: [
                "Airfare",
                "Personal expenses",
                "Lunch and Dinner (unless specified)"
            ]
        };
    };

    const pkg = getPackageData(id);

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Hero Header */}
            <div className="h-[50vh] relative w-full overflow-hidden">
                <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-6 left-4 md:left-8 z-10">
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-white/20 hover:text-white rounded-full"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Button>
                </div>

                <div className="absolute top-6 right-4 md:right-8 z-10 flex gap-2">
                    <Button variant="glass" size="icon" className="rounded-full">
                        <Share2 className="w-5 h-5" />
                    </Button>
                    <Button variant="glass" size="icon" className="rounded-full">
                        <Download className="w-5 h-5" />
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                    <div className="container mx-auto">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white mb-4 border-none">Wildlife</Badge>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{pkg.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/90">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                {pkg.duration}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                {pkg.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Family Friendly
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 -mt-8 relative z-10 mb-20 animate-slide-up">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 md:p-8 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold mb-4 text-primary">Overview</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {pkg.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-3">Highlights</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pkg.highlights.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 md:p-8">
                                <h2 className="text-2xl font-bold mb-6 text-primary">Itinerary</h2>
                                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200">
                                    {pkg.itinerary.map((day, idx) => (
                                        <div key={idx} className="relative flex gap-6">
                                            <div className="w-10 h-10 rounded-full bg-ocean text-white flex items-center justify-center font-bold shrink-0 z-10 border-4 border-slate-50">
                                                {day.day}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-primary mb-1">{day.title}</h4>
                                                <p className="text-muted-foreground text-sm leading-relaxed">{day.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="border-none shadow-md bg-green-50/50">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-700">
                                        <CheckCircle2 className="w-5 h-5" /> Inclusions
                                    </h3>
                                    <ul className="space-y-3">
                                        {pkg.inclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-green-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-md bg-red-50/50">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700">
                                        <XCircle className="w-5 h-5" /> Exclusions
                                    </h3>
                                    <ul className="space-y-3">
                                        {pkg.exclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-none shadow-xl overflow-hidden">
                            <div className="bg-primary p-6 text-white text-center">
                                <p className="text-sm opacity-90 mb-1">Starting From</p>
                                <h3 className="text-3xl font-bold">₹{pkg.price.toLocaleString()}</h3>
                                <p className="text-xs opacity-75 mt-1">per person</p>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Travel Dates</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal border-slate-300",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Guests</label>
                                        <Input type="number" min={1} defaultValue={2} className="border-slate-300" />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Base Price (2 pax)</span>
                                        <span className="font-medium">₹{(pkg.price * 2).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Taxes & Fees (5%)</span>
                                        <span className="font-medium">₹{(pkg.price * 2 * 0.05).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                                        <span>Total</span>
                                        <span className="text-ocean">₹{(pkg.price * 2 * 1.05).toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button className="w-full h-12 text-lg bg-orange-500 hover:bg-orange-600 shadow-orange-200 shadow-lg">
                                    Book Now
                                </Button>

                                <p className="text-xs text-center text-muted-foreground">
                                    Free cancellation up to 48 hours before travel.
                                </p>

                                <div className="flex justify-center gap-4 pt-4">
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        <Phone className="w-4 h-4 mr-1" /> Call
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                                        <Mail className="w-4 h-4 mr-1" /> Enquiry
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
