import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { Download, Trash2, Info, Loader, ChevronDown, ChevronUp, Minus, SortAsc, SortDesc } from 'lucide-react';
import FileDetails from './FileDetails';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function FilesTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [globalFilter, setGlobalFilter] = useState('');

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

  const exportToExcel = async (uploads) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách Upload');

    // Header
    worksheet.columns = [
      { header: 'Họ tên', key: 'fullName', width: 25 },
      { header: 'Lớp', key: 'className', width: 15 },
      { header: 'Ngày upload', key: 'createdAt', width: 18 },
      { header: 'Tên file', key: 'fileName', width: 30 },
      { header: 'Dung lượng (KB)', key: 'fileSize', width: 20 },
    ];

    // Format dữ liệu: convert key về camelCase để dễ xài
    const formattedUploads = uploads.map(upload => ({
      fullName: upload.name,
      className: upload.class,
      createdAt: upload.uploadDate,
      files: upload.files.map(file => ({
        fileName: file.file_name,
        fileSize: file.file_size,
      })),
    }));

    // Ghi từng file ra một dòng
    formattedUploads.forEach(upload => {
      upload.files.forEach(file => {
        worksheet.addRow({
          fullName: upload.fullName,
          className: upload.className,
          createdAt: upload.createdAt,
          fileName: file.fileName,
          fileSize: (file.fileSize / 1024).toFixed(2), // KB
        });
      });
    });

    // Export
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'Danh_sach_upload.xlsx');
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

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Họ và tên', accessor: 'name' },
    { Header: 'Lớp', accessor: 'class' },
    {
      Header: 'Chi tiết',
      accessor: 'files',
      Cell: ({ row }) => (
        <button
          className="flex items-center text-blue-600 hover:underline"
          onClick={() => toggleRow(row.original.id)}
        >
          {row.original.files.length} file
          {expandedRows.has(row.original.id) ? (
            <ChevronUp className="ml-1 w-4 h-4" />
          ) : (
            <ChevronDown className="ml-1 w-4 h-4" />
          )}
        </button>
      )
    },
    {
      Header: 'Tải file',
      accessor: 'download',
      Cell: ({ row }) => (
        <a
          href={`http://localhost:5000/downloads/${row.original.files[0]?.folder_name}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-green-600 hover:underline"
        >
          <Download className="w-4 h-4 mr-1" /> ZIP
        </a>
      )
    },
    { Header: 'Ngày upload', accessor: 'uploadDate' },
    {
      Header: 'Thao tác',
      accessor: 'actions',
      Cell: ({ row }) => (
        <button
          onClick={() => handleDeleteUser(row.original.id)}
          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          <Trash2 className="w-4 h-4 mr-1" /> Xoá
        </button>
      )
    },
  ], [expandedRows]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setGlobalFilter: setFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
  } = useTable({
    columns,
    data,
    initialState: { pageSize: 5 },
  }, useGlobalFilter, useSortBy, usePagination);

  useEffect(() => {
    setFilter(globalFilter);
  }, [globalFilter, setFilter]);

  if (loading) return <div className="flex items-center justify-center mt-10 text-gray-600 space-x-2"><Loader className="w-5 h-5 animate-spin" /><span>Đang tải dữ liệu...</span></div>;
  if (error) return <div className="max-w-2xl mx-auto mt-10 bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl text-center">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Info className="w-5 h-5 text-blue-600 mr-2" /> Danh sách người dùng đã upload
        </h2>
        <button onClick={() => exportToExcel(data)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Export Excel
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/3"
      />

      <div className="overflow-x-auto shadow-lg rounded-xl bg-white border border-gray-200">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-3 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.render('Header')}</span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <SortDesc className="w-4 h-4 text-gray-800" />
                        ) : (
                          <SortAsc className="w-4 h-4 text-gray-800" />
                        )
                      ) : (
                        <Minus className="w-4 h-4 text-gray-400 opacity-50" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-100 text-sm">
            {page.map(row => {
              prepareRow(row);
              return (
                <React.Fragment key={row.original.id}>
                  <tr {...row.getRowProps()} className="hover:bg-gray-50">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="px-4 py-3">{cell.render('Cell')}</td>
                    ))}
                  </tr>
                  {expandedRows.has(row.original.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan={columns.length} className="px-4 py-4">
                        <FileDetails
                          files={row.original.files}
                          onClose={() => toggleRow(row.original.id)}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <div>Trang {pageIndex + 1} / {pageOptions.length}</div>
        <div className="space-x-2">
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Trước</button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Sau</button>
        </div>
      </div>
    </div>
  );
}

export default FilesTable;
