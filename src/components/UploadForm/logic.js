export const readableFileSize = (sizeInBytes) => {
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  return (sizeInBytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

export const validateForm = (formData) => {
  if (!formData.name || !formData.class) return 'Vui lòng điền đầy đủ họ tên và lớp.';
  if (!formData.files || formData.files.length === 0) return 'Vui lòng chọn ít nhất một file.';
  return null;
};
