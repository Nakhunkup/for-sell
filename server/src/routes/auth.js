const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readSheet, writeSheet } = require('../db/excel');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretcoursekey123';

// Mocking failed logins IP block in-memory (in production use Redis)
const failedLogins = {};
const BLOCK_LIMIT = 7;
const BLOCK_DURATION = 4 * 60 * 60 * 1000; // 4 hours

const checkBlockStatus = (ip) => {
    const record = failedLogins[ip];
    if (record && record.count >= BLOCK_LIMIT) {
        if (Date.now() < record.blockUntil) {
            return { locked: true, timeRemaining: record.blockUntil - Date.now() };
        } else {
            // Block expired, remove record
            delete failedLogins[ip];
        }
    }
    return { locked: false };
};

const recordFailedLogin = (ip) => {
    if (!failedLogins[ip]) {
        failedLogins[ip] = { count: 0, blockUntil: null };
    }
    failedLogins[ip].count += 1;
    if (failedLogins[ip].count >= BLOCK_LIMIT) {
        failedLogins[ip].blockUntil = Date.now() + BLOCK_DURATION;
    }
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password, role = 'user' } = req.body;
        
        if (!username || !email || !password || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const users = readSheet('Users');
        
        // Check if email exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            phone,
            password: hashPassword,
            role, // 'user' or 'instructor'
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeSheet('Users', users);
        
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ 
            message: 'User registered successfully',
            user: { id: newUser.id, username, email, role },
            token
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        
        const blockStatus = checkBlockStatus(ip);
        if (blockStatus.locked) {
            return res.status(403).json({ 
                error: `Too many failed attempts. Try again in ${Math.ceil(blockStatus.timeRemaining / 60000)} minutes.` 
            });
        }

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const users = readSheet('Users');
        const user = users.find(u => u.email === email);

        if (!user) {
            recordFailedLogin(ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            recordFailedLogin(ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Reset failed logins on success
        delete failedLogins[ip];

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Profile endpoint
router.get('/me', verifyToken, async (req, res) => {
    try {
        const users = readSheet('Users');
        const user = users.find(u => u.id === req.user.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, phone: user.phone } });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
