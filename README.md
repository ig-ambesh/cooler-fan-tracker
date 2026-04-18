# Family Night Usage Tracker

A modern React + Vite + Firebase app for tracking nightly fan and cooler usage per user.

## Features

- Firebase Authentication with email and password
- Private Firestore data per user
- One log per date to prevent duplicates
- Overnight duration calculation that handles midnight crossover
- Dashboard cards for today, week, and month
- Electricity unit and rupee cost estimation
- Editable and deletable logs
- CSV export
- Simple weekly/monthly charts
- Dark mode toggle
- Mobile responsive Tailwind UI

## Tech Stack

- React 19
- Vite
- Firebase modular SDK
- Tailwind CSS
- TypeScript

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root from `.env.example`.

3. Add your Firebase config values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Run the app:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Firebase Setup Guide

1. Create a Firebase project.
2. Enable Authentication > Sign-in method > Email/Password.
3. Create a Firestore database in production mode.
4. Copy your Firebase web app config into `.env`.
5. Add these Firestore rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/usageLogs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Firestore Data Model

Path:

`users/{userId}/usageLogs/{logId}`

Each document stores:

- `date`
- `fanStart`
- `fanEnd`
- `fanDuration`
- `coolerStart`
- `coolerEnd`
- `coolerDuration`
- `createdAt`

The app uses the log date as the document ID so duplicate entries for the same date are naturally prevented.

## Time Calculation Logic

- Times are parsed as 24-hour `HH:mm`
- If end time is earlier than start time, the app assumes the session crossed midnight
- Missing inputs safely resolve to `0` minutes

Examples:

- `23:00 -> 04:00` = `300` minutes
- `22:30 -> 22:30` = `0` minutes
- `21:15 -> 01:45` = `270` minutes

## Electricity Cost Calculation

- Enter `fan units per hour` and `cooler units per hour` in the dashboard
- The app converts usage minutes into electricity units
- Total rupees are calculated using `1 unit = Rs 7`

Formula used:

```text
units = hours_used * units_per_hour
cost_in_rupees = total_units * 7
```

## Example Test Data

See [`example-data.json`](./example-data.json) for sample log entries you can use to seed Firestore manually.

## Deployment on Vercel

1. Push the project to GitHub.
2. Import it into Vercel.
3. Set the same `VITE_FIREBASE_*` environment variables in Vercel.
4. Use the default build command:

```bash
npm run build
```

5. The output directory is `dist`.

## Notes

- The app queries the latest logs for the user and computes daily, weekly, and monthly summaries client-side.
- Each user only sees their own Firestore subcollection.
