import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    city_name: z.string().min(2, "City name is required"),
    country_name: z.string().min(2, "Country name is required"),
    dates: z.object({
        from: z.date().optional(),
        to: z.date().optional(),
    }).optional(),
});

interface AddDestinationDialogProps {
    tripId: string;
    onSuccess: () => void;
    trigger?: React.ReactNode;
}

const AddDestinationDialog = ({ tripId, onSuccess, trigger }: AddDestinationDialogProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            city_name: "",
            country_name: "India",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const { error } = await supabase
                .from("trip_destinations" as any)
                .insert({
                    trip_id: tripId,
                    city_name: values.city_name,
                    country_name: values.country_name,
                    arrival_date: values.dates?.from ? format(values.dates.from, "yyyy-MM-dd") : null,
                    departure_date: values.dates?.to ? format(values.dates.to, "yyyy-MM-dd") : null,
                    list_order: 1, // Default to 1 for now, or fetch max order + 1
                });

            if (error) throw error;

            toast.success("Destination added!");
            setOpen(false);
            form.reset();
            onSuccess();
        } catch (error) {
            console.error("Error adding destination:", error);
            toast.error("Failed to add destination.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-ocean hover:bg-ocean-dark text-white">
                        <MapPin className="w-4 h-4 mr-2" />
                        Add Destination
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Destination</DialogTitle>
                    <DialogDescription>
                        Where are you heading next in your journey?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="city_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Jaipur" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="country_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., India" {...field} />
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
                                    <FormLabel>Dates (Optional)</FormLabel>
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
                                                            {format(field.value.from, "LLL dd")} -{" "}
                                                            {format(field.value.to, "LLL dd")}
                                                        </>
                                                    ) : (
                                                        format(field.value.from, "LLL dd")
                                                    )
                                                ) : (
                                                    <span>Pick dates</span>
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

                        <DialogFooter>
                            <Button type="submit" disabled={loading} className="bg-ocean text-white">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Stop
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddDestinationDialog;
