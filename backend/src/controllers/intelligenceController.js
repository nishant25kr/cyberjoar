const Intelligence = require('../models/Intelligence');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// @desc    Get all intelligence records
// @route   GET /api/intelligence
exports.getAllRecords = async (req, res) => {
    try {
        const { sourceType, priority, search } = req.query;
        let query = {};

        if (sourceType) query.sourceType = sourceType;
        if (priority) query.priority = priority;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const records = await Intelligence.find(query).sort({ timestamp: -1 });
        res.status(200).json({ success: true, count: records.length, data: records });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create a record
// @route   POST /api/intelligence
exports.createRecord = async (req, res) => {
    try {
        const record = await Intelligence.create(req.body);
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Upload file (CSV/JSON/XLSX)
// @route   POST /api/intelligence/upload
exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let records = [];

    try {
        if (fileExt === '.json') {
            const data = fs.readFileSync(filePath, 'utf-8');
            records = JSON.parse(data);
        } else if (fileExt === '.csv') {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => records.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else if (fileExt === '.xlsx' || fileExt === '.xls') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            records = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }

        // Map and validate records
        const formattedRecords = records.map(rec => ({
            title: rec.title || 'Untitled Report',
            sourceType: rec.sourceType || 'OSINT',
            description: rec.description || 'No description provided',
            latitude: parseFloat(rec.latitude),
            longitude: parseFloat(rec.longitude),
            timestamp: rec.timestamp ? new Date(rec.timestamp) : new Date(),
            confidence: parseInt(rec.confidence) || 50,
            priority: rec.priority || 'Medium',
            tags: typeof rec.tags === 'string' ? rec.tags.split(',') : (rec.tags || []),
            imageUrl: rec.imageUrl || ''
        }));

        const savedRecords = await Intelligence.insertMany(formattedRecords);
        
        // Clean up file
        fs.unlinkSync(filePath);

        res.status(200).json({ success: true, count: savedRecords.length, data: savedRecords });
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Upload image
// @route   POST /api/intelligence/upload-image
exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, imageUrl });
};

// @desc    Get stats
// @route   GET /api/intelligence/stats
exports.getStats = async (req, res) => {
    try {
        const total = await Intelligence.countDocuments();
        const osint = await Intelligence.countDocuments({ sourceType: 'OSINT' });
        const humint = await Intelligence.countDocuments({ sourceType: 'HUMINT' });
        const imint = await Intelligence.countDocuments({ sourceType: 'IMINT' });
        
        const recent = await Intelligence.find().sort({ timestamp: -1 }).limit(5);

        res.status(200).json({
            success: true,
            stats: { total, osint, humint, imint },
            recent
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
