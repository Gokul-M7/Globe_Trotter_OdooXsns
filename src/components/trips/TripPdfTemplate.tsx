import { format } from "date-fns";
import { MapPin, Calendar, Wallet, CheckCircle2, CircleDollarSign, Clock } from "lucide-react";

interface TripPdfTemplateProps {
    trip: any;
    destinations: any[];
    expenses: any[];
    totalCost: number;
    activityCost: number;
    expenseCost: number;
}

const TripPdfTemplate = ({ trip, destinations, expenses, totalCost, activityCost, expenseCost }: TripPdfTemplateProps) => {
    if (!trip) return null;

    const duration = new Date(trip.end_date).getDate() - new Date(trip.start_date).getDate() + 1;

    return (
        <div
            id="trip-pdf-template"
            style={{
                width: '794px', // A4 Pixel width at 96 DPI (approx)
                minHeight: '1123px',
                backgroundColor: 'white',
                padding: '40px',
                position: 'absolute',
                top: '-10000px',
                left: '-10000px'
            }}
            className="text-slate-900 font-sans"
        >
            {/* Header Section */}
            <div className="bg-ocean text-white p-8 rounded-3xl mb-8 flex justify-between items-start shadow-sm">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
                    <p className="text-blue-100 text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {format(new Date(trip.start_date), "MMMM d")} - {format(new Date(trip.end_date), "MMMM d, yyyy")}
                    </p>
                </div>
                <div className="text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                    <p className="text-sm text-blue-100 uppercase tracking-widest mb-1">Total Budget</p>
                    <p className="text-3xl font-bold">{trip.budget_currency} {trip.total_budget.toLocaleString()}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-ocean">
                        <Clock className="w-6 h-6" />
                        <span className="font-bold text-sm uppercase">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{duration} Days</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-green-600">
                        <Wallet className="w-6 h-6" />
                        <span className="font-bold text-sm uppercase">Total Spent</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">₹{totalCost.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 mb-2 text-purple-600">
                        <MapPin className="w-6 h-6" />
                        <span className="font-bold text-sm uppercase">Stops</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{destinations.length} Destinations</p>
                </div>
            </div>

            {/* Itinerary Section */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-ocean" />
                    Trip Itinerary
                </h2>
                <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 ml-3">
                    {destinations.map((dest, index) => (
                        <div key={dest.id} className="relative pl-8">
                            {/* Dot on Timeline */}
                            <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-ocean border-4 border-white shadow-sm"></div>

                            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm break-inside-avoid">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{dest.city_name}</h3>
                                        <p className="text-slate-500 font-medium">{dest.country_name}</p>
                                    </div>
                                    {dest.arrival_date && (
                                        <div className="text-right">
                                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                                                {format(new Date(dest.arrival_date), "MMM d")}
                                                {dest.departure_date ? ` - ${format(new Date(dest.departure_date), "MMM d")}` : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {dest.trip_activities && dest.trip_activities.length > 0 ? (
                                    <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Planned Activities</p>
                                        {dest.trip_activities.map((activity: any) => (
                                            <div key={activity.id} className="flex justify-between items-center text-sm border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    <span className="font-medium text-slate-700">{activity.name}</span>
                                                </div>
                                                <span className="font-semibold text-slate-600">
                                                    {activity.cost > 0 ? `₹${activity.cost}` : 'Free'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No activities scheduled yet.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expenses Breakdown */}
            <div className="break-inside-avoid">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2 flex items-center gap-2">
                    <CircleDollarSign className="w-6 h-6 text-orange-500" />
                    Additional Expenses
                </h2>
                {expenses.length > 0 ? (
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b-2 border-slate-100 bg-slate-50 text-slate-500">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">Item</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                                <th scope="col" className="px-4 py-3 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{expense.description}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs capitalize">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {expense.expense_date ? format(new Date(expense.expense_date), "MMM d") : '-'}
                                    </td>
                                    <td className="px-4 py-3 font-bold text-slate-800 text-right">₹{expense.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 font-bold text-slate-800">
                            <tr>
                                <td colSpan={3} className="px-4 py-3 text-right uppercase text-xs tracking-wider">Total Extra Expenses</td>
                                <td className="px-4 py-3 text-right">₹{expenseCost.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <p className="text-slate-500 italic">No additional expenses recorded.</p>
                )}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center text-slate-400 text-sm">
                <p>Generated by DreamWeaver Trips</p>
                <p>{new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default TripPdfTemplate;
