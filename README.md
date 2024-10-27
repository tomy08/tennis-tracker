# Tennis Tracker

Welcome to **Tennis Tracker**, a web and mobile application designed for tennis players to log matches, track statistics, and connect with other players in their area.

## Features

- **Match Logging**: Record match details, including singles or doubles play, number of sets, scores, and match outcomes.
- **Player Stats**: View and analyze personal statistics such as wins, losses, and set data over time.
- **Social Connectivity**: Connect with friends, add new players, and view head-to-head records.
- **Local Player Finder**: Discover players nearby to arrange new matches.

## Project Structure

The Tennis Tracker app is built with **Next.js** for server-side rendering and **Supabase** for database management, allowing for seamless interaction between the front-end and back-end.

### Key Components

- **Frontend**: Developed using Next.js, React, and TailwindCSS for a responsive and interactive user experience.
- **Backend**: Utilizes Supabase for data management, including player records, match statistics, and social connections.
- **Database**: Contains several tables, including:
  - **User Table**: Stores user profiles with fields like ID, name, category, city, and rating.
  - **Match Table**: Records individual match details, including players, match format, and set scores.
  - **Friends Table**: Manages friend connections between users.

### User Registration and Rating

Upon registration, each user is classified into one of five categories (Amateur, Beginner, Intermediate, Advanced, Professional), which assigns a rating score to facilitate matchmaking and rankings.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/tomy08/tennis-tracker.git
   cd tennis-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env.local` file with the necessary Supabase and API keys.
4. **Run the application**:
   ```bash
   npm run dev
   ```

## Database Configuration

The Tennis Tracker database has three main tables, each designed to store specific data:

- **Users**: Stores profile information like name, rating, and contact details.
- **Matches**: Logs each match's details, including the type (singles/doubles), sets played, and players involved.
- **Friends**: Contains connections between users to enable social interactions and track head-to-head stats.
