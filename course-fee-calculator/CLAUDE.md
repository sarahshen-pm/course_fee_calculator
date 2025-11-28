# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 14 web application for managing course fees and schedules. The app processes raw schedule data, matches students using fuzzy name matching, calculates fees, and generates multi-language SMS notifications for parents.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:3000
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
# Run SQL scripts in Supabase dashboard SQL editor
# Located in scripts/ directory
```

## Environment Setup

Required environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Architecture

### Data Flow Pipeline

The application uses a two-step data processing pipeline:

1. **Raw Data Extraction** (`extractRawScheduleData` in `lib/data-processor.ts:83-196`)
   - Parses pasted schedule text using regex pattern: `Title:(.*?)Startdate:(.*?)Enddate:(.*?)Duration:(.*?)`
   - Saves to `schedule_data` table in Supabase
   - Handles duplicates by checking title+startdate combinations
   - Processes in batches of 50 records to avoid URL length limits

2. **Data Processing & Matching** (`processScheduleDataFromRaw` in `lib/data-processor.ts:199-297`)
   - Reads from `schedule_data` table
   - Parses Chinese dates (2025年2月1日 09:30) and slash dates (01/02/25 12:30)
   - Converts duration strings to decimal hours:
     - Handles `h:mm:ss` format (3:00:00)
     - Handles `mm:ss` format (30:00)
   - Matches student names from course titles using fuzzy matching
   - Enriches with student data (fees, parent info, accompany numbers)
   - Preserves original startdate/enddate times (no conversion to 00:00:00)
   - Saves to `processed_schedule_data` table
   - Can process only recent data (last 5 minutes) for efficiency

### Database Schema

**Three main tables** (defined in `scripts/001_create_tables.sql`):

1. **students** - Student profiles (static reference data)
   - Contains 32+ student records with name, fee_per_hour, parent, accompany_number, language
   - This is the source of truth for student information

2. **schedule_data** - Raw schedule entries (extracted from paste)
   - Stores unparsed title, startdate, enddate, duration
   - Acts as staging area before processing

3. **processed_schedule_data** - Processed course records (enriched & matched)
   - Contains parsed dates, matched student names, calculated fees
   - Has generated column: `fee_total = fee_per_hour * hours`
   - This is the main data source for the UI
   - Supports CRUD operations (add, edit, delete)

4. **data_modification_logs** - Audit log for data changes (defined in `scripts/007_create_audit_log.sql`)
   - Tracks INSERT, UPDATE, DELETE operations on processed_schedule_data
   - Stores old_values and new_values as JSONB
   - Records modified_at timestamp

### Student Name Matching

Critical function: `matchNames` in `lib/data-processor.ts:579-626`

- Uses case-insensitive substring matching
- Handles both English names (Giselle) and Chinese names (林亭萱)
- Special cases for students with multiple name forms (凯文/Kevan, 亚拉/Ayara)
- Returns first match only (not multiple students)
- 32+ students pre-configured in `STUDENT_DATABASE` constant

### Date Parsing

Two parsers handle different formats:

1. **parseChineseDate** (`lib/data-processor.ts:482-538`)
   - Format: `2025年8月31日 11:00`
   - Handles corrupted characters (年月日 may appear as ?)
   - Reconstructs date from pattern even when corrupted

2. **parseSlashDate** (`lib/data-processor.ts:540-568`)
   - Format: `31/08/25 12:30`
   - Assumes 20xx century for 2-digit years

### UI Components

**Main page** (`app/page.tsx`):
- Two tabs: Calculator (DataInputTab) and Students (StudentsView)
- Fetches students from Supabase on mount
- Uses Toaster for notifications

**DataInputTab** (`components/data-input-tab.tsx`):
- Large dialog for pasting schedule data
- Triggers two-step processing pipeline
- Displays processed data in sortable table
- Multi-select filters for name, parent, accompany_number, date range
- Shows totals (hours and fees) at table footer
- SMS Generator button (enabled when filtered data has single parent)
- iPad-specific handling with extended timeouts (60s vs 30s)
- CRUD actions: Add Record, Edit (date/hours only), Delete with confirmation

**Data Operations** (`lib/data-operations.ts`):
- `insertProcessedData` - Add new record with audit logging
- `updateProcessedData` - Update record with old/new value tracking
- `deleteProcessedData` - Delete record with audit logging
- All operations automatically log to data_modification_logs table

**Add/Edit Dialogs** (`components/add-record-dialog.tsx`, `components/edit-record-dialog.tsx`):
- Add: Select student from dropdown, auto-fills fee/parent info
- Edit: Only date, start/end time, and hours are editable
- Both support date picker and auto-calculate hours from time inputs

### SMS Generation

Multi-language support (English, 简体中文, 繁體中文) for parent notifications. Located in `components/sms-generator-modal.tsx`.

**Features:**
- Editable data table with inline editing (date picker, hours, fee)
- Name filter buttons to focus on specific students
- Auto-sort by Name > Date after saving edits
- Regenerate button to update SMS after table edits
- Date ranges formatted as month names:
  - English: `Sep` (single month) or `Sep - Oct` (multiple)
  - Chinese: `9月` (single month) or `9月 - 10月` (multiple)
- Numbers formatted without trailing zeros (100.00 → 100)
- Copy to clipboard with iPad fallback support

**Performance optimizations:**
- Uses `useRef` to store editable data without re-renders
- Stable row keys prevent input focus loss during editing
- StableInput component with `React.memo` for form inputs

### Supabase Integration

- **Client**: `lib/supabase/client.ts` - Browser client using `@supabase/ssr`
- **Server**: `lib/supabase/server.ts` - Server-side client (if needed)
- All tables use Row Level Security with public access policies (single-user app)
- Batch operations limited to 50 records to avoid Supabase URL length limits

### Styling

- Tailwind CSS v4 with custom design system
- Radix UI components (`components/ui/`)
- Custom `.material-table` styles in `app/globals.css`
- Responsive design with iPad-specific optimizations

## Important Implementation Details

### Batch Processing Pattern

When inserting/updating data in Supabase, always use 50-record batches:

```typescript
const BATCH_SIZE = 50
for (let i = 0; i < data.length; i += BATCH_SIZE) {
  const batch = data.slice(i, i + BATCH_SIZE)
  // Process batch...
}
```

This prevents "413 Request Entity Too Large" errors from Supabase.

### Duplicate Detection

Both extraction and processing steps check for duplicates before inserting:
- Raw data: Check title + startdate combination
- Processed data: Check name + date + title combination
- Use `.or()` queries for efficient batch duplicate checking

### 24-Hour Duration Handling

Skip entries with exactly 24-hour duration (all-day events):

```typescript
const adjustedHours = Math.abs(hours - 24) < 0.01 ? 0 : hours
if (adjustedHours === 0) continue
```

### iPad Compatibility

iPad devices may have slower connections:
- Extended timeout from 30s to 60s for iPad users
- Detection: Check `navigator.userAgent` for "iPad" or MacIntel + touchPoints > 1
- Additional connection quality checks using `navigator.connection` API
- Informative timeout messages in error handling

### Date Formatting

Display dates as dd/mm/yyyy using `formatDate` function in `data-input-tab.tsx:205-218`. Always validate date objects with `isNaN(date.getTime())` before formatting.

### Number Formatting

Remove trailing zeros from amounts using `formatAmount` function:
```typescript
const formatAmount = (amount: number) => {
  return parseFloat(amount.toFixed(2)).toString()
}
```
Applied to: Total column, SMS messages, summary rows (100.00 → 100, 100.50 → 100.5)

## Common Tasks

### Adding a New Student

1. Update `STUDENT_DATABASE` in `lib/data-processor.ts:39-72`
2. Add to database by running INSERT in Supabase SQL editor:
   ```sql
   INSERT INTO students (name, fee_per_hour, graduated, parent, accompany_number, language)
   VALUES ('Student Name', 80.00, 'Ongoing', 'Parent Name', 0, 'English');
   ```

### Modifying Name Matching Logic

Edit `matchNames` function in `lib/data-processor.ts:579-626`. Add special cases for students with alternate name forms or complex matching rules.

### Updating SMS Templates

Edit `SMSGeneratorModal` component in `components/sms-generator-modal.tsx`. Templates use string interpolation with calculated values (total hours, fees, date ranges).

### Database Migrations

Create numbered SQL scripts in `scripts/` directory. Review existing scripts for naming conventions (001_, 002_, etc.). Always test in Supabase SQL editor before committing.

## Deployment

- Configured for Vercel with `output: 'standalone'` in `next.config.mjs`
- Uses unoptimized images for broader compatibility
- No trailing slashes in URLs

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Database**: Supabase (PostgreSQL)
- **UI**: Radix UI + Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (for future analytics)
- **Date Handling**: date-fns
