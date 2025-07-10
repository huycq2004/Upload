import React, { useState, useRef } from 'react';
import { Upload, X, File, Check, User, GraduationCap, AlertCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadForm() {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!className.trim()) newErrors.className = 'Vui lòng nhập lớp';
    if (selectedFiles.length === 0) newErrors.files = 'Vui lòng chọn ít nhất một file';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (files) => {
    if (!files) return;
    const fileArray = Array.from(files);
    const mapped = fileArray.map(file => ({
      file,
      id: Math.random().toString(36).substring(2),
      uploadedAt: new Date(),
    }));
    setSelectedFiles(prev => [...prev, ...mapped]);
    setErrors(prev => ({ ...prev, files: '' }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('ho_ten', fullName);
    formData.append('lop', className);
    selectedFiles.forEach(f => {
      formData.append('files', f.file); // `f.file` là file gốc
    });

    try {
      setIsUploading(true);

      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200 && res.data?.user?.files) {
        navigate('/success', {
          state: {
            fullName,
            className,
            uploadedFiles: res.data.user.files.map((f, i) => ({
              id: i + 1,
              name: f.file_name,
              size: f.file_size,
              type: f.file_type,
              uploadedAt: new Date(),
            }))
          }
        });

        // Reset form
        setFullName('');
        setClassName('');
        setSelectedFiles([]);
      } else {
        // Nếu response trả về lỗi nhưng không throw, vẫn điều hướng đến /error
        const message = res.data?.message || 'Lỗi không xác định từ máy chủ.';
        navigate('/error', {
          state: {
            errorType: 'server',
            errorMessage: message,
            failedFiles: selectedFiles.map(f => ({
              name: f.file.name,
              size: f.file.size,
              error: 'Không rõ lý do'
            }))
          }
        });
      }

    } catch (err) {
      // Trường hợp request lỗi hoàn toàn (network, CORS, timeout...)
      const errorType = err.response ? 'server' : 'network';
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';

      navigate('/error', {
        state: {
          errorType,
          errorMessage,
          failedFiles: selectedFiles.map(f => ({
            name: f.file.name,
            size: f.file.size,
            error: 'Upload thất bại'
          }))
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gửi Tài Liệu</h1>
          <p className="text-gray-600">Vui lòng điền đầy đủ thông tin và tải lên tài liệu của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Họ và tên
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors(prev => ({ ...prev, fullName: '' }));
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.fullName && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Class */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <GraduationCap className="w-4 h-4 mr-2 text-blue-600" />
              Lớp
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                setErrors(prev => ({ ...prev, className: '' }));
              }}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                errors.className ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Nhập lớp của bạn"
            />
            {errors.className && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.className}
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <File className="w-4 h-4 mr-2 text-blue-600" />
              Chọn file đính kèm
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:bg-gray-50 ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } ${errors.files ? 'border-red-300 bg-red-50' : ''}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Đang tải lên...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Kéo thả file vào đây hoặc <span className="text-blue-600 font-medium">nhấp để chọn</span>
                  </p>
                  <p className="text-sm text-gray-500">Hỗ trợ tất cả các loại file</p>
                </div>
              )}
            </div>

            {errors.files && (
              <p className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.files}
              </p>
            )}
          </div>

          {/* Uploaded Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm text-left font-medium text-gray-700">File đã tải lên ({selectedFiles.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <File className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
                        <p className="text-xs text-left text-gray-500">
                          {formatFileSize(item.file.size)} • {item.uploadedAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(item.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            <Check className="w-5 h-5" />
            <span>Gửi nội dung</span>
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Nếu bạn là quản trị viên, hãy <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">đăng nhập</a>.</p>
        </div>
      </div>
    </div>
  );
}

export default UploadForm;
