const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seedTestUsers() {
  try {
    console.log('🌱 Starting test user seeding...\n');

    // Hash password default
    const defaultPassword = await bcrypt.hash('password123', 10);
    console.log('🔐 Password: password123\n');

    // ========== SEED MAHASISWA TEST ==========
    console.log('📚 Creating test mahasiswa accounts...');
    
    const mahasiswaTest = {
      id: 'mhs_test_001',
      nim: '3312411001',
      nama: 'Mahasiswa Test',
      email: 'mahasiswa@test.com',
      no_telp: '081234567801',
      program_studi_id: 'clx001prodi01',
      dosen_pembimbing_id: 'clx001dosen01',
      judul_ta: 'Sistem Informasi Test'
    };

    // Cek apakah sudah ada
    const [existingMhs] = await db.query(
      'SELECT * FROM mahasiswa WHERE nim = ?',
      [mahasiswaTest.nim]
    );

    if (existingMhs.length === 0) {
      await db.query(
        `INSERT INTO mahasiswa (id, nim, nama, email, password, no_telp, program_studi_id, dosen_pembimbing_id, judul_ta, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          mahasiswaTest.id, 
          mahasiswaTest.nim, 
          mahasiswaTest.nama, 
          mahasiswaTest.email, 
          defaultPassword, 
          mahasiswaTest.no_telp, 
          mahasiswaTest.program_studi_id, 
          mahasiswaTest.dosen_pembimbing_id, 
          mahasiswaTest.judul_ta
        ]
      );
      console.log(`✅ Created: ${mahasiswaTest.nama} (NIM: ${mahasiswaTest.nim})`);
    } else {
      // Update password
      await db.query(
        'UPDATE mahasiswa SET password = ?, updated_at = NOW() WHERE nim = ?',
        [defaultPassword, mahasiswaTest.nim]
      );
      console.log(`♻️  Updated: ${mahasiswaTest.nama} (NIM: ${mahasiswaTest.nim})`);
    }

    // ========== SEED DOSEN TEST ==========
    console.log('\n👨‍🏫 Creating test dosen account...');
    
    const dosenTest = {
      id: 'dosen_test_001',
      nik: '1234567890',
      nama: 'Dosen Test',
      email: 'dosen@test.com',
      no_telp: '081234567901',
      program_studi_id: 'clx001prodi01'
    };

    // Cek apakah sudah ada
    const [existingDsn] = await db.query(
      'SELECT * FROM dosen WHERE nik = ?',
      [dosenTest.nik]
    );

    if (existingDsn.length === 0) {
      await db.query(
        `INSERT INTO dosen (id, nik, nama, email, password, no_telp, program_studi_id, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          dosenTest.id, 
          dosenTest.nik, 
          dosenTest.nama, 
          dosenTest.email, 
          defaultPassword, 
          dosenTest.no_telp, 
          dosenTest.program_studi_id
        ]
      );
      console.log(`✅ Created: ${dosenTest.nama} (NIK: ${dosenTest.nik})`);
    } else {
      // Update password
      await db.query(
        'UPDATE dosen SET password = ?, updated_at = NOW() WHERE nik = ?',
        [defaultPassword, dosenTest.nik]
      );
      console.log(`♻️  Updated: ${dosenTest.nama} (NIK: ${dosenTest.nik})`);
    }

    console.log('\n✅ Test user seeding completed!');
    console.log('\n📝 Test Login Credentials:');
    console.log('\n🔹 ADMIN:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🔹 MAHASISWA TEST:');
    console.log('   NIM: 3312411001');
    console.log('   Password: password123');
    console.log('\n🔹 DOSEN TEST:');
    console.log('   NIK: 1234567890');
    console.log('   Password: password123');
    console.log('\n🔗 Login URL: http://localhost:3000/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test users:', error);
    process.exit(1);
  }
}

seedTestUsers();