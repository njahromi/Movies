const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/moviesController');

// GET /movies
router.get('/', moviesController.listMovies);

// GET /movies/:imdbId
router.get('/:imdbId', moviesController.getMovieDetails);

// GET /movies/year/:year
router.get('/year/:year', moviesController.getMoviesByYear);

// GET /movies/genre/:genre
router.get('/genre/:genre', moviesController.getMoviesByGenre);

module.exports = router; 