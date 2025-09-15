# Course Fee Calculator

A modern web application for managing and calculating course fees for students, with automated SMS generation for parent notifications.

## Features

### 📊 Data Management
- **Data Input Tab**: Paste and process schedule data from external sources
- **Real-time Processing**: Automatically extracts student information, fees, and schedules
- **Smart Name Matching**: Advanced fuzzy matching to identify students from course titles
- **Complete Student Database**: 32+ students with accurate fee structures and parent information
- **Data Filtering**: Filter students by name, parent, accompany number, and date
- **Database Integration**: Uses Supabase for data persistence

### 📈 Analysis & Reporting
- **Analysis Tab**: View student data grouped by parent
- **Fee Calculations**: Automatic calculation of total hours, fees, and averages
- **Parent Grouping**: Organize students by their parents for easy management
- **Data Visualization**: Clean table views with totals and summaries

### 💬 SMS Generation
- **Multi-language Support**: Generate SMS in English, Simplified Chinese, and Traditional Chinese
- **Template System**: Pre-built templates for single and multiple student scenarios
- **Auto-calculation**: Automatically calculates fees, hours, and date ranges
- **Copy to Clipboard**: Easy copying of generated SMS messages

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: Radix UI with Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-fee-calculator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL script in `scripts/001_create_tables.sql` in your Supabase SQL editor
   - This will create the necessary tables and sample data

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Data Input
1. Go to the "Data Input" tab
2. Paste your schedule data in the text area (format: `Title:...Startdate:...Enddate:...Duration:...`)
3. Click "Extracting Data" to process the information
4. The system will automatically:
   - Parse Chinese dates (2025年2月1日 09:30)
   - Parse slash dates (01/02/25 12:30)
   - Calculate hours from duration (3:00:00 → 3 hours)
   - Match student names from titles using fuzzy matching
   - Apply correct fees and parent information
5. Click "Save to Database" to store processed data in Supabase
6. View saved data in the right panel, sorted by creation time (newest first)
7. Use filters to narrow down the data by name, parent, accompany number, or date

### Analysis
1. Switch to the "Analysis" tab
2. Use filters to narrow down the data
3. Select different parent tabs to view grouped data
4. Review fee calculations and totals

### SMS Generation
1. In the Analysis tab, select a parent
2. Choose your preferred language (English/中文简体/中文繁體)
3. Click "Generate SMS" to create the notification
4. Copy the generated message to send to parents

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── analysis-tab.tsx  # Analysis functionality
│   ├── data-input-tab.tsx # Data input functionality
│   └── sms-generator.tsx # SMS generation
├── lib/                  # Utility libraries
│   ├── data-processor.ts # Data processing logic
│   └── supabase/         # Database client
├── scripts/              # Database scripts
└── hooks/                # Custom React hooks
```

## Database Schema

The application uses three main tables:

- **students**: Stores student profiles and fee information
- **schedule_data**: Stores processed schedule information
- **modification_logs**: Tracks data changes (for future use)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For support or questions, please contact the development team.
