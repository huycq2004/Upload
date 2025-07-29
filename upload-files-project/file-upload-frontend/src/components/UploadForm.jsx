import React, { useState, useRef } from 'react';
import { Upload, X, File, Check, User, GraduationCap, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FileUploadGroup from './FileUploadGroup';

function UploadForm() {
  //Khai báo useState cho họ và tên + lớp
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');

  // Group 1: Văn bản
  const [filesGroup1, setFilesGroup1] = useState([]);
  const [isDragging1, setIsDragging1] = useState(false);
  const fileInputRef1 = useRef(null);

  // Group 2: Hình ảnh
  const [filesGroup2, setFilesGroup2] = useState([]);
  const [isDragging2, setIsDragging2] = useState(false);
  const fileInputRef2 = useRef(null);

  // Group 3: Tài liệu khác
  const [filesGroup3, setFilesGroup3] = useState([]);
  const [isDragging3, setIsDragging3] = useState(false);
  const fileInputRef3 = useRef(null);
  
  // Khai báo usetState cho Error & uploading
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Khai báo hook chuyển hướng trang
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!className.trim()) newErrors.className = 'Vui lòng nhập lớp';
    if (filesGroup1.length === 0) newErrors.group1 = 'Bạn cần chọn ít nhất một file';
    if (filesGroup2.length === 0) newErrors.group2 = 'Bạn cần chọn ít nhất một file';
    if (filesGroup3.length === 0) newErrors.group3 = 'Bạn cần chọn ít nhất một file';
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
  
  const handleFileSelect = (files, setFileGroup) => {
    if (!files) return;
    const fileArray = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      uploadedAt: new Date(),
    }));

    setFileGroup(prev => [...prev, ...fileArray]);
  };

  const removeFile = (id, setFileGroup) => {
    setFileGroup(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const allFiles = [
      ...filesGroup1.map(f => ({ ...f, group: 'Tepvanban' })),
      ...filesGroup2.map(f => ({ ...f, group: 'Hinhanh' })),
      ...filesGroup3.map(f => ({ ...f, group: 'Tailieukhac' })),
    ];

    const formData = new FormData();
    formData.append('ho_ten', fullName);
    formData.append('lop', className);
    allFiles.forEach(f => {
      formData.append('files', f.file); // file
      formData.append('fileGroups', f.group); // tên nhóm tương ứng
    });

    try {
      setIsUploading(true);
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

        setFullName('');
        setClassName('');
        setFilesGroup1([]);
        setFilesGroup2([]);
        setFilesGroup3([]);
      } else {
        const message = res.data?.message || 'Lỗi không xác định từ máy chủ.';
        navigate('/error', {
          state: {
            errorType: 'server',
            errorMessage: message,
            failedFiles: allFiles.map(f => ({
              name: f.file.name,
              size: f.file.size,
              error: 'Không rõ lý do'
            }))
          }
        });
      }
    } catch (err) {
      const errorType = err.response ? 'server' : 'network';
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';

      navigate('/error', {
        state: {
          errorType,
          errorMessage,
          failedFiles: allFiles.map(f => ({
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
          <FileUploadGroup
            label="Tệp văn bản"
            files={filesGroup1}
            onFileSelect={(files) => handleFileSelect(files, setFilesGroup1)}
            onRemoveFile={(id) => removeFile(id, setFilesGroup1)}
            isDragging={isDragging1}
            setIsDragging={setIsDragging1}
            error={errors.group1}
            fileInputRef={fileInputRef1}
            isUploading={isUploading}
            formatFileSize={formatFileSize}
          />

          <FileUploadGroup
            label="Hình ảnh"
            files={filesGroup2}
            onFileSelect={(files) => handleFileSelect(files, setFilesGroup2)}
            onRemoveFile={(id) => removeFile(id, setFilesGroup2)}
            isDragging={isDragging2}
            setIsDragging={setIsDragging2}
            error={errors.group2}
            fileInputRef={fileInputRef2}
            isUploading={isUploading}
            formatFileSize={formatFileSize}
          />

          <FileUploadGroup
            label="Tài liệu khác"
            files={filesGroup3}
            onFileSelect={(files) => handleFileSelect(files, setFilesGroup3)}
            onRemoveFile={(id) => removeFile(id, setFilesGroup3)}
            isDragging={isDragging3}
            setIsDragging={setIsDragging3}
            error={errors.group3}
            fileInputRef={fileInputRef3}
            isUploading={isUploading}
            formatFileSize={formatFileSize}
          />

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
