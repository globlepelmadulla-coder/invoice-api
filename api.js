const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const config = require('./config');

const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning']
}));

app.use(express.json());

const pool = mysql.createPool(config.mysqlDB);

// Middleware to handle ngrok warning
app.use((req, res, next) => {
    // Skip ngrok warning page
    res.setHeader('ngrok-skip-browser-warning', 'true');
    next();
});

// Get all invoices
app.get('/api/invoices', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    pool.query(`SELECT * FROM INVOICE_HDR ORDER BY SysInvNO DESC LIMIT ${limit}`, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: results, count: results.length });
        }
    });
});

// Get single invoice
app.get('/api/invoices/:id', (req, res) => {
    pool.query('SELECT * FROM INVOICE_HDR WHERE SysInvNO = ?', [req.params.id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, data: results[0] || null });
        }
    });
});

// Get invoice count
app.get('/api/invoices/count', (req, res) => {
    pool.query('SELECT COUNT(*) as total FROM INVOICE_HDR', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, total: results[0].total });
        }
    });
});

// Dashboard stats
app.get('/api/dashboard', (req, res) => {
    pool.query('SELECT COUNT(*) as total, SUM(NetAmount) as total_amount FROM INVOICE_HDR', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, ...results[0] });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Invoice API Server Running`);
    console.log(`📍 URL: http://0.0.0.0:${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   GET /api/invoices`);
    console.log(`   GET /api/invoices/:id`);
    console.log(`   GET /api/invoices/count`);
    console.log(`   GET /api/dashboard\n`);
});