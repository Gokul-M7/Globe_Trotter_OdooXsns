
import { useState, useMemo } from "react";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, MessageSquare, ThumbsUp, Share2, MoreHorizontal, Compass, Plane, User, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import CreatePostDialog from "@/components/community/CreatePostDialog";

// --- Mock Data ---
type Channel = "Tourism" | "Way2Travel" | "YourSpace" | "DreamWeavers" | "All";

const CHANNELS: { id: Channel; icon: any; color: string }[] = [
    { id: "Tourism", icon: Compass, color: "text-blue-500" },
    { id: "Way2Travel", icon: Plane, color: "text-green-500" },
    { id: "YourSpace", icon: User, color: "text-purple-500" },
    { id: "DreamWeavers", icon: Users, color: "text-orange-500" },
];

const MOCK_POSTS = [
    // Tourism Channel (General Travel Info)
    {
        id: 1,
        channel: "Tourism",
        author: { name: "Kerala Tourism", avatar: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=100&q=80" },
        title: "Top 10 Places to Visit in Munnar this Winter",
        content: "Munnar is breathtaking in December. From the misty tea gardens to the blooming Neelakurinji (if you're lucky!), here is our curated list of must-visit spots...",
        image: "https://images.unsplash.com/photo-1596370743446-6a7ef43a36f9?w=800&q=80",
        likes: 1240, comments: 45, timestamp: "2 hours ago"
    },
    {
        id: 2,
        channel: "Tourism",
        author: { name: "Rajasthan Diaries", avatar: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=100&q=80" },
        title: "The Royal Splendor of Jaipur",
        content: "Experience the Pink City like never before. Visit the Hawa Mahal early in the morning to catch the sun rays filtering through the stained glass windows.",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
        likes: 856, comments: 120, timestamp: "5 hours ago"
    },
    {
        id: 3,
        channel: "Tourism",
        author: { name: "Himachal Explorer", avatar: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=100&q=80" },
        title: "Manali Snow Forecast 2024",
        content: "Heavy snowfall expected this weekend! Pack your woolens and get ready for skiing in Solang Valley.",
        image: "https://images.unsplash.com/photo-1605649486169-32363b4e8b46?w=800&q=80",
        likes: 2100, comments: 340, timestamp: "1 day ago"
    },

    // Way2Travel (Tips, Hacks, Logistics)
    {
        id: 4,
        channel: "Way2Travel",
        author: { name: "Alex Rover", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" },
        title: "How to pack light for a 2-week trip",
        content: "You don't need that extra pair of jeans. Trust me. Here is my capsule wardrobe guide for tropical destinations.",
        image: null,
        likes: 89, comments: 12, timestamp: "3 hours ago"
    },
    {
        id: 5,
        channel: "Way2Travel",
        author: { name: "Budget Backpacker", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" },
        title: "Train vs Flight in India: What to choose?",
        content: "While flights save time, Vande Bharat trains offer a scenic and comfortable alternative for shorter distances like Bangalore to Chennai.",
        image: "https://images.unsplash.com/photo-1532305523713-5aadf5748cfc?w=800&q=80",
        likes: 450, comments: 89, timestamp: "6 hours ago"
    },
    {
        id: 6,
        channel: "Way2Travel",
        author: { name: "Travel Hacker", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80" },
        title: "5 Hidden Google Flights tricks",
        content: "Did you know you can search for 'Anywhere' to find the cheapest flights? Here is how to use the Explore map feature effectively.",
        image: null,
        likes: 1205, comments: 56, timestamp: "2 days ago"
    },

    // YourSpace (Personal Stories, Blogs)
    {
        id: 7,
        channel: "YourSpace",
        author: { name: "Loris", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80" },
        title: "My Solo Trip to Pondicherry",
        content: "I was scared at first, but the French colony vibe, the cafes, and the peace at Auroville made it totally worth it. Highly recommend Cafe des Arts!",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f00d44?w=800&q=80",
        likes: 340, comments: 28, timestamp: "1 day ago"
    },
    {
        id: 8,
        channel: "YourSpace",
        author: { name: "Sarah K.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
        title: "Family vacation gone wrong... and right",
        content: "We missed our flight, lost a bag, but discovered a hidden beach because of the delay. Sometimes the journey is indeed the destination.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        likes: 560, comments: 90, timestamp: "3 days ago"
    },
    {
        id: 9,
        channel: "YourSpace",
        author: { name: "Foodie Jin", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80" },
        title: "Best Biryani in Hyderabad?",
        content: "I tried Paradise, Bawarchi, and Shah Ghouse. Unpopular opinion: Shadab near Charminar wins hands down!",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
        likes: 890, comments: 450, timestamp: "4 days ago"
    },

    // DreamWeavers (Itineraries, Dreams, Bucket Lists)
    {
        id: 10,
        channel: "DreamWeavers",
        author: { name: "Bucket List Guy", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" },
        title: "My Dream Itinerary: The Great Himalayan Trek",
        content: "Day 1: Arrival in Leh. Day 2: Acclimatization. Day 3: Drive to Nubra Valley via Khardung La... Who wants to join me in 2025?",
        image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80",
        likes: 1500, comments: 230, timestamp: "1 week ago"
    },
    {
        id: 11,
        channel: "DreamWeavers",
        author: { name: "Luxury Traveler", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" },
        title: "Maldives Water Villa Experience",
        content: "Waking up to the ocean right beneath your feet is purely magical. Check out this video tour of the villa.",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
        likes: 2300, comments: 110, timestamp: "2 weeks ago"
    },
    {
        id: 12,
        channel: "DreamWeavers",
        author: { name: "Planner Pro", avatar: "https://images.unsplash.com/photo-1552058835-27644a80f679?w=100&q=80" },
        title: "Complete Europe Trip under 2 Lakhs?",
        content: "Here is the exact breakdown of how I managed a 10-day trip to Paris, Amsterdam, and Swiss Alps on a budget.",
        image: "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?w=800&q=80",
        likes: 4500, comments: 670, timestamp: "3 weeks ago"
    }
];

const Community = () => {
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeChannel, setActiveChannel] = useState<Channel>("All");
    const [sortOption, setSortOption] = useState<"recent" | "popular">("recent");

    const filteredPosts = useMemo(() => {
        let currentPosts = [...posts];

        // 1. Filter by Channel
        if (activeChannel !== "All") {
            currentPosts = currentPosts.filter(post => post.channel === activeChannel);
        }

        // 2. Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            currentPosts = currentPosts.filter(post =>
                post.title.toLowerCase().includes(lowerQuery) ||
                post.content.toLowerCase().includes(lowerQuery) ||
                post.author.name.toLowerCase().includes(lowerQuery)
            );
        }

        // 3. Sort
        if (sortOption === "popular") {
            currentPosts.sort((a, b) => b.likes - a.likes);
        }
        // Note: For "recent", we are relying on the array order as mock timestamp isn't a Date object. 

        return currentPosts;
    }, [activeChannel, searchQuery, sortOption]);

    const handlePostCreated = (newPost: any) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    console.log("Community component rendered", { filteredPosts });

    return (
        <div className="container mx-auto px-4 py-4 max-w-7xl flex flex-col lg:flex-row gap-8">

            {/* Left Sidebar: Channels */}
            <div className="w-full lg:w-64 shrink-0 space-y-6">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm sticky top-24">
                    <div className="mb-6">
                        <CreatePostDialog onPostCreated={handlePostCreated} />
                    </div>

                    <h2 className="font-bold text-lg mb-4 px-2">Channels</h2>
                    <div className="space-y-1">
                        <Button
                            variant={activeChannel === "All" ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium"
                            onClick={() => setActiveChannel("All")}
                        >
                            <Globe className="mr-2 h-4 w-4 text-slate-500" />
                            All Posts
                        </Button>
                        <Separator className="my-2" />
                        {CHANNELS.map((channel) => {
                            const Icon = channel.icon;
                            return (
                                <Button
                                    key={channel.id}
                                    variant={activeChannel === channel.id ? "secondary" : "ghost"}
                                    className="w-full justify-start font-medium"
                                    onClick={() => setActiveChannel(channel.id)}
                                >
                                    <Icon className={`mr-2 h-4 w-4 ${channel.color}`} />
                                    {channel.id}
                                </Button>
                            );
                        })}
                    </div>

                    <div className="mt-8 bg-ocean/10 p-4 rounded-lg">
                        <h3 className="font-bold text-sm text-ocean mb-2">Create New Channel?</h3>
                        <p className="text-xs text-muted-foreground mb-3">Have a new topic in mind? Start a community.</p>
                        <Button size="sm" className="w-full bg-ocean hover:bg-ocean/90">Request +</Button>
                    </div>
                </div>
            </div>

            {/* Main Content: Feed */}
            <div className="flex-1 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{activeChannel === "All" ? "Community Feed" : activeChannel}</h1>
                    <p className="text-muted-foreground">
                        {activeChannel === "All"
                            ? "Explore stories, tips, and dreams from travelers worldwide."
                            : `Welcome to the ${activeChannel} channel.`}
                    </p>
                </div>

                {/* Search & Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-white/80">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search discussions..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <Button
                                variant={sortOption === "popular" ? "default" : "outline"}
                                className="gap-2"
                                onClick={() => setSortOption("popular")}
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Popular
                            </Button>
                            <Button
                                variant={sortOption === "recent" ? "default" : "outline"}
                                className="gap-2"
                                onClick={() => setSortOption("recent")}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Recent
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Posts List */}
                <div className="space-y-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-all duration-300 border-slate-100">
                                <CardHeader className="flex flex-row items-center gap-4 p-5 pb-3">
                                    <Avatar className="h-10 w-10 border border-slate-200">
                                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-base">{post.title}</h3>
                                            <Badge variant="secondary" className="text-xs font-normal">
                                                {post.channel}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-medium text-foreground">{post.author.name}</span>
                                            <span>•</span>
                                            <span>{post.timestamp}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-400">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-5 pt-0">
                                    <p className="mb-4 text-slate-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                        {post.content}
                                    </p>

                                    {post.image && (
                                        <div className="rounded-xl overflow-hidden mb-5 max-h-[400px] shadow-sm">
                                            <img src={post.image} alt="Post attachment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-ocean hover:bg-ocean/10 gap-2 transition-colors">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span className="font-medium">{post.likes}</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-blue-500 hover:bg-blue-50 gap-2 transition-colors">
                                            <MessageSquare className="h-4 w-4" />
                                            <span className="font-medium">{post.comments}</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-green-500 hover:bg-green-50 gap-2 ml-auto transition-colors">
                                            <Share2 className="h-4 w-4" />
                                            Share
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="font-semibold text-lg text-slate-700">No posts found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                            <Button
                                variant="link"
                                className="mt-2 text-ocean"
                                onClick={() => { setSearchQuery(""); setActiveChannel("All"); }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Community;
