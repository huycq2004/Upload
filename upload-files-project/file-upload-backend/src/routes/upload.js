const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Dùng multer để xử lý upload bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.array('files'), uploadController.handleUpload);
router.get('/list', uploadController.getUploadList);

module.exports = router;
