import React from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';

export default function FileUploadGroup({
  label,
  files,
  onFileSelect,
  onRemoveFile,
  isDragging,
  setIsDragging,
  error,
  fileInputRef,
  isUploading = false,
  formatFileSize
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <File className="w-4 h-4 mr-2 text-blue-600" />
        {label}
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          onFileSelect(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer hover:bg-gray-50 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-300 bg-red-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => onFileSelect(e.target.files)}
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

      {error && (
        <p className="flex items-center text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm text-left font-medium text-gray-700">Đã chọn ({files.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((item) => (
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
                  onClick={() => onRemoveFile(item.id)}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
