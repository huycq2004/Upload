import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  //  Dùng để điều hướng sau khi đăng nhập
import styles from './LoginForm.module.css';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();  //  Hook điều hướng của React Router

  //  Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    //  Xác thực tài khoản cứng (tạm thời, chưa gọi backend)
    if (username === 'admin' && password === '123456') {
      onLogin(username);         //  Gọi callback từ App (set user state)
      navigate('/manage');       //  Chuyển trang về /manage sau khi đăng nhập
    } else {
      setErrorMsg('❌ Sai tài khoản hoặc mật khẩu!'); // 💬 Hiển thị thông báo lỗi
    }
  };

  return (
    <div className={`card p-4 ${styles.loginCard}`}>
      <h4 className="text-center mb-4">🔐 Đăng nhập hệ thống</h4>

      {/*  Hiển thị thông báo lỗi nếu có */}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        {/*  Ô nhập username */}
        <div className="mb-3">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            required
          />
        </div>

        {/*  Ô nhập mật khẩu */}
        <div className="mb-3">
          <label>Mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        {/*  Nút đăng nhập */}
        <button type="submit" className="btn btn-primary w-100">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
