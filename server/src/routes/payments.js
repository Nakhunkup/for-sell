const express = require('express');
const jwt = require('jsonwebtoken');
const { readSheet, writeSheet } = require('../db/excel');

const { verifyToken, isStudent } = require('../middleware/authMiddleware');

const router = express.Router();

// Simulated Payment Checkout (Students Only)
router.post('/checkout', verifyToken, isStudent, async (req, res) => {
    try {
        const { courseId, paymentMethod } = req.body;
        
        if (!courseId) {
            return res.status(400).json({ error: 'Course ID missing' });
        }

        const courses = readSheet('Courses');
        const course = courses.find(c => c.id === courseId);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if already purchased
        const purchases = readSheet('Purchases');
        const alreadyPurchased = purchases.find(p => p.userId === req.user.id && p.courseId === courseId);
        
        if (alreadyPurchased) {
            return res.status(400).json({ error: 'You already own this course' });
        }

        // Simulating Payment Success ...

        const newPurchase = {
            id: Date.now().toString(),
            userId: req.user.id,
            courseId: courseId,
            pricePaid: course.price,
            status: 'completed',
            purchasedAt: new Date().toISOString()
        };

        purchases.push(newPurchase);
        await writeSheet('Purchases', purchases);

        res.json({ message: 'Payment successful, course unlocked!', purchase: newPurchase });
    } catch (error) {
        console.error("Payment Error:", error);
        res.status(500).json({ error: 'Internal system error' });
    }
});

// Get user purchases (My Learning)
router.get('/my-purchases', verifyToken, isStudent, (req, res) => {
    try {
        const purchases = readSheet('Purchases');
        const courses = readSheet('Courses');

        const myPurchases = purchases.filter(p => p.userId === req.user.id);
        
        // Join course data
        const purchasedCourses = myPurchases.map(p => {
            const course = courses.find(c => c.id === p.courseId);
            return {
                ...p,
                courseDetails: course || null
            }
        });

        res.json(purchasedCourses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching purchases' });
    }
});

module.exports = router;
