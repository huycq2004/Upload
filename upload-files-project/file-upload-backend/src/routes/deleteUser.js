const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // đường dẫn tuỳ theo cấu trúc của bạn
const express = require('express');
const router = express.Router();

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      'SELECT folder_name FROM user WHERE user_id = ?',
      [userId]
    );

    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });

    const folder = rows[0].folder_name;
    const folderPath = path.join(process.env.UPLOAD_DIR, folder);

    // Xoá folder vật lý
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }

    // Xoá trong DB (giả định bạn đã set ON DELETE CASCADE cho bảng `detail`)
    await db.promise().query('DELETE FROM user WHERE user_id = ?', [userId]);

    res.status(200).json({ message: 'Xoá thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xoá người dùng.' });
  }
});

module.exports = router;