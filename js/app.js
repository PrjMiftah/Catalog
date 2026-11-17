/**
 * ============================================================================
 * PT. FATH INDAH TRAVEL SERVICE - CATALOG PAKET BROSUR
 * Standalone Client Application Logic
 * ============================================================================
 */

const GDRIVE_BROSUR_FOLDER_URL = 'https://drive.google.com/drive/folders/1nDoE-UPkzVwt6m_OwOpP6G-1O8w4T9wc';

// Konfigurasi Supabase Cloud (Sinkronisasi Live Data sama seperti MenuFathIndah)
const SUPABASE_CONFIG = {
  url: 'https://utqexpkwtatwzknjftpx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cWV4cGt3dGF0d3prbmpmdHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxODQ5MTYsImV4cCI6MjEwNzc2MDkxNn0.s17as0ZuXm11AMJyYp01omnHkiqTRTGrKtYZfAI7kwE'
};

// Master Data Fallbacks
const DEFAULT_CAT_PAKET = [
  { id: 1, catagory: 'Umrah' },
  { id: 2, catagory: 'Haji Khusus & Furoda' },
  { id: 3, catagory: 'Haji Terencana' },
  { id: 4, catagory: 'Wisata Halal' },
  { id: 5, catagory: 'Promo & Seasonal' }
];

const DEFAULT_KANWIL_FATH_INDAH = [
  { id: 1, namakanwil: 'Pusat' },
  { id: 2, namakanwil: 'Jabodetabek' },
  { id: 3, namakanwil: 'Solo Raya' },
  { id: 4, namakanwil: 'Samarinda' },
  { id: 5, namakanwil: 'Surabaya' },
  { id: 6, namakanwil: 'Pemalang' },
  { id: 7, namakanwil: 'Pekalongan' },
  { id: 8, namakanwil: 'Jawa Barat' },
  { id: 9, namakanwil: 'Jawa Tengah' },
  { id: 10, namakanwil: 'Jawa Timur' }
];

const DEFAULT_MNU_LOG_BROSUR = [
  { id: 'MNU-001', catagory: 'Umrah', brosurname: 'Paket Umrah Reguler 9 Hari', status: 'Active', catatan: 'Brosur paket standar bintang 4' },
  { id: 'MNU-002', catagory: 'Umrah', brosurname: 'Paket Umrah Ramadhan', status: 'Active', catatan: 'Brosur paket Umrah Ramadhan Jabodetabek & Sekitarnya' },
  { id: 'MNU-003', catagory: 'Umrah', brosurname: 'Paket Umrah Ramadhan Awal', status: 'Active', catatan: 'Brosur paket awal Ramadhan' },
  { id: 'MNU-004', catagory: 'Umrah', brosurname: 'Paket Umrah Ramadhan Lailatul Qadar', status: 'Active', catatan: 'Brosur paket 10 hari akhir Ramadhan' },
  { id: 'MNU-005', catagory: 'Umrah', brosurname: 'Paket Umrah Plus Turki 12 Hari', status: 'Active', catatan: 'Wisata sejarah Istanbul & Bursa' },
  { id: 'MNU-006', catagory: 'Umrah', brosurname: 'Paket Umrah Plus Dubai', status: 'Active', catatan: 'Wisata Dubai & Abu Dhabi' },
  { id: 'MNU-007', catagory: 'Umrah', brosurname: 'Paket Umrah VIP Bintang 5', status: 'Active', catatan: 'Hotel depan pelataran Masjidil Haram' },
  { id: 'MNU-008', catagory: 'Haji Khusus & Furoda', brosurname: 'Brosur Haji Khusus Kuota Kemenag', status: 'Active', catatan: 'Masa tunggu resmi kemenag' },
  { id: 'MNU-009', catagory: 'Haji Khusus & Furoda', brosurname: 'Brosur Haji Furoda / Mujamalah VVIP', status: 'Active', catatan: 'Berangkat langsung tanpa antri' },
  { id: 'MNU-010', catagory: 'Haji Khusus & Furoda', brosurname: 'Brosur Rincian Fasilitas Maktab Haji', status: 'Active', catatan: 'Maktab VIP tenda AC berkarpet' },
  { id: 'MNU-011', catagory: 'Haji Terencana', brosurname: 'Brosur Program Tabungan Haji Terencana', status: 'Active', catatan: 'Skema porsi awal terencana' },
  { id: 'MNU-012', catagory: 'Haji Terencana', brosurname: 'Brosur Skema Angsuran Terencana', status: 'Active', catatan: 'Tabel angsuran berkala' },
  { id: 'MNU-013', catagory: 'Wisata Halal', brosurname: 'Brosur Tour Muslim Turki Cappadochia', status: 'Active', catatan: 'Paket liburan musim dingin & semi' },
  { id: 'MNU-014', catagory: 'Wisata Halal', brosurname: 'Brosur Wisata Halal Aqsho - Jordan - Mesir', status: 'Active', catatan: 'Napak tilas tiga masjid suci' },
  { id: 'MNU-015', catagory: 'Wisata Halal', brosurname: 'Brosur Tour Muslim Eropa Barat', status: 'Active', catatan: 'Paris, Swiss, Italia & Belanda' },
  { id: 'MNU-016', catagory: 'Promo & Seasonal', brosurname: 'Flyer Promo Early Bird 1448H', status: 'Active', catatan: 'Diskon khusus pendaftar awal' },
  { id: 'MNU-017', catagory: 'Promo & Seasonal', brosurname: 'Katalog Brosur Milad PT Fath Indah', status: 'Active', catatan: 'Edisi spesial milad travel' }
];

const DEFAULT_LOG_BROSUR = [
  {
    id: '14',
    created_at: '2026-10-21T08:30:00.000Z',
    tglupload: '2026-10-21',
    validuntil: '2026-12-31',
    status: 'Aktif',
    wilayah: 'Jabodetabek',
    lokasibrosur: 'Jabodetabek',
    catagory: 'Umrah',
    brosurname: 'Paket Umrah Ramadhan',
    namapaket: '[Jabodetabek] [Reguler Ramadhan] [9H 12H] [24 Feb 2026]',
    link: '/uploads/brosur_umrah_ramadhan.jpg',
    catatan: 'Brosur resmi Umrah Ramadhan 1448H Jabodetabek & Sekitarnya (Paket 9D, 12D, 16D)'
  },
  {
    id: '16',
    created_at: '2026-10-18T14:45:00.000Z',
    tglupload: '2026-10-18',
    validuntil: '2026-10-25',
    status: 'Expired',
    wilayah: 'Samarinda',
    lokasibrosur: 'Samarinda',
    catagory: 'Promo & Seasonal',
    brosurname: 'Flyer Promo Early Bird 1448H',
    namapaket: '[Samarinda] [Early Bird Promo Musim Depan] [9D] [01 Nov 2026]',
    link: '/uploads/brosur_early_bird.svg',
    catatan: 'Flyer digital untuk share Instagram & WhatsApp marketing cabang'
  }
];

// App State
const state = {
  data: {
    kanwilFathIndah: [],
    catPaket: [],
    mnuLogBrosur: [],
    logBrosur: []
  },
  brosurFilter: {
    search: '',
    category: 'ALL',
    wilayah: 'ALL',
    status: 'Aktif'
  },
  brosurViewMode: 'table',
  activeBrosurId: null,
  selectedLocalBrosurFile: null,
  generatedSpecificFileName: '',
  auth: {
    isLoggedIn: false,
    token: localStorage.getItem('fath_catalog_auth_token') || '',
    user: null,
    pendingAction: null
  }
};

// Notification Toast
function showToast(message, type = 'success') {
  const toast = document.getElementById('appToast');
  if (!toast) return;

  const iconEl = toast.querySelector('.toast-icon');
  const textEl = toast.querySelector('.toast-text');

  if (iconEl) {
    if (type === 'error') {
      iconEl.className = 'toast-icon fa-solid fa-circle-exclamation';
      iconEl.style.color = '#ef4444';
      toast.style.borderColor = '#ef4444';
    } else {
      iconEl.className = 'toast-icon fa-solid fa-circle-check';
      iconEl.style.color = '#34d399';
      toast.style.borderColor = 'var(--gold-primary)';
    }
  }

  if (textEl) textEl.textContent = message;
  toast.style.display = 'flex';

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}

// ============================================================================
// AUTHENTICATION & ACCESS CONTROL (ADMIN ONLY)
// User: Admin | Password: Fath2026!
// ============================================================================
window.openLoginModal = function(action = null) {
  state.auth.pendingAction = action;
  const modal = document.getElementById('loginModal');
  const alertBox = document.getElementById('loginAlertBox');
  const alertText = document.getElementById('loginAlertText');
  const userInp = document.getElementById('loginUsername');
  const passInp = document.getElementById('loginPassword');

  if (alertBox) alertBox.style.display = 'none';
  if (userInp) userInp.value = 'Admin';
  if (passInp) passInp.value = '';

  if (action && alertBox && alertText) {
    alertBox.style.display = 'flex';
    alertBox.style.background = 'rgba(56, 189, 248, 0.12)';
    alertBox.style.borderColor = 'rgba(56, 189, 248, 0.35)';
    alertBox.style.color = '#38bdf8';
    if (action === 'input') {
      alertText.textContent = 'Fitur Input Brosur Baru memerlukan login Admin.';
    } else if (action.type === 'update') {
      alertText.textContent = 'Fitur Ubah Status Brosur memerlukan login Admin.';
    } else if (action.type === 'delete') {
      alertText.textContent = 'Fitur Hapus Brosur memerlukan login Admin.';
    } else {
      alertText.textContent = 'Fitur ini memerlukan login Administrator.';
    }
  }

  if (modal) modal.style.display = 'flex';
  if (passInp) setTimeout(() => passInp.focus(), 150);
};

window.closeLoginModal = function() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
  state.auth.pendingAction = null;
};

window.togglePasswordVisibility = function() {
  const passInp = document.getElementById('loginPassword');
  const icon = document.getElementById('togglePasswordIcon');
  if (!passInp || !icon) return;
  if (passInp.type === 'password') {
    passInp.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    passInp.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
};

window.handleAdminLogin = async function(event) {
  if (event) event.preventDefault();

  const userInp = document.getElementById('loginUsername');
  const passInp = document.getElementById('loginPassword');
  const alertBox = document.getElementById('loginAlertBox');
  const alertText = document.getElementById('loginAlertText');
  const btnSubmit = document.getElementById('btnLoginSubmit');

  const username = userInp ? userInp.value.trim() : '';
  const password = passInp ? passInp.value : '';

  if (!username || !password) {
    if (alertBox && alertText) {
      alertBox.style.display = 'flex';
      alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
      alertBox.style.borderColor = '#ef4444';
      alertBox.style.color = '#f87171';
      alertText.textContent = 'Harap masukkan Username dan Password!';
    }
    return;
  }

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memvalidasi...';
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await res.json();

    if (result.success && result.token) {
      state.auth.isLoggedIn = true;
      state.auth.token = result.token;
      state.auth.user = result.user || { username: 'Admin' };
      localStorage.setItem('fath_catalog_auth_token', result.token);
      localStorage.setItem('fath_catalog_auth_user', JSON.stringify(state.auth.user));

      updateAuthUI();
      closeLoginModal();
      showToast('Login Administrator Berhasil! Fitur edit & input telah aktif.');

      // Check pending action
      const pending = state.auth.pendingAction;
      state.auth.pendingAction = null;
      if (pending === 'input') {
        switchBrosurTab('input');
      } else if (pending && pending.type === 'update' && pending.id) {
        openUpdateStatusModal(pending.id);
      } else if (pending && pending.type === 'delete' && pending.id) {
        deleteBrosurRecord(pending.id);
      }
    } else {
      if (alertBox && alertText) {
        alertBox.style.display = 'flex';
        alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
        alertBox.style.borderColor = '#ef4444';
        alertBox.style.color = '#f87171';
        alertText.textContent = result.message || 'Username atau password salah!';
      }
    }
  } catch (err) {
    // Local fallback check
    if (username.toLowerCase() === 'admin' && password === 'Fath2026!') {
      state.auth.isLoggedIn = true;
      state.auth.token = 'fath-admin-auth-session-2026';
      state.auth.user = { username: 'Admin', role: 'admin' };
      localStorage.setItem('fath_catalog_auth_token', state.auth.token);
      localStorage.setItem('fath_catalog_auth_user', JSON.stringify(state.auth.user));

      updateAuthUI();
      closeLoginModal();
      showToast('Login Administrator Berhasil!');
      if (state.auth.pendingAction === 'input') switchBrosurTab('input');
    } else {
      if (alertBox && alertText) {
        alertBox.style.display = 'flex';
        alertBox.style.background = 'rgba(239, 68, 68, 0.15)';
        alertBox.style.borderColor = '#ef4444';
        alertBox.style.color = '#f87171';
        alertText.textContent = 'Username atau password salah!';
      }
    }
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> <span>Masuk (Login)</span>';
    }
  }
};

window.handleLogout = async function() {
  const confirmLogout = confirm('Apakah Anda ingin keluar (logout) dari sesi Administrator dan kembali ke menu awal?');
  if (!confirmLogout) return;

  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (_) {}

  state.auth.isLoggedIn = false;
  state.auth.token = '';
  state.auth.user = null;
  localStorage.removeItem('fath_catalog_auth_token');
  localStorage.removeItem('fath_catalog_auth_user');

  updateAuthUI();
  switchBrosurTab('list');
  showToast('Anda telah logout. Kembali ke tampilan katalog publik.');
};

window.requireAdminAuthAction = function(actionType, id) {
  if (state.auth.isLoggedIn) {
    if (actionType === 'update') openUpdateStatusModal(id);
    else if (actionType === 'delete') deleteBrosurRecord(id);
    else if (actionType === 'input') switchBrosurTab('input');
  } else {
    openLoginModal({ type: actionType, id });
  }
};

function updateAuthUI() {
  const btnLogin = document.getElementById('btnNavLogin');
  const boxSession = document.getElementById('boxAdminSession');
  const lockBadge = document.getElementById('inputTabLockBadge');

  if (state.auth.isLoggedIn) {
    if (btnLogin) btnLogin.style.display = 'none';
    if (boxSession) boxSession.style.display = 'inline-flex';
    if (lockBadge) lockBadge.style.display = 'none';
  } else {
    if (btnLogin) btnLogin.style.display = 'inline-flex';
    if (boxSession) boxSession.style.display = 'none';
    if (lockBadge) lockBadge.style.display = 'inline-flex';
  }

  // Re-render table & split view action buttons to reflect auth state
  if (state.brosurViewMode === 'split') {
    renderBrosurSplitView();
  } else {
    renderBrosurTable();
  }
}

async function verifyInitialAuth() {
  const token = localStorage.getItem('fath_catalog_auth_token');
  if (!token) {
    state.auth.isLoggedIn = false;
    updateAuthUI();
    return;
  }

  try {
    const res = await fetch('/api/auth/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.success && json.authenticated) {
      state.auth.isLoggedIn = true;
      state.auth.token = token;
      state.auth.user = json.user || { username: 'Admin' };
    } else {
      state.auth.isLoggedIn = false;
      state.auth.token = '';
      localStorage.removeItem('fath_catalog_auth_token');
    }
  } catch (_) {
    if (token === 'fath-admin-auth-session-2026') {
      state.auth.isLoggedIn = true;
    }
  }

  updateAuthUI();
}

// Helper format tanggal dd mmm yy (Lampiran 3)
function formatDateDdMmmYy(dateStr) {
  if (!dateStr || dateStr === '-' || dateStr === 'null' || dateStr === 'undefined') return '-';
  const clean = String(dateStr).trim().slice(0, 10);
  const parts = clean.split('-');
  if (parts.length === 3) {
    const y = parts[0];
    const m = parseInt(parts[1], 10);
    const d = parts[2].padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const mmm = months[m - 1] || parts[1];
    const yy = y.length === 4 ? y.slice(2) : y;
    return `${d} ${mmm} ${yy}`;
  }
  return dateStr;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  setupDropZoneListeners();
  updateGDriveStatusUI();

  const savedMode = localStorage.getItem('catalog_view_mode') || 'table';
  state.brosurViewMode = savedMode;

  await verifyInitialAuth();
  await loadBrosurData();

  setBrosurViewMode(savedMode);
});

// Tab Switching
window.switchBrosurTab = function(tabName) {
  const btnList = document.getElementById('tabBtnBrosurList');
  const btnInput = document.getElementById('tabBtnBrosurInput');
  const paneList = document.getElementById('tabPaneBrosurList');
  const paneInput = document.getElementById('tabPaneBrosurInput');

  if (tabName === 'input') {
    // Guard: require admin authentication
    if (!state.auth.isLoggedIn) {
      openLoginModal('input');
      return;
    }

    btnList?.classList.remove('active');
    btnInput?.classList.add('active');
    paneList?.classList.remove('active');
    paneInput?.classList.add('active');
    resetBrosurForm();
    window.scrollTo({ top: 120, behavior: 'smooth' });
  } else {
    btnInput?.classList.remove('active');
    btnList?.classList.add('active');
    paneInput?.classList.remove('active');
    paneList?.classList.add('active');
    if (state.brosurViewMode === 'split') {
      renderBrosurSplitView();
    } else {
      renderBrosurTable();
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }
};

// Load Data (PostgreSQL Server API sebagai SUMBER UTAMA)
async function loadBrosurData(force = false) {
  // 1. Kanwil Data (Utama dari /api/brosur/kanwil PostgreSQL)
  let kanwil = [];
  try {
    const res = await fetch('/api/brosur/kanwil');
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) kanwil = json.data;
    }
  } catch (_) {}

  if (!kanwil.length) {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/KanwilFathIndah?select=namakanwil`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) kanwil = data;
      }
    } catch (_) {}
  }
  if (!kanwil.length) {
    const local = localStorage.getItem('catalog_kanwil');
    if (local) {
      try { kanwil = JSON.parse(local); } catch (_) {}
    }
  }
  if (!kanwil.length) kanwil = DEFAULT_KANWIL_FATH_INDAH;
  state.data.kanwilFathIndah = kanwil;

  // 2. CatPaket Data (Utama dari /api/brosur/catpaket PostgreSQL)
  let catPaket = [];
  try {
    const res = await fetch('/api/brosur/catpaket');
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) catPaket = json.data;
    }
  } catch (_) {}

  if (!catPaket.length) {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/CatPaket?select=*&order=id.asc`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) catPaket = data;
      }
    } catch (_) {}
  }
  if (!catPaket.length) {
    const local = localStorage.getItem('catalog_catpaket');
    if (local) {
      try { catPaket = JSON.parse(local); } catch (_) {}
    }
  }
  if (!catPaket.length) catPaket = DEFAULT_CAT_PAKET;
  state.data.catPaket = catPaket;

  // 3. MnuLogBrosur Data (Utama dari /api/brosur/menu PostgreSQL)
  let mnu = [];
  try {
    const res = await fetch('/api/brosur/menu');
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) mnu = json.data;
    }
  } catch (_) {}

  if (!mnu.length) {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/MnuLogBrosur?select=*&order=catagory.asc,brosurname.asc`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) mnu = data;
      }
    } catch (_) {}
  }
  if (!mnu.length) {
    const local = localStorage.getItem('catalog_mnu');
    if (local) {
      try { mnu = JSON.parse(local); } catch (_) {}
    }
  }
  if (!mnu.length) mnu = DEFAULT_MNU_LOG_BROSUR;
  state.data.mnuLogBrosur = mnu;

  populateBrosurDropdowns();

  // 4. LogBrosur Data (Utama dari /api/brosur/log PostgreSQL)
  let logList = null;
  let serverConnected = false;
  try {
    const res = await fetch('/api/brosur/log');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        serverConnected = true;
        logList = json.data.map(item => ({
          ...item,
          wilayah: item.wilayah || item.lokasibrosur || 'Pusat'
        }));
        // Update client storage cache
        try {
          localStorage.setItem('catalog_log_brosur', JSON.stringify(logList));
        } catch (_) {}
      }
    }
  } catch (_) {}

  // Fallback HANYA jika server backend tidak dapat dihubungi sama sekali (offline)
  if (!serverConnected) {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/LogBrosur?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          logList = data.map(item => ({
            ...item,
            wilayah: item.wilayah || item.lokasibrosur || 'Pusat'
          }));
        }
      }
    } catch (_) {}

    if (!logList) {
      const local = localStorage.getItem('catalog_log_brosur');
      if (local) {
        try { logList = JSON.parse(local); } catch (_) {}
      }
    }

    if (!logList) logList = [];
  }

  state.data.logBrosur = logList || [];
  renderBrosurTable();
}

// Populate Dropdowns
function populateBrosurDropdowns() {
  const kanwilList = (state.data.kanwilFathIndah && state.data.kanwilFathIndah.length > 0)
    ? state.data.kanwilFathIndah
    : DEFAULT_KANWIL_FATH_INDAH;

  const listNames = kanwilList.map(k => (k.namakanwil || k.namakanwill || '').trim()).filter(Boolean);

  const logWilayah = (state.data.logBrosur || []).map(l => {
    if (l.wilayah) return l.wilayah.trim();
    if (l.lokasibrosur) return l.lokasibrosur.trim();
    if (l.namapaket && l.namapaket.startsWith('[')) {
      const m = l.namapaket.match(/^\[([^\]]+)\]/);
      if (m) return m[1].trim();
    }
    return '';
  }).filter(Boolean);

  const defaultNames = DEFAULT_KANWIL_FATH_INDAH.map(k => k.namakanwil);

  const wilNames = [...new Set([...listNames, ...logWilayah, ...defaultNames, 'Jabodetabek'])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'id'));

  // Filter Wilayah Dropdown
  const wilFilter = document.getElementById('brosurWilayahFilter');
  if (wilFilter) {
    const currentWil = state.brosurFilter.wilayah || 'ALL';
    let wilFilterHtml = '<option value="ALL">Semua Wilayah</option>';
    wilNames.forEach(w => {
      wilFilterHtml += `<option value="${w}" ${w === currentWil ? 'selected' : ''}>${w}</option>`;
    });
    wilFilter.innerHTML = wilFilterHtml;
  }

  // Form Input Wilayah
  const inputWilayah = document.getElementById('inputBrosurWilayah');
  if (inputWilayah) {
    const prevWil = inputWilayah.value;
    let inputWilHtml = '<option value="">-- Pilih Wilayah Brosur --</option>';
    wilNames.forEach(w => {
      inputWilHtml += `<option value="${w}" ${w === prevWil ? 'selected' : ''}>${w}</option>`;
    });
    inputWilayah.innerHTML = inputWilHtml;
  }

  // Category Dropdowns
  const catList = (state.data.catPaket && state.data.catPaket.length > 0)
    ? state.data.catPaket
    : DEFAULT_CAT_PAKET;
  const categories = [...new Set(catList.map(c => (c.catagory || c.category || '').trim()).filter(Boolean))].sort();

  const catFilter = document.getElementById('brosurCategoryFilter');
  if (catFilter) {
    const currentCat = state.brosurFilter.category || 'ALL';
    let filterHtml = '<option value="ALL">Semua Kategori</option>';
    categories.forEach(cat => {
      filterHtml += `<option value="${cat}" ${cat === currentCat ? 'selected' : ''}>${cat}</option>`;
    });
    catFilter.innerHTML = filterHtml;
  }

  const inputCategory = document.getElementById('inputBrosurCategory');
  if (inputCategory) {
    const prevSelected = inputCategory.value;
    let inputCatHtml = '<option value="">-- Pilih Kategori --</option>';
    categories.forEach(cat => {
      inputCatHtml += `<option value="${cat}" ${cat === prevSelected ? 'selected' : ''}>${cat}</option>`;
    });
    inputCategory.innerHTML = inputCatHtml;
  }

  syncBrosurNameVisibility();
}

function syncBrosurNameVisibility() {
  const categorySelect = document.getElementById('inputBrosurCategory');
  const groupName = document.getElementById('groupBrosurName');
  const nameSelect = document.getElementById('inputBrosurName');
  if (!groupName || !nameSelect) return;

  const selectedCat = categorySelect ? categorySelect.value.trim() : '';

  if (!selectedCat) {
    groupName.style.display = 'none';
    nameSelect.innerHTML = '<option value="">-- Pilih Kategori Terlebih Dahulu --</option>';
    nameSelect.value = '';
    nameSelect.removeAttribute('required');
    return;
  }

  const mnuList = (state.data.mnuLogBrosur && state.data.mnuLogBrosur.length > 0)
    ? state.data.mnuLogBrosur
    : DEFAULT_MNU_LOG_BROSUR;

  const matched = mnuList.filter(m => (m.catagory || m.category || '').trim().toLowerCase() === selectedCat.toLowerCase());

  if (matched.length > 0) {
    groupName.style.display = 'block';
    nameSelect.removeAttribute('required');

    const distinctNames = [...new Set(matched.map(m => (m.brosurname || m.brosur_name || '').trim()).filter(Boolean))].sort();

    const prevVal = nameSelect.value;
    let html = `<option value="">-- Pilih Nama Brosur (${selectedCat}) --</option>`;
    distinctNames.forEach(name => {
      html += `<option value="${name}" ${name === prevVal ? 'selected' : ''}>${name}</option>`;
    });
    nameSelect.innerHTML = html;
  } else {
    groupName.style.display = 'block';
    nameSelect.removeAttribute('required');
    nameSelect.innerHTML = `<option value="">-- Belum ada brosur di MnuLogBrosur untuk "${selectedCat}" --</option>`;
  }
}

window.onBrosurWilayahChange = function() {
  updateBrosurCompositeName();
};

window.onBrosurCategoryChange = function() {
  syncBrosurNameVisibility();
  updateBrosurCompositeName();
};

window.onBrosurNameChange = function() {
  updateBrosurCompositeName();
};

// Jumlah Hari change
window.onJumlahHariChange = function() {
  const select = document.getElementById('inputBrosurJumlahHari');
  const groupCustom = document.getElementById('groupCustomJumlahHari');
  if (select && groupCustom) {
    if (select.value === 'custom') {
      groupCustom.style.display = 'block';
      const customInput = document.getElementById('inputBrosurCustomHari');
      if (customInput) customInput.focus();
    } else {
      groupCustom.style.display = 'none';
      const customInput = document.getElementById('inputBrosurCustomHari');
      if (customInput) customInput.value = '';
    }
  }
  updateBrosurCompositeName();
};

function formatCustomHariBrosur(val) {
  if (!val) return '';
  const clean = val.trim();
  const tokens = clean.split(/[\s,]+/);
  if (tokens.length > 1) {
    return tokens.map(t => {
      const num = t.replace(/\D/g, '');
      return num ? `${num}H` : t;
    }).join(' ');
  }
  const singleNum = clean.replace(/\D/g, '');
  return singleNum ? `${singleNum}D` : clean;
}

window.updateBrosurCompositeName = function() {
  const displayBox = document.getElementById('generatedSpecificFileName');
  const wilayah = document.getElementById('inputBrosurWilayah')?.value || '';
  const paket = document.getElementById('inputBrosurNamaPaket')?.value.trim() || '';
  const hariSelect = document.getElementById('inputBrosurJumlahHari')?.value || '';
  const customHari = document.getElementById('inputBrosurCustomHari')?.value.trim() || '';
  const tglBerangkat = document.getElementById('inputBrosurTglBerangkat')?.value || '';

  let partHari = '';
  if (hariSelect === 'custom') {
    partHari = customHari ? `[${formatCustomHariBrosur(customHari)}]` : '[Jumlah Hari]';
  } else if (hariSelect) {
    partHari = `[${hariSelect}D]`;
  } else {
    partHari = '[Jumlah Hari]';
  }

  const partWilayah = wilayah ? `[${wilayah}]` : '[Wilayah]';
  const partPaket = paket ? `[${paket}]` : '[Nama Paket]';

  let partTgl = '[Tanggal Berangkat]';
  if (tglBerangkat) {
    const parts = tglBerangkat.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const m = parseInt(parts[1], 10);
      const d = parts[2].padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const mmm = months[m - 1] || parts[1];
      partTgl = `[${d} ${mmm} ${y}]`;
    }
  }

  const combinedName = `${partWilayah} ${partPaket} ${partHari} ${partTgl}`;
  state.generatedSpecificFileName = combinedName;
  if (displayBox) {
    displayBox.textContent = combinedName;
    displayBox.style.color = '#38bdf8';
  }
};

window.copySpecificFileName = function() {
  const text = state.generatedSpecificFileName || document.getElementById('generatedSpecificFileName')?.textContent;
  if (!text || text.includes('...')) {
    alert('Harap isi Nama Paket, Jumlah Hari, atau Tanggal Berangkat.');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast('Nama file standar tersalin ke clipboard!');
  }).catch(() => {
    prompt('Salin nama file berikut:', text);
  });
};

// Reset Form
window.resetBrosurForm = function() {
  const form = document.getElementById('brosurInputForm');
  if (form) form.reset();

  populateBrosurDropdowns();

  const groupName = document.getElementById('groupBrosurName');
  if (groupName) groupName.style.display = 'none';

  const groupCustom = document.getElementById('groupCustomJumlahHari');
  if (groupCustom) groupCustom.style.display = 'none';

  const todayYmd = new Date().toISOString().slice(0, 10);
  const tglUploadInput = document.getElementById('inputBrosurTglUpload');
  if (tglUploadInput) tglUploadInput.value = todayYmd;

  const validUntilInput = document.getElementById('inputBrosurValidUntil');
  if (validUntilInput) {
    validUntilInput.value = '';
    validUntilInput.min = todayYmd;
  }

  const linkInput = document.getElementById('inputBrosurLink');
  if (linkInput) linkInput.value = GDRIVE_BROSUR_FOLDER_URL;

  clearSelectedFile();
  updateBrosurCompositeName();
};

// File Selection & Drop Zone
function setupDropZoneListeners() {
  const dropZone = document.getElementById('brosurDropZone');
  if (!dropZone || dropZone.dataset.listenersAdded) return;
  dropZone.dataset.listenersAdded = 'true';

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      const fileInput = document.getElementById('localBrosurFileInput');
      if (fileInput) fileInput.files = files;
      handleLocalFileSelect({ target: { files: files } });
    }
  }, false);
}

window.handleLocalFileSelect = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  state.selectedLocalBrosurFile = file;

  updateBrosurCompositeName();

  const banner = document.getElementById('selectedFileBanner');
  const nameEl = document.getElementById('selectedFileName');
  const metaEl = document.getElementById('selectedFileMeta');

  if (banner) banner.style.display = 'flex';
  if (nameEl) nameEl.textContent = file.name;
  if (metaEl) {
    const sizeKB = Math.round(file.size / 1024);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = sizeKB > 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
    const autoStatus = getGDriveWebhookUrl() ? '⚡ Google Drive Auto-Upload' : '📁 Siap Upload Lokal';
    metaEl.textContent = `Ukuran: ${sizeStr} • Format: ${file.name.split('.').pop().toUpperCase()} • ${autoStatus}`;
  }
};

window.clearSelectedFile = function() {
  state.selectedLocalBrosurFile = null;
  const fileInput = document.getElementById('localBrosurFileInput');
  if (fileInput) fileInput.value = '';
  const banner = document.getElementById('selectedFileBanner');
  if (banner) banner.style.display = 'none';
  updateBrosurCompositeName();
};

// Google Apps Script source code
const APPS_SCRIPT_SOURCE_CODE = `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT: AUTO-UPLOADER BROSUR PT. FATH INDAH TRAVEL SERVICE
 * Target Folder ID: 1nDoE-UPkzVwt6m_OwOpP6G-1O8w4T9wc
 * ============================================================================
 */
const TARGET_FOLDER_ID = "1nDoE-UPkzVwt6m_OwOpP6G-1O8w4T9wc";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, message: "Payload tidak ditemukan." });
    }
    var payload = JSON.parse(e.postData.contents);
    var folderId = payload.folderId || TARGET_FOLDER_ID;
    var folder = DriveApp.getFolderById(folderId);
    if (!folder) {
      return createJsonResponse({ success: false, message: "Folder tidak ditemukan: " + folderId });
    }
    var fileName = payload.fileName || ("BROSUR_" + Utilities.formatDate(new Date(), "GMT+7", "yyyyMMdd_HHmmss") + ".pdf");
    var mimeType = payload.mimeType || "application/pdf";
    var base64String = payload.base64;
    if (!base64String) {
      return createJsonResponse({ success: false, message: "Konten file kosong." });
    }
    if (base64String.indexOf(",") > -1) {
      base64String = base64String.split(",")[1];
    }
    var decoded = Utilities.base64Decode(base64String);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    var createdFile = folder.createFile(blob);
    try {
      createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {}
    var fileId = createdFile.getId();
    var directViewUrl = "https://drive.google.com/file/d/" + fileId + "/view?usp=sharing";
    return createJsonResponse({
      success: true,
      message: "File brosur berhasil diunggah ke Google Drive!",
      fileId: fileId,
      fileName: createdFile.getName(),
      directLink: directViewUrl,
      fileUrl: directViewUrl
    });
  } catch (error) {
    return createJsonResponse({ success: false, message: error.toString() });
  }
}

function doGet(e) {
  return createJsonResponse({
    success: true,
    status: "active",
    message: "Google Drive Uploader Webhook PT Fath Indah aktif.",
    targetFolderId: TARGET_FOLDER_ID
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}`;

function getGDriveWebhookUrl() {
  return (localStorage.getItem('fath_indah_gdrive_script_url') || '').trim();
}

function setGDriveWebhookUrl(url) {
  localStorage.setItem('fath_indah_gdrive_script_url', (url || '').trim());
  updateGDriveStatusUI();
}

function updateGDriveStatusUI() {
  const url = getGDriveWebhookUrl();
  const pill = document.getElementById('gdriveWebhookStatusPill');
  const pillText = document.getElementById('gdriveWebhookStatusText');
  if (pill && pillText) {
    if (url) {
      pill.className = 'gdrive-status-badge active';
      pillText.textContent = 'Auto-Upload Drive: Terhubung';
      pill.title = `Terkoneksi ke: ${url}`;
    } else {
      pill.className = 'gdrive-status-badge pending';
      pillText.textContent = 'Auto-Upload: Opsional Webhook';
      pill.title = 'Klik untuk konfigurasi Google Apps Script';
    }
  }
}

window.openGDriveConfigModal = function() {
  const modal = document.getElementById('gdriveConfigModal');
  if (!modal) return;
  modal.style.display = 'flex';
  const urlInput = document.getElementById('inputGDriveScriptUrl');
  if (urlInput) urlInput.value = getGDriveWebhookUrl();
  const codeBox = document.getElementById('appsScriptCodeBlock');
  if (codeBox) codeBox.textContent = APPS_SCRIPT_SOURCE_CODE;
  updateGDriveStatusUI();
};

window.closeGDriveConfigModal = function() {
  const modal = document.getElementById('gdriveConfigModal');
  if (modal) modal.style.display = 'none';
};

window.toggleGDriveGuide = function() {
  const content = document.getElementById('gdriveStepsContent');
  const chevron = document.getElementById('gdriveGuideChevron');
  if (!content) return;
  if (content.style.display === 'none' || !content.style.display) {
    content.style.display = 'block';
    if (chevron) chevron.className = 'fa-solid fa-chevron-up';
  } else {
    content.style.display = 'none';
    if (chevron) chevron.className = 'fa-solid fa-chevron-down';
  }
};

window.copyAppsScriptCode = function() {
  navigator.clipboard.writeText(APPS_SCRIPT_SOURCE_CODE).then(() => {
    showToast('Kode Webhook Google Apps Script tersalin!');
  }).catch(() => {
    prompt('Salin skrip berikut:', APPS_SCRIPT_SOURCE_CODE);
  });
};

window.saveGDriveConfig = function() {
  const input = document.getElementById('inputGDriveScriptUrl');
  const url = (input ? input.value : '').trim();
  setGDriveWebhookUrl(url);
  showToast('Konfigurasi Webhook berhasil disimpan!');
  closeGDriveConfigModal();
};

window.testGDriveWebhook = async function() {
  const input = document.getElementById('inputGDriveScriptUrl');
  const statusEl = document.getElementById('gdriveTestStatus');
  const url = (input ? input.value : '').trim();
  if (!url) {
    alert('Harap masukkan URL Web App Google Apps Script!');
    return;
  }

  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.style.color = '#38bdf8';
    statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menguji koneksi ke Web App...';
  }

  try {
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    if (res.ok) {
      if (statusEl) {
        statusEl.style.color = '#34d399';
        statusEl.innerHTML = '<i class="fa-solid fa-check-circle"></i> Koneksi Berhasil! Siap digunakan.';
      }
    } else {
      if (statusEl) {
        statusEl.style.color = '#f87171';
        statusEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Respon HTTP ${res.status}. Pastikan deployment Anyone.`;
      }
    }
  } catch (err) {
    if (statusEl) {
      statusEl.style.color = '#fbbf24';
      statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Respon diterima. Web App siap menerima POST upload.`;
    }
  }
};

// Form Submit
window.submitBrosurForm = async function(event) {
  if (event) event.preventDefault();

  // Guard: Admin Auth Required
  if (!state.auth.isLoggedIn) {
    openLoginModal('input');
    return;
  }

  const wilayah = (document.getElementById('inputBrosurWilayah')?.value || '').trim();
  const catagory = (document.getElementById('inputBrosurCategory')?.value || '').trim();
  let brosurname = (document.getElementById('inputBrosurName')?.value || '').trim();
  const validuntil = (document.getElementById('inputBrosurValidUntil')?.value || '').trim();
  const catatan = (document.getElementById('inputBrosurCatatan')?.value || '').trim();
  const tglupload = document.getElementById('inputBrosurTglUpload')?.value || new Date().toISOString().slice(0, 10);
  let link = document.getElementById('inputBrosurLink')?.value || GDRIVE_BROSUR_FOLDER_URL;

  const namaPaket = (document.getElementById('inputBrosurNamaPaket')?.value || '').trim();
  const hariSelect = document.getElementById('inputBrosurJumlahHari')?.value || '';
  const customHari = (document.getElementById('inputBrosurCustomHari')?.value || '').trim();
  const tglBerangkat = document.getElementById('inputBrosurTglBerangkat')?.value || '';

  let generatedNamaPaket = '';
  if (wilayah || namaPaket || hariSelect || tglBerangkat) {
    let partHari = '';
    if (hariSelect === 'custom') {
      partHari = customHari ? `[${formatCustomHariBrosur(customHari)}]` : '';
    } else if (hariSelect) {
      partHari = `[${hariSelect}D]`;
    }

    const partWil = wilayah ? `[${wilayah}]` : '';
    const partPkt = namaPaket ? `[${namaPaket}]` : '';

    let partTgl = '';
    if (tglBerangkat) {
      const parts = tglBerangkat.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10);
        const d = parts[2].padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const mmm = months[m - 1] || parts[1];
        partTgl = `[${d} ${mmm} ${y}]`;
      }
    }
    generatedNamaPaket = [partWil, partPkt, partHari, partTgl].filter(Boolean).join(' ');
  }

  // Jika nama brosur master belum terpilih, gunakan hasil komponen paket
  if (!brosurname) {
    if (generatedNamaPaket) {
      brosurname = generatedNamaPaket;
    } else if (namaPaket) {
      brosurname = namaPaket;
    } else {
      brosurname = `Brosur ${catagory || 'Paket'} ${wilayah || ''}`.trim();
    }
  }

  if (!wilayah) {
    alert('Harap pilih Wilayah Brosur!');
    return;
  }

  if (!catagory) {
    alert('Harap pilih Kategori Brosur!');
    return;
  }

  if (!brosurname) {
    alert('Harap lengkapi rincian Nama Paket atau pilih Nama Brosur!');
    return;
  }

  if (!validuntil) {
    alert('Harap tentukan tanggal batas berlaku brosur (Valid Until)!');
    return;
  }

  const selectedFile = state.selectedLocalBrosurFile;
  const btnSubmit = document.getElementById('btnSubmitBrosur');

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan brosur...';
  }

  // Process file upload if file chosen
  if (selectedFile) {
    if (btnSubmit) btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah berkas brosur...';

    // 1. Check Google Drive Webhook first
    const gdriveWebhookUrl = getGDriveWebhookUrl();
    if (gdriveWebhookUrl) {
      try {
        const base64Data = await readFileAsBase64(selectedFile);
        const gdriveRes = await fetch(gdriveWebhookUrl, {
          method: 'POST',
          body: JSON.stringify({
            folderId: '1nDoE-UPkzVwt6m_OwOpP6G-1O8w4T9wc',
            fileName: `${generatedNamaPaket || selectedFile.name}.${selectedFile.name.split('.').pop()}`,
            mimeType: selectedFile.type || 'application/pdf',
            base64: base64Data
          })
        });
        const gdriveJson = await gdriveRes.json();
        if (gdriveJson.success && gdriveJson.directLink) {
          link = gdriveJson.directLink;
        }
      } catch (e) {
        console.warn('Gagal upload ke Google Drive Apps Script, fallback ke server upload:', e.message);
      }
    }

    // 2. Upload to local server /api/brosur/upload-file if not uploaded to GDrive
    if (!link || link === GDRIVE_BROSUR_FOLDER_URL) {
      try {
        const base64Data = await readFileAsBase64(selectedFile);
        const ext = selectedFile.name.split('.').pop();
        const safeFileName = `${(generatedNamaPaket || selectedFile.name).replace(/[^a-zA-Z0-9_\-\[\]]/g, '_')}.${ext}`;
        const uploadRes = await fetch('/api/brosur/upload-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.auth.token}`
          },
          body: JSON.stringify({
            fileName: safeFileName,
            mimeType: selectedFile.type,
            base64: base64Data
          })
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.success && uploadJson.fileUrl) {
          link = uploadJson.fileUrl;
        }
      } catch (err) {
        console.warn('Gagal upload lokal:', err.message);
      }
    }
  }

  if (btnSubmit) btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan ke PostgreSQL...';

  const payload = {
    wilayah,
    lokasibrosur: wilayah,
    catagory,
    brosurname,
    namapaket: generatedNamaPaket || null,
    validuntil,
    tglupload,
    status: 'Aktif',
    link,
    catatan: (catatan || '').trim()
  };

  let savedRecord = null;

  // 1. Simpan ke Backend PostgreSQL Server (Primary)
  try {
    const res = await fetch('/api/brosur/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.auth.token}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        savedRecord = result.data;
      }
    }
  } catch (err) {
    console.warn('Gagal simpan ke /api/brosur/log:', err.message);
  }

  // 2. Jika backend server tidak merespon, coba simpan via Supabase
  if (!savedRecord) {
    try {
      const supaRes = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/LogBrosur`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });
      if (supaRes.ok) {
        const supaData = await supaRes.json();
        savedRecord = Array.isArray(supaData) ? supaData[0] : supaData;
      }
    } catch (_) {}
  }

  // 3. Fallback Offline
  if (!savedRecord) {
    savedRecord = {
      id: `LOCAL-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...payload
    };
  }

  savedRecord.wilayah = savedRecord.lokasibrosur || savedRecord.wilayah || wilayah;

  // Prepend data baru ke antarmuka & localStorage seketika
  const currentList = state.data.logBrosur || [];
  state.data.logBrosur = [savedRecord, ...currentList.filter(x => String(x.id) !== String(savedRecord.id))];
  try {
    localStorage.setItem('catalog_log_brosur', JSON.stringify(state.data.logBrosur));
  } catch (_) {}

  // Set active preview ke brosur yang baru disimpan
  state.activeBrosurId = String(savedRecord.id);

  if (btnSubmit) {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> <span>Simpan Brosur</span>';
  }

  showToast(`Brosur "${brosurname}" berhasil disimpan!`);
  alert(`Brosur "${brosurname}" untuk wilayah ${wilayah} berhasil disimpan!\n(ID Record: #${savedRecord.id || 'Baru'})`);

  resetBrosurForm();
  renderBrosurTable();
  switchBrosurTab('list');
};

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// Filtered List
function getFilteredBrosurList() {
  const list = state.data.logBrosur || [];
  const search = (state.brosurFilter.search || '').toLowerCase();
  const category = state.brosurFilter.category || 'ALL';
  const wilayahFilter = state.brosurFilter.wilayah || 'ALL';
  const statusFilter = state.brosurFilter.status || 'Aktif';
  const todayStr = new Date().toISOString().slice(0, 10);

  return list.filter(item => {
    const wil = (item.wilayah || item.lokasibrosur || '').toLowerCase();
    const cat = (item.catagory || item.category || '').toLowerCase();
    const name = (item.brosurname || item.name || '').toLowerCase();
    const paket = (item.namapaket || '').toLowerCase();
    const notes = (item.catatan || '').toLowerCase();

    let rawStatus = (item.status || 'Aktif').trim();
    const isPastDate = item.validuntil && item.validuntil < todayStr;
    const isExpired = rawStatus.toLowerCase() === 'expired' || isPastDate;
    const effectiveStatus = isExpired ? 'Expired' : 'Aktif';

    if (statusFilter !== 'ALL' && effectiveStatus !== statusFilter) return false;
    if (wilayahFilter !== 'ALL' && (item.wilayah || item.lokasibrosur || '') !== wilayahFilter) return false;
    if (category !== 'ALL' && (item.catagory || item.category) !== category) return false;

    if (search && !wil.includes(search) && !cat.includes(search) && !name.includes(search) && !paket.includes(search) && !notes.includes(search)) {
      return false;
    }

    return true;
  });
}

// Stats Update
function updateBrosurStats(list) {
  const elTotal = document.getElementById('brosurStatTotal');
  const elCat = document.getElementById('brosurStatCategory');
  const elActive = document.getElementById('brosurStatActive');
  const todayStr = new Date().toISOString().slice(0, 10);

  if (elTotal) elTotal.textContent = list.length;
  if (elCat) {
    const cats = new Set(list.map(x => x.catagory || x.category).filter(Boolean));
    elCat.textContent = cats.size || 0;
  }
  if (elActive) {
    const activeCount = list.filter(item => {
      const isPast = item.validuntil && item.validuntil < todayStr;
      const isExp = (item.status || '').trim().toLowerCase() === 'expired' || isPast;
      return !isExp;
    }).length;
    elActive.textContent = activeCount;
  }
}

// Render Table List
function renderBrosurTable() {
  const tbody = document.getElementById('logBrosurTableBody');
  const list = state.data.logBrosur || [];
  const filtered = getFilteredBrosurList();
  const todayStr = new Date().toISOString().slice(0, 10);

  updateBrosurStats(list);

  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:38px; color:#64748b;">
          <i class="fa-regular fa-folder-open" style="font-size:2.2rem; color:var(--gold-light); margin-bottom:12px; display:block;"></i>
          <div>Tidak ada brosur yang sesuai filter. Klik <strong>Input Brosur Baru</strong> untuk mendaftarkan brosur.</div>
          <button type="button" class="btn-gold" style="margin-top:14px; padding:6px 16px; font-size:0.8rem;" onclick="switchBrosurTab('input')">
            <i class="fa-solid fa-plus"></i> Input Brosur Baru
          </button>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((item, idx) => {
    const no = idx + 1;
    const wil = item.lokasibrosur || item.wilayah || 'Pusat';
    const cat = item.catagory || item.category || 'Umrah';
    const name = item.brosurname || item.name || '-';
    const notes = item.catatan || '-';
    const link = item.link || GDRIVE_BROSUR_FOLDER_URL;

    let rawTglUpload = item.tglupload || '';
    if (!rawTglUpload && item.created_at) rawTglUpload = String(item.created_at).slice(0, 10);
    const tglUploadDisplay = formatDateDdMmmYy(rawTglUpload);
    const validUntilDisplay = formatDateDdMmmYy(item.validuntil);

    let rawStatus = (item.status || 'Aktif').trim();
    const isPastDate = item.validuntil && item.validuntil < todayStr;
    const isExpired = rawStatus.toLowerCase() === 'expired' || isPastDate;
    const statusLabel = isExpired ? 'Expired' : 'Aktif';
    const statusPillClass = isExpired ? 'expired' : 'aktif';
    const statusIcon = isExpired ? 'fa-clock-rotate-left' : 'fa-circle-check';

    const catLower = cat.toLowerCase();
    let badgeClass = 'default';
    if (catLower.includes('umrah')) badgeClass = 'umrah';
    else if (catLower.includes('haji')) badgeClass = 'haji';
    else if (catLower.includes('wisata')) badgeClass = 'wisata';
    else if (catLower.includes('promo')) badgeClass = 'promo';

    const safeId = String(item.id || `LOCAL-${idx}`);

    return `
      <tr>
        <td style="color:#64748b; font-weight:600; text-align:center;">${no}</td>
        <td style="white-space:nowrap; font-size:0.82rem; color:#cbd5e1; font-family:'JetBrains Mono',monospace;">
          <i class="fa-regular fa-calendar" style="color:var(--text-dim); margin-right:4px;"></i>${tglUploadDisplay}
        </td>
        <td style="white-space:nowrap; font-size:0.82rem; font-family:'JetBrains Mono',monospace; ${isPastDate ? 'color:#f87171;' : 'color:#38bdf8;'}">
          <i class="fa-regular fa-calendar-check" style="margin-right:4px;"></i><strong>${validUntilDisplay}</strong>
        </td>
        <td>
          <span style="color:#38bdf8; font-weight:600; font-size:0.82rem; display:inline-flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-location-dot"></i> ${wil}
          </span>
        </td>
        <td>
          <span class="brosur-cat-badge ${badgeClass}">${cat}</span>
        </td>
        <td>
          <a href="${link}" target="_blank" rel="noopener noreferrer" style="color:#ffffff; font-size:0.9rem; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:color 0.2s;" onmouseover="this.style.color='#38bdf8'" onmouseout="this.style.color='#ffffff'" title="Klik untuk membuka berkas brosur">
            <span>${name}</span>
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem; color:#38bdf8;"></i>
          </a>
          ${item.namapaket ? `<div style="font-size:0.78rem; color:#38bdf8; font-weight:600; margin-top:3px; font-family:'JetBrains Mono',monospace;"><i class="fa-solid fa-box-archive" style="font-size:0.72rem; margin-right:4px;"></i>${item.namapaket}</div>` : ''}
        </td>
        <td style="text-align:center;">
          <span class="brosur-status-pill ${statusPillClass}">
            <i class="fa-solid ${statusIcon}"></i> ${statusLabel}
          </span>
        </td>
        <td style="font-size:0.84rem; color:#94a3b8; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${notes}">
          ${notes}
        </td>
        <td style="text-align:center; white-space:nowrap;">
          <button type="button" class="btn-action-icon btn-action-wa" onclick="sendBrosurViaWhatsApp('${safeId}')" title="Send Via WA">
            <i class="fa-brands fa-whatsapp"></i>
          </button>
          <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn-action-icon" title="Buka Berkas">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          ${state.auth.isLoggedIn ? `
            <button type="button" class="btn-action-icon btn-action-edit" onclick="openUpdateStatusModal('${safeId}')" title="Update Status Brosur">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="btn-action-icon btn-action-delete" onclick="deleteBrosurRecord('${safeId}')" title="Hapus Brosur">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : `
            <button type="button" class="btn-action-icon btn-action-edit locked" onclick="requireAdminAuthAction('update', '${safeId}')" title="Ubah Status (Login Admin Diperlukan)">
              <i class="fa-solid fa-lock" style="font-size:0.75rem; color:var(--text-dim);"></i>
            </button>
            <button type="button" class="btn-action-icon btn-action-delete locked" onclick="requireAdminAuthAction('delete', '${safeId}')" title="Hapus (Login Admin Diperlukan)">
              <i class="fa-solid fa-lock" style="font-size:0.75rem; color:var(--text-dim);"></i>
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');

  if (state.brosurViewMode === 'split') {
    renderBrosurSplitView();
  }
}

// View Mode Toggle
window.setBrosurViewMode = function(mode) {
  state.brosurViewMode = mode || 'table';
  try {
    localStorage.setItem('catalog_view_mode', state.brosurViewMode);
  } catch (_) {}

  const btnTable = document.getElementById('btnViewModeTable');
  const btnSplit = document.getElementById('btnViewModeSplit');
  const tableContainer = document.getElementById('brosurTableViewContainer');
  const splitContainer = document.getElementById('brosurSplitViewContainer');

  if (state.brosurViewMode === 'split') {
    btnTable?.classList.remove('active');
    btnSplit?.classList.add('active');
    if (tableContainer) tableContainer.style.display = 'none';
    if (splitContainer) splitContainer.style.display = 'grid';
    renderBrosurSplitView();
  } else {
    btnSplit?.classList.remove('active');
    btnTable?.classList.add('active');
    if (splitContainer) splitContainer.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
    renderBrosurTable();
  }
};

// Split View Listing & Preview (Persis MenuFathIndah)
function renderBrosurSplitView() {
  const cardsContainer = document.getElementById('brosurSplitCardsList');
  if (!cardsContainer) return;

  updateBrosurStats(state.data.logBrosur || []);

  const filtered = getFilteredBrosurList();
  const countEl = document.getElementById('brosurSplitCount');
  if (countEl) countEl.textContent = `${filtered.length} Berkas`;

  if (filtered.length === 0) {
    cardsContainer.innerHTML = `
      <div style="text-align:center; padding:36px 16px; color:#64748b; background:rgba(0,0,0,0.2); border-radius:8px;">
        <i class="fa-regular fa-folder-open" style="font-size:2rem; color:var(--gold-light); margin-bottom:10px; display:block;"></i>
        <div style="font-size:0.86rem; color:#94a3b8;">Tidak ada dokumen brosur yang sesuai filter.</div>
      </div>
    `;
    resetActiveDrivePreviewEmpty();
    return;
  }

  // Tentukan item mana yang aktif untuk preview
  let activeItem = null;
  if (state.activeBrosurId) {
    activeItem = filtered.find(x => String(x.id || '') === String(state.activeBrosurId));
  }
  if (!activeItem) {
    activeItem = filtered[0];
    state.activeBrosurId = String(activeItem.id || 'LOCAL-0');
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  cardsContainer.innerHTML = filtered.map((item, idx) => {
    const safeId = String(item.id || `LOCAL-${idx}`);
    const isActive = String(safeId) === String(state.activeBrosurId);
    const no = idx + 1;
    const wil = item.lokasibrosur || item.wilayah || 'Pusat';
    const cat = item.catagory || item.category || 'Umrah';
    const name = item.brosurname || item.name || '-';
    const notes = item.catatan || '-';
    const link = item.link || GDRIVE_BROSUR_FOLDER_URL;

    let rawTglUpload = item.tglupload || '';
    if (!rawTglUpload && item.created_at) rawTglUpload = String(item.created_at).slice(0, 10);
    const tglUploadDisplay = formatDateDdMmmYy(rawTglUpload);
    const validUntilDisplay = formatDateDdMmmYy(item.validuntil);

    let rawStatus = (item.status || 'Aktif').trim();
    const isPastDate = item.validuntil && item.validuntil < todayStr;
    const isExpired = rawStatus.toLowerCase() === 'expired' || isPastDate;
    const statusLabel = isExpired ? 'Expired' : 'Aktif';
    const statusPillClass = isExpired ? 'expired' : 'aktif';
    const statusIcon = isExpired ? 'fa-clock-rotate-left' : 'fa-circle-check';

    const catLower = cat.toLowerCase();
    let badgeClass = 'default';
    if (catLower.includes('umrah')) badgeClass = 'umrah';
    else if (catLower.includes('haji')) badgeClass = 'haji';
    else if (catLower.includes('wisata')) badgeClass = 'wisata';
    else if (catLower.includes('promo')) badgeClass = 'promo';

    return `
      <div class="brosur-doc-card ${isActive ? 'active' : ''}" id="docCard-${safeId}" onclick="selectBrosurForPreview('${safeId}')">
        <div class="brosur-doc-card-top">
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="brosur-doc-card-no">#${no}</span>
            <span class="brosur-cat-badge ${badgeClass}">${cat}</span>
          </div>
          <span class="brosur-status-pill ${statusPillClass}" style="font-size:0.68rem; padding:2px 8px;">
            <i class="fa-solid ${statusIcon}"></i> ${statusLabel}
          </span>
        </div>

        <div class="brosur-doc-card-title">
          <i class="fa-solid fa-file-pdf" style="color:${isActive ? 'var(--gold-light)' : '#38bdf8'}; font-size:0.88rem;"></i>
          <span>${name}</span>
        </div>

        ${item.namapaket ? `
          <div class="brosur-doc-card-paket">
            <i class="fa-solid fa-box-archive" style="font-size:0.75rem;"></i>
            <span>${item.namapaket}</span>
          </div>
        ` : ''}

        <div class="brosur-doc-card-meta">
          <div class="brosur-doc-card-meta-item" title="Wilayah: ${wil}">
            <i class="fa-solid fa-location-dot" style="color:#38bdf8;"></i>
            <span>${wil}</span>
          </div>
          <div class="brosur-doc-card-meta-item" title="Valid Until: ${validUntilDisplay}">
            <i class="fa-regular fa-calendar-check" style="${isPastDate ? 'color:#f87171;' : 'color:#34d399;'}"></i>
            <span style="${isPastDate ? 'color:#f87171;' : ''}">${validUntilDisplay}</span>
          </div>
          <div class="brosur-doc-card-meta-item" title="Tanggal Upload: ${tglUploadDisplay}">
            <i class="fa-regular fa-calendar" style="color:var(--text-dim);"></i>
            <span>${tglUploadDisplay}</span>
          </div>
          <div class="brosur-doc-card-meta-item" title="Tautan Google Drive">
            <i class="fa-brands fa-google-drive" style="color:#f59e0b;"></i>
            <span>Google Drive</span>
          </div>
        </div>

        ${notes && notes !== '-' ? `
          <div class="brosur-doc-card-notes" title="${notes}">
            <i class="fa-regular fa-note-sticky" style="margin-right:4px;"></i>${notes}
          </div>
        ` : ''}

        <div class="brosur-doc-card-footer" onclick="event.stopPropagation()">
          <button type="button" class="brosur-btn-view-indicator" onclick="selectBrosurForPreview('${safeId}')">
            <i class="fa-solid ${isActive ? 'fa-eye' : 'fa-arrow-right'}"></i>
            <span>${isActive ? 'Sedang Dilihat' : 'Lihat Dokumen'}</span>
          </button>
          
          <div style="display:flex; align-items:center; gap:5px;">
            <button type="button" class="btn-action-icon btn-action-wa" onclick="sendBrosurViaWhatsApp('${safeId}')" title="Send Via WA">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn-action-icon" title="Buka di Tab Baru">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            ${state.auth.isLoggedIn ? `
              <button type="button" class="btn-action-icon btn-action-edit" onclick="openUpdateStatusModal('${safeId}')" title="Update Status">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button type="button" class="btn-action-icon btn-action-delete" onclick="deleteBrosurRecord('${safeId}')" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            ` : `
              <button type="button" class="btn-action-icon btn-action-edit locked" onclick="requireAdminAuthAction('update', '${safeId}')" title="Update Status (Login Admin Diperlukan)">
                <i class="fa-solid fa-lock" style="font-size:0.75rem; color:var(--text-dim);"></i>
              </button>
              <button type="button" class="btn-action-icon btn-action-delete locked" onclick="requireAdminAuthAction('delete', '${safeId}')" title="Hapus (Login Admin Diperlukan)">
                <i class="fa-solid fa-lock" style="font-size:0.75rem; color:var(--text-dim);"></i>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (activeItem) {
    selectBrosurForPreview(String(activeItem.id || 'LOCAL-0'));
  }
}

function getGDriveEmbedUrl(url) {
  if (!url) return 'about:blank';
  url = url.trim();

  // If local file or image URL
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    return url;
  }

  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1] && !url.includes('/folders/')) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`;
  }

  return url;
}

window.scrollToBrosurList = function() {
  const leftPane = document.getElementById('brosurSplitLeft');
  if (leftPane) {
    leftPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.selectBrosurForPreview = function(safeId) {
  state.activeBrosurId = safeId;

  // Pastikan langsung menampilkan sub-tab "Tampilan Dokumen Drive"
  if (typeof switchPreviewSubTab === 'function') {
    switchPreviewSubTab('doc');
  }

  document.querySelectorAll('.brosur-doc-card').forEach(el => el.classList.remove('active'));
  const card = document.getElementById(`docCard-${safeId}`);
  if (card) card.classList.add('active');

  // Auto-scroll ke panel preview pada perangkat mobile / layar kecil
  if (window.innerWidth < 960) {
    const previewPane = document.getElementById('brosurSplitRight');
    if (previewPane) {
      setTimeout(() => {
        previewPane.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  const list = state.data.logBrosur || [];
  let item = list.find(x => String(x.id || '') === String(safeId));
  if (!item && safeId && safeId.startsWith('LOCAL-')) {
    const idx = parseInt(safeId.replace('LOCAL-', ''), 10);
    if (!isNaN(idx) && list[idx]) item = list[idx];
  }

  if (!item) return;

  const wil = item.lokasibrosur || item.wilayah || 'Pusat';
  const cat = item.catagory || item.category || 'Umum';
  const name = item.brosurname || item.name || 'Dokumen Brosur';
  const link = item.link || GDRIVE_BROSUR_FOLDER_URL;
  const paket = item.namapaket || '';
  const validUntilDisplay = formatDateDdMmmYy(item.validuntil);
  const notes = item.catatan || '-';

  // Update header panel kanan
  const titleEl = document.getElementById('brosurPreviewTitle');
  const badgeEl = document.getElementById('brosurPreviewBadge');
  const metaEl = document.getElementById('brosurPreviewMeta');
  const openExternalBtn = document.getElementById('btnPreviewOpenExternal');
  const fallbackLink = document.getElementById('brosurIframeDirectFallback');

  if (titleEl) titleEl.textContent = name;
  if (badgeEl) badgeEl.innerHTML = `${cat.toUpperCase()} &bull; ${wil.toUpperCase()}`;
  if (metaEl) {
    metaEl.innerHTML = `${paket ? `<span style="color:#38bdf8; font-family:'JetBrains Mono',monospace; margin-right:8px;">${paket}</span>` : ''}<span>Masa Berlaku: ${validUntilDisplay}</span>`;
  }
  if (openExternalBtn) openExternalBtn.href = link;
  if (fallbackLink) fallbackLink.href = link;

  // Iframe update
  const iframe = document.getElementById('brosurPreviewIframe');
  const loader = document.getElementById('brosurIframeLoader');
  const embedUrl = getGDriveEmbedUrl(link);

  if (iframe) {
    if (loader) {
      loader.style.opacity = '1';
      loader.style.display = 'flex';
    }

    const isImage = link.match(/\.(jpg|jpeg|png|webp|gif|svg)($|\?)/i) || link.startsWith('/uploads/');
    if (isImage) {
      iframe.removeAttribute('src');
      iframe.srcdoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { width:100%; height:100%; min-height:100%; background:#060a14; display:flex; align-items:center; justify-content:center; overflow:auto; padding:12px; }
    img { max-width:100%; max-height:100%; object-fit:contain; border-radius:4px; box-shadow:0 8px 30px rgba(0,0,0,0.7); }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.2); border-radius:3px; }
  </style>
</head>
<body>
  <img src="${link}" alt="Preview Brosur">
</body>
</html>`;
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; }, 180);
        }
      }, 150);
    } else {
      iframe.removeAttribute('srcdoc');
      iframe.onload = function() {
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; }, 200);
        }
      };
      iframe.src = embedUrl;
    }
  }

  // Update Detail Pane content
  const detailBody = document.getElementById('brosurDetailBody');
  if (detailBody) {
    let rawTglUpload = item.tglupload || '';
    if (!rawTglUpload && item.created_at) rawTglUpload = String(item.created_at).slice(0, 10);
    const tglUploadDisplay = formatDateDdMmmYy(rawTglUpload);

    let rawStatus = (item.status || 'Aktif').trim();
    const todayStr = new Date().toISOString().slice(0, 10);
    const isPastDate = item.validuntil && item.validuntil < todayStr;
    const isExpired = rawStatus.toLowerCase() === 'expired' || isPastDate;
    const statusLabel = isExpired ? 'Expired' : 'Aktif';
    const statusPillClass = isExpired ? 'expired' : 'aktif';

    detailBody.innerHTML = `
      <div style="margin-bottom:18px;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
          <h3 style="font-size:1.15rem; font-weight:800; color:#ffffff; margin:0;">${name}</h3>
          <span class="brosur-status-pill ${statusPillClass}">${statusLabel}</span>
        </div>
        ${paket ? `<div style="color:#38bdf8; font-family:'JetBrains Mono',monospace; font-size:0.86rem; font-weight:600;"><i class="fa-solid fa-box-archive" style="margin-right:5px;"></i>${paket}</div>` : ''}
      </div>

      <div class="brosur-detail-grid">
        <div class="brosur-detail-box">
          <label>Wilayah / Kantor</label>
          <div class="val" style="color:#38bdf8;"><i class="fa-solid fa-location-dot" style="margin-right:5px;"></i>${wil}</div>
        </div>
        <div class="brosur-detail-box">
          <label>Kategori Paket</label>
          <div class="val" style="color:var(--gold-light);"><i class="fa-solid fa-tags" style="margin-right:5px;"></i>${cat}</div>
        </div>
        <div class="brosur-detail-box">
          <label>Tanggal Upload</label>
          <div class="val" style="font-family:'JetBrains Mono',monospace;"><i class="fa-regular fa-calendar" style="margin-right:5px;"></i>${tglUploadDisplay}</div>
        </div>
        <div class="brosur-detail-box">
          <label>Masa Berlaku (Valid Until)</label>
          <div class="val" style="font-family:'JetBrains Mono',monospace; ${isPastDate ? 'color:#f87171;' : 'color:#34d399;'}"><i class="fa-regular fa-calendar-check" style="margin-right:5px;"></i>${validUntilDisplay}</div>
        </div>
      </div>

      <div class="brosur-detail-box" style="margin-bottom:18px;">
        <label>Catatan & Keterangan Brosur</label>
        <div class="val" style="font-size:0.84rem; line-height:1.5; color:#cbd5e1; font-weight:normal;">${notes}</div>
      </div>

      <div class="brosur-detail-box" style="margin-bottom:20px;">
        <label>Tautan Berkas Google Drive</label>
        <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
          <input type="text" readonly value="${link}" style="flex:1; background:rgba(0,0,0,0.3); border:1px solid var(--border-subtle); color:#38bdf8; padding:8px 12px; border-radius:4px; font-size:0.8rem; font-family:'JetBrains Mono',monospace;">
          <button type="button" class="btn-preview-tool" onclick="copyActiveDriveLink()" title="Salin Tautan">
            <i class="fa-solid fa-link"></i>
          </button>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding-top:14px; border-top:1px solid rgba(255,255,255,0.06);">
        <button type="button" class="btn-add-brosur-shortcut" style="margin-left:0; background:#22c55e; color:#ffffff;" onclick="sendBrosurViaWhatsApp('${safeId}')">
          <i class="fa-brands fa-whatsapp" style="font-size:1.1rem;"></i>
          <span>Kirim Via WhatsApp</span>
        </button>
        <a href="${link}" target="_blank" rel="noopener noreferrer" class="btn-refresh-brosur" style="text-decoration:none; color:var(--text-main);">
          <i class="fa-brands fa-google-drive" style="color:#f59e0b;"></i>
          <span>Buka di Google Drive</span>
        </a>
        ${state.auth.isLoggedIn ? `
          <button type="button" class="btn-refresh-brosur" onclick="openUpdateStatusModal('${safeId}')">
            <i class="fa-solid fa-pen-to-square" style="color:#38bdf8;"></i>
            <span>Ubah Status</span>
          </button>
        ` : `
          <button type="button" class="btn-refresh-brosur" onclick="requireAdminAuthAction('update', '${safeId}')" title="Login Admin Diperlukan">
            <i class="fa-solid fa-lock" style="color:var(--gold-light);"></i>
            <span>Ubah Status (Admin)</span>
          </button>
        `}
      </div>
    `;
  }
};

window.switchPreviewSubTab = function(subTab) {
  const btnDoc = document.getElementById('btnPrevTabDoc');
  const btnDetail = document.getElementById('btnPrevTabDetail');
  const paneDoc = document.getElementById('panePrevTabDoc');
  const paneDetail = document.getElementById('panePrevTabDetail');

  if (subTab === 'detail') {
    btnDoc?.classList.remove('active');
    btnDetail?.classList.add('active');
    paneDoc?.classList.remove('active');
    paneDetail?.classList.add('active');
  } else {
    btnDetail?.classList.remove('active');
    btnDoc?.classList.add('active');
    paneDetail?.classList.remove('active');
    paneDoc?.classList.add('active');
  }
};

window.reloadActiveDrivePreview = function() {
  if (state.activeBrosurId) {
    selectBrosurForPreview(state.activeBrosurId);
  } else {
    const iframe = document.getElementById('brosurPreviewIframe');
    const loader = document.getElementById('brosurIframeLoader');
    if (iframe && iframe.src && iframe.src !== 'about:blank') {
      if (loader) {
        loader.style.opacity = '1';
        loader.style.display = 'flex';
      }
      const currentSrc = iframe.src;
      iframe.src = 'about:blank';
      setTimeout(() => { iframe.src = currentSrc; }, 100);
    }
  }
};

window.copyActiveDriveLink = function() {
  const linkEl = document.getElementById('btnPreviewOpenExternal');
  const link = linkEl?.href;
  if (link && link !== '#' && !link.endsWith('#')) {
    navigator.clipboard.writeText(link).then(() => {
      showToast('Tautan Google Drive berhasil disalin ke clipboard!');
    }).catch(() => {
      prompt('Salin tautan Google Drive:', link);
    });
  } else {
    alert('Pilih dokumen terlebih dahulu.');
  }
};

function resetActiveDrivePreviewEmpty() {
  const titleEl = document.getElementById('brosurPreviewTitle');
  const badgeEl = document.getElementById('brosurPreviewBadge');
  const metaEl = document.getElementById('brosurPreviewMeta');
  const iframe = document.getElementById('brosurPreviewIframe');
  const loader = document.getElementById('brosurIframeLoader');
  if (titleEl) titleEl.textContent = 'Tidak Ada Dokumen';
  if (badgeEl) badgeEl.textContent = 'GOOGLE DRIVE VIEWER';
  if (metaEl) metaEl.textContent = 'Sesuaikan pencarian atau filter di atas';
  if (loader) loader.style.display = 'none';
  if (iframe) iframe.src = 'about:blank';
}

// WhatsApp Share
window.sendBrosurViaWhatsApp = function(id) {
  const list = state.data.logBrosur || [];
  let item = list.find(x => String(x.id) === String(id));
  if (!item && id && id.startsWith('LOCAL-')) {
    const idx = parseInt(id.replace('LOCAL-', ''), 10);
    if (!isNaN(idx) && list[idx]) item = list[idx];
  }
  if (!item) {
    alert('Data brosur tidak ditemukan.');
    return;
  }

  const name = item.brosurname || item.name || 'Brosur Paket';
  const wil = item.lokasibrosur || item.wilayah || 'Pusat';
  const cat = item.catagory || item.category || 'Umum';
  const validUntilDisplay = formatDateDdMmmYy(item.validuntil);
  const link = item.link || GDRIVE_BROSUR_FOLDER_URL;
  const notes = (item.catatan || '').trim();
  const paket = (item.namapaket || '').trim();

  const fullLink = link.startsWith('/') ? `${window.location.origin}${link}` : link;

  const lines = [
    `*KATALOG BROSUR PT. FATH INDAH TRAVEL SERVICE*`,
    `----------------------------------------------------`,
    `📌 *Nama Brosur:* ${name}`,
    paket ? `📦 *Rincian Paket:* ${paket}` : null,
    `📍 *Wilayah:* ${wil}`,
    `🏷️ *Kategori:* ${cat}`,
    validUntilDisplay && validUntilDisplay !== '-' ? `📅 *Masa Berlaku:* s/d ${validUntilDisplay}` : null,
    notes ? `📝 *Keterangan:* ${notes}` : null,
    `----------------------------------------------------`,
    `📥 *Unduh / Buka Berkas Brosur:*`,
    `${fullLink}`,
    `----------------------------------------------------`,
    `_PT. Fath Indah Travel Service - Umrah & Hajj Service_`
  ].filter(Boolean).join('\n');

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(lines)}`;
  window.open(waUrl, '_blank');
};

// Update Status Modal
window.openUpdateStatusModal = function(id) {
  const modal = document.getElementById('updateStatusModal');
  if (!modal) return;

  const list = state.data.logBrosur || [];
  let item = list.find(x => String(x.id) === String(id));
  if (!item && id && id.startsWith('LOCAL-')) {
    const idx = parseInt(id.replace('LOCAL-', ''), 10);
    if (!isNaN(idx) && list[idx]) item = list[idx];
  }
  if (!item) {
    alert('Data brosur tidak ditemukan.');
    return;
  }

  const idInput = document.getElementById('modalStatusBrosurId');
  const nameEl = document.getElementById('modalStatusBrosurName');
  const wilEl = document.getElementById('modalStatusBrosurWilayah');
  const catEl = document.getElementById('modalStatusBrosurCat');
  const tglUpEl = document.getElementById('modalStatusBrosurTglUpload');
  const validEl = document.getElementById('modalStatusBrosurValidUntil');
  const linkEl = document.getElementById('modalStatusBrosurLink');
  const selectEl = document.getElementById('modalStatusSelect');

  if (idInput) idInput.value = item.id;
  if (nameEl) nameEl.textContent = item.brosurname || item.name || '-';
  if (wilEl) wilEl.textContent = item.lokasibrosur || item.wilayah || 'Pusat';
  if (catEl) catEl.textContent = item.catagory || item.category || '-';
  if (tglUpEl) tglUpEl.textContent = item.tglupload || (item.created_at ? String(item.created_at).slice(0, 10) : '-');
  if (validEl) validEl.textContent = item.validuntil || '-';
  if (linkEl) {
    linkEl.href = item.link || GDRIVE_BROSUR_FOLDER_URL;
  }

  if (selectEl) {
    const curStatus = (item.status || 'Aktif').trim();
    selectEl.value = curStatus.toLowerCase() === 'expired' ? 'Expired' : 'Aktif';
  }

  modal.style.display = 'flex';
};

window.closeUpdateStatusModal = function() {
  const modal = document.getElementById('updateStatusModal');
  if (modal) modal.style.display = 'none';
};

window.saveBrochureStatus = async function() {
  const id = document.getElementById('modalStatusBrosurId')?.value;
  const selectEl = document.getElementById('modalStatusSelect');
  const newStatus = selectEl ? selectEl.value : 'Aktif';

  if (!id) return;

  if (!state.auth.isLoggedIn) {
    closeUpdateStatusModal();
    openLoginModal({ type: 'update', id });
    return;
  }

  const btnSave = document.getElementById('btnSaveStatusChange');
  if (btnSave) {
    btnSave.disabled = true;
    btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
  }

  try {
    await fetch(`${SUPABASE_CONFIG.url}/rest/v1/LogBrosur?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (_) {}

  try {
    const res = await fetch(`/api/brosur/log/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.auth.token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Status brosur berhasil diubah menjadi: "${newStatus}"!`);
    } else {
      showToast(json.message || 'Gagal mengubah status', 'error');
    }
  } catch (_) {
    if (state.data.logBrosur) {
      const item = state.data.logBrosur.find(x => String(x.id) === String(id));
      if (item) item.status = newStatus;
      localStorage.setItem('catalog_log_brosur', JSON.stringify(state.data.logBrosur));
    }
    showToast(`Status brosur diubah menjadi: "${newStatus}"!`);
  }

  if (btnSave) {
    btnSave.disabled = false;
    btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan Status';
  }

  closeUpdateStatusModal();
  await loadBrosurData();
};

// Delete Record
window.deleteBrosurRecord = async function(id) {
  if (!state.auth.isLoggedIn) {
    openLoginModal({ type: 'delete', id });
    return;
  }

  const list = state.data.logBrosur || [];
  let item = list.find(x => String(x.id) === String(id));
  if (!item && id && id.startsWith('LOCAL-')) {
    const idx = parseInt(id.replace('LOCAL-', ''), 10);
    if (!isNaN(idx) && list[idx]) item = list[idx];
  }
  const brosurName = item ? (item.brosurname || item.name) : 'brosur';

  const confirmDelete = confirm(`Apakah Anda yakin ingin menghapus brosur "${brosurName}" dari daftar katalog?`);
  if (!confirmDelete) return;

  try {
    await fetch(`${SUPABASE_CONFIG.url}/rest/v1/LogBrosur?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      }
    });
  } catch (_) {}

  try {
    const res = await fetch(`/api/brosur/log/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.auth.token}`
      }
    });
    const json = await res.json();
    if (!json.success && json.message) {
      showToast(json.message, 'error');
      return;
    }
  } catch (_) {}

  state.data.logBrosur = list.filter(x => String(x.id) !== String(id));
  localStorage.setItem('catalog_log_brosur', JSON.stringify(state.data.logBrosur));

  showToast(`Brosur "${brosurName}" berhasil dihapus.`);
  renderBrosurTable();
};

// Filter Changes
window.onBrosurFilterChange = function() {
  const searchInput = document.getElementById('brosurSearchInput');
  const catSelect = document.getElementById('brosurCategoryFilter');
  const wilSelect = document.getElementById('brosurWilayahFilter');
  const statusSelect = document.getElementById('brosurStatusFilter');

  if (searchInput) state.brosurFilter.search = searchInput.value.trim();
  if (catSelect) state.brosurFilter.category = catSelect.value;
  if (wilSelect) state.brosurFilter.wilayah = wilSelect.value;
  if (statusSelect) state.brosurFilter.status = statusSelect.value;

  renderBrosurTable();
};

window.reloadBrosurData = async function() {
  const tbody = document.getElementById('logBrosurTableBody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:38px; color:#64748b;">
          <i class="fa-solid fa-spinner fa-spin" style="color:var(--gold-light); font-size:1.8rem; margin-bottom:10px; display:block;"></i>
          <div>Memperbarui data katalog brosur...</div>
        </td>
      </tr>
    `;
  }
  await checkServerStatus();
  await loadBrosurData(true);
  showToast('Data brosur berhasil disegarkan!');
};
