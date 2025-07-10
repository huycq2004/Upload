import { XCircle, Trash2, FileText, FileImage, FileAudio, FileVideo, FileArchive, FileCheck, Folder } from 'lucide-react';

function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Simple logic to choose icon by file extension
function getLucideFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return <FileImage className="w-5 h-5 text-blue-500" />;
  if (['mp3', 'wav', 'ogg'].includes(ext)) return <FileAudio className="w-5 h-5 text-purple-500" />;
  if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return <FileVideo className="w-5 h-5 text-indigo-500" />;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return <FileArchive className="w-5 h-5 text-yellow-500" />;
  if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)) return <FileText className="w-5 h-5 text-green-600" />;
  return <FileCheck className="w-5 h-5 text-gray-500" />;
}

function FileDetails({ files, onClose, onDeleteFile }) {
  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex gap-2 text-lg font-bold text-gray-800"><Folder />Danh sách file</h3>
        <button
          onClick={onClose}
          className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Đóng
        </button>
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Không có file nào.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center space-x-4">
                <div className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md">
                  {getLucideFileIcon(file.file_name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate">{file.file_name}</p>
                  <p className="text-xs text-gray-500">
                    {file.file_type || 'Không xác định'} — {formatSize(file.file_size)}
                  </p>
                </div>
              </div>

              {onDeleteFile && (
                <button
                  onClick={() => onDeleteFile(file)}
                  className="inline-flex items-center text-red-600 hover:text-red-800 transition"
                  title="Xoá file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileDetails;
