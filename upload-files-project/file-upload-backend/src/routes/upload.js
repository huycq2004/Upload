const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// Dùng multer để xử lý upload bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    // THÊM KHỐI 'LIMITS' NÀY VÀO
    limits: {
        fileSize: 100 * 1024 * 1024, // Giới hạn dung lượng mỗi file là 100MB
        files: 100                    // Giới hạn số lượng file tối đa trong một lần upload
    }
});


router.post('/', upload.array('files'), uploadController.handleUpload);
router.get('/list', uploadController.getUploadList);

module.exports = router;
