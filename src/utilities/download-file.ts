export default function downloadFile(
  fileLink: string,
  fileName: string,
  fileFormat: string,
) {
  const link = document.createElement('a');
  link.href = fileLink;
  link.setAttribute('style', 'display: none;');
  link.setAttribute('download', `${fileName}.${fileFormat}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
