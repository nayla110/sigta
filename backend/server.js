const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dosenRoutes = require('./routes/dosenRoutes');
const mahasiswaRoutes = require('./routes/mahasiswaRoutes');
const beritaRoutes = require('./routes/beritaRoutes');
const programStudiRoutes = require('./routes/programStudiRoutes');
const bimbinganRoutes = require('./routes/bimbinganRoutes'); // ⭐ TAMBAHKAN INI

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dosen', dosenRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/program-studi', programStudiRoutes);
app.use('/api/bimbingan', bimbinganRoutes); // ⭐ TAMBAHKAN INI

app.get('/', (req, res) => {
  res.json({ 
    message: 'SIGTA API Server Running',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      dosen: '/api/dosen',
      mahasiswa: '/api/mahasiswa',
      berita: '/api/berita',
      programStudi: '/api/program-studi',
      bimbingan: '/api/bimbingan' // ⭐ TAMBAHKAN INI
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
});