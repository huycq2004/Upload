import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, XCircle, RefreshCw, ArrowLeft, FileX, Wifi,
  Server, Clock, Shield, HardDrive, AlertCircle, CheckCircle2, Info
} from 'lucide-react';

const UploadErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  // Lấy dữ liệu từ state được navigate('/error', { state: { ... } })
  const {
    errorType = 'general',
    errorMessage = 'Đã xảy ra lỗi không xác định',
    failedFiles = []
  } = location.state || {};

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      navigate(-1); // hoặc navigate('/'), hoặc reload trang
    }, 1000);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Error type configurations
  const errorConfigs = {
    network: {
      icon: Wifi,
      title: 'Lỗi kết nối mạng',
      description: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet của bạn.',
      color: 'orange',
      canRetry: true,
      suggestions: [
        'Kiểm tra kết nối internet',
        'Thử tải lại trang',
        'Kiểm tra tường lửa hoặc proxy'
      ]
    },
    server: {
      icon: Server,
      title: 'Lỗi máy chủ',
      description: 'Máy chủ đang gặp sự cố tạm thời. Chúng tôi đang khắc phục vấn đề.',
      color: 'red',
      canRetry: true,
      suggestions: [
        'Thử lại sau vài phút',
        'Liên hệ bộ phận hỗ trợ nếu lỗi tiếp tục',
        'Kiểm tra trang trạng thái hệ thống'
      ]
    },
    fileSize: {
      icon: HardDrive,
      title: 'File quá lớn',
      description: 'Một hoặc nhiều file vượt quá giới hạn kích thước cho phép.',
      color: 'yellow',
      canRetry: false,
      suggestions: [
        'Nén file trước khi tải lên',
        'Chia nhỏ file thành nhiều phần',
        'Sử dụng định dạng file khác'
      ]
    },
    fileType: {
      icon: FileX,
      title: 'Định dạng file không hỗ trợ',
      description: 'Một hoặc nhiều file có định dạng không được phép tải lên.',
      color: 'purple',
      canRetry: false,
      suggestions: [
        'Chuyển đổi file sang định dạng được hỗ trợ',
        'Kiểm tra danh sách định dạng cho phép',
        'Liên hệ hỗ trợ để biết thêm thông tin'
      ]
    },
    timeout: {
      icon: Clock,
      title: 'Hết thời gian chờ',
      description: 'Quá trình tải lên mất quá nhiều thời gian và đã bị hủy.',
      color: 'blue',
      canRetry: true,
      suggestions: [
        'Thử lại với kết nối internet tốt hơn',
        'Tải lên từng file một',
        'Kiểm tra kích thước file'
      ]
    },
    general: {
      icon: AlertTriangle,
      title: 'Đã xảy ra lỗi',
      description: 'Có lỗi không xác định trong quá trình tải lên.',
      color: 'gray',
      canRetry: true,
      suggestions: [
        'Thử lại sau',
        'Kiểm tra thông tin đã nhập',
        'Liên hệ hỗ trợ nếu cần'
      ]
    }
  };

  const config = errorConfigs[errorType] || errorConfigs.general;
  const IconComponent = config.icon;

  const colorClasses = {
    red: {
      bg: 'from-red-50 to-rose-50',
      icon: 'from-red-500 to-rose-500',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      accent: 'text-red-600',
      button: 'from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
      border: 'border-red-200'
    },
    orange: {
      bg: 'from-orange-50 to-amber-50',
      icon: 'from-orange-500 to-amber-500',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      accent: 'text-orange-600',
      button: 'from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700',
      border: 'border-orange-200'
    },
    yellow: {
      bg: 'from-yellow-50 to-amber-50',
      icon: 'from-yellow-500 to-amber-500',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      accent: 'text-yellow-600',
      button: 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700',
      border: 'border-yellow-200'
    },
    blue: {
      bg: 'from-blue-50 to-indigo-50',
      icon: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      accent: 'text-blue-600',
      button: 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      border: 'border-blue-200'
    },
    purple: {
      bg: 'from-purple-50 to-violet-50',
      icon: 'from-purple-500 to-violet-500',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      accent: 'text-purple-600',
      button: 'from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700',
      border: 'border-purple-200'
    },
    gray: {
      bg: 'from-gray-50 to-slate-50',
      icon: 'from-gray-500 to-slate-500',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      accent: 'text-gray-600',
      button: 'from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700',
      border: 'border-gray-200'
    }
  };

  const colors = colorClasses[config.color];


  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white bg-opacity-30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-white bg-opacity-25 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Error Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${colors.icon} rounded-full flex items-center justify-center shadow-2xl`}>
                <IconComponent className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <XCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <h1 className={`text-5xl font-bold bg-gradient-to-r ${colors.icon} bg-clip-text text-transparent mb-4`}>
              {config.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              {config.description}
            </p>
            
            {errorMessage && errorMessage !== config.description && (
              <div className={`inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border ${colors.border}`}>
                <AlertCircle className={`w-5 h-5 ${colors.iconText} mr-2`} />
                <span className="text-gray-800 font-medium">{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Error Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Failed Files (if any) */}
              {failedFiles && failedFiles.length > 0 && (
                <div className={`bg-white rounded-3xl shadow-xl p-8 border ${colors.border}`}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FileX className={`w-6 h-6 ${colors.iconText} mr-3`} />
                    File gặp lỗi ({failedFiles.length})
                  </h2>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {failedFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <FileX className="w-6 h-6 text-red-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            {file.error && (
                              <>
                                <span>•</span>
                                <span className="text-red-600">{file.error}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Lỗi
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Info className={`w-6 h-6 ${colors.iconText} mr-3`} />
                  Gợi ý khắc phục
                </h2>
                
                <div className="space-y-4">
                  {config.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-6 h-6 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                          <span className={`text-sm font-bold ${colors.iconText}`}>{index + 1}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Error Status */}
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className={`w-5 h-5 ${colors.iconText} mr-2`} />
                  Trạng thái
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Loại lỗi</span>
                    <span className={`text-sm font-semibold ${colors.accent}`}>
                      {config.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Thời gian</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date().toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Có thể thử lại</span>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      config.canRetry 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {config.canRetry ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Có
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Không
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {config.canRetry && isRetrying && (
                  <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className={`w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r ${colors.button} text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {isRetrying ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold">Đang thử lại...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        <span className="font-semibold">Thử lại</span>
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={handleBackToHome}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Quay lại trang chủ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadErrorPage;