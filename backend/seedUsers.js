const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seedUsers() {
  try {
    console.log('🌱 Starting user seeding...\n');

    // Hash password default
    const defaultPassword = await bcrypt.hash('password123', 10);
    console.log('🔐 Generated password hash for "password123"');

    // ========== SEED MAHASISWA TEST USERS ==========
    console.log('\n📚 Creating test mahasiswa accounts...');
    
    const mahasiswaTests = [
      {
        id: 'mhs_test_001',
        nim: '3312411001',
        nama: 'Mahasiswa Test 1',
        email: 'mhs1@test.com',
        no_telp: '081234567801',
        program_studi_id: 'clx001prodi01',
        dosen_pembimbing_id: 'clx001dosen01',
        judul_ta: 'Sistem Test Mahasiswa 1'
      },
      {
        id: 'mhs_test_002',
        nim: '3312411002',
        nama: 'Mahasiswa Test 2',
        email: 'mhs2@test.com',
        no_telp: '081234567802',
        program_studi_id: 'clx001prodi02',
        dosen_pembimbing_id: 'clx001dosen02',
        judul_ta: 'Sistem Test Mahasiswa 2'
      }
    ];

    for (const mhs of mahasiswaTests) {
      // Cek apakah sudah ada
      const [existing] = await db.query(
        'SELECT * FROM mahasiswa WHERE nim = ?',
        [mhs.nim]
      );

      if (existing.length === 0) {
        await db.query(
          `INSERT INTO mahasiswa (id, nim, nama, email, password, no_telp, program_studi_id, dosen_pembimbing_id, judul_ta, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [mhs.id, mhs.nim, mhs.nama, mhs.email, defaultPassword, mhs.no_telp, mhs.program_studi_id, mhs.dosen_pembimbing_id, mhs.judul_ta]
        );
        console.log(`✅ Created mahasiswa: ${mhs.nama} (NIM: ${mhs.nim})`);
      } else {
        // Update password
        await db.query(
          'UPDATE mahasiswa SET password = ?, updated_at = NOW() WHERE nim = ?',
          [defaultPassword, mhs.nim]
        );
        console.log(`♻️  Updated password for mahasiswa: ${mhs.nama} (NIM: ${mhs.nim})`);
      }
    }

    // ========== SEED DOSEN TEST USERS ==========
    console.log('\n👨‍🏫 Creating test dosen accounts...');
    
    const dosenTests = [
      {
        id: 'dosen_test_001',
        nik: '1234567890',
        nama: 'Dosen Test 1',
        email: 'dosen1@test.com',
        no_telp: '081234567901',
        program_studi_id: 'clx001prodi01'
      },
      {
        id: 'dosen_test_002',
        nik: '1234567891',
        nama: 'Dosen Test 2',
        email: 'dosen2@test.com',
        no_telp: '081234567902',
        program_studi_id: 'clx001prodi02'
      }
    ];

    for (const dsn of dosenTests) {
      // Cek apakah sudah ada
      const [existing] = await db.query(
        'SELECT * FROM dosen WHERE nik = ?',
        [dsn.nik]
      );

      if (existing.length === 0) {
        await db.query(
          `INSERT INTO dosen (id, nik, nama, email, password, no_telp, program_studi_id, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
          [dsn.id, dsn.nik, dsn.nama, dsn.email, defaultPassword, dsn.no_telp, dsn.program_studi_id]
        );
        console.log(`✅ Created dosen: ${dsn.nama} (NIK: ${dsn.nik})`);
      } else {
        // Update password
        await db.query(
          'UPDATE dosen SET password = ?, updated_at = NOW() WHERE nik = ?',
          [defaultPassword, dsn.nik]
        );
        console.log(`♻️  Updated password for dosen: ${dsn.nama} (NIK: ${dsn.nik})`);
      }
    }

    console.log('\n✅ User seeding completed!');
    console.log('\n📝 Test Login Credentials:');
    console.log('\n🔹 ADMIN:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🔹 MAHASISWA TEST 1:');
    console.log('   NIM: 3312411001');
    console.log('   Password: password123');
    console.log('\n🔹 MAHASISWA TEST 2:');
    console.log('   NIM: 3312411002');
    console.log('   Password: password123');
    console.log('\n🔹 DOSEN TEST 1:');
    console.log('   NIK: 1234567890');
    console.log('   Password: password123');
    console.log('\n🔹 DOSEN TEST 2:');
    console.log('   NIK: 1234567891');
    console.log('   Password: password123');
    console.log('\n🔗 Login URL: http://localhost:3000/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();