// CONTROLLER: menangani request, validasi, dan response 
const Buku = require('../models/bukuModel'); 
const { errorHttp } = require('../middlewares/errorHandler'); 

const LIMIT_DEFAULT = 10; 
const LIMIT_MAKS = 50; 
const FIELD_SORT = ['judul', 'penerbit', 'tahun', 'createdAt']; 
const FIELD_BOLEH_DIPILIH = ['judul', 'penerbit', 'tahun', 'penulis', 'kategoriId', 'ulasan']; 

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman 
function angkaAman(nilai, bawaan, min, maks) { 
  const n = parseInt(nilai, 10); 
  if (Number.isNaN(n)) return bawaan; 
  return Math.min(Math.max(n, min), maks); 
} 

// [POST] Membuat data Buku baru
exports.create = async (req, res, next) => { 
  try { 
    const buku = await Buku.create(req.body); 
    res.status(201).json(buku); 
  } catch (err) { 
    next(err); // Diteruskan ke errorHandler middleware
  } 
}; 

// [GET] Mendapatkan semua data Buku dengan Filtering, Pagination, Sorting, dan Projection
exports.getAll = async (req, res, next) => { 
  try {
    const filter = {}; 
    
    // 1. FILTERING (Contoh filter berdasarkan penerbit atau tahun)
    if (req.query.penerbit) { 
      filter.penerbit = String(req.query.penerbit); 
    } 
    if (req.query.tahun) {
      filter.tahun = parseInt(req.query.tahun, 10);
    }
    // Filter berdasarkan Embedding (Contoh: mencari buku yang memiliki ulasan dengan rating minimal tertentu)
    if (req.query.minRating) {
      filter['ulasan.rating'] = { $gte: parseFloat(req.query.minRating) };
    }

    // 2. PAGINATION
    const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER); 
    const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS); 

    // 3. SORTING
    const sortParam = String(req.query.sort || '-createdAt'); 
    const arah = sortParam.startsWith('-') ? -1 : 1; 
    const sortField = sortParam.replace(/^-/, ''); 

    if (!FIELD_SORT.includes(sortField)) { 
      throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`); 
    } 

    // 4. PROJECTION
    let select = ''; 
    if (req.query.fields) { 
      const fields = String(req.query.fields).split(',').map((f) => f.trim()); 
      if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) { 
        throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`); 
      } 
      select = fields.join(' '); 
    } 

    // Eksekusi Query MongoDB
    const query = Buku.find(filter) 
      .select(select) 
      .sort({ [sortField]: arah, _id: 1 }) 
      .skip((page - 1) * limit) 
      .limit(limit); 

    // REFERENCING: Isi data kategoriId (Reference) jika diminta atau default
    if (!select || select.split(' ').includes('kategoriId')) { 
      query.populate('kategoriId', 'namaKategori deskripsi'); 
    } 

    const [data, total] = await Promise.all([
      query, 
      Buku.countDocuments(filter)
    ]); 

    res.json({ 
      data, 
      page, 
      limit, 
      total, 
      totalPages: Math.ceil(total / limit) 
    }); 
  } catch (err) {
    next(err);
  }
}; 

// [GET] Detail Buku berdasarkan ID
exports.getById = async (req, res, next) => { 
  try {
    const data = await Buku.findById(req.params.id).populate('kategoriId'); 
    if (!data) throw errorHttp(404, 'Data tidak ditemukan'); 
    res.json(data); 
  } catch (err) {
    next(err);
  }
}; 

// [PUT/PATCH] Update data Buku
exports.update = async (req, res, next) => { 
  try {
    const data = await Buku.findByIdAndUpdate( 
      req.params.id, 
      req.body, 
      { returnDocument: 'after', runValidators: true } 
    ); 
    if (!data) throw errorHttp(404, 'Data tidak ditemukan'); 
    res.json(data); 
  } catch (err) {
    next(err);
  }
}; 

// [DELETE] Hapus Buku
exports.remove = async (req, res, next) => { 
  try {
    const data = await Buku.findByIdAndDelete(req.params.id); 
    if (!data) throw errorHttp(404, 'Data tidak ditemukan'); 
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};
