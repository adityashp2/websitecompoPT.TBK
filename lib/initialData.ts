export interface BannerSlide {
  id: string;
  eyebrow: string;
  headlineFirstLine: string;
  headlineHighlight: string;
  supportingText: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  isSecondaryExternal?: boolean;
  image: string;
  imageAlt: string;
}

export interface FeatureCard {
  title: string;
  desc: string;
  icon?: string;
}

export interface PurchaseStep {
  step: string;
  title: string;
  desc: string;
  highlight: string;
}

export interface KprSimulationConfig {
  badge: string;
  title: string;
  subtitle: string;
  defaultPrice: number;
  minPrice: number;
  maxPrice: number;
  defaultDp: number;
  minDp: number;
  maxDp: number;
  defaultTenor: number;
  annualInterestRate: number;
  benefits: string[];
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    tagline: string;
    logo?: string;
  };
  bannerSlides?: BannerSlide[];
  hero: {
    badge: string;
    heading: string;
    subheading: string;
    headlineTop?: string;
    headlineBottom?: string;
    bodyText?: string;
    activeBadgeLabel?: string;
    activeBadgeProject?: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    backgroundImage: string;
    stats: Array<{ label: string; value: string }>;
    slides?: Array<{
      image: string;
      caption: string;
    }>;
  };
  about: {
    badge: string;
    title: string;
    description: string;
    visionTitle: string;
    visionText: string;
    missionTitle: string;
    missions: string[];
    commitmentTitle?: string;
    commitmentBody?: string;
    commitmentPoints?: Array<{ title: string; subtitle: string }>;
    officeImage?: string;
    officeCaption?: string;
    homeIntroBadge?: string;
    homeIntroTitle?: string;
    homeIntroHighlight?: string;
    homeIntroText?: string;
    homeIntroCtaText?: string;
    homeIntroCtaLink?: string;
    features?: FeatureCard[];
  };
  leadership: {
    badge: string;
    title: string;
    subtitle: string;
    operationalTitle?: string;
    operationalSubtitle?: string;
    members: Array<{
      name: string;
      role: string;
      roleDescription: string;
      image: string;
      department?: string;
    }>;
  };
  buyingProcess?: {
    badge: string;
    title: string;
    subtitle: string;
    steps: PurchaseStep[];
  };
  kprSimulation?: KprSimulationConfig;
  legal: {
    badge: string;
    title: string;
    subtitle: string;
    aktaNumber: string;
    aktaDate: string;
    notary: string;
    skMenkumham: string;
    skDate: string;
    directorAuthority: string;
    landStatus?: string;
    landStatusDetail?: string;
  };
  activities: {
    badge: string;
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      tag: string;
      videoUrl?: string;
    }>;
  };
  project: {
    badge: string;
    name: string;
    type: string;
    status: string;
    location: string;
    district: string;
    province: string;
    description: string;
    image: string;
    mediaType?: 'photo' | 'video';
    videoUrl?: string;
    slides?: Array<{ image: string; caption?: string }>;
    specs: Array<{ label: string; value: string }>;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    city: string;
    address: string;
    whatsapp: string;
    email: string;
    operatingHours: string;
    mapsEmbedUrl?: string;
    mapsUrl?: string;
  };
  footer: {
    companyName: string;
    shortName: string;
    tagline?: string;
    summary: string;
    copyrightText: string;
  };
}

export const defaultBannerSlides: BannerSlide[] = [
  {
    id: 'slide-puri-gunung-langgar',
    eyebrow: 'Puri Gunung Langgar • Proyek Berjalan',
    headlineFirstLine: 'Hunian bersubsidi yang layak,',
    headlineHighlight: 'dibangun dari Lampung.',
    supportingText:
      'PT. Terbang Bersama Kawan adalah pengembang perumahan di Bandar Lampung. Saat ini kami sedang membangun Puri Gunung Langgar di Tanjung Bintang, Lampung Selatan.',
    primaryCtaText: 'Lihat Proyek',
    primaryCtaHref: '/proyek',
    secondaryCtaText: 'Hubungi Kami',
    secondaryCtaHref: '/kontak',
    isSecondaryExternal: false,
    image: '/assets/hero-marketing.jpg',
    imageAlt: 'Perumahan Puri Gunung Langgar PT. Terbang Bersama Kawan',
  },
  {
    id: 'slide-kpr-flpp',
    eyebrow: 'KPR Bersubsidi FLPP • Bunga Tetap 5%',
    headlineFirstLine: 'Cicilan ringan mulai 1 jutaan,',
    headlineHighlight: 'proses mudah sampai serah kunci.',
    supportingText:
      'Miliki rumah impian subsidi pemerintah dengan bunga tetap 5% hingga 20 tahun, bebas PPN, dan pendampingan berkas lengkap hingga akad kredit.',
    primaryCtaText: 'Simulasi KPR',
    primaryCtaHref: '/simulasi-kpr',
    secondaryCtaText: 'Konsultasi WhatsApp',
    secondaryCtaHref: 'https://wa.me/6281278901234?text=Halo%20PT.%20TBK%2C%20saya%20ingin%20berkonsultasi%20mengenai%20program%20KPR%20FLPP%20Puri%20Gunung%20Langgar.',
    isSecondaryExternal: true,
    image: '/assets/project-workspace.jpg',
    imageAlt: 'Master Plan Kawasan Perumahan Puri Gunung Langgar',
  },
  {
    id: 'slide-legalitas-lokasi',
    eyebrow: 'Legalitas SHM Pasti • Tanjung Bintang',
    headlineFirstLine: 'Kawasan asri terencana dengan,',
    headlineHighlight: 'kepastian hukum nyata.',
    supportingText:
      'Lokasi strategis di Sabah Balau, dekat fasilitas umum, jalan lingkungan paving lebar, jaringan listrik PLN, dan instalasi air bersih siap huni.',
    primaryCtaText: 'Detail Legalitas',
    primaryCtaHref: '/legalitas',
    secondaryCtaText: 'Survei Lokasi',
    secondaryCtaHref: '/kontak',
    isSecondaryExternal: false,
    image: '/assets/service-residential.jpg',
    imageAlt: 'Pekerjaan Pembangunan Fisik Unit Rumah Subsidi',
  },
];

export const initialSiteContent: SiteContent = {
  meta: {
    title: "PT. Terbang Bersama Kawan (PT. TBK) | Pengembang Perumahan Berkualitas & Terpercaya",
    description: "Website resmi PT. Terbang Bersama Kawan (PT. TBK), pengembang perumahan subsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek Puri Gunung Langgar.",
    tagline: "Perusahaan properti yang berkualitas dan terpercaya",
    logo: "/assets/logo-tbk.png",
  },
  bannerSlides: defaultBannerSlides,
  hero: {
    badge: "PENGEMBANG PROPERTI RESMI & TERPERCAYA",
    heading: "Hunian Berkualitas, Aman, Nyaman, dan Terjangkau",
    subheading: "PT. Terbang Bersama Kawan (PT. TBK) berkomitmen menghadirkan perumahan subsidi terbaik dengan standar kepuasan dan legalitas resmi terjamin.",
    headlineTop: "Hunian bersubsidi yang layak,",
    headlineBottom: "dibangun dari Lampung.",
    bodyText: "PT. Terbang Bersama Kawan adalah pengembang perumahan di Bandar Lampung. Saat ini kami sedang membangun Puri Gunung Langgar di Lampung Selatan.",
    activeBadgeLabel: "PROYEK AKTIF",
    activeBadgeProject: "Puri Gunung Langgar",
    primaryCtaText: "Lihat Proyek",
    primaryCtaLink: "/proyek",
    secondaryCtaText: "Hubungi Kami",
    secondaryCtaLink: "/kontak",
    backgroundImage: "/assets/hero-villa.jpg",
    stats: [
      { label: "Domisili Perusahaan", value: "Bandar Lampung" },
      { label: "Pengesahan Kemenkumham", value: "2021" },
      { label: "Proyek Utama", value: "Puri Gunung Langgar" },
      { label: "Kategori Pembangunan", value: "Hunian Bersubsidi" }
    ],
    slides: [
      {
        image: "/assets/service-construction.jpg",
        caption: "Dokumentasi Lapangan: Pekerjaan Cut & Fill Perataan Lahan Kawasan Puri Gunung Langgar."
      },
      {
        image: "/assets/service-residential.jpg",
        caption: "Dokumentasi Lapangan: Pengukuran Batas Kavling & Persiapan Struktur Bangunan."
      },
      {
        image: "/assets/service-interior.jpg",
        caption: "Dokumentasi Lapangan: Pekerjaan Pondasi Batu Belah & Penegakan Struktur Dinding."
      },
      {
        image: "/assets/project-coastal.jpg",
        caption: "Dokumentasi Lapangan: Pembangunan Saluran Drainase & Akses Jalan Kawasan."
      },
      {
        image: "/assets/project-workspace.jpg",
        caption: "Ilustrasi Perencanaan: Konsep Tata Ruang Terpadu & Kawasan Hunian Modern."
      },
      {
        image: "/assets/hero-villa.jpg",
        caption: "Visualisasi Arsitektural: Konsep Desain & Standar Mutu Hunian PT. TBK."
      }
    ],
  },
  about: {
    badge: "TENTANG PERUSAHAAN",
    title: "Membangun dengan Komitmen & Legalitas Nyata",
    description: "PT. Terbang Bersama Kawan (PT. TBK) adalah perusahaan pengembang properti dan real estat yang berbasis di Bandar Lampung. Didirikan secara sah dengan Akta Notaris No. 10 tanggal 18 Maret 2021 dan disahkan oleh Kementerian Hukum dan HAM RI pada 19 Maret 2021.",
    visionTitle: "Visi Perusahaan",
    visionText: "Perusahaan properti yang berkualitas dan terpercaya.",
    missionTitle: "Misi Perusahaan",
    missions: [
      "Memberikan pelayanan yang terbaik bagi konsumen",
      "Memberikan hunian yang berkualitas bagi konsumen",
      "Menyediakan hunian yang aman, nyaman, dan terjangkau",
      "Menjadi pengembang yang mampu menjaga kepuasan konsumen"
    ],
    commitmentTitle: "Komitmen Utama Perseroan",
    commitmentBody: "Sebagai pengembang properti resmi di Provinsi Lampung, PT. Terbang Bersama Kawan mengutamakan kepastian hukum, keterbukaan informasi, dan mutu konstruksi terbaik agar masyarakat berpenghasilan rendah hingga menengah dapat memiliki rumah impian dengan rasa tenang.",
    commitmentPoints: [
      { title: "Legalitas 100% Sah", subtitle: "Terdaftar Kemenkumham & Notaris resmi" },
      { title: "Kualitas Konstruksi", subtitle: "Standar mutu teknis perumahan layak" },
      { title: "Akses Strategis", subtitle: "Dekat fasilitas umum & transportasi" },
      { title: "Kemitraan Perbankan", subtitle: "Kemudahan fasilitas KPR bersubsidi" }
    ],
    officeImage: "/assets/project-identity.jpg",
    officeCaption: "Kantor Pusat - Bandar Lampung, Provinsi Lampung",
    homeIntroBadge: "Tentang Kami",
    homeIntroTitle: "Membangun Rumah,",
    homeIntroHighlight: "Mewujudkan Masa Depan.",
    homeIntroText: "Kami hadir untuk menyediakan hunian berkualitas dengan harga terjangkau, khususnya bagi keluarga Indonesia. Dengan pengalaman dan komitmen tinggi, PT. Terbang Bersama Kawan terus berinovasi dalam menghadirkan lingkungan yang nyaman, aman, dan berkelanjutan.",
    homeIntroCtaText: "Kenal Lebih Dekat",
    homeIntroCtaLink: "/tentang",
    features: [
      {
        title: "Hunian Berkualitas",
        desc: "Rumah nyaman dengan infrastruktur yang memadai.",
        icon: "home"
      },
      {
        title: "Harga Terjangkau",
        desc: "Solusi hunian untuk keluarga Indonesia.",
        icon: "shield"
      },
      {
        title: "Lokasi Strategis",
        desc: "Mudah diakses dan dekat dengan fasilitas umum.",
        icon: "map"
      },
      {
        title: "Lingkungan Asri",
        desc: "Hidup lebih sehat di lingkungan yang hijau.",
        icon: "leaf"
      }
    ],
  },
  leadership: {
    badge: "STRUKTUR PENGURUS RESMI",
    title: "Dewan Pengurus & Manajemen Perseroan",
    subtitle: "Dikelola oleh pengurus resmi yang tercantum dalam Anggaran Dasar, Akta Pendirian, serta tim manajemen profesional yang berdedikasi membangun kawasan perumahan berkualitas di Lampung.",
    operationalTitle: "Kepala Divisi & Pelaksana Teknis",
    operationalSubtitle: "Memastikan kelancaran proses verifikasi KPR FLPP, pengawasan fisik konstruksi, dan sertifikasi tanah secara tepat waktu.",
    members: [
      {
        name: "Riski Apriadi",
        role: "Komisaris Utama",
        department: "Dewan Komisaris",
        roleDescription: "Bertanggung jawab atas pengawasan menyeluruh terhadap tata kelola perseroan, kepatuhan legalitas, dan arah strategis pembangunan perumahan subsidi berstandar nasional.",
        image: "/assets/pengurus/komisaris-riski-apriadi.jpg",
      },
      {
        name: "Heri Ilhamsyah",
        role: "Direktur Utama",
        department: "Direksi Utama",
        roleDescription: "Memegang wewenang penuh dalam memimpin perseroan, mengarahkan eksekusi proyek Puri Gunung Langgar, serta mewakili perusahaan di dalam dan luar pengadilan sesuai Anggaran Dasar.",
        image: "/assets/pengurus/direktur-heri-ilhamsyah.jpg",
      },
      {
        name: "Ir. Hendra Gunawan, S.T.",
        role: "Direktur Operasional & Teknik",
        department: "Manajemen Eksekutif",
        roleDescription: "Memimpin pelaksanaan rekayasa teknis, pekerjaan cut & fill lahan, infrastruktur jalan drainase, serta pengawasan mutu konstruksi fisik bangunan sesuai regulasi PUPR.",
        image: "/assets/pengurus/hendra-gunawan.jpg",
      },
      {
        name: "Siti Nurhaliza, S.Ak.",
        role: "Manajer Keuangan & KPR FLPP",
        department: "Divisi Keuangan",
        roleDescription: "Mengelola akuntabilitas arus kas perseroan, koordinasi perbankan mitra penyalur KPR FLPP (Bank BTN, BSI, Mandiri), verifikasi berkas debitur, dan administrasi akad kredit.",
        image: "/assets/pengurus/siti-nurhaliza.jpg",
      },
      {
        name: "Dedi Irawan, S.I.Kom.",
        role: "Manajer Pemasaran & Pelayanan Konsumen",
        department: "Divisi Pemasaran",
        roleDescription: "Mengkoordinasikan konsultasi konsumen, survei lokasi Puri Gunung Langgar, pemesanan unit kavling, serta pendampingan calon debitur hingga serah terima kunci.",
        image: "/assets/pengurus/dedi-irawan.jpg",
      },
      {
        name: "Fajar Pratama, S.H.",
        role: "Manajer Legalitas & Perizinan Lahan",
        department: "Divisi Legalitas",
        roleDescription: "Mengawal kelengkapan legalitas perseroan, perizinan PBG/IMB, tata ruang kawasan, koordinasi BPN Lampung Selatan untuk pemecahan sertifikat induk (SHM per kavling).",
        image: "/assets/pengurus/fajar-pratama.jpg",
      },
    ],
  },
  buyingProcess: {
    badge: "PANDUAN KONSUMEN",
    title: "Tahapan Pembelian Rumah Subsidi",
    subtitle: "Alur pengajuan yang transparan dan terstruktur bagi masyarakat, dari pemilihan kavling hingga serah terima kunci.",
    steps: [
      {
        step: "01",
        title: "Pilih Unit & Konsultasi",
        desc: "Kunjungi kantor pemasaran atau lokasi proyek untuk memilih nomor kavling yang tersedia dan melakukan konsultasi syarat KPR.",
        highlight: "Survei kavling langsung"
      },
      {
        step: "02",
        title: "Pemberkasan Dokumen",
        desc: "Menyiapkan berkas identitas (KTP, KK, NPWP, Slip Gaji atau Keterangan Usaha) untuk verifikasi kelayakan subsidi FLPP.",
        highlight: "Didampingi tim admin"
      },
      {
        step: "03",
        title: "Wawancara & Analisis Bank",
        desc: "Proses persetujuan pembiayaan oleh perbankan mitra penyalur KPR bersubsidi dengan suku bunga 5% tetap pemerintah.",
        highlight: "Kepastian plafon kredit"
      },
      {
        step: "04",
        title: "Akad & Serah Terima",
        desc: "Penandatanganan akta di hadapan Notaris resmi perseroan dan serah terima kunci unit rumah kepada konsumen.",
        highlight: "Sertifikat Hak Milik (SHM)"
      }
    ]
  },
  kprSimulation: {
    badge: "KALKULATOR FINANSIAL",
    title: "Simulasi Angsuran KPR Bersubsidi",
    subtitle: "Hitung perkiraan angsuran bulanan rumah subsidi Puri Gunung Langgar melalui skema FLPP dengan suku bunga tetap 5% p.a.",
    defaultPrice: 166000000,
    minPrice: 140000000,
    maxPrice: 200000000,
    defaultDp: 2000000,
    minDp: 1000000,
    maxDp: 20000000,
    defaultTenor: 20,
    annualInterestRate: 0.05,
    benefits: [
      "Suku Bunga Tetap (Anuitas) 5% sampai lunas",
      "Bebas PPN dan premi asuransi bersubsidi",
      "Pilihan jangka waktu fleksibel hingga 20 tahun"
    ]
  },
  legal: {
    badge: "LEGALITAS & TRANSPARANSI PERUSAHAAN",
    title: "Dokumen Resmi Perseroan",
    subtitle: "Kekuatan hukum dan legalitas pendirian PT. Terbang Bersama Kawan terdaftar secara sah di Republik Indonesia.",
    aktaNumber: "No. 10",
    aktaDate: "18 Maret 2021",
    notary: "Eka Dian Anggraini, S.H., M.Kn.",
    skMenkumham: "AHU-0016462.AH.01.01.TAHUN 2021",
    skDate: "19 Maret 2021",
    directorAuthority: "Direktur berhak bertindak untuk dan atas nama Direksi serta mewakili Perseroan",
    landStatus: "Sertifikat Hak Milik (SHM)",
    landStatusDetail: "Hak kepemilikan mutlak dan sah atas nama pembeli"
  },
  activities: {
    badge: "KEGIATAN LAPANGAN RESMI",
    title: "Dokumentasi Pekerjaan Lapangan",
    subtitle: "Aktivitas riil pembangunan dan persiapan kawasan perumahan PT. Terbang Bersama Kawan.",
    items: [
      {
        title: "Perataan Tanah & Pembukaan Jalan",
        description: "Dokumentasi riil pekerjaan cut & fill perataan kontur lahan dan pembukaan akses jalan utama kawasan perumahan.",
        image: "/assets/service-construction.jpg",
        tag: "Tahap 1 • Lapangan",
      },
      {
        title: "Pengukuran & Pematokan Kavling",
        description: "Dokumentasi riil pengukuran presisi batas tanah dan pematokan kavling unit hunian sesuai master plan.",
        image: "/assets/service-residential.jpg",
        tag: "Tahap 2 • Lapangan",
      },
      {
        title: "Pondasi & Struktur Dinding",
        description: "Dokumentasi riil konstruksi pondasi kokoh dan penegakan struktur dinding bata presisi rumah hunian.",
        image: "/assets/service-interior.jpg",
        tag: "Tahap 3 • Lapangan",
      },
      {
        title: "Infrastruktur & Akses Lingkungan",
        description: "Dokumentasi riil pembangunan saluran drainase kawasan dan pengerasan akses jalan utama perumahan.",
        image: "/assets/project-coastal.jpg",
        tag: "Tahap 4 • Lapangan",
      },
      {
        title: "Perencanaan Master Plan Terpadu",
        description: "Ilustrasi konseptual master plan dan prinsip tata ruang lingkungan hunian yang terintegrasi.",
        image: "/assets/project-workspace.jpg",
        tag: "Tahap 5 • Konsep",
      },
      {
        title: "Visualisasi Rencana Standar Mutu",
        description: "Visualisasi arsitektural konsep standar kualitas konstruksi dan kenyamanan hunian yang dihadirkan PT. TBK.",
        image: "/assets/hero-villa.jpg",
        tag: "Tahap 6 • Konsep",
      },
    ],
  },
  project: {
    badge: "PROYEK RESMI PERSEROAN",
    name: "Puri Gunung Langgar",
    type: "Perumahan Subsidi",
    status: "Tahap Konstruksi",
    location: "Desa Sabah Balau / Tanjung Bintang",
    district: "Kabupaten Lampung Selatan",
    province: "Provinsi Lampung",
    description: "Proyek hunian perumahan subsidi persembahan PT. Terbang Bersama Kawan yang dirancang untuk memberikan kenyamanan, keamanan, dan akses strategis bagi masyarakat.",
    image: "/assets/project-workspace.jpg",
    mediaType: "photo",
    videoUrl: "",
    slides: [
      {
        image: "/assets/service-construction.jpg",
        caption: "Dokumentasi Lapangan: Pematangan dan Perataan Lahan Proyek Puri Gunung Langgar."
      },
      {
        image: "/assets/service-residential.jpg",
        caption: "Dokumentasi Lapangan: Pengukuran Batas Kavling dan Pondasi Unit."
      },
      {
        image: "/assets/service-interior.jpg",
        caption: "Dokumentasi Lapangan: Pekerjaan Pondasi, Pembesian, dan Struktur Bangunan Kokoh."
      },
      {
        image: "/assets/project-coastal.jpg",
        caption: "Dokumentasi Lapangan: Infrastruktur Akses Jalan Lingkungan dan Saluran Air Kawasan."
      },
      {
        image: "/assets/project-workspace.jpg",
        caption: "Ilustrasi Perencanaan: Master Plan Kawasan Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan."
      },
      {
        image: "/assets/hero-villa.jpg",
        caption: "Visualisasi Arsitektural: Konsep Desain & Standar Mutu Hunian PT. TBK."
      }
    ],
    specs: [
      { label: "Status Proyek", value: "Tahap Konstruksi (Aktif)" },
      { label: "Kategori Proyek", value: "Rumah Tapak Bersubsidi" },
      { label: "Tipe Bangunan", value: "Tipe 36 / 72 m²" },
      { label: "Luas Bangunan", value: "36 m²" },
      { label: "Luas Tanah", value: "72 m²" },
      { label: "Legalitas Lahan", value: "Sertifikat Hak Milik (SHM)" },
      { label: "Fasilitas Dasar", value: "Jalan Lingkungan Paving, Listrik PLN, Air Bersih" },
      { label: "Skema Pembiayaan", value: "KPR FLPP Bersubsidi 5% & Mandiri" },
      { label: "Lokasi Strategis", value: "Akses Cepat ke Pusat Kota Bandar Lampung" }
    ],
  },
  contact: {
    badge: "HUBUNGI PERSEROAN",
    title: "Layanan Konsultasi & Pemesanan Resmi",
    subtitle: "Hubungi tim pemasaran resmi kami untuk informasi ketersediaan unit, tahapan pemesanan KPR, dan survei lokasi langsung.",
    city: "Bandar Lampung",
    address: "Kawasan Puri Gunung Langgar, Desa Sabah Balau, Kec. Tanjung Bintang, Lampung Selatan",
    whatsapp: "0812-7890-1234",
    email: "info@terbangbersamakawan.co.id",
    operatingHours: "Senin - Sabtu: 08.00 - 17.00 WIB",
    mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127103.95764032483!2d105.19799639726562!3d-5.412499999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40da473d091219%3A0x3039d80b220cc70!2sKota%20Bandar%20Lampung%2C%20Lampung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid",
    mapsUrl: "https://maps.google.com/?q=Bandar+Lampung",
  },
  footer: {
    companyName: "PT. Terbang Bersama Kawan",
    shortName: "PT. TBK",
    tagline: "Pengembang Perumahan Resmi",
    summary: "Pengembang perumahan resmi, amanah, dan berkualitas berdomisili di Bandar Lampung. Mengutamakan transparansi, kepuasan konsumen, dan legalitas sah.",
    copyrightText: "Hak Cipta Dilindungi Undang-Undang. PT. Terbang Bersama Kawan (PT. TBK).",
  },
};

export function getYouTubeEmbedUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/embed/')) {
    const match = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : trimmed;
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0`;
  }

  return null;
}

export function getYouTubeThumbnailUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.trim().match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return null;
}
