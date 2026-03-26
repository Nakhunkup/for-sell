const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretcoursekey123';

// Validate JWT Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No valid token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
    }
};

// Check if user is an Instructor
const isInstructor = (req, res, next) => {
    if (!req.user || req.user.role !== 'instructor') {
        return res.status(403).json({ error: 'Forbidden. This API is restricted to Instructors.' });
    }
    next();
};

// Check if user is a Student (User)
const isStudent = (req, res, next) => {
    // In our system, students are marked with role 'user'
    if (!req.user || (req.user.role !== 'user' && req.user.role !== 'student')) {
        return res.status(403).json({ error: 'Forbidden. This API is restricted to Students.' });
    }
    next();
};

module.exports = {
    verifyToken,
    isInstructor,
    isStudent
};
