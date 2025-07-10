import React, { useState } from 'react';
import styles from './UploadForm.module.css';
import { validateForm, readableFileSize } from './logic'; // Hàm kiểm tra và định dạng size file
import { getFileIcon } from './fileIcons'; // Trả về icon phù hợp theo tên file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function UploadForm() {
  //  Trạng thái form: tên, lớp và danh sách file
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    files: []
  });

  //  Danh sách file người dùng đã chọn để hiển thị
  const [selectedFiles, setSelectedFiles] = useState([]);

  //  Hàm xử lý khi người dùng chọn file hoặc nhập thông tin
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    //  Nếu là chọn file
    if (name === 'files') {
      const newFiles = Array.from(files);

      //  Gộp file cũ với file mới, tránh thêm trùng
      const updatedFiles = [...selectedFiles];
      newFiles.forEach((file) => {
        const isDuplicate = updatedFiles.find(
          (f) => f.name === file.name && f.size === file.size
        );
        if (!isDuplicate) {
          updatedFiles.push(file);
        }
      });

      //  Cập nhật cả form và danh sách hiển thị
      setFormData({ ...formData, files: updatedFiles });
      setSelectedFiles(updatedFiles);
    } else {
      //  Nếu là input text (họ tên, lớp)
      setFormData({ ...formData, [name]: value });
    }
  };

  //  Xử lý xóa một file ra khỏi danh sách
  const handleRemoveFile = (indexToRemove) => {
    const newFiles = selectedFiles.filter((_, i) => i !== indexToRemove);
    setSelectedFiles(newFiles);
    setFormData({ ...formData, files: newFiles });
  };

  //  Gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm(formData); // Gọi hàm validate

    if (error) {
      alert(error); // Nếu lỗi thì cảnh báo
      return;
    }

    //  Hiển thị thông tin đã gửi (tạm thời chưa gửi backend)
    alert(`✅ Đã gửi ${selectedFiles.length} file!\n👤 Tên: ${formData.name}\n🏫 Lớp: ${formData.class}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/*  Giao diện form */}
          <form onSubmit={handleSubmit} className={`p-4 shadow rounded bg-white ${styles.formContainer}`}>
            <h4 className="mb-4 text-center">📤 Gửi tài liệu</h4>

            {/* Họ tên */}
            <div className="mb-3">
              <label className="form-label fw-semibold">👤 Họ và tên</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nhập họ tên"
                onChange={handleChange}
                required
              />
            </div>

            {/* Lớp */}
            <div className="mb-3">
              <label className="form-label fw-semibold">🏫 Lớp</label>
              <input
                type="text"
                name="class"
                className="form-control"
                placeholder="Nhập lớp"
                onChange={handleChange}
                required
              />
            </div>

            {/* Chọn file */}
            <div className="mb-3">
              <label className="form-label fw-semibold">📎 Chọn file đính kèm</label>
              <input
                type="file"
                name="files"
                className="form-control"
                multiple
                onChange={handleChange}
              />
            </div>

            {/* Hiển thị danh sách file đã chọn */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h6 className="mb-2 fw-bold">🗂️ Danh sách file đã chọn:</h6>
                <ul className="list-group">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className={`list-group-item d-flex justify-content-between align-items-center ${styles.fileItem}`}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <FontAwesomeIcon icon={getFileIcon(file.name)} size="lg" className={styles.fileIcon} />
                        <div>
                          <div className="fw-semibold">{file.name}</div>
                          <div className="text-muted small">Loại: {file.type || "Không xác định"}</div>
                        </div>
                      </div>

                      {/*  Hiển thị dung lượng và nút xóa */}
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary rounded-pill">
                          {readableFileSize(file.size)}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveFile(index)}
                        >
                          🗑
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nút gửi */}
            <button type="submit" className="btn btn-success mt-4 w-100 fw-bold">
              🚀 Gửi nội dung
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadForm;
