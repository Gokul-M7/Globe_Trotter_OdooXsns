
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Camera, Share2, MapPin, Mail, Phone, Edit2, Check, X } from "lucide-react";

type ProfileData = {
    full_name: string | null;
    username: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    avatar_url: string | null;
    email?: string;
};

const Profile = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        username: "",
        bio: "",
        phone: "",
        location: "",
        avatar_url: "",
    });

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    const getProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    username: data.username || "",
                    bio: data.bio || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    avatar_url: data.avatar_url || "",
                    email: user?.email
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            const updates = {
                user_id: user.id,
                full_name: profile.full_name,
                username: profile.username,
                bio: profile.bio,
                phone: profile.phone,
                location: profile.location,
                avatar_url: profile.avatar_url,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            toast({
                title: "Profile updated",
                description: "Your changes have been saved successfully.",
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulator: In real app, upload to storage bucket
            const url = URL.createObjectURL(file);
            setProfile({ ...profile, avatar_url: url });
        }
    };

    const copyProfileLink = () => {
        const url = window.location.href; // In real app, typicaly /u/username
        navigator.clipboard.writeText(url);
        toast({
            title: "Link copied",
            description: "Profile link copied to clipboard",
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-ocean" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="grid md:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Quick Actions */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="text-center overflow-hidden border-slate-100 shadow-md">
                        <div className="h-24 bg-gradient-to-r from-ocean to-blue-500"></div>
                        <div className="px-6 pb-6 -mt-12">
                            <div className="relative inline-block">
                                <Avatar className="h-24 w-24 border-4 border-white shadow-lg mx-auto">
                                    <AvatarImage src={profile.avatar_url || ""} />
                                    <AvatarFallback className="text-xl bg-slate-100">{profile.full_name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-ocean text-white rounded-full cursor-pointer hover:bg-ocean-dark transition-colors shadow-sm">
                                        <Camera className="w-4 h-4" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                    </label>
                                )}
                            </div>

                            <h2 className="mt-4 font-bold text-xl">{profile.full_name || "Traveler"}</h2>
                            <p className="text-sm text-muted-foreground">@{profile.username || "username"}</p>

                            {profile.location && (
                                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-slate-500">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{profile.location}</span>
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-2">
                                <Button variant="outline" className="w-full gap-2" onClick={copyProfileLink}>
                                    <Share2 className="w-4 h-4" />
                                    Share Profile
                                </Button>
                                <Button variant="destructive" className="w-full gap-2" onClick={signOut}>
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Details Form */}
                <div className="md:col-span-2">
                    <Card className="border-slate-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Profile Details</CardTitle>
                                <CardDescription>Manage your personal information and preferences.</CardDescription>
                            </div>
                            {!isEditing ? (
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-ocean hover:text-ocean-dark hover:bg-ocean/10">
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button size="sm" onClick={updateProfile} disabled={isSaving} className="bg-ocean">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-2" /> Save</>}
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <Separator />
                        <CardContent className="space-y-6 pt-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <div className="relative">
                                        <Input
                                            id="fullName"
                                            value={profile.full_name || ""}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? "bg-slate-50 border-transparent pl-10" : "pl-10"}
                                        />
                                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            value={profile.username || ""}
                                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? "bg-slate-50 border-transparent pl-10" : "pl-10"}
                                            placeholder="johndoe"
                                        />
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">@</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            value={profile.email || ""}
                                            disabled={true}
                                            className="bg-slate-50 border-transparent pl-10"
                                        />
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground ml-1">Email cannot be changed.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Input
                                            id="phone"
                                            value={profile.phone || ""}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? "bg-slate-50 border-transparent pl-10" : "pl-10"}
                                            placeholder="+91 98765 43210"
                                        />
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="location">Location</Label>
                                    <div className="relative">
                                        <Input
                                            id="location"
                                            value={profile.location || ""}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            disabled={!isEditing}
                                            className={!isEditing ? "bg-slate-50 border-transparent pl-10" : "pl-10"}
                                            placeholder="City, Country"
                                        />
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="bio">Bio / Tagline</Label>
                                    <Textarea
                                        id="bio"
                                        value={profile.bio || ""}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        disabled={!isEditing}
                                        className={!isEditing ? "bg-slate-50 border-transparent min-h-[100px]" : "min-h-[100px]"}
                                        placeholder="Tell us about your travel dreams..."
                                    />
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Helper component for icon since User is already imported in lucide-react potentially
const UserIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default Profile;
