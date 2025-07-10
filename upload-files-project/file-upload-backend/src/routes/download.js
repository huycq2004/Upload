const express = require('express');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'D:/uploads';

// Route tải về cả folder dưới dạng zip
router.get('/:folder', (req, res, next) => {
    const { folder } = req.params;
    const folderPath = path.join(UPLOAD_DIR, folder);

    // Nếu đang gọi tải 1 file cụ thể thì next()
    if (req.params.filename) return next();

    // Kiểm tra bảo mật
    if (!folderPath.startsWith(path.normalize(UPLOAD_DIR))) {
        return res.status(400).send('Đường dẫn không hợp lệ.');
    }

    if (!fs.existsSync(folderPath)) {
        return res.status(404).send('Thư mục không tồn tại.');
    }

    res.setHeader(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodeURIComponent(folder)}.zip`
    );
    res.setHeader('Content-Type', 'application/zip');


    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.directory(folderPath, false);
    archive.pipe(res);
    archive.finalize();
});

module.exports = router;
