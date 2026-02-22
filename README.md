# Course Platform — Mobile Frontend Take-Home

A mobile application for browsing and viewing course details with search, category filters, and a per-course comment system. Built with React Native, TypeScript, and Expo.

## Features

- **Course listing** — Vertical list of course cards with image, title, category, rating, and duration
- **Search & filter** — Search by title and horizontal category chip filters
- **Course detail** — Detail screen with full description, metadata (author, level, duration), and interactive comment section
- **Comments** — Add comments (enter to send), like/unlike, and delete; data persisted in `AsyncStorage`
- **User Identity** — Integrated name input flow directly in the comment section (no modal)
- **Dark mode** — Native theme support via React Native Paper
- **Keyboard Friendly** — Sticky input container that adjusts with the system keyboard
- **EAS Update** — Support for Over-the-Air (OTA) updates to push fixes instantly

## Tech Stack

| Area      | Technology              |
|-----------|-------------------------|
| Framework | React Native (Expo SDK 52) |
| Routing   | Expo Router v3          |
| Language  | TypeScript              |
| UI Lib    | React Native Paper      |
| Storage   | AsyncStorage            |
| Icons     | Material Community Icons|
| Deployment| EAS (Expo Application Services) |
| Data      | Static JSON + AsyncStorage |

## Prerequisites

- **Node.js** (v18+ recommended)
- **Expo Go** app on your physical device or an Android/iOS Emulator
- **eas-cli** (for builds and updates)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npx expo start

# Build Preview APK
eas build --profile preview --platform android

# Push OTA Update
eas update --channel preview --message "Your update message"

# Lint
npm run lint
```

## Project Structure
```
app/
├── _layout.tsx     # Root layout & Theme provider
├── index.tsx       # Home: course list, search, category filter
├── course/[id].tsx # Course Detail & Comment system
components/         # Reusable components (CourseCard, etc.)
assets/             # Images, splash screen, and icons
data/               # data.json — course list & categories
```

## Routes & Flow

| Route         | Description |
|---------------|-------------|
| `/`           | Home: course list, search, horizontal category filter |
| `/course/:id` | Course detail + comments (add, like, delete, sort)    |