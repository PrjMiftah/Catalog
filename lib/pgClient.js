const https = require('https');

class PhpPgAdminClient {
  constructor(options = {}) {
    this.baseUrl = (options.baseUrl || 'https://findme.fathindah.id/phppgadmin').replace(/\/+$/, '');
    this.server = options.server || 'localhost:5432:allow';
    this.database = options.database || 'c1_dbfindme';
    this.username = options.username || 'c1_findme';
    this.password = options.password || '@bb6MqxHuDDL';
    this.cookie = null;
  }

  async ensureLogin() {
    if (this.cookie) return this.cookie;

    const init = await fetch(`${this.baseUrl}/index.php`);
    const setCookie = init.headers.get('set-cookie');
    if (!setCookie) throw new Error('Gagal mendapatkan session cookie dari phpPgAdmin');
    this.cookie = setCookie.split(';')[0];

    const formPage = await fetch(`${this.baseUrl}/redirect.php?subject=server&server=${encodeURIComponent(this.server)}`, {
      headers: { 'Cookie': this.cookie }
    });
    const html = await formPage.text();
    const pwMatch = html.match(/name="(loginPassword_[^"]+)"/);
    if (!pwMatch) throw new Error('Gagal menemukan input password di halaman login phpPgAdmin');
    const pwFieldName = pwMatch[1];

    const body = new URLSearchParams({
      subject: 'server',
      server: this.server,
      loginServer: this.server,
      loginUsername: this.username,
      [pwFieldName]: this.password,
      loginSubmit: 'Login'
    });

    const loginRes = await fetch(`${this.baseUrl}/redirect.php`, {
      method: 'POST',
      headers: {
        'Cookie': this.cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const loginHtml = await loginRes.text();
    if (loginHtml.includes('Login failed')) {
      throw new Error('Otentikasi phpPgAdmin Gagal: Username atau password salah');
    }

    return this.cookie;
  }

  async query(sql) {
    await this.ensureLogin();

    const body = new URLSearchParams({
      query: sql,
      server: this.server,
      database: this.database,
      execute: 'Execute'
    });

    const res = await fetch(`${this.baseUrl}/sql.php`, {
      method: 'POST',
      headers: {
        'Cookie': this.cookie,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    if (!res.ok) {
      throw new Error(`HTTP Error dari phpPgAdmin: ${res.status}`);
    }

    const html = await res.text();

    if (html.includes('class="error"') || html.includes('SQL error:')) {
      const errMatch = html.match(/<pre class="error"[^>]*>([\s\S]*?)<\/pre>/i) || html.match(/<table class="error"[^>]*>([\s\S]*?)<\/table>/i);
      const errMsg = errMatch ? errMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'SQL Execution Error';
      throw new Error(errMsg);
    }

    const rows = [];
    const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/gi)];
    for (const t of tables) {
      const tableHtml = t[0];
      if (tableHtml.includes('<th class="data"') || tableHtml.includes('class="data1"')) {
        const ths = [...tableHtml.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
        const trs = [...tableHtml.matchAll(/<tr class="data\d*"[^>]*>([\s\S]*?)<\/tr>/gi)];
        
        for (const tr of trs) {
          const tds = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
          if (tds.length === ths.length && ths.length > 0) {
            const rowObj = {};
            ths.forEach((col, idx) => {
              rowObj[col] = tds[idx];
            });
            rows.push(rowObj);
          }
        }
      }
    }

    return { rows, count: rows.length };
  }
}

module.exports = { PhpPgAdminClient };

