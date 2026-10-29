const mongoose = require('mongoose');

const penerbitSchema = new mongoose.Schema({
  nama: String,
  kota: String,
}, { _id: false });


const bukuSchema = new mongoose.Schema({
  nama: { type: String, required: [true, 'nama wajib diisi'], trim: true },
  penerbit: penerbitSchema,
  kategoriId: { type: mongoose.Schema.Types.ObjectId, ref: 'Kategori' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Buku', bukuSchema);