import React, { useEffect, useState } from 'react';
import './App.css';

const GENRES = [
  '', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
}

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = '';
    if (genre) {
      url = `/movies/genre/${encodeURIComponent(genre)}?page=${page}`;
    } else if (search) {
      url = `/movies?page=${page}&search=${encodeURIComponent(search)}`;
    } else {
      url = `/movies?page=${page}`;
    }
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movies');
        return res.json();
      })
      .then((data) => {
        setMovies(data.movies || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, genre, search]);

  const handleMovieClick = (imdbId) => {
    setSelectedMovie(imdbId);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(true);
    fetch(`/movies/${imdbId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movie details');
        return res.json();
      })
      .then((data) => {
        setDetails(data);
        setDetailsLoading(false);
      })
      .catch((err) => {
        setDetailsError(err.message);
        setDetailsLoading(false);
      });
  };

  const closeDetails = () => {
    setSelectedMovie(null);
    setDetails(null);
    setDetailsError(null);
    setDetailsLoading(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setPage(1);
    setSearch(value);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setPage(1);
  };

  return (
    <div className="App">
      <h1>Movie List</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select value={genre} onChange={handleGenreChange} className="genre-select">
          <option value="">All Genres</option>
          {GENRES.filter(g => g).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.imdbId} className="movie-item" onClick={() => handleMovieClick(movie.imdbId)}>
            <strong>{movie.title}</strong> ({formatDate(movie.releaseDate)})<br />
            Genres: {(() => {
              try {
                const genres = JSON.parse(movie.genres);
                if (Array.isArray(genres)) {
                  return genres.map(g => g.name).join(', ');
                }
              } catch (e) {}
              return movie.genres;
            })()}<br />
            Budget: {movie.budget}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
      {selectedMovie && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {detailsLoading && <p>Loading details...</p>}
            {detailsError && <p style={{ color: 'red' }}>{detailsError}</p>}
            {details && (
              <div>
                <h2>{details.title}</h2>
                <p><strong>IMDB ID:</strong> {details.imdbId}</p>
                <p><strong>Description:</strong> {details.description}</p>
                <p><strong>Release Date:</strong> {formatDate(details.releaseDate)}</p>
                <p><strong>Budget:</strong> {details.budget}</p>
                <p><strong>Runtime:</strong> {details.runtime} min</p>
                <p><strong>Average Rating:</strong> {details.averageRating}</p>
                <p><strong>Genres:</strong> {(() => {
                  try {
                    const genres = JSON.parse(details.genres);
                    if (Array.isArray(genres)) {
                      return genres.map(g => g.name).join(', ');
                    }
                  } catch (e) {}
                  return details.genres;
                })()}</p>
                <p><strong>Original Language:</strong> {details.originalLanguage}</p>
                <p><strong>Production Companies:</strong> {(() => {
                  try {
                    const pcs = JSON.parse(details.productionCompanies);
                    if (Array.isArray(pcs)) {
                      return pcs.map(pc => pc.name).join(', ');
                    }
                  } catch (e) {}
                  return details.productionCompanies;
                })()}</p>
                <button onClick={closeDetails} className="close-btn">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
