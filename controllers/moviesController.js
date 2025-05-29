const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/movies.db');

exports.listMovies = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection error' });
    }
  });

  const query = `SELECT imdbId, title, genres, releaseDate, budget FROM movies LIMIT ? OFFSET ?`;
  db.all(query, [pageSize, offset], (err, rows) => {
    db.close();
    if (err) {
      return res.status(500).json({ error: 'Query error' });
    }
    // Format budget as dollars
    const movies = rows.map(row => ({
      imdbId: row.imdbId,
      title: row.title,
      genres: row.genres,
      releaseDate: row.releaseDate,
      budget: row.budget ? `$${Number(row.budget).toLocaleString()}` : null
    }));
    res.json({ page, pageSize, movies });
  });
};

exports.getMovieDetails = (req, res) => {
  const imdbId = req.params.imdbId;
  const moviesDbPath = path.join(__dirname, '../db/movies.db');
  const ratingsDbPath = path.join(__dirname, '../db/ratings.db');

  // Open movies.db
  const movieDb = new sqlite3.Database(moviesDbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection error (movies)' });
    }
  });

  // Query for movie details and movieId
  const movieQuery = `SELECT movieId, imdbId, title, overview, releaseDate, budget, runtime, genres, language, productionCompanies FROM movies WHERE imdbId = ?`;
  movieDb.get(movieQuery, [imdbId], (err, movie) => {
    movieDb.close();
    if (err) {
      return res.status(500).json({ error: 'Query error (movies)' });
    }
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    // Open ratings.db
    const ratingsDb = new sqlite3.Database(ratingsDbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database connection error (ratings)' });
      }
    });
    // Query for average rating using movieId
    const ratingQuery = `SELECT AVG(rating) as averageRating FROM ratings WHERE movieId = ?`;
    ratingsDb.get(ratingQuery, [movie.movieId], (err, ratingRow) => {
      ratingsDb.close();
      if (err) {
        return res.status(500).json({ error: 'Query error (ratings)' });
      }
      const details = {
        imdbId: movie.imdbId,
        title: movie.title,
        description: movie.overview,
        releaseDate: movie.releaseDate,
        budget: movie.budget ? `$${Number(movie.budget).toLocaleString()}` : null,
        runtime: movie.runtime,
        averageRating: ratingRow && ratingRow.averageRating ? Number(ratingRow.averageRating).toFixed(2) : null,
        genres: movie.genres,
        originalLanguage: movie.language,
        productionCompanies: movie.productionCompanies
      };
      res.json(details);
    });
  });
};

exports.getMoviesByYear = (req, res) => {
  const year = req.params.year;
  const page = parseInt(req.query.page) || 1;
  const pageSize = 50;
  const offset = (page - 1) * pageSize;
  const desc = req.query.desc === 'true';
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection error' });
    }
  });
  // releaseDate is in 'YYYY-MM-DD' format
  const order = desc ? 'DESC' : 'ASC';
  const query = `SELECT imdbId, title, genres, releaseDate, budget FROM movies WHERE substr(releaseDate, 1, 4) = ? ORDER BY releaseDate ${order} LIMIT ? OFFSET ?`;
  db.all(query, [year, pageSize, offset], (err, rows) => {
    db.close();
    if (err) {
      return res.status(500).json({ error: 'Query error' });
    }
    const movies = rows.map(row => ({
      imdbId: row.imdbId,
      title: row.title,
      genres: row.genres,
      releaseDate: row.releaseDate,
      budget: row.budget ? `$${Number(row.budget).toLocaleString()}` : null
    }));
    res.json({ year, page, pageSize, movies });
  });
};

exports.getMoviesByGenre = (req, res) => {
  const genre = req.params.genre.toLowerCase();
  const page = parseInt(req.query.page) || 1;
  const pageSize = 50;
  const offset = (page - 1) * pageSize;
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection error' });
    }
  });
  // genres is a JSON string, so we use LIKE for partial match
  const query = `SELECT imdbId, title, genres, releaseDate, budget FROM movies WHERE LOWER(genres) LIKE ? LIMIT ? OFFSET ?`;
  db.all(query, [`%${genre}%`, pageSize, offset], (err, rows) => {
    db.close();
    if (err) {
      return res.status(500).json({ error: 'Query error' });
    }
    const movies = rows.map(row => ({
      imdbId: row.imdbId,
      title: row.title,
      genres: row.genres,
      releaseDate: row.releaseDate,
      budget: row.budget ? `$${Number(row.budget).toLocaleString()}` : null
    }));
    res.json({ genre, page, pageSize, movies });
  });
}; 