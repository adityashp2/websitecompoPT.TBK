const { createClient } = require('@supabase/supabase-js');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Lightweight native .env loader without third-party dependencies
function loadEnvFile(filename) {
  const filePath = path.join(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n======================================================');
console.log('  MIGRASI DATA DARI SQLITE KE SUPABASE (PT. TBK)');
console.log('======================================================\n');

if (!supabaseUrl || !supabaseUrl.startsWith('https://') || !supabaseKey) {
  console.error('❌ Kredensial Supabase belum diatur dalam file .env.local!');
  console.log('\nLangkah-langkah:');
  console.log('1. Buka dashboard Supabase: https://supabase.com/dashboard');
  console.log('2. Buka Project Settings -> API');
  console.log('3. Isi file .env.local dengan:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=eyJh...');
  console.log('4. Jalankan script ini kembali: npm run migrate:supabase\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  const dbPath = path.join(__dirname, '..', 'data', 'content.db');
  if (!fs.existsSync(dbPath)) {
    console.log('⚠️  Database SQLite lokal (content.db) tidak ditemukan.');
    return;
  }

  const db = new Database(dbPath);
  console.log(' Terhubung ke database SQLite lokal...');
  console.log(`📡 Menghubungkan ke Supabase: ${supabaseUrl} ...\n`);

  // 1. Migrasi site_content
  try {
    const row = db.prepare("SELECT data FROM site_content WHERE id = 'main'").get();
    if (row && row.data) {
      const parsed = JSON.parse(row.data);
      const { error } = await supabase.from('site_content').upsert({
        id: 'main',
        data: parsed,
        updated_at: new Date().toISOString()
      });
      if (error) {
        console.error('❌ Gagal migrasi site_content:', error.message);
      } else {
        console.log('✅ Konten website (site_content) berhasil di-push ke Supabase.');
      }
    }
  } catch (err) {
    console.error('❌ Error site_content:', err.message);
  }

  // 2. Migrasi admin_users
  try {
    const adminUsers = db.prepare("SELECT username, email, password_hash, salt, name, role FROM admin_users").all();
    if (adminUsers && adminUsers.length > 0) {
      for (const u of adminUsers) {
        const { error } = await supabase.from('admin_users').upsert({
          username: u.username,
          email: u.email,
          password_hash: u.password_hash,
          salt: u.salt,
          name: u.name,
          role: u.role,
        }, { onConflict: 'username' });

        if (error) {
          console.error(`❌ Gagal migrasi admin [${u.username}]:`, error.message);
        } else {
          console.log(`✅ Admin [${u.username}] berhasil dimigrasi ke Supabase.`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error admin_users:', err.message);
  }

  // 3. Migrasi inquiries
  try {
    const inquiries = db.prepare("SELECT name, phone, email, message, created_at FROM inquiries").all();
    if (inquiries && inquiries.length > 0) {
      console.log(` Mengunggah ${inquiries.length} pesan masuk (inquiries)...`);
      for (const inq of inquiries) {
        await supabase.from('inquiries').insert([{
          name: inq.name,
          phone: inq.phone,
          email: inq.email || null,
          message: inq.message || null,
          created_at: inq.created_at || new Date().toISOString(),
        }]);
      }
      console.log(`✅ ${inquiries.length} pesan masuk berhasil dimigrasi.`);
    } else {
      console.log('ℹ️  Tidak ada pesan masuk lama di SQLite.');
    }
  } catch (err) {
    console.error('❌ Error inquiries:', err.message);
  }

  console.log('\n🎉 SELURUH DATA BERHASIL DIMIGRASI KE SUPABASE!');
  console.log('Website dan CMS Anda kini langsung membaca dan menyimpan data ke Supabase Cloud.\n');
}

runMigration().catch(console.error);
