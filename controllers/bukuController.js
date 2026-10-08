// CONTROLLER: menangani request, validasi, dan response
const Buku = require('../models/bukuModel');

const dataLengkap = (body) =>
  body &&
  typeof body.judul === 'string' && body.judul.trim() !== '' &&
  typeof body.penulis === 'string' && body.penulis.trim() !== '' &&
  body.tahun !== undefined && !Number.isNaN(Number(body.tahun));

const ambilData = (body) => ({
  judul: body.judul.trim(),
  penulis: body.penulis.trim(),
  tahun: Number(body.tahun),
});

const tidakDitemukan = (res, id) =>
  res.status(404).json({ sukses: false, pesan: `Buku dengan ID ${id} tidak ditemukan` });

const getAll = (req, res) => {
  res.status(200).json({ sukses: true, data: Buku.semua() });
};

const getById = (req, res) => {
  const id = Number(req.params.id);
  const buku = Buku.cariById(id);
  if (!buku) return tidakDitemukan(res, req.params.id);
  res.status(200).json({ sukses: true, data: buku });
};

const create = (req, res) => {
  if (!dataLengkap(req.body)) {
    return res.status(400).json({
      sukses: false,
      pesan: 'Data tidak lengkap. Wajib: judul, penulis, tahun',
    });
  }
  const baru = Buku.tambah(ambilData(req.body));
  res.status(201).json({ sukses: true, pesan: 'Buku berhasil ditambahkan', data: baru });
};

const update = (req, res) => {
  const id = Number(req.params.id);
  if (!Buku.cariById(id)) return tidakDitemukan(res, req.params.id);
  if (!dataLengkap(req.body)) {
    return res.status(400).json({
      sukses: false,
      pesan: 'Data tidak lengkap. Wajib: judul, penulis, tahun',
    });
  }
  const diubah = Buku.ubah(id, ambilData(req.body));
  res.status(200).json({ sukses: true, pesan: 'Buku berhasil diperbarui', data: diubah });
};

const remove = (req, res) => {
  const id = Number(req.params.id);
  const dihapus = Buku.hapus(id);
  if (!dihapus) return tidakDitemukan(res, req.params.id);
  res.status(200).json({ sukses: true, pesan: 'Buku berhasil dihapus', data: dihapus });
};

module.exports = { getAll, getById, create, update, remove };
