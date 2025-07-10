require('dotenv').config();

exports.handleLogin = (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra thiếu trường
  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.' });
  }

  // So sánh với biến môi trường
  const isValidUser =
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD;

  if (!isValidUser) {
    return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác.' });
  }

  // Có thể sau này gắn JWT hoặc session ở đây
  return res.status(200).json({ message: 'Đăng nhập thành công', user: username });
};
