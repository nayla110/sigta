const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const adminRoutes = require('./routes/adminRoutes');

const programStudiRoutes = require('./routes/programStudiRoutes');

app.use('/api/admin', adminRoutes);

app.use('/api/program-studi', programStudiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SIGTA API Server Running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});