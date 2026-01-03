import TransportBooking from "@/components/dashboard/TransportBooking";

const Bookings = () => {
    return (
        <div className="container mx-auto px-4 py-4 max-w-6xl animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 text-primary">Travel Bookings</h1>
                <p className="text-muted-foreground">
                    Book flights, trains, buses, and hotels for your next adventure.
                </p>
            </div>

            <TransportBooking />

            {/* Optional: Add some placeholder content for "Recent Bookings" or "Offers" below to make the page less empty */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-primary">Exclusive Offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-32 flex items-center justify-center p-6 text-white text-center">
                                <div className="font-bold text-2xl">FLAT 15% OFF</div>
                            </div>
                            <div className="p-4">
                                <p className="font-medium text-slate-800 mb-1">On Domestic Flights</p>
                                <p className="text-xs text-slate-500 mb-3">Use Code: FLYHIGH</p>
                                <div className="text-xs text-blue-600 font-semibold cursor-pointer">View Details</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Bookings;
