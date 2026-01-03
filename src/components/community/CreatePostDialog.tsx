
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type CreatePostDialogProps = {
    onPostCreated: (post: any) => void;
};

const CreatePostDialog = ({ onPostCreated }: CreatePostDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [channel, setChannel] = useState("Tourism");
    const [image, setImage] = useState<string | null>(null);
    const { toast } = useToast();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulator image upload by creating a local URL
            // In a real app, this would upload to Supabase Storage
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const newPost = {
                id: Date.now(),
                channel,
                author: {
                    name: "You (Demo User)",
                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                },
                title,
                content,
                image,
                likes: 0,
                comments: 0,
                timestamp: "Just now"
            };

            onPostCreated(newPost);

            toast({
                title: "Post created!",
                description: "Your post has been shared with the community.",
                variant: "default", // or "success" if configured
            });

            // Reset form
            setTitle("");
            setContent("");
            setImage(null);
            setIsLoading(false);
            setIsOpen(false);
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-ocean hover:bg-ocean-dark text-white gap-2 shadow-lg hover:shadow-xl transition-all">
                    <ImagePlus className="w-4 h-4" />
                    Create New Post
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create a Post</DialogTitle>
                    <DialogDescription>
                        Share your travel stories, questions, or tips with the community.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="channel">Channel</Label>
                        <Select value={channel} onValueChange={setChannel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a channel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Tourism">Tourism</SelectItem>
                                <SelectItem value="Way2Travel">Way2Travel</SelectItem>
                                <SelectItem value="YourSpace">YourSpace</SelectItem>
                                <SelectItem value="DreamWeavers">DreamWeavers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Give your post a catchy title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="What's on your mind?"
                            className="min-h-[120px] resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Image (Optional)</Label>
                        <div className="flex items-center gap-4">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="cursor-pointer file:cursor-pointer file:text-ocean file:font-semibold"
                            />
                        </div>
                        {image && (
                            <div className="relative mt-2 rounded-lg overflow-hidden border border-slate-200 h-40 w-full">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
                                    onClick={() => setImage(null)}
                                >
                                    &times;
                                </Button>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-ocean">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostDialog;
