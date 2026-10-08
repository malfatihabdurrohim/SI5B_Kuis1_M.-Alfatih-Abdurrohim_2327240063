require('dotenv').config();
const express = require('express');
const cors = require('cors');

const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const bukuRoutes = require('./routes/bukuRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('Server Express.js berjalan!');
});

app.use('/buku', bukuRoutes);

app.use(notFound);      // harus setelah semua rute
app.use(errorHandler);  // harus paling akhir

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
