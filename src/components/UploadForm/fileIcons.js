import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileArchive,
  faFileAlt,
  faFileCode,
  faFileVideo,
  faFileAudio,
  faFile
} from '@fortawesome/free-regular-svg-icons';

export const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return faFilePdf;
    case 'doc':
    case 'docx':
      return faFileWord;
    case 'xls':
    case 'xlsx':
      return faFileExcel;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return faFileImage;
    case 'zip':
    case 'rar':
    case '7z':
      return faFileArchive;
    case 'txt':
    case 'md':
      return faFileAlt;
    case 'js':
    case 'html':
    case 'css':
    case 'java':
    case 'py':
    case 'cpp':
      return faFileCode;
    case 'mp4':
    case 'avi':
    case 'mov':
      return faFileVideo;
    case 'mp3':
    case 'wav':
      return faFileAudio;
    default:
      return faFile;
  }
};
