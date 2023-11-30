import PropTypes from 'prop-types';

SingleFilePreview.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
export default function SingleFilePreview({ file }) {
  if (!file) {
    return null;
  }
  const pdfUrl = typeof file === 'string' ? file : file.preview;
  return (
    <iframe
      src={pdfUrl}
      title="PDF Preview"
      width="100%"
      height="10%"
      style={{
        border: 'none',
        borderRadius: 4,
        position: 'relative',
      }}
    />
  );
}
