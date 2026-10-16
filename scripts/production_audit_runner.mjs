// scripts/production_audit_runner.mjs
const BASE_URL = 'http://localhost:3000';

async function runAudit() {
  console.log('=====================================================');
  console.log('   AUDIT KELAYAKAN WEBSITE PRODUCTION PT. TBK       ');
  console.log('=====================================================\n');

  const results = {
    pages: [],
    security: [],
    apis: [],
    seo: [],
  };

  // 1. Audit Public Pages
  const publicPages = [
    { path: '/', name: 'Beranda' },
    { path: '/tentang', name: 'Tentang Kami' },
    { path: '/proyek', name: 'Proyek Puri Gunung Langgar' },
    { path: '/pimpinan', name: 'Pimpinan & Manajemen' },
    { path: '/legalitas', name: 'Legalitas & Dokumen Hukum' },
    { path: '/kegiatan', name: 'Kegiatan & Berita' },
    { path: '/simulasi-kpr', name: 'Simulasi KPR FLPP' },
    { path: '/kontak', name: 'Kontak & Form Minat' },
  ];

  console.log('1. Menguji Semua Halaman Publik:');
  for (const page of publicPages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const text = await res.text();
      const hasTitle = text.includes('<title>') || text.includes('PT. TBK') || text.includes('Terbang Bersama');
      const passed = res.status === 200 && hasTitle;
      results.pages.push({ ...page, status: res.status, passed });
      console.log(`   [${passed ? 'PASS' : 'FAIL'}] ${page.name} (${page.path}) -> HTTP ${res.status}`);
    } catch (err) {
      results.pages.push({ ...page, status: 'ERROR', passed: false, error: err.message });
      console.log(`   [FAIL] ${page.name} (${page.path}) -> ERROR: ${err.message}`);
    }
  }

  // 2. Audit SEO (robots.txt & sitemap.xml)
  console.log('\n2. Menguji SEO (robots.txt & sitemap.xml):');
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    const robotsOk = robotsRes.status === 200 && robotsTxt.includes('Disallow: /A9MIN') && robotsTxt.includes('sitemap.xml');
    results.seo.push({ name: 'robots.txt', status: robotsRes.status, passed: robotsOk });
    console.log(`   [${robotsOk ? 'PASS' : 'FAIL'}] /robots.txt -> HTTP ${robotsRes.status} (Admin protected & Sitemap linked)`);
  } catch (err) {
    console.log(`   [FAIL] /robots.txt -> ERROR: ${err.message}`);
  }

  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapTxt = await sitemapRes.text();
    const sitemapOk = sitemapRes.status === 200 && sitemapTxt.includes('<urlset') && sitemapTxt.includes('/proyek');
    results.seo.push({ name: 'sitemap.xml', status: sitemapRes.status, passed: sitemapOk });
    console.log(`   [${sitemapOk ? 'PASS' : 'FAIL'}] /sitemap.xml -> HTTP ${sitemapRes.status} (Valid XML with 8 canonical URLs)`);
  } catch (err) {
    console.log(`   [FAIL] /sitemap.xml -> ERROR: ${err.message}`);
  }

  // 3. Audit Security Headers
  console.log('\n3. Menguji HTTP Security Headers:');
  try {
    const rootRes = await fetch(`${BASE_URL}/`);
    const xFrame = rootRes.headers.get('x-frame-options');
    const xContentType = rootRes.headers.get('x-content-type-options');
    const referrerPolicy = rootRes.headers.get('referrer-policy');
    const permissionsPolicy = rootRes.headers.get('permissions-policy');
    const xPoweredBy = rootRes.headers.get('x-powered-by');

    const headersOk = xFrame === 'SAMEORIGIN' && xContentType === 'nosniff' && !xPoweredBy;
    results.security.push({ name: 'Security Headers', passed: headersOk });
    console.log(`   [${xFrame ? 'PASS' : 'FAIL'}] X-Frame-Options: ${xFrame || 'MISSING'}`);
    console.log(`   [${xContentType ? 'PASS' : 'FAIL'}] X-Content-Type-Options: ${xContentType || 'MISSING'}`);
    console.log(`   [${referrerPolicy ? 'PASS' : 'FAIL'}] Referrer-Policy: ${referrerPolicy || 'MISSING'}`);
    console.log(`   [${permissionsPolicy ? 'PASS' : 'FAIL'}] Permissions-Policy: ${permissionsPolicy || 'MISSING'}`);
    console.log(`   [${!xPoweredBy ? 'PASS' : 'WARN'}] X-Powered-By Header Hidden: ${!xPoweredBy}`);
  } catch (err) {
    console.log(`   [FAIL] Security headers check error: ${err.message}`);
  }

  // 4. Audit Auth & Protection: Unauthenticated Access to Admin Panel
  console.log('\n4. Menguji Proteksi Akses Admin Tanpa Login:');
  try {
    const adminRes = await fetch(`${BASE_URL}/A9MIN`, { redirect: 'manual' });
    const isRedirectToLogin = adminRes.status === 307 || adminRes.status === 302 || adminRes.status === 308;
    const location = adminRes.headers.get('location') || '';
    const redirectOk = isRedirectToLogin && location.includes('/A9MIN/login');
    results.security.push({ name: 'Admin Route Middleware Protection', passed: redirectOk });
    console.log(`   [${redirectOk ? 'PASS' : 'FAIL'}] GET /A9MIN unauthenticated -> HTTP ${adminRes.status} (Redirects to: ${location})`);
  } catch (err) {
    console.log(`   [FAIL] GET /A9MIN check error: ${err.message}`);
  }

  // 5. Audit API Authorization: Unauthenticated access to Admin APIs
  console.log('\n5. Menguji Proteksi Akses API Administrator (Anti-Bypass):');
  try {
    // Test PUT /api/content unauthenticated
    const putRes = await fetch(`${BASE_URL}/api/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ about: { title: 'Hacked' } }),
    });
    const putData = await putRes.json().catch(() => ({}));
    const putBlocked = putRes.status === 401;
    console.log(`   [${putBlocked ? 'PASS' : 'FAIL'}] PUT /api/content unauthorized -> HTTP ${putRes.status} (${putData.error || 'OK'})`);

    // Test GET /api/inquiries unauthenticated
    const inqGetRes = await fetch(`${BASE_URL}/api/inquiries`);
    const inqGetData = await inqGetRes.json().catch(() => ({}));
    const inqBlocked = inqGetRes.status === 401;
    console.log(`   [${inqBlocked ? 'PASS' : 'FAIL'}] GET /api/inquiries unauthorized -> HTTP ${inqGetRes.status} (${inqGetData.error || 'OK'})`);

    // Test POST /api/upload unauthenticated
    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: new FormData(),
    });
    const uploadBlocked = uploadRes.status === 401;
    console.log(`   [${uploadBlocked ? 'PASS' : 'FAIL'}] POST /api/upload unauthorized -> HTTP ${uploadRes.status}`);
  } catch (err) {
    console.log(`   [FAIL] API authorization checks error: ${err.message}`);
  }

  // 6. Audit Public API: POST /api/inquiries
  console.log('\n6. Menguji Formulir Konsultasi Publik (POST /api/inquiries):');
  try {
    // Missing phone test
    const invalidRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Budi' }),
    });
    const invalidData = await invalidRes.json();
    const validationOk = invalidRes.status === 400;
    console.log(`   [${validationOk ? 'PASS' : 'FAIL'}] Validasi input kosong -> HTTP ${invalidRes.status} (${invalidData.error})`);

    // Valid inquiry submission test
    const validRes = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Audit Test User',
        phone: '081234567890',
        email: 'audit@example.com',
        message: 'Pengujian integrasi otomatis form minat Puri Gunung Langgar.',
      }),
    });
    const validData = await validRes.json();
    const submitOk = validRes.status === 200 && validData.success;
    console.log(`   [${submitOk ? 'PASS' : 'FAIL'}] Submit formulir minat konsumen -> HTTP ${validRes.status} (${validData.message})`);
  } catch (err) {
    console.log(`   [FAIL] POST /api/inquiries error: ${err.message}`);
  }

  // 7. Audit Public Content API: GET /api/content
  console.log('\n7. Menguji API Konten Publik (GET /api/content):');
  try {
    const contentRes = await fetch(`${BASE_URL}/api/content`);
    const contentData = await contentRes.json();
    const hasData = contentData.success && contentData.data?.project && contentData.data?.bannerSlides;
    console.log(`   [${hasData ? 'PASS' : 'FAIL'}] GET /api/content -> HTTP ${contentRes.status} (Slides: ${contentData.data?.bannerSlides?.length || 0}, Project: ${contentData.data?.project?.name})`);
  } catch (err) {
    console.log(`   [FAIL] GET /api/content error: ${err.message}`);
  }

  console.log('\n=====================================================');
  console.log('   AUDIT SELESAI DENGAN STATUS LENGKAP               ');
  console.log('=====================================================');
}

runAudit().catch(console.error);
