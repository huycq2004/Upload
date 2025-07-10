import React, { useState } from 'react';
import FileDetails from '../FileDetails'; //  Component hiển thị chi tiết file dưới dạng cây thư mục

//  Dữ liệu mô phỏng cho bảng danh sách người dùng đã upload file
const mockData = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    class: 'K22',
    uploadDate: '08/07/2025',
    files: [
      new File(["Sample content"], "report.pdf", { type: "application/pdf" }),
      new File(["Sample image"], "photo.jpg", { type: "image/jpeg" }),
      new File(["Text notes"], "notes.txt", { type: "text/plain" }),
    ]
  },
  {
    id: 2,
    name: 'Trần Thị B',
    class: 'K23',
    uploadDate: '09/07/2025',
    files: [
      new File(["Presentation"], "slides.pptx", { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }),
      new File(["Data"], "data.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    ]
  },
  {
    id: 3,
    name: 'Phạm Văn C',
    class: 'K24',
    uploadDate: '10/07/2025',
    files: [
      new File(["Code"], "main.cpp", { type: "text/x-c++src" }),
      new File(["Script"], "run.py", { type: "text/x-python" }),
    ]
  },
];

function ManageTable() {
  //  State để lưu các dòng đang được mở rộng (hiển thị chi tiết)
  const [expandedRows, setExpandedRows] = useState(new Set());

  //  Toggle mở/đóng chi tiết của một dòng
  const toggleRow = (rowId) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(rowId)) {
      newSet.delete(rowId); //  Nếu đã mở, thì đóng
    } else {
      newSet.add(rowId); //  Nếu đang đóng, thì mở
    }
    setExpandedRows(newSet); //  Cập nhật lại set dòng mở rộng
  };

  return (
    <div className="container mt-4">
      <h4>📄 Danh sách đã upload</h4>

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Lớp</th>
            <th>Chi tiết</th>
            <th>Tải file</th>
            <th>Ngày upload</th>
          </tr>
        </thead>

        <tbody>
          {mockData.map((row) => (
            <React.Fragment key={row.id}>
              {/*  Dòng chính hiển thị thông tin người dùng */}
              <tr>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.class}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => toggleRow(row.id)}
                  >
                    {row.files.length} file
                  </button>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary">Download</button>
                </td>
                <td>{row.uploadDate}</td>
              </tr>

              {/*  Nếu dòng này đang mở rộng, hiển thị chi tiết file */}
              {expandedRows.has(row.id) && (
                <tr>
                  <td colSpan="6">
                    <FileDetails
                      files={row.files} //  Truyền file của dòng đó
                      onClose={() => toggleRow(row.id)} //  Truyền hàm để đóng lại khi bấm "Đóng"
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageTable;
