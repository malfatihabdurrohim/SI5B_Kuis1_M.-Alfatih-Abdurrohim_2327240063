// MIDDLEWARE: penanganan error terpusat

// 404 untuk rute yang tidak ada
const notFound = (req, res, next) => {
  res.status(404).json({
    sukses: false,
    pesan: `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
};

// Penangan error umum (termasuk JSON rusak)
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ sukses: false, pesan: 'Format JSON tidak valid' });
  }
  console.error(err);
  res.status(err.status || 500).json({
    sukses: false,
    pesan: err.message || 'Terjadi kesalahan pada server',
  });
};

module.exports = { notFound, errorHandler };
