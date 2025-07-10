import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import ManageTable from './components/ManageTable';
import UploadForm from './components/UploadForm'; 

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Trang upload mở cho mọi người */}
        <Route path="/upload" element={<UploadForm />} />

        {/* Trang quản lý: chỉ cho admin */}
        <Route
          path="/manage"
          element={
            loggedInUser ? (
              <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>👋 Xin chào, {loggedInUser}</h5>
                  <button className="btn btn-outline-danger" onClick={() => setLoggedInUser(null)}>Đăng xuất</button>
                </div>
                <ManageTable />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Trang đăng nhập mặc định */}
        <Route path="/" element={<LoginForm onLogin={setLoggedInUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
