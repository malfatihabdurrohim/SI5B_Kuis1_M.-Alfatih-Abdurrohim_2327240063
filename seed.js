// seed.js
// Mengisi basis data dengan 3 prodi dan 25 mahasiswa. Aman dijalankan berulang:
// data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Buku = require('./models/bukuModel');

const judul = ['sekolah', 'dogeng', 'hitungan', 'sejarah 1945'];
const kota = ['Palembang', 'Indralaya', 'Prabumulih', 'Lubuklinggau'];

async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Buku.deleteMany({});
  await Kategori.deleteMany({});

  const kategori = await Kategori.insertMany([
    { kode: 'SI', nama: 'Sistem Informasi' },
    { kode: 'TI', nama: 'Teknik Informatika' },
    { kode: 'MI', nama: 'Manajemen Informatika' },
  ]);

  const buku = judul.map((judul, i) => ({
    judul,
    tahun: String(2000 + i),
    alamat: { jalan: `Jl. Contoh No. ${i + 1}`, kota: KOTA[i % KOTA.length] },
    kategoriId: kategori[i % 3]._id, // SI, TI, MI bergantian
  }));
  await Buku.insertMany(buku);

  console.log(`Seed selesai: ${prodi.length} prodi, ${buku.length} buku`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err.message); process.exit(1); });