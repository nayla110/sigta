// postcss.config.mjs
const config = {
  plugins: [
    // Panggil plugin PostCSS resmi dari paket baru
    "@tailwindcss/postcss", 
    // Tambahkan autoprefixer jika diperlukan (biasanya perlu)
    // 'autoprefixer' 
  ],
};

export default config;