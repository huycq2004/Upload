import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);
        onLogin(username);
        navigate('/manage');
    } catch (err) {
      setErrorMsg(`${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative">
        {/* Header Icon */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center shadow-lg">
          <Lock className="w-10 h-10 text-blue-600" />
        </div>

        <h2 className="text-center text-3xl font-bold text-blue-700 mt-12 mb-6">
          Đăng nhập hệ thống
        </h2>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-100 text-red-800 text-sm rounded-lg p-3 flex items-start space-x-2 mb-4 border border-red-200">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full outline-none bg-transparent text-gray-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                className="w-full outline-none bg-transparent text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition duration-200"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer warning */}
        <div className="text-sm text-gray-600 text-center mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          Nếu bạn không phải là quản trị viên, vui lòng quay về {' '}
          <a href="/" className="font-semibold text-blue-600 underline hover:text-blue-800">
            Trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
