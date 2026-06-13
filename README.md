# Aksara Picture Link-in-Bio Landing Page

This repository contains the source code for the Aksara Picture landing page and bio link platform, built using React, Vite, and Supabase. The site is optimized for local search engines and provides client booking integrations.

## Core Features

- Responsive Glassmorphism UI: Adapts to mobile viewports and desktop resolutions.
- Dynamic Background Slider: Loads optimized device-specific images with localized search engine alt text tags.
- Multi-Language Support: Toggles between English and Indonesian layouts.
- Supabase Integration: Fetches links and promotional pop-ups dynamically from a Supabase database.
- Integrated Booking Form: Collects name, date, package choices, and university data, saves details directly to Supabase, and triggers WhatsApp redirects with pre-filled localized messages.
- Ambient Audio Player: Features a custom vinyl-spinning UI trigger for optional background music.
- Optimized SEO Foundations: Configured with JSON-LD Schema markup, robots.txt, sitemap.xml, and a complete modern favicon suite.

## Project Structure

```text
src/
├── assets/             # Local assets and SVG brand files
├── components/         # Reusable global UI elements
│   ├── AudioPlayer/    # Audio player widgets and Vinyl triggers
│   ├── Preloader.jsx   # Page load screen
│   ├── LangSwitcher.jsx# Language toggle
│   ├── WhatsAppNotif.jsx# Notification toast
│   ├── PromoPopup.jsx  # Dynamic database promo modal
│   └── BackgroundSlider.jsx # Background image component
├── constants/          # Static data arrays and translation assets
├── context/            # React Audio Context API provider
├── hooks/              # Custom hooks for Supabase operations
├── views/              # View wrappers representing page sections
│   ├── HomeView.jsx    # Links list view
│   ├── AboutView.jsx   # About and services info
│   └── ContactView.jsx # Booking form view
├── App.jsx             # App layout and event orchestrator
├── main.jsx            # Entry point mounting components
└── supabase.js         # Supabase client initializer
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm package manager

### Environment Configuration

Create a `.env` file in the root directory and define the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

Install the required node modules:

```bash
npm install
```

### Development Server

Run the development server locally:

```bash
npm run dev
```

### Production Build

Compile and optimize the build files for production:

```bash
npm run build
```

The compiled files will be output to the `dist/` directory.

## Database Schema Configuration

To store user booking submissions, run the following SQL script inside your Supabase SQL Editor:

```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  graduation_date date not null,
  package_choice text not null,
  campus text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table bookings enable row level security;

create policy "Allow anonymous inserts" 
on bookings 
for insert 
to anon 
with check (true);
```
