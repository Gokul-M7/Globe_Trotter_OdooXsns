import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Map, Wallet, Share2, Plus, MapPin, Ticket, Receipt, Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import AddDestinationDialog from "@/components/trips/AddDestinationDialog";
import AddActivityDialog from "@/components/trips/AddActivityDialog";
import AddExpenseDialog from "@/components/trips/AddExpenseDialog";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as ReTooltip } from 'recharts';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TripPdfTemplate from "@/components/trips/TripPdfTemplate";
import ShareTripDialog from "@/components/trips/ShareTripDialog";

const localizer = momentLocalizer(moment);

interface Trip {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    total_budget: number;
    budget_currency: string;
    cover_photo_url: string | null;
}

interface Activity {
    id: string;
    name: string;
    activity_type: string;
    cost: number;
    description: string;
    start_time?: string;
    end_time?: string;
}

interface Destination {
    id: string;
    city_name: string;
    country_name: string;
    arrival_date: string | null;
    departure_date: string | null;
    trip_id: string;
    trip_activities: Activity[];
}

interface Expense {
    id: string;
    category: string;
    amount: number;
    description: string;
    expense_date: string | null;
}

const COLORS = ['#0EA5E9', '#F97316', '#22C55E', '#A855F7', '#EC4899', '#64748B'];

const TripDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);

    const fetchTripData = async () => {
        if (!id) return;
        try {
            const { data: tripData, error: tripError } = await supabase
                .from("trips" as any)
                .select("*")
                .eq("id", id)
                .single();

            if (tripError) throw tripError;
            setTrip(tripData as unknown as Trip);

            const { data: destData, error: destError } = await supabase
                .from("trip_destinations" as any)
                .select("*, trip_activities(*)")
                .eq("trip_id", id)
                .order('list_order', { ascending: true });

            if (destError) throw destError;
            setDestinations(destData as unknown as Destination[]);

            const { data: expData, error: expError } = await supabase
                .from("trip_expenses" as any)
                .select("*")
                .eq("trip_id", id)
                .order('expense_date', { ascending: false });

            if (expError) throw expError;
            setExpenses(expData as unknown as Expense[]);

        } catch (error) {
            console.error("Error fetching trip data:", error);
            toast.error("Could not load trip details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTripData();
    }, [id, navigate]);

    const handleDownloadPDF = async () => {
        const element = document.getElementById('trip-pdf-template');
        if (!trip || !element) return;

        try {
            toast.info("Generating Itinerary PDF... Please wait.");

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true, // Attempt to load images if possible
                logging: false,
                windowWidth: 1200 // Ensure consistent rendering width
            });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Calculate height to fit A4 width
            const imgProps = pdf.getImageProperties(imgData);
            const pdfImageHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Simple multi-page logic if content is very long
            let heightLeft = pdfImageHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfImageHeight; // top of key next page
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, - (pdfImageHeight - heightLeft), pdfWidth, pdfImageHeight); // Approximate shift
                heightLeft -= pdfHeight;
            }

            // For now, let's just do single long page if it's reasonable, or fit to page if small.
            // Better: just render it as is. If it overflows, it overflows (or we can scale it).
            // Actually, the hidden template is designed to be ~A4 width (794px).
            // So we can just drop it in.

            pdf.save(`${trip.name.replace(/\s+/g, '_')}_itinerary.pdf`);
            toast.success("PDF Downloaded successfully!");

        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate PDF.");
        }
    };


    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-ocean" />
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h2 className="text-2xl font-bold">Trip not found</h2>
                <Button variant="link" onClick={() => navigate("/dashboard")}>
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const duration = new Date(trip.end_date).getDate() - new Date(trip.start_date).getDate() + 1;
    const totalActivities = destinations.reduce((acc, curr) => acc + (curr.trip_activities?.length || 0), 0);

    const activityCost = destinations.reduce((acc, dest) => {
        return acc + (dest.trip_activities?.reduce((sum, act) => sum + (act.cost || 0), 0) || 0);
    }, 0);

    const expenseCost = expenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
    const totalCost = activityCost + expenseCost;
    const remainingBudget = trip.total_budget - totalCost;

    // Chart Data Preparation
    const chartData = [
        { name: 'Activities', value: activityCost },
        ...expenses.reduce((acc: any[], exp) => {
            const existing = acc.find(item => item.name === exp.category);
            if (existing) {
                existing.value += exp.amount;
            } else {
                acc.push({ name: exp.category, value: exp.amount });
            }
            return acc;
        }, [])
    ].filter(item => item.value > 0);

    // ... (previous code)

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in bg-white min-h-screen">

            {/* Hidden PDF Template */}
            <div style={{ position: 'absolute', top: -10000, left: -10000, overflow: 'hidden' }}>
                <TripPdfTemplate
                    trip={trip}
                    destinations={destinations}
                    expenses={expenses}
                    totalCost={totalCost}
                    activityCost={activityCost}
                    expenseCost={expenseCost}
                />
            </div>

            {/* Header */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-large group">
                <img
                    src={trip.cover_photo_url || "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80"}
                    alt={trip.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{trip.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <CalendarIcon className="w-4 h-4" />
                            {format(new Date(trip.start_date), "MMM d")} -{" "}
                            {format(new Date(trip.end_date), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                            <Wallet className="w-4 h-4" />
                            {trip.budget_currency} {trip.total_budget.toLocaleString()}
                        </div>
                    </div>
                </div>


                <div className="absolute top-6 right-6 flex gap-2">
                    <Button variant="glass" size="icon" onClick={handleDownloadPDF} title="Download Trip Itinerary PDF">
                        <Download className="w-5 h-5" />
                    </Button>
                    <ShareTripDialog tripName={trip.name} tripId={trip.id} />
                </div>
            </div>

            {/* ... rest of the main content ... */}
            <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b border-border rounded-none h-auto p-0 mb-8 gap-6">
                    <TabsTrigger
                        value="itinerary"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-ocean data-[state=active]:shadow-none rounded-none px-2 py-3 text-base"
                    >
                        <Map className="w-4 h-4 mr-2" />
                        Itinerary
                    </TabsTrigger>
                    <TabsTrigger
                        value="budget"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-ocean data-[state=active]:shadow-none rounded-none px-2 py-3 text-base"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        Budget
                    </TabsTrigger>
                    <TabsTrigger
                        value="calendar"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-ocean data-[state=active]:shadow-none rounded-none px-2 py-3 text-base"
                    >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Calendar
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary" className="animate-slide-up">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Your Itinerary</h2>
                                <AddDestinationDialog tripId={trip.id} onSuccess={fetchTripData} />
                            </div>

                            {destinations.length > 0 ? (
                                <div className="space-y-4">
                                    {destinations.map((dest, index) => (
                                        <Card key={dest.id} className="overflow-hidden border-l-4 border-l-ocean hover:shadow-md transition-shadow">
                                            <CardContent className="p-0">
                                                <div className="p-4 sm:p-6 pb-0 flex flex-col sm:flex-row justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                                            <div className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center font-bold text-ocean">
                                                                {index + 1}
                                                            </div>
                                                            <div className="h-full w-0.5 bg-border flex-1 my-1" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold">{dest.city_name}</h3>
                                                            <p className="text-muted-foreground">{dest.country_name}</p>
                                                            {dest.arrival_date && (
                                                                <div className="flex items-center gap-2 text-sm text-ocean mt-2">
                                                                    <CalendarIcon className="w-3 h-3" />
                                                                    {format(new Date(dest.arrival_date), "MMM d")}
                                                                    {dest.departure_date && ` - ${format(new Date(dest.departure_date), "MMM d")}`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                                        <AddActivityDialog destinationId={dest.id} onSuccess={fetchTripData} />
                                                    </div>
                                                </div>

                                                {/* Activities List */}
                                                <div className="p-4 sm:p-6 pt-2 pl-[calc(1rem+3rem)]">
                                                    {dest.trip_activities?.length > 0 ? (
                                                        <div className="space-y-3 mt-4 border-t border-border pt-4">
                                                            {dest.trip_activities.map(activity => (
                                                                <div key={activity.id} className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-ocean shadow-sm">
                                                                            <Ticket className="w-4 h-4" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-sm">{activity.name}</p>
                                                                            <p className="text-xs text-muted-foreground capitalize">{activity.activity_type}</p>
                                                                        </div>
                                                                    </div>
                                                                    {activity.cost > 0 && (
                                                                        <Badge variant="secondary" className="bg-white">
                                                                            ₹{activity.cost}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-4 p-4 border border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
                                                            No activities yet. Add some fun!
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="pt-6 text-center py-12">
                                        <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center mx-auto mb-4">
                                            <MapPin className="w-6 h-6 text-ocean" />
                                        </div>
                                        <p className="text-muted-foreground mb-4">No destinations added yet.</p>
                                        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">Start building your itinerary by adding your first stop!</p>
                                        <AddDestinationDialog tripId={trip.id} onSuccess={fetchTripData} />
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="md:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Trip Summary</CardTitle>
                                    <CardDescription>Overview of your plan</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-border">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium">{duration > 0 ? `${duration} Days` : "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-border">
                                        <span className="text-muted-foreground">Destinations</span>
                                        <span className="font-medium">{destinations.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-border">
                                        <span className="text-muted-foreground">Activities</span>
                                        <span className="font-medium">{totalActivities}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-border pt-2">
                                        <span className="text-muted-foreground font-semibold">Total Cost</span>
                                        <div className="text-right">
                                            <span className="block font-bold text-ocean text-lg">{trip.budget_currency} {totalCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 pt-2">
                                        <span className="text-muted-foreground">Budget</span>
                                        <span className="font-medium">{trip.budget_currency} {trip.total_budget.toLocaleString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="budget">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Budget Breakdown</CardTitle>
                                <CardDescription>Track your expenses against your budget.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                                        <span>Total Budget</span>
                                        <span className="font-bold">₹{trip.total_budget.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-ocean/10 rounded-lg">
                                        <span>Estimated Spent</span>
                                        <span className="font-bold text-ocean">₹{totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg">
                                        <span>Remaining</span>
                                        <span className={`font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            ₹{remainingBudget.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 h-[300px] w-full">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <ReTooltip formatter={(value: number) => `₹${value}`} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            No expenses to show chart
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Expense List</h3>
                                <AddExpenseDialog tripId={trip.id} onSuccess={fetchTripData} />
                            </div>

                            {expenses.length > 0 ? (
                                <div className="space-y-3">
                                    {expenses.map((expense) => (
                                        <Card key={expense.id} className="overflow-hidden">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                        <Receipt className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{expense.description}</p>
                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary capitalize text-muted-foreground">
                                                            {expense.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">₹{expense.amount.toLocaleString()}</p>
                                                    {expense.expense_date && (
                                                        <p className="text-xs text-muted-foreground">{format(new Date(expense.expense_date), "MMM d")}</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 border border-dashed rounded-lg text-muted-foreground">
                                    <Receipt className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No extra expenses added.</p>
                                    <Button variant="link" className="mt-2 text-ocean">Add your first expense</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="calendar" className="h-[800px]">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Trip Calendar</CardTitle>
                            <CardDescription>Visual timeline of your trip and activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[calc(100%-80px)] p-6">
                            <Calendar
                                localizer={localizer}
                                events={[
                                    // Trip Duration Event
                                    {
                                        title: `${trip.name} (Entire Trip)`,
                                        start: new Date(trip.start_date),
                                        end: new Date(trip.end_date),
                                        allDay: true,
                                        resource: 'trip'
                                    },
                                    // Add Destination Events
                                    ...destinations.map(d => ({
                                        title: `📍 ${d.city_name}`,
                                        start: d.arrival_date ? new Date(d.arrival_date) : new Date(trip.start_date),
                                        end: d.departure_date ? new Date(d.departure_date) : d.arrival_date ? new Date(d.arrival_date) : new Date(trip.end_date),
                                        allDay: true,
                                        resource: 'destination'
                                    })),
                                    // Add Activity Events
                                    ...destinations.flatMap(d => d.trip_activities?.map(a => ({
                                        title: `🎫 ${a.name}`,
                                        start: a.start_time ? new Date(a.start_time) : (d.arrival_date ? new Date(d.arrival_date) : new Date(trip.start_date)),
                                        end: a.end_time ? new Date(a.end_time) : (a.start_time ? new Date(a.start_time) : (d.arrival_date ? new Date(d.arrival_date) : new Date(trip.start_date))),
                                        allDay: !a.start_time,
                                        resource: 'activity'
                                    })) || [])
                                ]}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%' }}
                                views={['month', 'week', 'day', 'agenda']}
                                defaultView="month"
                                defaultDate={new Date(trip.start_date)}
                                eventPropGetter={(event) => {
                                    let backgroundColor = '#3174ad';
                                    if (event.resource === 'trip') backgroundColor = '#4f46e5'; // Indigo
                                    if (event.resource === 'destination') backgroundColor = '#0891b2'; // Cyan
                                    if (event.resource === 'activity') backgroundColor = '#f97316'; // Orange
                                    return { style: { backgroundColor } };
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );

};

export default TripDetails;
