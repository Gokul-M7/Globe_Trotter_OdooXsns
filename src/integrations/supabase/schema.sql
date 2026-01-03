-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- *** USER PROFILES ***
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies (Drop first to avoid errors if re-running)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profile Functions & Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- *** TRIPS APP TABLES ***

-- Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  start_date date,
  end_date date,
  cover_photo_url text,
  budget_currency text default 'INR',
  total_budget numeric(10, 2),
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trip Destinations (Stops)
CREATE TABLE IF NOT EXISTS public.trip_destinations (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  city_name text not null,
  country_name text not null,
  arrival_date date,
  departure_date date,
  list_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trip Activities
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id uuid default uuid_generate_v4() primary key,
  destination_id uuid references public.trip_destinations(id) on delete cascade not null,
  name text not null,
  description text,
  activity_type text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  cost numeric(10, 2) default 0,
  location_lat numeric,
  location_lng numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trip Expenses
CREATE TABLE IF NOT EXISTS public.trip_expenses (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  category text not null,
  amount numeric(10, 2) not null,
  description text,
  expense_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;

-- Trips Policies
DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
CREATE POLICY "Users can view own trips" ON public.trips for select using (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own trips" ON public.trips;
CREATE POLICY "Users can insert own trips" ON public.trips for insert with check (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
CREATE POLICY "Users can update own trips" ON public.trips for update using (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips" ON public.trips for delete using (auth.uid() = user_id);

-- Trip Destinations Policies
DROP POLICY IF EXISTS "Users can view own trip destinations" ON public.trip_destinations;
CREATE POLICY "Users can view own trip destinations" on public.trip_destinations for select 
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own trip destinations" ON public.trip_destinations;
CREATE POLICY "Users can insert own trip destinations" on public.trip_destinations for insert 
  with check (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own trip destinations" ON public.trip_destinations;
CREATE POLICY "Users can update own trip destinations" on public.trip_destinations for update
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own trip destinations" ON public.trip_destinations;
CREATE POLICY "Users can delete own trip destinations" on public.trip_destinations for delete
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

-- Trip Activities Policies
DROP POLICY IF EXISTS "Users can view own trip activities" ON public.trip_activities;
CREATE POLICY "Users can view own trip activities" on public.trip_activities for select 
  using (destination_id in (
    select id from public.trip_destinations where trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can insert own trip activities" ON public.trip_activities;
CREATE POLICY "Users can insert own trip activities" on public.trip_activities for insert 
  with check (destination_id in (
    select id from public.trip_destinations where trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can update own trip activities" ON public.trip_activities;
CREATE POLICY "Users can update own trip activities" on public.trip_activities for update 
  using (destination_id in (
    select id from public.trip_destinations where trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  ));

DROP POLICY IF EXISTS "Users can delete own trip activities" ON public.trip_activities;
CREATE POLICY "Users can delete own trip activities" on public.trip_activities for delete 
  using (destination_id in (
    select id from public.trip_destinations where trip_id in (
      select id from public.trips where user_id = auth.uid()
    )
  ));

-- Trip Expenses Policies
DROP POLICY IF EXISTS "Users can view own trip expenses" ON public.trip_expenses;
CREATE POLICY "Users can view own trip expenses" on public.trip_expenses for select
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert own trip expenses" ON public.trip_expenses;
CREATE POLICY "Users can insert own trip expenses" on public.trip_expenses for insert
  with check (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own trip expenses" ON public.trip_expenses;
CREATE POLICY "Users can update own trip expenses" on public.trip_expenses for update
  using (trip_id in (select id from public.trips where user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete own trip expenses" ON public.trip_expenses;

-- *** COMMUNITY TABLES ***

-- Community Posts
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  channel text not null,
  title text not null,
  content text not null,
  image_url text,
  likes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Community Likes (Optional for real implementation, but good to have)
CREATE TABLE IF NOT EXISTS public.community_likes (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.community_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  UNIQUE(post_id, user_id)
);

-- RLS Policies for Community
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Posts Policies
DROP POLICY IF EXISTS "Public posts are viewable by everyone" ON public.community_posts;
CREATE POLICY "Public posts are viewable by everyone" ON public.community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own posts" ON public.community_posts;
CREATE POLICY "Users can insert their own posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON public.community_posts;
CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.community_posts;
CREATE POLICY "Users can delete their own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Likes Policies
DROP POLICY IF EXISTS "Public likes are viewable by everyone" ON public.community_likes;
CREATE POLICY "Public likes are viewable by everyone" ON public.community_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own likes" ON public.community_likes;
CREATE POLICY "Users can insert their own likes" ON public.community_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.community_likes;

-- *** SETTINGS TABLES ***

CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  
  -- 2. Travel Preferences
  travel_style text check (travel_style in ('Budget', 'Mid', 'Luxury')),
  interests text[], -- Array of strings
  accommodation_pref text,
  transport_pref text,
  travel_pace text check (travel_pace in ('Relaxed', 'Fast')),
  
  -- 3. Budget & Currency
  currency text default 'INR',
  auto_conversion boolean default true,
  daily_budget_limit numeric(10, 2),
  budget_alerts boolean default true,
  smart_budget boolean default true,
  
  -- 4. Notifications
  trip_reminders boolean default true,
  daily_itinerary_alerts boolean default true,
  overrun_alerts boolean default true,
  collab_updates boolean default true,
  notification_channel text check (notification_channel in ('Email', 'In-app', 'Both')) default 'In-app',
  
  -- 5. Privacy & Sharing
  default_trip_visibility text check (default_trip_visibility in ('Private', 'Friends', 'Public')) default 'Private',
  allow_copy boolean default false,
  show_budget_shared boolean default false,
  profile_visibility text check (profile_visibility in ('Public', 'Private')) default 'Public',
  blocked_users uuid[], -- Array of user IDs
  
  -- 6. Collaboration
  default_collab_permission text check (default_collab_permission in ('View', 'Edit', 'Comment')) default 'View',
  enable_comments boolean default true,
  invite_approval boolean default true,
  
  -- 7. Language & Region
  app_language text default 'en',
  date_format text default 'DD/MM/YYYY',
  time_format text default '24h',
  distance_units text default 'km',
  
  -- 8. Appearance
  theme text check (theme in ('Light', 'Dark', 'System')) default 'Light',
  font_size text default 'Medium',
  high_contrast boolean default false,
  reduce_animations boolean default false,
  screen_reader boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
