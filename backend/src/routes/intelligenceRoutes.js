const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    getAllRecords,
    createRecord,
    uploadFile,
    uploadImage,
    getStats
} = require('../controllers/intelligenceController');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/', getAllRecords);
router.post('/', createRecord);
router.get('/stats', getStats);
router.post('/upload', upload.single('file'), uploadFile);
router.post('/upload-image', upload.single('image'), uploadImage);

module.exports = router;
