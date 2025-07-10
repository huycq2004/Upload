import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, ArrowLeft,
  FileText, Calendar, User, GraduationCap, Package, Star
} from 'lucide-react';

const UploadSuccessfulPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fallback nếu user F5 mất state
  const fullName = state?.fullName || 'Chưa rõ';
  const className = state?.className || 'Chưa rõ';
  const uploadedFiles = state?.uploadedFiles || [];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
  const submissionTime = new Date();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-100 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-green-100 rounded-full opacity-25 animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle2 className="w-14 h-14 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-sm"><Star /></span>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Hoàn thành!
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Tài liệu của bạn đã được gửi thành công và đang được xử lý. 
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Submission Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student Information */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-6 h-6 text-emerald-600 mr-3" />
                  Thông tin học sinh
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-2xl">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-700">Họ và tên</p>
                        <p className="text-lg font-bold text-gray-900">{fullName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-2xl">
                      <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-700">Lớp</p>
                        <p className="text-lg font-bold text-gray-900">{className}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Files List */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Package className="w-6 h-6 text-emerald-600 mr-3" />
                    Tài liệu đã gửi
                  </h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                      {uploadedFiles.length} files
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {formatFileSize(totalSize)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={file.id} className="group flex items-center space-x-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-200">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {file.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleTimeString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Submission Details */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
                  Chi tiết gửi
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Thời gian</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {submissionTime.toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Trạng thái</span>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Đã nhận
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3"> 
                <button
                  onClick={handleBackToHome}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Gửi tài liệu khác</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSuccessfulPage;
