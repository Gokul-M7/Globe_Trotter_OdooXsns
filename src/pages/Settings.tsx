
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User, Settings as SettingsIcon, Bell, Shield, Users, Globe, Smartphone, Download, CreditCard, LogOut, Moon, Sun, Monitor
} from "lucide-react";

type SettingsSection = "account" | "preferences" | "budget" | "notifications" | "privacy" | "collaboration" | "region" | "appearance" | "data";

const Settings = () => {
    const { user, signOut } = useAuth();
    const { toast } = useToast();
    const [activeSection, setActiveSection] = useState<SettingsSection>("account");
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        if (user) fetchSettings();
    }, [user]);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user?.id)
                .single();

            if (data) {
                setSettings(data);
            } else if (error && error.code === 'PGRST116') {
                // If not found, create default settings
                const { data: newData, error: createError } = await supabase
                    .from('user_settings')
                    .insert([{ user_id: user?.id }])
                    .select()
                    .single();

                if (newData) setSettings(newData);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateSetting = async (key: string, value: any) => {
        // Optimistic update
        setSettings({ ...settings, [key]: value });

        try {
            const { error } = await supabase
                .from('user_settings')
                .update({ [key]: value })
                .eq('user_id', user?.id);

            if (error) throw error;

            toast({
                title: "Settings saved",
                description: "Your preferences have been updated.",
            });
        } catch (error) {
            console.error("Error updating setting:", error);
            toast({
                title: "Error",
                description: "Failed to save changes.",
                variant: "destructive",
            });
            // Revert on error (would need prev state, simplified here)
        }
    };

    const renderSidebar = () => (
        <div className="w-full md:w-64 space-y-1">
            <h2 className="font-bold text-lg mb-4 px-4">Settings</h2>

            <SidebarButton
                active={activeSection === "account"}
                onClick={() => setActiveSection("account")}
                icon={User}
                label="Account & Security"
            />
            <SidebarButton
                active={activeSection === "preferences"}
                onClick={() => setActiveSection("preferences")}
                icon={SettingsIcon}
                label="Travel Preferences"
            />
            <SidebarButton
                active={activeSection === "budget"}
                onClick={() => setActiveSection("budget")}
                icon={CreditCard}
                label="Budget & Currency"
            />
            <SidebarButton
                active={activeSection === "notifications"}
                onClick={() => setActiveSection("notifications")}
                icon={Bell}
                label="Notifications"
            />
            <SidebarButton
                active={activeSection === "privacy"}
                onClick={() => setActiveSection("privacy")}
                icon={Shield}
                label="Privacy & Sharing"
            />
            <SidebarButton
                active={activeSection === "collaboration"}
                onClick={() => setActiveSection("collaboration")}
                icon={Users}
                label="Collaboration"
            />
            <SidebarButton
                active={activeSection === "region"}
                onClick={() => setActiveSection("region")}
                icon={Globe}
                label="Language & Region"
            />
            <SidebarButton
                active={activeSection === "appearance"}
                onClick={() => setActiveSection("appearance")}
                icon={Smartphone}
                label="App Appearance"
            />
            <SidebarButton
                active={activeSection === "data"}
                onClick={() => setActiveSection("data")}
                icon={Download}
                label="Data & Export"
            />
        </div>
    );

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
            {renderSidebar()}

            <div className="flex-1">
                {activeSection === "account" && <AccountSection user={user} signOut={signOut} />}
                {activeSection === "preferences" && <PreferencesSection settings={settings} update={updateSetting} />}
                {activeSection === "budget" && <BudgetSection settings={settings} update={updateSetting} />}
                {activeSection === "notifications" && <NotificationsSection settings={settings} update={updateSetting} />}
                {activeSection === "privacy" && <PrivacySection settings={settings} update={updateSetting} />}
                {activeSection === "collaboration" && <CollaborationSection settings={settings} update={updateSetting} />}
                {activeSection === "region" && <RegionSection settings={settings} update={updateSetting} />}
                {activeSection === "appearance" && <AppearanceSection settings={settings} update={updateSetting} />}
                {activeSection === "data" && <DataSection />}
            </div>
        </div>
    );
};

// --- Sub-Components ---

const SidebarButton = ({ active, onClick, icon: Icon, label }: any) => (
    <Button
        variant={active ? "secondary" : "ghost"}
        className={`w-full justify-start ${active ? "bg-slate-100 font-medium" : "text-slate-600"}`}
        onClick={onClick}
    >
        <Icon className="mr-2 h-4 w-4" />
        {label}
    </Button>
);

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
    <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <Separator className="mt-4" />
    </div>
);

// 1. Account & Security
const AccountSection = ({ user, signOut }: any) => {
    const { toast } = useToast();
    // Mock handlers for Auth actions
    const handlePasswordReset = () => {
        toast({ title: "Email Sent", description: "Check your inbox to reset your password." });
    };

    return (
        <div className="space-y-6">
            <SectionHeader title="Account & Security" description="Manage your login details and account security." />

            <Card>
                <CardHeader>
                    <CardTitle>Login Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Email Address</Label>
                        <div className="flex gap-2">
                            <Input value={user?.email} disabled />
                            <Button variant="outline">Change</Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>Password</Label>
                        <Button variant="outline" className="w-fit" onClick={handlePasswordReset}>Change Password</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Session Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Active Sessions</p>
                            <p className="text-sm text-muted-foreground">You are currently logged in on this device.</p>
                        </div>
                        <Button variant="outline">View All</Button>
                    </div>
                    <Separator />
                    <div className="pt-2">
                        <Button variant="destructive" onClick={signOut} className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Logout from all devices
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// 2. Travel Preferences
const PreferencesSection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="Travel Preferences" description="Customize how we recommend trips to you." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label>Preferred Travel Style</Label>
                    <Select value={settings.travel_style || "Mid"} onValueChange={(val) => update('travel_style', val)}>
                        <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Budget">Budget Friendly</SelectItem>
                            <SelectItem value="Mid">Balanced (Mid-Range)</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Travel Pace</Label>
                    <Select value={settings.travel_pace || "Relaxed"} onValueChange={(val) => update('travel_pace', val)}>
                        <SelectTrigger><SelectValue placeholder="Select pace" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Relaxed">Relaxed (Slow & Steady)</SelectItem>
                            <SelectItem value="Fast">Fast Paced (See everything)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Interests (Multi-select simulated)</Label>
                    <div className="flex flex-wrap gap-2">
                        {['Nature', 'Adventure', 'Food', 'Culture', 'History'].map(tag => (
                            <Button
                                key={tag}
                                variant={(settings.interests || []).includes(tag) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    const current = settings.interests || [];
                                    const newVal = current.includes(tag)
                                        ? current.filter((t: string) => t !== tag)
                                        : [...current, tag];
                                    update('interests', newVal);
                                }}
                            >
                                {tag}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

// 3. Budget & Currency
const BudgetSection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="Budget & Currency" description="Manage your financial preferences for trips." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select value={settings.currency || "INR"} onValueChange={(val) => update('currency', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Automatic Conversion</Label>
                        <p className="text-sm text-muted-foreground">Automatically convert costs to your default currency.</p>
                    </div>
                    <Switch checked={settings.auto_conversion} onCheckedChange={(val) => update('auto_conversion', val)} />
                </div>

                <div className="space-y-2">
                    <Label>Default Daily Budget Limit</Label>
                    <Input
                        type="number"
                        value={settings.daily_budget_limit || ""}
                        onChange={(e) => update('daily_budget_limit', e.target.value)}
                        placeholder="e.g. 5000"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Smart Budget Suggestions</Label>
                        <p className="text-sm text-muted-foreground">Get AI-powered tips to save money.</p>
                    </div>
                    <Switch checked={settings.smart_budget} onCheckedChange={(val) => update('smart_budget', val)} />
                </div>
            </CardContent>
        </Card>
    </div>
);

// 4. Notifications
const NotificationsSection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="Notifications" description="Control what alerts you receive." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Trip Start Reminders</Label>
                    </div>
                    <Switch checked={settings.trip_reminders} onCheckedChange={(val) => update('trip_reminders', val)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Daily Itinerary Alerts</Label>
                    </div>
                    <Switch checked={settings.daily_itinerary_alerts} onCheckedChange={(val) => update('daily_itinerary_alerts', val)} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Budget Overrun Alerts</Label>
                    </div>
                    <Switch checked={settings.overrun_alerts} onCheckedChange={(val) => update('overrun_alerts', val)} />
                </div>
                <Separator />
                <div className="space-y-2">
                    <Label>Preferred Notification Channel</Label>
                    <Select value={settings.notification_channel || "In-app"} onValueChange={(val) => update('notification_channel', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="In-app">In-App Only</SelectItem>
                            <SelectItem value="Email">Email Only</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    </div>
);

// 5. Privacy
const PrivacySection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="Privacy & Sharing" description="Manage who can see your data." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label>Default Trip Visibility</Label>
                    <Select value={settings.default_trip_visibility || "Private"} onValueChange={(val) => update('default_trip_visibility', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Private">Private (Only You)</SelectItem>
                            <SelectItem value="Friends">Friends Only</SelectItem>
                            <SelectItem value="Public">Public (Everyone)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Allow others to copy my public trips</Label>
                    </div>
                    <Switch checked={settings.allow_copy} onCheckedChange={(val) => update('allow_copy', val)} />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">Control who can see your profile page.</p>
                    </div>
                    <Select value={settings.profile_visibility || "Public"} onValueChange={(val) => update('profile_visibility', val)}>
                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    </div>
);

// 6. Collaboration
const CollaborationSection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="Collaboration" description="Settings for shared trips." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label>Default Collaborator Permission</Label>
                    <Select value={settings.default_collab_permission || "View"} onValueChange={(val) => update('default_collab_permission', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="View">View Only</SelectItem>
                            <SelectItem value="Comment">Vote & Comment</SelectItem>
                            <SelectItem value="Edit">Edit Itinerary</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Enable Comments by default</Label>
                    </div>
                    <Switch checked={settings.enable_comments} onCheckedChange={(val) => update('enable_comments', val)} />
                </div>
            </CardContent>
        </Card>
    </div>
);

// 7. Region
const RegionSection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="Language & Region" description="Localization settings." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label>App Language</Label>
                    <Select value={settings.app_language || "en"} onValueChange={(val) => update('app_language', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English (US)</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select value={settings.date_format || "DD/MM/YYYY"} onValueChange={(val) => update('date_format', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    </div>
);

// 8. Appearance
const AppearanceSection = ({ settings, update }: any) => (
    <div className="space-y-6">
        <SectionHeader title="App Appearance" description="Customize how the app looks." />
        <Card>
            <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-4">
                        <Button
                            variant={settings.theme === "Light" ? "default" : "outline"}
                            onClick={() => update('theme', 'Light')}
                            className="flex-1"
                        >
                            <Sun className="mr-2 h-4 w-4" /> Light
                        </Button>
                        <Button
                            variant={settings.theme === "Dark" ? "default" : "outline"}
                            onClick={() => update('theme', 'Dark')}
                            className="flex-1"
                        >
                            <Moon className="mr-2 h-4 w-4" /> Dark
                        </Button>
                        <Button
                            variant={settings.theme === "System" ? "default" : "outline"}
                            onClick={() => update('theme', 'System')}
                            className="flex-1"
                        >
                            <Monitor className="mr-2 h-4 w-4" /> System
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Reduce Animations</Label>
                    </div>
                    <Switch checked={settings.reduce_animations} onCheckedChange={(val) => update('reduce_animations', val)} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>High Contrast Mode</Label>
                    </div>
                    <Switch checked={settings.high_contrast} onCheckedChange={(val) => update('high_contrast', val)} />
                </div>
            </CardContent>
        </Card>
    </div>
);

// 9. Data
const DataSection = () => {
    const { toast } = useToast();
    const handleExport = () => {
        toast({ title: "Export Started", description: "You will receive an email shortly." });
    }

    return (
        <div className="space-y-6">
            <SectionHeader title="Data & Export" description="Manage your data and privacy." />
            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Export all my trips</p>
                            <p className="text-sm text-muted-foreground">Download a copy of your trip data as JSON/PDF.</p>
                        </div>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                    </div>
                    <Separator />
                    <div className="pt-2">
                        <p className="font-medium text-destructive mb-2">Danger Zone</p>
                        <Button variant="destructive" className="w-full sm:w-auto">Delete Account</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Settings;
