const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { PhpPgAdminClient } = require('./pgClient');
require('dotenv').config();

const DATA_DIR = path.join(__dirname, '..', 'data');
const LOGBROSUR_FILE = path.join(DATA_DIR, 'logbrosur.json');
const MNULOGBROSUR_FILE = path.join(DATA_DIR, 'mnulogbrosur.json');
const CATPAKET_FILE = path.join(DATA_DIR, 'catpaket.json');
const KANWIL_FILE = path.join(DATA_DIR, 'kanwil.json');

// Helper JSON File Storage (Fallback lokal)
function readJson(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
      return defaultVal;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Gagal membaca ${filePath}:`, err.message);
    return defaultVal;
  }
}

function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Gagal menulis ${filePath}:`, err.message);
    return false;
  }
}

// PhpPgAdmin Bridge Client
const adminClient = new PhpPgAdminClient({
  baseUrl: process.env.PG_ADMIN_URL || 'https://findme.fathindah.id/phppgadmin',
  server: 'localhost:5432:allow',
  database: process.env.PG_DATABASE || 'c1_dbfindme',
  username: process.env.PG_USER || 'c1_findme',
  password: process.env.PG_PASSWORD || '@bb6MqxHuDDL'
});

// PostgreSQL Native Connection Pool
let pool = null;
function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT || '5432', 10),
      user: process.env.PG_USER || 'c1_findme',
      password: process.env.PG_PASSWORD || '@bb6MqxHuDDL',
      database: process.env.PG_DATABASE || 'c1_dbfindme',
      connectionTimeoutMillis: 2000
    });
    pool.on('error', (err) => {
      console.warn('[Postgres Pool Warning]:', err.message);
    });
  }
  return pool;
}

/**
 * Universal Query Executor
 * Berusaha lewat direct TCP pool, jika gagal langsung lewat automated bridge,
 * dan jika offline sepenuhnya menggunakan fallback lokal.
 */
async function query(sql, params = []) {
  // Format parameters
  let formattedSql = sql;
  if (params && params.length > 0) {
    params.forEach((val, idx) => {
      const placeholder = new RegExp(`\\$${idx + 1}(?![0-9])`, 'g');
      const escaped = val === null || val === undefined ? 'NULL' : `'${String(val).replace(/'/g, "''")}'`;
      formattedSql = formattedSql.replace(placeholder, escaped);
    });
  }

  // 1. Direct TCP
  try {
    const p = getPool();
    const res = await p.query(formattedSql);
    return res.rows;
  } catch (tcpErr) {
    // 2. Automated Bridge ke findme.fathindah.id
    try {
      const bridgeRes = await adminClient.query(formattedSql);
      return bridgeRes.rows || [];
    } catch (bridgeErr) {
      throw new Error(`Postgres query failed: ${bridgeErr.message}`);
    }
  }
}

// --------------------------------------------------------------------------
// 1. GET LOG BROSUR
// --------------------------------------------------------------------------
async function getLogBrosur() {
  try {
    const rows = await query('SELECT * FROM c1_findme."LogBrosur" ORDER BY created_at DESC;');
    if (rows && Array.isArray(rows)) {
      const list = rows.map(r => ({
        ...r,
        wilayah: r.lokasibrosur || r.wilayah || 'Pusat'
      }));
      // Sync local JSON as mirror cache
      writeJson(LOGBROSUR_FILE, list);
      return { source: 'postgresql', data: list };
    }
  } catch (err) {
    console.warn('[Postgres getLogBrosur Fallback ke JSON]:', err.message);
  }

  // Fallback ke JSON jika query Postgres gagal
  const data = readJson(LOGBROSUR_FILE, []);
  return { source: 'local_json', data };
}

// --------------------------------------------------------------------------
// 2. INSERT LOG BROSUR
// --------------------------------------------------------------------------
async function insertLogBrosur(entry) {
  const wilayah = entry.wilayah || entry.lokasibrosur || 'Pusat';
  const lokasibrosur = entry.lokasibrosur || entry.wilayah || 'Pusat';
  const catagory = entry.catagory || 'Umrah';
  const brosurname = entry.brosurname || 'Dokumen Brosur';
  const namapaket = entry.namapaket || null;
  const validuntil = entry.validuntil || null;
  const tglupload = entry.tglupload || new Date().toISOString().slice(0, 10);
  const status = entry.status || 'Aktif';
  const link = entry.link || '';
  const catatan = entry.catatan || '';

  let insertedRecord = null;

  try {
    const rows = await query(`
      INSERT INTO c1_findme."LogBrosur" (catagory, brosurname, namapaket, lokasibrosur, link, validuntil, tglupload, status, catatan)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `, [catagory, brosurname, namapaket, lokasibrosur, link, validuntil, tglupload, status, catatan]);

    if (rows && rows.length > 0) {
      insertedRecord = { ...rows[0], wilayah: rows[0].lokasibrosur || 'Pusat' };
    }
  } catch (err) {
    console.warn('[Postgres insertLogBrosur Fallback ke JSON]:', err.message);
  }

  // Mirror ke file JSON
  const list = readJson(LOGBROSUR_FILE, []);
  if (!insertedRecord) {
    insertedRecord = {
      id: `BRS-${Date.now()}`,
      created_at: new Date().toISOString(),
      wilayah,
      lokasibrosur,
      catagory,
      brosurname,
      namapaket,
      validuntil,
      tglupload,
      status,
      link,
      catatan
    };
  }
  list.unshift(insertedRecord);
  writeJson(LOGBROSUR_FILE, list);

  return insertedRecord;
}

// --------------------------------------------------------------------------
// 3. UPDATE STATUS BROSUR
// --------------------------------------------------------------------------
async function updateLogBrosurStatus(id, newStatus) {
  try {
    await query(`
      UPDATE c1_findme."LogBrosur" 
      SET status = $1 
      WHERE id::text = $2;
    `, [newStatus, String(id)]);
  } catch (err) {
    console.warn('[Postgres updateLogBrosurStatus Fallback ke JSON]:', err.message);
  }

  // Update file JSON
  const list = readJson(LOGBROSUR_FILE, []);
  const item = list.find(x => String(x.id) === String(id));
  if (item) {
    item.status = newStatus;
    writeJson(LOGBROSUR_FILE, list);
    return item;
  }
  return { id, status: newStatus };
}

// --------------------------------------------------------------------------
// 4. DELETE LOG BROSUR
// --------------------------------------------------------------------------
async function deleteLogBrosur(id) {
  try {
    await query(`
      DELETE FROM c1_findme."LogBrosur" 
      WHERE id::text = $1;
    `, [String(id)]);
  } catch (err) {
    console.warn('[Postgres deleteLogBrosur Fallback ke JSON]:', err.message);
  }

  // Update file JSON
  const list = readJson(LOGBROSUR_FILE, []);
  const filtered = list.filter(x => String(x.id) !== String(id));
  writeJson(LOGBROSUR_FILE, filtered);
  return true;
}

// --------------------------------------------------------------------------
// 5. GET MASTER MNU LOG BROSUR
// --------------------------------------------------------------------------
async function getMnuLogBrosur() {
  try {
    const rows = await query('SELECT * FROM c1_findme."MnuLogBrosur" ORDER BY catagory ASC, brosurname ASC;');
    if (rows && rows.length > 0) {
      writeJson(MNULOGBROSUR_FILE, rows);
      return { source: 'postgresql', data: rows };
    }
  } catch (err) {
    console.warn('[Postgres getMnuLogBrosur Fallback ke JSON]:', err.message);
  }
  return { source: 'local_json', data: readJson(MNULOGBROSUR_FILE, []) };
}

// --------------------------------------------------------------------------
// 6. GET MASTER CAT PAKET
// --------------------------------------------------------------------------
async function getCatPaket() {
  try {
    const rows = await query('SELECT * FROM c1_findme."CatPaket" ORDER BY id ASC;');
    if (rows && rows.length > 0) {
      writeJson(CATPAKET_FILE, rows);
      return { source: 'postgresql', data: rows };
    }
  } catch (err) {
    console.warn('[Postgres getCatPaket Fallback ke JSON]:', err.message);
  }
  return { source: 'local_json', data: readJson(CATPAKET_FILE, []) };
}

// --------------------------------------------------------------------------
// 7. GET MASTER KANWIL
// --------------------------------------------------------------------------
async function getKanwil() {
  try {
    const rows = await query('SELECT * FROM c1_findme."KanwilFathIndah" ORDER BY id ASC;');
    if (rows && rows.length > 0) {
      writeJson(KANWIL_FILE, rows);
      return { source: 'postgresql', data: rows };
    }
  } catch (err) {
    console.warn('[Postgres getKanwil Fallback ke JSON]:', err.message);
  }
  return { source: 'local_json', data: readJson(KANWIL_FILE, []) };
}

// 8. STATS PERHITUNGAN BROSUR
async function getStats() {
  try {
    const rows = await query(`
      SELECT 
        COUNT(*)::int AS total_brosur,
        COUNT(DISTINCT catagory)::int AS total_kategori,
        COUNT(CASE WHEN LOWER(TRIM(status)) = 'aktif' AND (validuntil IS NULL OR validuntil >= TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')) THEN 1 END)::int AS brosur_aktif
      FROM c1_findme."LogBrosur";
    `);
    if (rows && rows.length > 0) {
      return {
        total: parseInt(rows[0].total_brosur, 10) || 0,
        kategori: parseInt(rows[0].total_kategori, 10) || 0,
        aktif: parseInt(rows[0].brosur_aktif, 10) || 0
      };
    }
  } catch (err) {
    console.warn('[Postgres getStats Fallback]:', err.message);
  }

  const list = readJson(LOGBROSUR_FILE, []);
  const todayStr = new Date().toISOString().slice(0, 10);
  const total = list.length;
  const cats = new Set(list.map(x => (x.catagory || x.category || '').trim()).filter(Boolean));
  const aktif = list.filter(item => {
    const isPast = item.validuntil && item.validuntil < todayStr;
    const isExp = (item.status || '').trim().toLowerCase() === 'expired' || isPast;
    return !isExp;
  }).length;

  return { total, kategori: cats.size, aktif };
}

// Status Database
async function getStatus() {
  const conn = await testConnection();
  if (conn.ok) {
    return {
      database: 'PostgreSQL c1_dbfindme (Active)',
      source: 'postgresql',
      connected: true,
      message: conn.message
    };
  }
  return {
    database: 'Local JSON Storage (Active)',
    source: 'local_json',
    connected: false,
    storageFile: LOGBROSUR_FILE
  };
}

async function ensurePostgresTables() {
  return true;
}

// Test Connection Helper
async function testConnection() {
  try {
    const rows = await query('SELECT current_database() AS db, current_user AS usr, NOW() AS time;');
    if (rows && rows.length > 0) {
      return { ok: true, message: `Terhubung ke PostgreSQL c1_dbfindme (${rows[0].db} @ ${rows[0].usr})` };
    }
  } catch (err) {
    return { ok: false, error: err.message };
  }
  return { ok: false, error: 'Database tidak merespon' };
}

module.exports = {
  getLogBrosur,
  insertLogBrosur,
  updateLogBrosurStatus,
  deleteLogBrosur,
  getMnuLogBrosur,
  getCatPaket,
  getKanwil,
  getStats,
  getStatus,
  ensurePostgresTables,
  testConnection
};
