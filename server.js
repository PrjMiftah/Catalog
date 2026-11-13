const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./lib/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static Assets
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use(express.static(PUBLIC_DIR));

// ============================================================================
// AUTHENTICATION & SECURITY (ADMIN ONLY)
// User: Admin | Password: Fath2026!
// ============================================================================
const ADMIN_USER = 'Admin';
const ADMIN_PASS = 'Fath2026!';
const ADMIN_TOKEN = 'fath-admin-auth-session-2026';

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.slice(7)
    : (req.headers['x-admin-token'] || req.query.token);

  if (token === ADMIN_TOKEN) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Akses ditolak. Fitur ini memerlukan login Administrator (User: Admin / Password: Fath2026!).'
  });
}

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (
    username &&
    String(username).trim().toLowerCase() === ADMIN_USER.toLowerCase() &&
    String(password) === ADMIN_PASS
  ) {
    return res.json({
      success: true,
      message: 'Login berhasil! Akses Administrator diaktifkan.',
      user: { username: 'Admin', role: 'admin' },
      token: ADMIN_TOKEN
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau password salah! Pastikan User: Admin dan Password benar.'
  });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer '))
    ? authHeader.slice(7)
    : req.headers['x-admin-token'];

  if (token === ADMIN_TOKEN) {
    return res.json({ success: true, authenticated: true, user: { username: 'Admin', role: 'admin' } });
  }
  return res.json({ success: false, authenticated: false });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout berhasil. Kembali ke tampilan awal/katalog publik.' });
});

// 1. HEALTH & STATUS
app.get('/api/status', async (req, res) => {
  try {
    const status = await db.getStatus();
    res.json({ success: true, app: 'Catalog Paket Brosur PT. Fath Indah', ...status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET LIST BROSUR (LOG BROSUR)
app.get('/api/brosur/log', async (req, res) => {
  try {
    const result = await db.getLogBrosur();
    res.json({
      success: true,
      count: result.data.length,
      data: result.data,
      source: result.source
    });
  } catch (err) {
    console.error('Error fetching LogBrosur:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2b. GET STATS PERHITUNGAN BROSUR
app.get('/api/brosur/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. MASTER KANWIL / WILAYAH
app.get('/api/brosur/kanwil', async (req, res) => {
  try {
    const list = await db.getKanwil();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. MASTER KATEGORI PAKET (CATPAKET)
app.get('/api/brosur/catpaket', async (req, res) => {
  try {
    const list = await db.getCatPaket();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. MASTER NAMA BROSUR (MNU LOG BROSUR)
app.get('/api/brosur/menu', async (req, res) => {
  try {
    const list = await db.getMnuLogBrosur();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. INPUT BROSUR BARU (POST - ADMIN ONLY)
app.post('/api/brosur/log', requireAdminAuth, async (req, res) => {
  try {
    const { catagory } = req.body;
    let { brosurname, namapaket, wilayah, lokasibrosur } = req.body;
    if (!catagory) {
      return res.status(400).json({
        success: false,
        message: 'Kategori (catagory) wajib diisi!'
      });
    }
    if (!brosurname || !brosurname.trim()) {
      brosurname = namapaket || `Brosur ${catagory} ${wilayah || lokasibrosur || 'Pusat'}`;
      req.body.brosurname = brosurname;
    }

    const inserted = await db.insertLogBrosur(req.body);
    res.json({
      success: true,
      message: 'Brosur berhasil disimpan ke katalog!',
      data: inserted
    });
  } catch (err) {
    console.error('Error inserting brosur:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. UPDATE STATUS BROSUR (PATCH / POST - ADMIN ONLY)
app.patch('/api/brosur/log/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status wajib diisi!' });
    }
    const updated = await db.updateLogBrosurStatus(id, status);
    res.json({
      success: true,
      message: `Status brosur berhasil diubah menjadi: ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/brosur/update-status', requireAdminAuth, async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'ID dan Status wajib diisi!' });
    }
    const updated = await db.updateLogBrosurStatus(id, status);
    res.json({
      success: true,
      message: `Status brosur berhasil diperbarui menjadi ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. HAPUS BROSUR (DELETE / POST - ADMIN ONLY)
app.delete('/api/brosur/log/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteLogBrosur(id);
    res.json({ success: true, message: 'Brosur berhasil dihapus dari katalog!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/brosur/delete', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: 'ID wajib diisi!' });
    await db.deleteLogBrosur(id);
    res.json({ success: true, message: 'Brosur berhasil dihapus dari katalog!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. UPLOAD BERKAS BROSUR LOKAL (Base64 - ADMIN ONLY)
app.post('/api/brosur/upload-file', requireAdminAuth, async (req, res) => {
  try {
    const { fileName, mimeType, base64 } = req.body;
    if (!base64) {
      return res.status(400).json({ success: false, message: 'Data berkas kosong!' });
    }

    let cleanBase64 = base64;
    if (cleanBase64.includes(',')) {
      cleanBase64 = cleanBase64.split(',')[1];
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    const safeName = (fileName || `BROSUR_${Date.now()}.pdf`).replace(/[^a-zA-Z0-9_.\-\[\] ]/g, '_');
    const targetPath = path.join(UPLOADS_DIR, safeName);

    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/${encodeURIComponent(safeName)}`;
    res.json({
      success: true,
      message: 'Berkas brosur berhasil disimpan di server!',
      fileName: safeName,
      fileUrl,
      directLink: fileUrl,
      sizeBytes: buffer.length
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Start Server
app.listen(PORT, async () => {
  console.log('================================================================');
  console.log(` PT. FATH INDAH TRAVEL SERVICE - CATALOG PAKET BROSUR`);
  console.log(` Server berjalan di http://localhost:${PORT}`);
  console.log('================================================================');
  try {
    await db.ensurePostgresTables();
  } catch (_) {}
});

