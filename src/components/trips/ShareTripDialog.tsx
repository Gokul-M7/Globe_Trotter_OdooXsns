import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Mail, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ShareTripDialogProps {
    tripName: string;
    tripId: string;
}

const ShareTripDialog = ({ tripName, tripId }: ShareTripDialogProps) => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter an email address");
            return;
        }

        setLoading(true);
        try {
            // 1. Generate PDF
            toast.info("Generating PDF attachment...");
            const element = document.getElementById('trip-pdf-template');
            if (!element) throw new Error("PDF Template not found");

            const canvas = await html2canvas(element, {
                scale: 1, // Reduced scale for email to prevent payload size limits
                useCORS: true,
                logging: false,
                windowWidth: 1200
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG compression

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfImageHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = pdfImageHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfImageHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - pdfImageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, - (pdfImageHeight - heightLeft), pdfWidth, pdfImageHeight);
                heightLeft -= pdfHeight;
            }

            // Convert PDF to Base64 (remove prefix for Resend)
            const pdfBase64 = pdf.output('datauristring').split(',')[1];
            console.log("PDF Size:", pdfBase64.length); // Debug size

            // 2. Call Edge Function
            toast.info("Sending email...");
            const { data, error } = await supabase.functions.invoke('send-trip-email', {
                body: {
                    email,
                    subject: `${tripName} - Trip Itinerary`,
                    tripName,
                    html: `
            <h1>Trip Itinerary for ${tripName}</h1>
            <p>Here is the detailed itinerary and budget breakdown for the trip.</p>
            <p>Please find the PDF attached.</p>
            <br/>
            <p>Sent via DreamWeaver Trips</p>
          `,
                    pdfBase64: pdfBase64
                }
            });

            if (error) throw error;

            toast.success(`Trip details sent to ${email}!`);
            setOpen(false);
            setEmail("");

        } catch (error: any) {
            console.error("Error sharing trip:", error);
            toast.error(`Failed to share trip: ${error.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="glass" size="icon" title="Share Trip">
                    <Share2 className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Trip Details</DialogTitle>
                    <DialogDescription>
                        Send the trip itinerary and budget as a PDF to a friend via email.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleShare} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Recipient Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                placeholder="friend@example.com"
                                type="email"
                                className="pl-9"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-ocean hover:bg-ocean/90" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Email
                            </>
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ShareTripDialog;
