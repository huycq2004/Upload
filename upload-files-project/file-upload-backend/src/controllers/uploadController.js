const path = require('path');
const fs = require('fs');
const db = require('../config/db');
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

exports.handleUpload = (req, res) => {
  const { ho_ten, lop } = req.body;
  const files = req.files;
  let fileGroups = req.body.fileGroups;

  if (!ho_ten || !lop || !files || files.length === 0) {
    return res.status(400).json({ message: 'Thiếu thông tin hoặc file.' });
  }

  // Đảm bảo fileGroups luôn là mảng
  if (!Array.isArray(fileGroups)) {
    fileGroups = [fileGroups];
  }

  const folder_timestamp = formatTimestamp();
  const folderName = `${ho_ten.replace(/\s+/g, '_')}_${lop}_${folder_timestamp}`;
  const uploadDir = path.join(UPLOAD_BASE, folderName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const insertUserSQL = `INSERT INTO user (ho_ten, lop, folder_name, upload_time) VALUES (?, ?, ?, NOW())`;
  db.query(insertUserSQL, [ho_ten, lop, folderName], (err, userResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Lỗi tạo user' });
    }

    const user_id = userResult.insertId;

    const fileInsertions = files.map((file, index) => {
      const file_timestamp = formatDateOnly();
      const group = fileGroups[index] || 'unknown';
      const ext = path.extname(file.originalname);
      const baseName = `${ho_ten.replace(/\s+/g, '_')}_${group}_${file_timestamp}_${ext}`;
      const relativePath = path.join('uploads', folderName, baseName);
      const absolutePath = path.join(uploadDir, baseName);

      fs.writeFileSync(absolutePath, file.buffer);

      const sql = `INSERT INTO detail (user_id, file_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?)`;
      const values = [user_id, baseName, relativePath, file.mimetype, file.size];

      return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
          if (err) reject(err);
          else resolve({
            file_name: baseName,
            file_path: relativePath,
            file_type: file.mimetype,
            file_size: file.size,
          });
        });
      });
    });

    Promise.all(fileInsertions)
      .then((insertedFiles) => {
        res.status(200).json({
          message: 'Upload thành công',
          user: {
            id: user_id,
            name: ho_ten,
            class: lop,
            folder: folderName,
            uploadDate: new Date().toLocaleDateString('vi-VN'),
            files: insertedFiles,
          }
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Lỗi lưu file vào DB' });
      });
  });
};

exports.getUploadList = async (req, res) => {
  try {
    const [users] = await db.promise().query('SELECT * FROM user ORDER BY upload_time DESC');

    const result = [];

    for (const user of users) {
      const [files] = await db.promise().query('SELECT * FROM detail WHERE user_id = ?', [user.user_id]);

      result.push({
        id: user.user_id,
        name: user.ho_ten,
        class: user.lop,
        uploadDate: new Date(user.upload_time).toLocaleDateString('vi-VN'),
        files: files.map(f => ({
          file_name: f.file_name,
          file_path: f.file_path,
          file_type: f.file_type,
          file_size: f.file_size,
          folder_name: user.folder_name
        }))
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách upload:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu' });
  }
};
