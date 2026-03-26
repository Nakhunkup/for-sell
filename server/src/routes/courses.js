const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { readSheet, writeSheet } = require('../db/excel');

const { verifyToken, isInstructor } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer Storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../../uploads'); // maps to server/uploads
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// GET all courses
router.get('/', (req, res) => {
    try {
        const rawCourses = readSheet('Courses');
        const query = req.query.search?.toLowerCase() || '';
        const category = req.query.category?.toLowerCase() || '';

        // Safely parse JSON arrays for modules and videos if stored as strings
        let courses = rawCourses.map(c => {
            return {
                ...c,
                tags: typeof c.tags === 'string' ? JSON.parse(c.tags || '[]') : []
            };
        });

        if (query) courses = courses.filter(c => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query));
        if (category) courses = courses.filter(c => c.category?.toLowerCase() === category);

        res.json(courses);
    } catch (error) {
        console.error("Fetch Courses Error", error);
        res.status(500).json({ error: 'Internal system error' });
    }
});

// GET course by ID
router.get('/:id', (req, res) => {
    try {
        const courses = readSheet('Courses');
        const course = courses.find(c => c.id === req.params.id);
        
        if (!course) return res.status(404).json({ error: 'Course not found' });
        
        // Return without video URLs unless purchased (Payment validation happens later in a secure way, but for MVP we return the course details)
        res.json({
            ...course,
            videoUrl: course.videoUrl, // In real app, hide this until purchased
            slidesUrl: course.slidesUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal system error' });
    }
});

// POST Create Course (Instructor only)
router.post('/', verifyToken, isInstructor, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'slides', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, description, price, category, tags } = req.body;
        
        if (!title || !description || !price || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const videoFile = req.files['video'] ? `/uploads/${req.files['video'][0].filename}` : null;
        const slidesFile = req.files['slides'] ? `/uploads/${req.files['slides'][0].filename}` : null;

        const courses = readSheet('Courses');
        
        const newCourse = {
            id: Date.now().toString(),
            instructorId: req.user.id,
            title,
            description,
            price: parseFloat(price),
            category,
            tags: tags || "[]",
            videoUrl: videoFile,
            slidesUrl: slidesFile,
            createdAt: new Date().toISOString()
        };

        courses.push(newCourse);
        await writeSheet('Courses', courses);

        res.status(201).json({ message: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(500).json({ error: 'Internal system error' });
    }
});

// Instructor specific courses
router.get('/instructor/my-courses', verifyToken, isInstructor, (req, res) => {
    try {
        const courses = readSheet('Courses');
        const myCourses = courses.filter(c => c.instructorId === req.user.id);
        res.json(myCourses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching instructor courses' });
    }
});

module.exports = router;
