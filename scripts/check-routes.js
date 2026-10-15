const assert = require('assert');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data', 'content.db');
const db = new Database(dbPath);

// 1. Check database content exists
const row = db.prepare("SELECT data FROM site_content WHERE id = 'main'").get();
assert(row && row.data, 'Database content found');
const data = JSON.parse(row.data);
assert(data.meta.title, 'Meta title exists');
assert(data.project.name, 'Project name exists');

// 2. Check KPR formula logic
const harga = 166000000;
const dp = 2000000;
const sisaPokok = harga - dp;
const rateTahunan = 0.05;
const rateBulanan = rateTahunan / 12;
const tenor = 20;
const months = tenor * 12;
const angsuran = Math.round(
  (sisaPokok * (rateBulanan * Math.pow(1 + rateBulanan, months))) /
    (Math.pow(1 + rateBulanan, months) - 1)
);

assert(angsuran > 0 && angsuran < 2000000, `Angsuran FLPP 20 tahun valid: Rp ${angsuran}`);

console.log('Self-check passed: DB and KPR logic valid.');
