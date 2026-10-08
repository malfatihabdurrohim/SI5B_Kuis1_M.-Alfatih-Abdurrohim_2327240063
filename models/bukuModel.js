// MODEL: menyimpan data dan fungsi pengolahannya (tanpa req & res)
// Ganti data & field ini sesuai topik Tugas 1 Anda.

let daftarBuku = [
  { id: 1, judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', tahun: 2005 },
  { id: 2, judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', tahun: 1980 },
  { id: 3, judul: 'Negeri 5 Menara', penulis: 'Ahmad Fuadi', tahun: 2009 },
];

let idBerikutnya = 4;

const semua = () => daftarBuku;

const cariById = (id) => daftarBuku.find((b) => b.id === id);

const tambah = ({ judul, penulis, tahun }) => {
  const baru = { id: idBerikutnya++, judul, penulis, tahun };
  daftarBuku.push(baru);
  return baru;
};

const ubah = (id, { judul, penulis, tahun }) => {
  const buku = cariById(id);
  if (!buku) return null;
  buku.judul = judul;
  buku.penulis = penulis;
  buku.tahun = tahun;
  return buku;
};

const hapus = (id) => {
  const index = daftarBuku.findIndex((b) => b.id === id);
  if (index === -1) return null;
  return daftarBuku.splice(index, 1)[0];
};

module.exports = { semua, cariById, tambah, ubah, hapus };
