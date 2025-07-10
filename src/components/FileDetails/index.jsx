import React from 'react';
import styles from './FileDetails.module.css';
import { readableFileSize } from '../UploadForm/logic';
import { getFileIcon } from '../UploadForm/fileIcons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FileDetails({ files, onClose, onDeleteFile }) {
  //  Hàm xử lý dữ liệu file thành dạng cây thư mục
  const renderFolderStructure = () => {
    const tree = {};

    //  Duyệt từng file để xây dựng cây dựa trên webkitRelativePath (hoặc file name)
    files.forEach(file => {
      const path = file.webkitRelativePath || file.name;
      const parts = path.split('/');

      let current = tree;
      parts.forEach((part, idx) => {
        if (idx === parts.length - 1) {
          current[part] = file;
        } else {
          current[part] = current[part] || {};
          current = current[part];
        }
      });
    });

    //  Hàm đệ quy hiển thị cây thư mục
    const renderTree = (node, indent = 0) => {
      return Object.entries(node).map(([key, value], index) => {
        const isFile = value instanceof File;
        return (
          <div
            key={index}
            style={{ marginLeft: indent * 16 }}
            className={`${styles.itemRow} d-flex justify-content-between align-items-center`}
          >
            <div className="d-flex align-items-center gap-2">
              {isFile ? (
                <>
                  <FontAwesomeIcon icon={getFileIcon(value.name)} className={styles.fileIcon} />
                  <div>
                    <div className={styles.fileName}><strong>{value.name}</strong></div>
                    <div className={styles.fileInfo}>
                      {value.type || "Không xác định"} — {readableFileSize(value.size)}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className={styles.folderIcon}>📁</span>
                  <strong>{key}</strong>
                </>
              )}
            </div>

            {/* Nút xóa nếu là file */}
            {isFile && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDeleteFile(value)}
              >
                🗑
              </button>
            )}

            {/* Đệ quy hiển thị nếu là thư mục */}
            {!isFile && (
              <div className="w-100 mt-2">
                {renderTree(value, indent + 1)}
              </div>
            )}
          </div>
        );
      });
    };

    return renderTree(tree);
  };

  return (
    <div className={`mt-4 p-3 bg-white border rounded shadow-sm ${styles.detailsPanel}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="m-0">📂 Chi tiết tất cả file</h6>
        <button className="btn btn-sm btn-outline-danger" onClick={onClose}>Đóng</button>
      </div>

      <div className={styles.folderView}>
        {renderFolderStructure()}
      </div>
    </div>
  );
}

export default FileDetails;
