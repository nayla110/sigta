const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Hash password default dengan salt 10
    const defaultPassword = await bcrypt.hash('admin123', 10);
    console.log('🔐 Generated password hash:', defaultPassword);

    // Cek apakah admin sudah ada
    const [existingAdmin] = await db.query(
      'SELECT * FROM admin WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      // Insert admin baru
      await db.query(
        `INSERT INTO admin (id, username, email, password, nama, no_telp, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        ['admin_001', 'admin', 'admin@sigta.ac.id', defaultPassword, 'Administrator', '081234567890']
      );
      console.log('✅ Admin user created successfully');
    } else {
      // Update password admin yang sudah ada
      await db.query(
        'UPDATE admin SET password = ?, updated_at = NOW() WHERE username = ?',
        [defaultPassword, 'admin']
      );
      console.log('✅ Admin password updated successfully');
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📝 Default Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('\n🔗 Login URL: http://localhost:3000/login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();