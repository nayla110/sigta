const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Hash password default
    const defaultPassword = await bcrypt.hash('admin123', 10);

    // Cek apakah admin sudah ada
    const [existingAdmin] = await db.query(
      'SELECT * FROM admin WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      // Insert admin
      await db.query(
        `INSERT INTO admin (id, username, email, password, nama, no_telp, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        ['admin_001', 'admin', 'admin@sigta.ac.id', defaultPassword, 'Administrator', '081234567890']
      );
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('✅ Database seeding completed!');
    console.log('\n📝 Default Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();