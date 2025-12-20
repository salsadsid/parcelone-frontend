# ParcelOne Frontend

A modern, real-time courier tracking and management dashboard. Built with React, Vite, and Redux Toolkit.

## ✨ Features

- **Role-Based Dashboards**: Tailored experiences for Admins, Delivery Agents, and Customers.
- **Live Tracking**: Real-time parcel location tracking on Google Maps.
- **Interactive Map**: Visual representation of pickup and delivery points.
- **Status Timeline**: Visual journey of the parcel from booking to delivery.
- **Responsive Design**: Fully optimized for mobile and desktop devices.
- **Modern UI**: Built with Shadcn UI, Tailwind CSS, and Framer Motion for a premium feel.

## 🛠️ Tech Stack

- **Framework**: React (Vite)
- **State Management**: Redux Toolkit (RTK Query)
- **Styling**: Tailwind CSS, Shadcn UI
- **Animations**: Framer Motion
- **Maps**: @react-google-maps/api
- **Real-time**: Socket.io-client
- **Notifications**: Sonner (Toast notifications)

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_PRODUCTION_URL=http://localhost:5000/api
```

## 🛠️ Installation & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure

- `src/components`: Reusable UI components.
- `src/features`: Redux slices and API logic.
- `src/pages`: Main application pages (Dashboard, Details, Booking).
- `src/hooks`: Custom React hooks.
- `src/utils`: Helper functions and constants.
