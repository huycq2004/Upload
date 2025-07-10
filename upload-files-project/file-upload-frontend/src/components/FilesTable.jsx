import React, { useEffect, useState } from 'react';
import FileDetails from './FileDetails';
import { Download, Trash2, ChevronDown, ChevronUp, Info, Loader } from 'lucide-react';

function FilesTable() {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleRow = (rowId) => {
    const newSet = new Set(expandedRows);
    newSet.has(rowId) ? newSet.delete(rowId) : newSet.add(rowId);
    setExpandedRows(newSet);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Bạn chắc chắn muốn xoá người dùng này không?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/delete/${userId}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Xoá thất bại');

      setData(data.filter(user => user.id !== userId));
      alert('Đã xoá người dùng.');
    } catch (err) {
      alert(`${err.message}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/upload/list');
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Lỗi không xác định');
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-10 text-gray-600 space-x-2">
        <Loader className="w-5 h-5 animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Info className="w-5 h-5 text-blue-600 mr-2" />
        Danh sách người dùng đã upload
      </h2>

      {data.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 border border-blue-200 p-4 rounded-xl text-center">
          Chưa có người dùng nào upload file.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl bg-white border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Họ và tên</th>
                <th className="px-4 py-3 text-left">Lớp</th>
                <th className="px-4 py-3 text-left">Chi tiết</th>
                <th className="px-4 py-3 text-left">Tải file</th>
                <th className="px-4 py-3 text-left">Ngày upload</th>
                <th className="px-4 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {data.map((row) => (
                <React.Fragment key={row.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{row.id}</td>
                    <td className="px-4 py-3 font-medium">{row.name}</td>
                    <td className="px-4 py-3">{row.class}</td>
                    <td className="px-4 py-3">
                      <button
                        className="flex items-center text-blue-600 hover:underline"
                        onClick={() => toggleRow(row.id)}
                      >
                        {row.files.length} file
                        {expandedRows.has(row.id) ? (
                          <ChevronUp className="ml-1 w-4 h-4" />
                        ) : (
                          <ChevronDown className="ml-1 w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`http://localhost:5000/downloads/${row.files[0]?.folder_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:underline"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        ZIP
                      </a>
                    </td>
                    <td className="px-4 py-3">{row.uploadDate}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteUser(row.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xoá
                      </button>
                    </td>
                  </tr>

                  {expandedRows.has(row.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-4 py-4">
                        <FileDetails
                          files={row.files}
                          onClose={() => toggleRow(row.id)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default FilesTable;
