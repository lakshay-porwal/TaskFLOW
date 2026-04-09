# Task Manager - Technical Assignment

A highly scalable, production-ready full-stack Task Manager application built with React, Node.js, Express, and Firebase. This project was designed with a focus on clean architecture, seamless user experience, and modern UI paradigms.

## Architecture & Tech Stack

### Frontend
- **React (via Vite)**: Lightning-fast development environment and optimized production builds.
- **Tailwind CSS v4**: Utility-first CSS framework used for building a clean, modern, and "glassmorphic" UI.
- **Axios**: Configured with a dedicated API service layer and global error interceptors.
- **Lucide React**: Clean and minimal icon set.
- **React Hot Toast**: For polished, accessible, non-intruding notifications.

### Backend
- **Node.js & Express**: Serves RESTful API endpoints.
- **Firebase Admin SDK (Firestore)**: A NoSQL cloud database providing fast document read/writes.
- **Express Validator**: Middleware for payload sanitization and validation.
- **Centralized Error Handling**: A unified error middleware ensuring consistent API responses and preventing server crashes from unhandled errors.

### Key Architectural Decisions (To Discuss in Interview)
1. **Optimistic UI Updates**: The frontend leverages optimistic updates to provide a zero-latency feel. When a user toggles or deletes a task, the UI updates instantly, while the API call resolves in the background. If the request fails, the UI rolls back automatically.
2. **Custom Hooks (`useTasks`)**: Business logic is separated from UI components. This makes components cleaner, promotes reusability, and makes unit testing significantly easier.
3. **MVC Backend Structure**: The backend is organized into Routes, Controllers, and Services. The `taskService.js` directly interfaces with Firestore, making the controllers small and strictly focused on request/response logic.
4. **Debounced Search**: Instead of slamming the backend or causing excessive re-renders, the search input utilizes a custom `useDebounce` hook (with a 300ms delay) to ensure filtering is performant.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- A Firebase Project (with Firestore active)

### 2. Backend Setup
1. Open the `/backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Download your Firebase **Service Account Key** JSON from the Firebase Console (Project Settings > Service Accounts > Generate new private key).
4. Update the `.env` file in the `backend` folder with your Firebase details:
   ```env
   PORT=5000
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_key_here\n-----END PRIVATE KEY-----"
   ```
   *(Note: Retain the double quotes and `\n` characters for the private key if deploying online).*
5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `/frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Add a `.env` file in the frontend root if your backend URL differs from the default:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the local URL provided (usually `http://localhost:5173`).

## Trade-offs and Considerations
- **NoSQL vs SQL**: Firestore (NoSQL) was chosen for speed and scalability, which fits perfectly for isolated documents like tasks. If tasks required complex relationships (e.g., sharing tasks across multiple users in specific workspaces), a relational database like PostgreSQL + Prisma might have been more appropriate.
- **Global State**: React's built-in `useState`/`useCallback` combined with the `useTasks` hook is perfectly sufficient for this scope. Redux or Zustand would introduce unnecessary boilerplate, though they would be considered if the application scaled to include complex state management across multiple disjointed trees.

---
*Developed as a technical assignment. Designed to be robust, readable, and ready for production.*
