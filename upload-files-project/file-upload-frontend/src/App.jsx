import { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import './App.css';
import UploadForm from './components/UploadForm';
import FilesTable from './components/FilesTable';
import LoginForm from './components/LoginForm';
import UploadSuccessfulPage from './components/UploadSuccessfulPage';
import UploadErrorPage from './components/UploadErrorPage';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // ✅ mới thêm

  useEffect(() => {
    const storedLogin = localStorage.getItem('adminLoggedIn');
    const storedUsername = localStorage.getItem('adminUsername');
    if (storedLogin === 'true' && storedUsername) {
      setLoggedInUser(storedUsername);
    }
    setIsLoadingAuth(false); // ✅ xong rồi thì cho render
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUsername');
    setLoggedInUser(null);
  };

  if (isLoadingAuth) {
    return <div className="text-center mt-10 text-gray-500">⏳ Đang tải...</div>; // ✅ Loading tạm thời
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadForm />} />

        <Route
          path="/manage"
          element={
            loggedInUser ? (
              <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                      👋 Xin chào, <span className="text-blue-600">{loggedInUser}</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                      Chào mừng bạn trở lại. Dưới đây là danh sách các file đã được upload.
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Đăng xuất
                  </button>
                </div>

                <FilesTable />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/login" element={<LoginForm onLogin={setLoggedInUser} />} />
        <Route path="/success" element={<UploadSuccessfulPage />} />
        <Route path="/error" element={<UploadErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;