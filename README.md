# 🎬 Movie Recommendation Web App

A modern web application that recommends movies based on user preferences using AI. Built with React, Node.js/Fastify, and SQLite.

## 📋 Features

- ✨ User-friendly interface to input movie preferences
- 🤖 AI-powered movie recommendations
- 💾 Stores user history in SQLite database
- 🎨 Beautiful and responsive UI
- ⚡ Fast API backend with Fastify
- 🔄 Real-time recommendation generation

## 📁 Project Structure

```
Movie_recomendation_app/
├── Backend/                      # Node.js Backend
│   ├── server.js                # Fastify server with routes
│   ├── db.js                    # SQLite database config
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables
│   └── movies.db                # SQLite database file
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── App.jsx             # Main App component
│   │   ├── App.css             # App styles
│   │   ├── index.css           # Global styles
│   │   ├── main.jsx            # Entry point
│   │   └── assets/             # Static assets
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # HTML template
│
├── README.md                   # This file
└── .gitignore                  # Git ignore file
```

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

## 📝 API Endpoints

### POST /recommend

Get movie recommendations based on user preference

**Request:**

```json
{
  "preference": "action movies with a strong female lead"
}
```

**Response:**

```json
{
  "movies": "Movie 1, Movie 2, Movie 3, Movie 4, Movie 5"
}
```

### GET /

Health check endpoint

**Response:**

```json
{
  "message": "Welcome to the Movie Recommendation API"
}
```

## 🗄️ Database Schema

**recommendations table:**

```sql
CREATE TABLE IF NOT EXISTS recommendations(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_input TEXT NOT NULL,
    recommended_movies TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 🔧 Technologies Used

**Frontend:**

- React 19.2.0
- Vite 7.2.4
- Axios (for API calls)
- CSS3 (with gradients and animations)

**Backend:**

- Fastify 5.7.4
- Node.js
- OpenAI API (with mock fallback)
- SQLite3 5.1.7
- CORS enabled

**Database:**

- SQLite (lightweight, file-based)

## 🌐 Deployment

### Option 1: Deploy Frontend on Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set environment variables if needed
5. Deploy!

### Option 2: Deploy Frontend on Netlify

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Deploy!

### Option 3: Deploy Backend on Render

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Settings:
   - Root directory: `Backend`
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables from `.env`
7. Deploy!

### Option 4: Deploy Backend on Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create a new project
4. Configure your repository
5. Set environment variables
6. Deploy!

## 📌 Important Notes

1. **OpenAI API Key**: Currently using mock recommendations. To enable real AI-powered recommendations:
   - Get your API key from [OpenAI](https://platform.openai.com/api-keys)
   - Add it to your `.env` file
   - Replace the mock function in `server.js` with the actual OpenAI API call

2. **CORS**: The app is configured to accept requests from any origin. For production, update the CORS settings in `server.js`

3. **Database**: SQLite database file (`movies.db`) is created automatically on first run

4. **Environment Variables**: Never expose API keys in version control. Always use `.env` files

## 💡 How It Works

1. User enters their movie preference in the frontend form
2. Frontend sends a POST request to the backend `/recommend` endpoint
3. Backend receives the preference and generates recommendations (currently using mock data)
4. Recommendations are saved to the SQLite database
5. Backend returns recommendations to the frontend
6. Frontend displays the movie list in an attractive format

## 🔮 Future Enhancements

- [ ] Integration with real OpenAI API
- [ ] User authentication and profiles
- [ ] Movie ratings and reviews
- [ ] Filter recommendations by genre, year, IMDb rating
- [ ] Dark mode toggle
- [ ] Recommendation history page
- [ ] API documentation with Swagger

## 🐛 Troubleshooting

**Port already in use?**

```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**CORS errors?**

- Make sure backend is running on port 5000
- Check that frontend API calls use correct URL: `http://localhost:5000`

**Database errors?**

- Delete `movies.db` and restart the backend to recreate it
- Ensure `sqlite3` is properly installed: `npm install sqlite3`

## 📄 License

This project is open-source and available under the MIT License.

## 👨‍💻 Author

Created as a full-stack web development project.

---

Happy movie watching! 🎬🍿
