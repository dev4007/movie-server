const Movie = require('../models/Movie');
const multer = require('multer');
const path = require('path'); // Import the path module
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
        
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

const createMovie = async (req, res) => {
    const { title, year } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const image = req.file.path;
    try {
        const movie = await Movie.create({ title, year, image });
        res.status(201).json({ success: true, data: movie });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

const updateMovie = async (req, res) => {
    const { id } = req.params;
    const { title, year } = req.body;
    const updateFields = {};
    
    if (title) updateFields.title = title;
    if (year) updateFields.year = year;
    if (req.file) updateFields.image = req.file.path;

    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }
        // Delete the old image file if a new one is uploaded
        if (req.file && movie.image) {
            fs.unlinkSync(movie.image);
        }
        // Update movie details
        Object.assign(movie, updateFields);
        await movie.save();
        res.status(200).json({ success: true, data: movie });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({ success: true, data: movies });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


const getMovieById = async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ success: false, error: 'Movie not found' });
        }
        res.status(200).json({ success: true, data: movie });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = { upload, createMovie, updateMovie, getAllMovies,getMovieById };
