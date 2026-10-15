export interface SiteContent {
  meta: {
    title: string;
    description: string;
    tagline: string;
    logo?: string;
  };
  hero: {
    badge: string;
    heading: string;
    subheading: string;
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
  };
  leadership: {
    badge: string;
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      role: string;
      roleDescription: string;
      image: string;
    }>;
  };
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
    summary: string;
    copyrightText: string;
  };
}

export const initialSiteContent: SiteContent = {
  meta: {
    title: "PT. Terbang Bersama Kawan (PT. TBK) | Pengembang Perumahan Berkualitas & Terpercaya",
    description: "Website resmi PT. Terbang Bersama Kawan (PT. TBK), pengembang perumahan subsidi berkualitas dan terpercaya di Lampung. Menghadirkan proyek Puri Gunung Langgar.",
    tagline: "Perusahaan properti yang berkualitas dan terpercaya",
    logo: "/assets/logo-tbk.png",
  },
  hero: {
    badge: "PENGEMBANG PROPERTI RESMI & TERPERCAYA",
    heading: "Hunian Berkualitas, Aman, Nyaman, dan Terjangkau",
    subheading: "PT. Terbang Bersama Kawan (PT. TBK) berkomitmen menghadirkan perumahan subsidi terbaik dengan standar kepuasan dan legalitas resmi terjamin.",
    primaryCtaText: "Lihat Proyek Puri Gunung Langgar",
    primaryCtaLink: "#proyek",
    secondaryCtaText: "Hubungi Kami",
    secondaryCtaLink: "#kontak",
    backgroundImage: "/assets/hero-villa.jpg",
    stats: [
      { label: "Domisili Perusahaan", value: "Bandar Lampung" },
      { label: "Pengesahan Kemenkumham", value: "2021" },
      { label: "Proyek Utama", value: "Puri Gunung Langgar" },
      { label: "Kategori Pembangunan", value: "Hunian Bersubsidi" }
    ],
    slides: [
      {
        image: "/assets/project-workspace.jpg",
        caption: "Kawasan Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan."
      },
      {
        image: "/assets/service-construction.jpg",
        caption: "Pekerjaan Cut & Fill dan Perataan Kontur Lahan Kawasan Perumahan."
      },
      {
        image: "/assets/service-residential.jpg",
        caption: "Pembangunan Unit Hunian Subsidi Berkualitas dan Kokoh."
      },
      {
        image: "/assets/service-interior.jpg",
        caption: "Pekerjaan Pondasi, Pembesian, dan Struktur Bangunan."
      },
      {
        image: "/assets/project-coastal.jpg",
        caption: "Penataan Lingkungan, Drainase, dan Akses Jalan Kawasan."
      },
      {
        image: "/assets/project-identity.jpg",
        caption: "Perencanaan Fasilitas Kawasan dan Tata Ruang Terpadu."
      },
      {
        image: "/assets/hero-villa.jpg",
        caption: "Unit Contoh & Standar Kualitas Hunian PT. Terbang Bersama Kawan."
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
  },
  leadership: {
    badge: "STRUKTUR PENGURUS RESMI",
    title: "Dewan Pengurus Perseroan",
    subtitle: "Dikelola oleh pengurus resmi yang tercantum dalam Anggaran Dasar dan Akta Pendirian Perseroan.",
    members: [
      {
        name: "Riski Apriadi",
        role: "Komisaris",
        roleDescription: "Bertanggung jawab atas pengawasan kebijakan umum dan tata kelola perseroan secara berkelanjutan.",
        image: "/assets/pengurus/komisaris-riski-apriadi.jpg",
      },
      {
        name: "Heri Ilhamsyah",
        role: "Direktur",
        roleDescription: "Berhak bertindak untuk dan atas nama Direksi serta mewakili Perseroan sesuai Akta Notaris pendirian.",
        image: "/assets/pengurus/direktur-heri-ilhamsyah.jpg",
      },
    ],
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
  },
  activities: {
    badge: "KEGIATAN LAPANGAN RESMI",
    title: "Dokumentasi Pekerjaan Lapangan",
    subtitle: "Aktivitas riil pembangunan dan persiapan kawasan perumahan PT. Terbang Bersama Kawan.",
    items: [
      {
        title: "Perataan Tanah & Pembukaan Jalan",
        description: "Pekerjaan cut & fill perataan kontur lahan dan pembukaan akses jalan utama kawasan perumahan.",
        image: "/assets/service-construction.jpg",
        tag: "Tahap 1",
      },
      {
        title: "Pengukuran & Pematokan Kavling",
        description: "Pengukuran presisi batas-batas tanah dan pematokan kavling unit hunian sesuai master plan.",
        image: "/assets/service-residential.jpg",
        tag: "Tahap 2",
      },
      {
        title: "Pondasi & Struktur Dinding",
        description: "Pekerjaan konstruksi pondasi kokoh dan penegakan struktur dinding bata presisi rumah hunian.",
        image: "/assets/service-interior.jpg",
        tag: "Tahap 3",
      },
      {
        title: "Infrastruktur & Akses Lingkungan",
        description: "Pembangunan saluran drainase kawasan dan pengerasan akses jalan utama perumahan.",
        image: "/assets/project-coastal.jpg",
        tag: "Tahap 4",
      },
      {
        title: "Pembangunan Unit & Masterplan",
        description: "Proses pembangunan unit hunian dan integrasi tata ruang kawasan hunian bersubsidi.",
        image: "/assets/project-workspace.jpg",
        tag: "Tahap 5",
      },
      {
        title: "Unit Contoh & Standar Mutu",
        description: "Visualisasi standar kualitas konstruksi dan kenyamanan hunian yang dihadirkan PT. TBK.",
        image: "/assets/hero-villa.jpg",
        tag: "Tahap 6",
      },
    ],
  },
  project: {
    badge: "PROYEK RESMI PERSEROAN",
    name: "Puri Gunung Langgar",
    type: "Perumahan Subsidi",
    status: "Tahap Pembangunan",
    location: "Desa Sabah Balau / Tanjung Bintang",
    district: "Kabupaten Lampung Selatan",
    province: "Provinsi Lampung",
    description: "Proyek hunian perumahan subsidi persembahan PT. Terbang Bersama Kawan yang dirancang untuk memberikan kenyamanan, keamanan, dan akses strategis bagi masyarakat.",
    image: "/assets/project-workspace.jpg",
    mediaType: "photo",
    videoUrl: "",
    slides: [
      {
        image: "/assets/project-workspace.jpg",
        caption: "Kawasan Puri Gunung Langgar, Desa Sabah Balau, Tanjung Bintang, Lampung Selatan."
      },
      {
        image: "/assets/service-construction.jpg",
        caption: "Pematangan dan Perataan Lahan Proyek Puri Gunung Langgar."
      },
      {
        image: "/assets/service-residential.jpg",
        caption: "Progres Pembangunan Unit Hunian Subsidi Berkualitas."
      },
      {
        image: "/assets/hero-villa.jpg",
        caption: "Unit Contoh & Standar Kualitas Hunian PT. TBK."
      },
      {
        image: "/assets/project-coastal.jpg",
        caption: "Infrastruktur Akses Jalan Lingkungan dan Saluran Air Kawasan."
      },
      {
        image: "/assets/service-interior.jpg",
        caption: "Pekerjaan Pondasi, Pembesian, dan Struktur Bangunan Kokoh."
      },
      {
        image: "/assets/project-identity.jpg",
        caption: "Perencanaan Fasilitas Kawasan dan Tata Ruang Terpadu."
      }
    ],
    specs: [
      { label: "Status Proyek", value: "Tahap Pembangunan (Aktif)" },
      { label: "Jenis Hunian", value: "Rumah Tapak Bersubsidi" },
      { label: "Tipe Bangunan", value: "Tipe 36 / 72 m²" },
      { label: "Legalitas Tanah", value: "Sertifikat Hak Milik (SHM)" },
      { label: "Fasilitas Utama", value: "Jalan Lingkungan Paving, Listrik & Air Bersih" },
      { label: "Skema Pembiayaan", value: "KPR FLPP Bersubsidi & Mandiri" },
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
