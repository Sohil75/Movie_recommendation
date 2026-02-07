import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [preference, setPreference] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!preference.trim()) {
      setError("Please enter your movie preference");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/recommend`,
        { preference }
      );

      // Parse movies string into array
      const movieList = response.data.movies
        .split(",")
        .map((movie) => movie.trim())
        .filter((movie) => movie);
      setMovies(movieList);
      setSource(response.data.source || "openai");
    } catch (error) {
      // Show backend error message if available
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.message === "Network Error") {
        setError("Cannot connect to backend. Make sure the server is running on http://localhost:5000");
      } else {
        setError("Error fetching recommendations. Please try again.");
      }
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 Movie Recommendation App</h1>
        <p>Discover your next favorite movie based on your preferences</p>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="e.g., action movies with a strong female lead"
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          className="input"
        />

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {movies.length > 0 && (
        <div className="result">
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px"}}>
            <h3 style={{margin: 0}}>Recommended Movies for you:</h3>
            {source === "fallback" && (
              <span className="source-badge">Using Curated List</span>
            )}
            {source === "openai" && (
              <span className="source-badge ai">AI Generated</span>
            )}
          </div>
          <ul className="movie-list">
            {movies.map((movie, index) => (
              <li key={index} className="movie-item">
                {movie}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;