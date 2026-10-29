const mongoose = require('mongoose');

const kategoriSchema = new mongoose.Schema({
  kode: { type: String, required: [true, 'nama wajib diisi'], unique: true, trim: true, uppercase: true },
  nama: { type: String, required: [true, 'tahun wajib diisi'], trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Kategori', kategoriSchema);