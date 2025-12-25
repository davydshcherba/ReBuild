# ReBuild Frontend

Modern React + TypeScript + Vite frontend application with dark theme design.

## Features

- 🎨 Dark theme UI matching modern design standards
- ⚡ Fast development with Vite
- 🔐 Authentication (Login/Register)
- 🏠 Home page with typing animation
- 📱 Responsive design

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_BACKEND_URL=http://localhost:8000
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/          # Page components
│   │   ├── Home.tsx    # Home page with dark theme
│   │   ├── Login.tsx   # Login page
│   │   └── Register.tsx # Register page
│   ├── utils/          # Utility functions
│   │   └── api.ts      # API client
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── public/             # Static assets
└── package.json        # Dependencies
```

## Development

The app runs on `http://localhost:3000` by default. The Vite dev server proxies API requests to the backend.

