# 🎬 Movie Recommendation Web App

A modern web application that recommends movies based on user preferences using AI. Built with React, Node.js/Fastify, and SQLite.

## 📋 Features

- ✨ User-friendly interface to input movie preferences
- 🤖 AI-powered movie recommendations
- 💾 Stores user history in SQLite database
- 🎨 Beautiful and responsive UI
- ⚡ Fast API backend with Fastify
- 🔄 Real-time recommendation generation

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.13.1 or later recommended)
- npm or yarn
- Git (for version control)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Movie_recomendation_app
   ```

2. **Setup Backend**

   ```bash
   cd Backend
   npm install
   ```

   Create a `.env` file in the Backend folder:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

**Terminal 1 - Start Backend Server:**

```bash
cd Backend
npm start
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Server:**

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:5174` (or next available port)

Open your browser and navigate to `http://localhost:5174` to use the app!

Open ai kota is reached so added a fallback option to run the app
