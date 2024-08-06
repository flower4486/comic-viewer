export function getFileType(filename) {
  filename.toString();
  let filetype = filename.split('.')[1];
  return filetype;
}
