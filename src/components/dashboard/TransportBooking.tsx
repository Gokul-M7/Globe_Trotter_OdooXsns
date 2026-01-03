import { useState } from "react";
import HotelMap from "./HotelMap";
import { Plane, Train, Bus, Car, Hotel, Calendar, MapPin, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const TransportBooking = () => {
    const [date, setDate] = useState<Date>();
    const [checkIn, setCheckIn] = useState<Date>();
    const [checkOut, setCheckOut] = useState<Date>();
    const [showTrainResults, setShowTrainResults] = useState(false);

    const modes = [
        { id: "flights", label: "Flights", icon: Plane },
        { id: "hotels", label: "Hotels", icon: Hotel },
        { id: "trains", label: "Trains", icon: Train },
        { id: "buses", label: "Buses", icon: Bus },
        { id: "cabs", label: "Cabs", icon: Car },
    ];

    const renderCommonInputs = (modeId: string) => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-fade-in">
            {/* From */}
            <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">From</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="City"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 focus:border-ocean focus:ring-ocean"
                        defaultValue="New Delhi"
                    />
                </div>
                <p className="text-xs text-muted-foreground truncate">DEL, Indira Gandhi</p>
            </div>

            {/* Swap Icon */}
            <div className="hidden md:flex md:col-span-1 justify-center pb-8 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                    <Search className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* To */}
            <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">To</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="City"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 focus:border-ocean focus:ring-ocean"
                        defaultValue="Bengaluru"
                    />
                </div>
                <p className="text-xs text-muted-foreground truncate">BLR, Kempegowda</p>
            </div>

            {/* Departure Date */}
            <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Departure</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full h-12 justify-start text-left font-medium border-slate-200 text-lg px-3",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <Calendar className="mr-2 h-5 w-5 text-slate-400" />
                            {date ? format(date, "d MMM") : <span>Date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Rate: Low</p>
            </div>

            {/* Travellers */}
            <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Travellers & Class</Label>
                <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        readOnly
                        value="1 Traveller"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 cursor-pointer hover:bg-slate-50"
                    />
                </div>
                <p className="text-xs text-muted-foreground">Economy</p>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2 flex justify-end mb-6">
                <Button className="h-12 w-full bg-gradient-to-r from-ocean to-blue-600 hover:from-ocean-dark hover:to-blue-700 text-white font-bold shadow-lg shadow-ocean/20">
                    SEARCH
                </Button>
            </div>
        </div>
    );

    const renderHotelInputs = () => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-fade-in">
            {/* City / Location */}
            <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">City, Area or Property</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="City, Area or Property"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 focus:border-ocean focus:ring-ocean"
                        defaultValue="Tindivanam"
                    />
                </div>
                <p className="text-xs text-muted-foreground truncate">India</p>
            </div>

            {/* Check-In */}
            <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Check-In</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full h-12 justify-start text-left font-medium border-slate-200 text-lg px-3",
                                !checkIn && "text-muted-foreground"
                            )}
                        >
                            <Calendar className="mr-2 h-5 w-5 text-slate-400" />
                            {checkIn ? format(checkIn, "d MMM''yy") : <span>Select Date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={checkIn}
                            onSelect={setCheckIn}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Saturday</p>
            </div>

            {/* Check-Out */}
            <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Check-Out</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full h-12 justify-start text-left font-medium border-slate-200 text-lg px-3",
                                !checkOut && "text-muted-foreground"
                            )}
                        >
                            <Calendar className="mr-2 h-5 w-5 text-slate-400" />
                            {checkOut ? format(checkOut, "d MMM''yy") : <span>Select Date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={checkOut}
                            onSelect={setCheckOut}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">Sunday</p>
            </div>

            {/* Rooms & Guests */}
            <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Rooms & Guests</Label>
                <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        readOnly
                        value="1 Room, 2 Adults"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 cursor-pointer hover:bg-slate-50"
                    />
                </div>
                <p className="text-xs text-muted-foreground">1 Room, 2 Adults</p>
            </div>

            {/* Search Button - Increased col-span to 2 for better spacing */}
            <div className="md:col-span-2 flex justify-end mb-6">
                <Button className="h-12 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold shadow-lg shadow-blue-500/20">
                    SEARCH
                </Button>
            </div>
        </div>
    );

    const renderTrainInputs = () => (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-fade-in">
            {/* From */}
            <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">From</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="From Station"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 focus:border-ocean focus:ring-ocean"
                        defaultValue="New Delhi"
                    />
                </div>
                <p className="text-xs text-muted-foreground truncate">NDLS, New Delhi Railway Station</p>
            </div>

            {/* Swap Icon */}
            <div className="hidden md:flex md:col-span-1 justify-center pb-8">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                    <Search className="w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* To */}
            <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">To</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="To Station"
                        className="pl-10 h-12 text-lg font-medium border-slate-200 focus:border-ocean focus:ring-ocean"
                        defaultValue="Kanpur Central"
                    />
                </div>
                <p className="text-xs text-muted-foreground truncate">CNB, Kanpur Central</p>
            </div>

            {/* Date */}
            <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full h-12 justify-start text-left font-medium border-slate-200 text-lg px-3",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <Calendar className="mr-2 h-5 w-5 text-slate-400" />
                            {date ? format(date, "d MMM") : <span>Select Date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground opacity-0">Spacer</p>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2 flex justify-end pb-6">
                <Button
                    onClick={() => setShowTrainResults(true)}
                    className="h-12 w-full bg-gradient-to-r from-ocean to-blue-600 hover:from-ocean-dark hover:to-blue-700 text-white font-bold shadow-lg shadow-ocean/20"
                >
                    SEARCH
                </Button>
            </div>
        </div>
    );

    const popularRoutes = [
        { city: "Chennai", via: "Delhi, Mumbai, Coimbatore, Madurai", image: "/flights/chennai.png" },
        { city: "Goa", via: "Delhi, Mumbai, Bangalore, Ahmedabad", image: "/packages/beach.png" },
        { city: "Mumbai", via: "Delhi, Bangalore, Chennai, Ahmedabad", image: "/flights/mumbai.png" },
        { city: "Hyderabad", via: "Chennai, Mumbai, Bangalore, Delhi", image: "/flights/hyderabad.png" },
        { city: "Delhi", via: "Mumbai, Pune, Bangalore, Chennai", image: "/flights/delhi.png" },
        { city: "Pune", via: "Delhi, Bangalore, Chennai, Ahmedabad", image: "/flights/pune.png" },
        { city: "Kolkata", via: "Delhi, Mumbai, Bangalore, Pune", image: "/flights/kolkata.png" },
        { city: "Bangalore", via: "Delhi, Pune, Mumbai, Kolkata", image: "/flights/bangalore.png" },
        { city: "Jaipur", via: "Mumbai, Delhi, Pune, Bangalore", image: "/flights/jaipur.png" },
    ];

    const renderPopularFlights = () => (
        <div className="mt-10 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Popular Domestic Flight Routes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularRoutes.map((route) => (
                    <div key={route.city} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                            <img src={route.image} alt={route.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 group-hover:text-ocean transition-colors">{route.city} Flights</h4>
                            <p className="text-xs text-slate-500 line-clamp-1">Via - {route.via}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const availableTrains = [
        {
            name: "Shram Shakti Exp", number: "#12452", runsOn: "SMTWTFS",
            depTime: "11:55 PM, 4 JAN", depStation: "New Delhi",
            duration: "6h 25m",
            arrTime: "6:20 AM, 5 JAN", arrStation: "Kanpur Central",
            classes: [
                { type: "SL", quota: "TATKAL", status: "Available 97", price: "₹ 415", updated: "few mins ago" },
                { type: "3A", quota: "TATKAL", status: "Available 60", price: "₹ 1110", updated: "few mins ago" },
                { type: "2A", quota: "TATKAL", status: "Available 31", price: "₹ 1520", updated: "2 hrs ago" },
                { type: "2A", quota: "RAC", status: "RAC 6", price: "₹ 1520", updated: "few mins ago" },
            ]
        },
        {
            name: "Vande Bharat Exp", number: "#22416", runsOn: "SMTWTFS",
            depTime: "3:00 PM, 4 JAN", depStation: "New Delhi",
            duration: "4h 8m",
            arrTime: "7:08 PM, 4 JAN", arrStation: "Kanpur Central",
            classes: [
                { type: "EC", quota: "TATKAL", status: "Available 6", price: "₹ 2625", updated: "3 hrs ago" },
                { type: "CC", quota: "TATKAL", status: "TQWL 8", isWaitlist: true, price: "₹ 1315", updated: "few mins ago" },
                { type: "CC", quota: "", status: "GNWL 69", isWaitlist: true, price: "₹ 1080", updated: "few mins ago" },
                { type: "EC", quota: "", status: "GNWL 10", isWaitlist: true, price: "₹ 2625", updated: "1 hr ago" },
            ]
        }
    ];

    const renderTrainOptions = () => (
        <div className="mt-8 animate-fade-in space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Available Trains</h3>
            {availableTrains.map((train, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between mb-6 group cursor-pointer">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-baseline gap-3 mb-1">
                                <h4 className="text-xl font-bold text-slate-900">{train.name}</h4>
                                <span className="text-sm text-slate-500">{train.number}</span>
                            </div>
                            <div className="text-xs text-slate-500 flex gap-1">
                                <span>Depart on:</span>
                                <span className="font-semibold text-green-600 tracking-widest">{train.runsOn}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-sm">
                            <div className="text-right">
                                <div className="font-bold text-lg text-slate-800">{train.depTime.split(',')[0]}</div>
                                <div className="text-xs text-slate-500">{train.depStation}</div>
                            </div>
                            <div className="flex flex-col items-center px-4">
                                <div className="text-xs text-slate-500 mb-1">{train.duration}</div>
                                <div className="w-24 h-[1px] bg-slate-300 relative">
                                    <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full border border-slate-300 bg-white"></div>
                                    <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full border border-slate-300 bg-white"></div>
                                </div>
                                <div className="text-xs text-blue-600 mt-1 font-medium cursor-pointer">View Route</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg text-slate-800">{train.arrTime.split(',')[0]}</div>
                                <div className="text-xs text-slate-500">{train.arrStation}</div>
                            </div>
                        </div>
                    </div>

                    {/* Classes */}
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                        {train.classes.map((cls, i) => (
                            <div key={i} className="min-w-[180px] p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:border-ocean transition-colors">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-700">{cls.type}</span>
                                        {cls.quota && (
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-sm">
                                                {cls.quota}
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-bold text-slate-800">{cls.price}</div>
                                </div>
                                <div className={cn("font-bold text-sm mb-1", cls.isWaitlist ? "text-orange-600" : "text-green-600")}>
                                    {cls.status}
                                </div>
                                <div className="text-[10px] text-slate-500">Free Cancellation</div>
                                <div className="text-[10px] text-slate-400 mt-1">Updated {cls.updated}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Card className="w-full border-none shadow-lg bg-white overflow-hidden mb-10">
            <div className="bg-slate-50 border-b border-slate-100 p-2">
                <Tabs defaultValue="flights" className="w-full">
                    <TabsList className="bg-transparent w-full justify-start h-14 p-0 gap-6 overflow-x-auto no-scrollbar">
                        {modes.map((mode) => {
                            const Icon = mode.icon;
                            return (
                                <TabsTrigger
                                    key={mode.id}
                                    value={mode.id}
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-ocean data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-ocean rounded-none h-full px-2 flex-col gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    <Icon className="w-5 h-5 mb-0.5" />
                                    <span className="text-xs font-medium">{mode.label}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    <div className="p-6 bg-white min-h-[200px]">
                        {modes.map((mode) => (
                            <TabsContent key={mode.id} value={mode.id} className="mt-0">
                                {mode.id === "hotels" ? (
                                    <div className="space-y-6">
                                        {renderHotelInputs()}
                                        <div className="mt-6 border-t border-slate-100 pt-6">
                                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-ocean" />
                                                View on Map
                                            </h3>
                                            <HotelMap />
                                        </div>
                                    </div>
                                ) : mode.id === "trains" ? (
                                    renderTrainInputs()
                                ) : (
                                    renderCommonInputs(mode.id)
                                )}

                                {mode.id === "flights" && renderPopularFlights()}
                                {mode.id === "trains" && showTrainResults && renderTrainOptions()}

                                {mode.id !== "hotels" && mode.id !== "flights" && mode.id !== "trains" && (
                                    <div className="pt-6 flex gap-6 text-sm text-slate-600">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="tripType" defaultChecked className="accent-ocean" />
                                            Regular Fare
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="tripType" className="accent-ocean" />
                                            Student Fare
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="tripType" className="accent-ocean" />
                                            Senior Citizen
                                        </label>
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>
        </Card>
    );
};

export default TransportBooking;
