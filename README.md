# Multi-Source Intelligence Fusion Dashboard (CyberJoar)

A sophisticated web-based intelligence dashboard that unifies OSINT, HUMINT, and IMINT data into a professional geospatial interface.

## 🚀 Features
- **Interactive Fusion Map**: Leaflet-powered terrain map with clustered intelligence markers.
- **Unified Schema**: Standardized data model for diverse intelligence sources.
- **Multi-Format Ingestion**: Support for CSV, JSON, and XLSX file uploads.
- **Real-time Stats**: Live count of intelligence reports by source type.
- **Premium UI**: Dark-mode, military-aesthetic dashboard built with Tailwind CSS and Framer Motion.
- **Search & Filter**: Deep search across titles, descriptions, and tags.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React, Leaflet, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Multer.
- **Utilities**: `xlsx`, `csv-parser`, `date-fns`.

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a remote URI

### 1. Backend Setup
```bash
cd backend
npm install
# Update .env with your MongoDB URI
npm run seed  # Optional: Seed initial data
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 Data Schema
Intelligence records follow this structure:
- `title`: string
- `sourceType`: OSINT | HUMINT | IMINT
- `description`: string
- `latitude`: number
- `longitude`: number
- `timestamp`: Date
- `confidence`: number (0-100)
- `priority`: Low | Medium | High | Critical
- `tags`: string[]
- `imageUrl`: string (optional)

## 📁 Project Structure
- `/backend`: Express API, Mongoose models, and upload handlers.
- `/frontend`: React application, UI components, and Leaflet integration.
- `/backend/src/uploads`: Local storage for uploaded intelligence assets.
