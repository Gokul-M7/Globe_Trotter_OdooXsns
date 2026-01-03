import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Plane } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Trip name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    dates: z.object({
        from: z.date({
            required_error: "Start date is required",
        }),
        to: z.date({
            required_error: "End date is required",
        }),
    }),
    budget: z.string().optional(), // Will parse to number later
});

const CreateTrip = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            budget: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) return;
        setIsLoading(true);

        try {
            const { data, error } = await supabase
                .from("trips" as any)
                .insert({
                    user_id: user.id,
                    name: values.name,
                    description: values.description,
                    start_date: format(values.dates.from, "yyyy-MM-dd"),
                    end_date: format(values.dates.to, "yyyy-MM-dd"),
                    total_budget: values.budget ? parseFloat(values.budget) : 0,
                    budget_currency: "INR",
                })
                .select()
                .single();

            if (error) throw error;

            toast.success("Trip created successfully!");
            if (data) {
                navigate(`/trips/${(data as any).id}`);
            }
        } catch (error: any) {
            console.error("Error creating trip:", error);
            toast.error("Failed to create trip. Please try again.");
            // For demo purposes if DB lacks table, just go back
            // navigate("/dashboard");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 max-w-2xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Trip</h1>
                <p className="text-muted-foreground">Start planning your next adventure.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-soft">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trip Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Summer in Kashmir" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dates"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Travel Dates</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value?.from ? (
                                                    field.value.to ? (
                                                        <>
                                                            {format(field.value.from, "LLL dd, y")} -{" "}
                                                            {format(field.value.to, "LLL dd, y")}
                                                        </>
                                                    ) : (
                                                        format(field.value.from, "LLL dd, y")
                                                    )
                                                ) : (
                                                    <span>Pick a date range</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                initialFocus
                                                mode="range"
                                                defaultMonth={field.value?.from}
                                                selected={field.value as any}
                                                onSelect={field.onChange}
                                                numberOfMonths={2}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Budget (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="50000" {...field} />
                                        </FormControl>
                                        <FormDescription>Estimated total budget in INR</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="What are your goals for this trip?"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="ghost" onClick={() => navigate("/dashboard")}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-ocean hover:bg-ocean-dark text-white" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plane className="mr-2 h-4 w-4" />
                                        Create Trip
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateTrip;
