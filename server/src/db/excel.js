const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../../data/database.xlsx');

// Ensure database file exists
const initDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        const wb = XLSX.utils.book_new();
        
        // Users sheet
        const wsUsers = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(wb, wsUsers, "Users");
        
        // Courses sheet
        const wsCourses = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(wb, wsCourses, "Courses");

        // Purchases sheet
        const wsPurchases = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(wb, wsPurchases, "Purchases");

        // Ensure data folder exists
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        XLSX.writeFile(wb, DB_PATH);
    }
};

initDB();

// Simple Mutex for Excel file synchronization
let isWriting = false;
const writeQueue = [];

const processQueue = async () => {
    if (isWriting || writeQueue.length === 0) return;
    
    isWriting = true;
    const { task, resolve, reject } = writeQueue.shift();
    
    try {
        const result = await task();
        resolve(result);
    } catch (error) {
        reject(error);
    } finally {
        isWriting = false;
        processQueue(); // Process next in queue
    }
};

const executeWithLock = (task) => {
    return new Promise((resolve, reject) => {
        writeQueue.push({ task, resolve, reject });
        processQueue();
    });
};

const readSheet = (sheetName) => {
    if (!fs.existsSync(DB_PATH)) initDB();
    const wb = XLSX.readFile(DB_PATH);
    const ws = wb.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(ws);
};

const writeSheet = (sheetName, data) => {
    return executeWithLock(() => {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(DB_PATH)) initDB();
                const wb = XLSX.readFile(DB_PATH);
                const ws = XLSX.utils.json_to_sheet(data);
                wb.Sheets[sheetName] = ws;
                XLSX.writeFile(wb, DB_PATH);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    });
};

module.exports = {
    readSheet,
    writeSheet
};
