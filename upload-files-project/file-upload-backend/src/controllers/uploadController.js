const path = require('path');
const fs = require('fs');
const db = require('../config/db').promise(); // dùng pool.promise()
require('dotenv').config();

function formatTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function formatDateOnly() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}`;
}

const UPLOAD_BASE = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

exports.handleUpload = async (req, res) => {
  const { ho_ten, ngay_sinh, so_dien_thoai, can_cuoc_cong_dan } = req.body;
  const files = req.files;
  let fileGroups = req.body.fileGroups;

  if (!ho_ten || !ngay_sinh || !so_dien_thoai || !can_cuoc_cong_dan || !files || files.length === 0) {
    return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc file.' });
  }

  if (!Array.isArray(fileGroups)) {
    fileGroups = [fileGroups];
  }

  const folder_timestamp = formatTimestamp();
  const folderName = `${ho_ten.replace(/\s+/g, '_')}_${folder_timestamp}`;
  const uploadDir = path.join(UPLOAD_BASE, folderName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    const [userResult] = await db.query(
      `INSERT INTO user (ho_ten, ngay_sinh, so_dien_thoai, can_cuoc_cong_dan, folder_name, upload_time)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [ho_ten, ngay_sinh, so_dien_thoai, can_cuoc_cong_dan, folderName]
    );

    const user_id = userResult.insertId;
    const insertedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const group = fileGroups[i] || 'unknown';
      const file_timestamp = formatDateOnly();
      const ext = path.extname(file.originalname);
      const baseName = `${ho_ten.replace(/\s+/g, '_')}_${group}_${file_timestamp}${ext}`;
      const relativePath = path.join('uploads', folderName, baseName);
      const absolutePath = path.join(uploadDir, baseName);

      fs.writeFileSync(absolutePath, file.buffer);

      await db.query(
        `INSERT INTO detail (user_id, file_name, file_path, file_type, file_size)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, baseName, relativePath, file.mimetype, file.size]
      );

      insertedFiles.push({
        file_name: baseName,
        file_path: relativePath,
        file_type: file.mimetype,
        file_size: file.size,
      });
    }

    res.status(200).json({
      message: 'Upload thành công',
      user: {
        id: user_id,
        name: ho_ten,
        birth: ngay_sinh,
        phone: so_dien_thoai,
        cccd: can_cuoc_cong_dan,
        folder: folderName,
        uploadDate: new Date().toLocaleDateString('vi-VN'),
        files: insertedFiles,
      }
    });
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ message: 'Lỗi server khi xử lý upload' });
  }
};

exports.getUploadList = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM user ORDER BY upload_time DESC');
    const result = [];

    for (const user of users) {
      const [files] = await db.query('SELECT * FROM detail WHERE user_id = ?', [user.user_id]);

      result.push({
        id: user.user_id,
        name: user.ho_ten,
        birth: user.ngay_sinh,
        phone: user.so_dien_thoai,
        cccd: user.can_cuoc_cong_dan,
        uploadDate: new Date(user.upload_time).toLocaleDateString('vi-VN'),
        folder: user.folder_name,
        files: files.map(f => ({
          file_name: f.file_name,
          file_path: f.file_path,
          file_type: f.file_type,
          file_size: f.file_size,
        }))
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách upload:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu' });
  }
};

