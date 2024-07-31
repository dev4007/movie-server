const express = require('express');
const { upload, createMovie, updateMovie, getAllMovies,getMovieById } = require('../controllers/movieController');
const router = express.Router();

router.post('/movie', upload.single('image'), createMovie);
router.put('/movie/:id', upload.single('image'), updateMovie);
router.get('/movie-list/:id', getMovieById);
router.get('/movies', getAllMovies); // New route to get all movies

module.exports = router;
