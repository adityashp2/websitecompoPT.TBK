'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteContent, initialSiteContent, BannerSlide, PurchaseStep, getYouTubeEmbedUrl } from '@/lib/initialData';
import {
  Save,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Home,
  FileText,
  Users,
  ShieldCheck,
  HardHat,
  Building,
  PhoneCall,
  Inbox,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles,
  Upload,
  Video,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Layers,
  Film,
  Check,
  LogOut,
  Key,
  MapPin,
  X,
  Calculator,
  Building2,
  ChevronDown,
  Megaphone,
  Eye,
  MessageCircle,
  Maximize2,
  Move,
  Crop
} from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  created_at: string;
}

interface ImageAdjustmentControlProps {
  title?: string;
  fit?: 'cover' | 'contain';
  offsetX?: number;
  offsetY?: number;
  zoom?: number;
  defaultOffsetX?: number;
  defaultOffsetY?: number;
  onChange: (updates: { fit: 'cover' | 'contain'; offsetX: number; offsetY: number; zoom: number }) => void;
}

function LivePreviewBadge({
  title = "LIVE PREVIEW (SESUAI TAMPILAN ASLI WEBSITE)",
  subtitle = "Simulasi Layar Pengunjung"
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-1.5">
        <Eye className="w-4 h-4 text-[#FF9D2E]" />
        <span>{title}</span>
      </label>
      <span className="text-[10px] text-[#526783] bg-white px-2 py-0.5 rounded border border-[#DCE7F5] shadow-2xs font-medium">
        {subtitle}
      </span>
    </div>
  );
}

function ImageAdjustmentControl({
  title = "Pengaturan Ukuran & Posisi Foto",
  fit = "cover",
  offsetX,
  offsetY,
  zoom = 100,
  defaultOffsetX = 50,
  defaultOffsetY = 50,
  onChange,
}: ImageAdjustmentControlProps) {
  const currentOffsetX = offsetX !== undefined ? offsetX : defaultOffsetX;
  const currentOffsetY = offsetY !== undefined ? offsetY : defaultOffsetY;
  const currentFit = fit || 'cover';
  const currentZoom = zoom !== undefined ? zoom : 100;

  const padRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const updateFromPointer = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.max(0, Math.min(100, rawX)));
    const clampedY = Math.round(Math.max(0, Math.min(100, rawY)));
    onChange({ fit: currentFit, offsetX: clampedX, offsetY: clampedY, zoom: currentZoom });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDragging(true);
    updateFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromPointer(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
    }
  };

  return (
    <div className="mt-2.5 p-3.5 rounded-xl bg-[#F0F4FA] border border-[#DCE7F5] space-y-3.5 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#073B78] flex items-center gap-1.5">
          <Crop className="w-3.5 h-3.5 text-[#FF9D2E]" />
          <span>{title}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onChange({ fit: 'cover', offsetX: 50, offsetY: 50, zoom: 100 })}
            className="text-[10px] text-[#526783] hover:text-[#073B78] bg-white px-2 py-0.5 rounded border border-[#DCE7F5] hover:border-[#073B78] flex items-center gap-1 transition-all"
            title="Reset posisi ke tengah (50% / 50%) dan zoom 100%"
          >
            <RotateCcw className="w-2.5 h-2.5 text-[#FF9D2E]" />
            <span>Reset Posisi</span>
          </button>
          <span className="text-[10px] text-[#073B78] font-bold bg-[#E6EFFD] px-2 py-0.5 rounded border border-[#C5DCFA]">
            Live Crop &amp; Pan
          </span>
        </div>
      </div>

      {/* Pilihan Fit: Cover vs Contain */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => onChange({ fit: 'cover', offsetX: currentOffsetX, offsetY: currentOffsetY, zoom: currentZoom })}
          className={`py-1.5 px-2.5 rounded-lg font-medium border text-center transition-all ${
            currentFit === 'cover'
              ? 'bg-[#073B78] text-white border-[#073B78] shadow-xs'
              : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
          }`}
        >
          Penuh Bingkai (Cover / Crop)
        </button>
        <button
          type="button"
          onClick={() => onChange({ fit: 'contain', offsetX: currentOffsetX, offsetY: currentOffsetY, zoom: currentZoom })}
          className={`py-1.5 px-2.5 rounded-lg font-medium border text-center transition-all ${
            currentFit === 'contain'
              ? 'bg-[#073B78] text-white border-[#073B78] shadow-xs'
              : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
          }`}
        >
          Utuh Tanpa Terpotong (Contain)
        </button>
      </div>

      {/* INTERACTIVE 2D PAN / CROP PAD */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#102D52] flex items-center gap-1.5">
            <Move className="w-3 h-3 text-[#FF9D2E]" />
            <span>Pad Titik Fokus &amp; Geser 2D (Klik / Seret Bebas)</span>
          </span>
          <span className="text-[10px] font-mono text-[#073B78] font-bold bg-white px-2 py-0.5 rounded border border-[#DCE7F5]">
            X: {currentOffsetX}% • Y: {currentOffsetY}%
          </span>
        </div>
        <div
          ref={padRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-24 bg-[#0B1E36] rounded-xl overflow-hidden cursor-crosshair border border-[#073B78]/40 select-none touch-none shadow-inner group transition-all"
        >
          {/* Rule of thirds grid lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-r border-b border-white" />
            <div className="border-b border-white" />
            <div className="border-r border-white" />
            <div className="border-r border-white" />
            <div />
          </div>

          {/* Helper Directional Labels */}
          <span className="absolute top-1 left-2 text-[8.5px] font-mono uppercase tracking-wider text-white/40 pointer-events-none">
            Atas-Kiri
          </span>
          <span className="absolute top-1 right-2 text-[8.5px] font-mono uppercase tracking-wider text-white/40 pointer-events-none">
            Atas-Kanan
          </span>
          <span className="absolute bottom-1 left-2 text-[8.5px] font-mono uppercase tracking-wider text-white/40 pointer-events-none">
            Bawah-Kiri
          </span>
          <span className="absolute bottom-1 right-2 text-[8.5px] font-mono uppercase tracking-wider text-white/40 pointer-events-none">
            Bawah-Kanan
          </span>
          <span className="absolute inset-x-0 bottom-1 text-center text-[8.5px] font-medium text-white/30 pointer-events-none">
            Seret titik target ke area yang ingin difokuskan
          </span>

          {/* Focal Target Reticle */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
            style={{ left: `${currentOffsetX}%`, top: `${currentOffsetY}%` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-7 h-7 rounded-full border-2 border-[#FF9D2E] bg-[#FF9D2E]/25 shadow-md flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              </div>
              {/* Crosshair guidelines */}
              <div className="absolute w-12 h-px bg-[#FF9D2E]/50 pointer-events-none" />
              <div className="absolute h-12 w-px bg-[#FF9D2E]/50 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Slider Geser Horizontal (X-Offset / Kanan - Kiri) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <label className="font-semibold text-[#102D52] flex items-center gap-1">
            <span>Posisi Geser Horizontal (Kiri - Kanan)</span>
          </label>
          <span className="text-[10px] font-mono text-[#073B78] font-bold">
            {currentOffsetX}% {currentOffsetX === 50 ? '(Tengah)' : currentOffsetX < 40 ? '(Fokus Kiri)' : '(Fokus Kanan)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={currentOffsetX}
          onChange={(e) =>
            onChange({
              fit: currentFit,
              offsetX: Number(e.target.value),
              offsetY: currentOffsetY,
              zoom: currentZoom,
            })
          }
          className="w-full accent-[#FF9D2E] cursor-pointer"
        />
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: 0, offsetY: currentOffsetY, zoom: currentZoom })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentOffsetX === 0 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            0% (Paling Kiri)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: 50, offsetY: currentOffsetY, zoom: currentZoom })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentOffsetX === 50 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            50% (Tengah)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: 100, offsetY: currentOffsetY, zoom: currentZoom })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentOffsetX === 100 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            100% (Paling Kanan)
          </button>
        </div>
      </div>

      {/* Slider Geser Vertikal (Y-Offset / Atas - Bawah) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <label className="font-semibold text-[#102D52]">
            Posisi Geser Vertikal (Atas - Bawah)
          </label>
          <span className="text-[10px] font-mono text-[#073B78] font-bold">
            {currentOffsetY}% {currentOffsetY === 50 ? '(Tengah)' : currentOffsetY < 40 ? '(Fokus Atas)' : '(Fokus Bawah)'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={currentOffsetY}
          onChange={(e) =>
            onChange({
              fit: currentFit,
              offsetX: currentOffsetX,
              offsetY: Number(e.target.value),
              zoom: currentZoom,
            })
          }
          className="w-full accent-[#FF9D2E] cursor-pointer"
        />
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: 0, zoom: currentZoom })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentOffsetY === 0 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            0% (Paling Atas)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: 50, zoom: currentZoom })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentOffsetY === 50 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            50% (Tengah)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: 100, zoom: currentZoom })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentOffsetY === 100 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            100% (Paling Bawah)
          </button>
        </div>
      </div>

      {/* Slider Skala / Zoom Foto (Crop Zoom) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <label className="font-semibold text-[#102D52]">
            Ukuran Skala / Zoom Foto (Crop Level)
          </label>
          <span className="text-[10px] font-mono text-[#073B78] font-bold">
            {currentZoom}%
          </span>
        </div>
        <input
          type="range"
          min="60"
          max="200"
          step="2"
          value={currentZoom}
          onChange={(e) =>
            onChange({
              fit: currentFit,
              offsetX: currentOffsetX,
              offsetY: currentOffsetY,
              zoom: Number(e.target.value),
            })
          }
          className="w-full accent-[#FF9D2E] cursor-pointer"
        />
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: currentOffsetY, zoom: 75 })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentZoom === 75 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            75% (Lebih Luas)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: currentOffsetY, zoom: 100 })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentZoom === 100 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            100% (Normal)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: currentOffsetY, zoom: 125 })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentZoom === 125 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            125% (Crop Dekat)
          </button>
          <button
            type="button"
            onClick={() => onChange({ fit: currentFit, offsetX: currentOffsetX, offsetY: currentOffsetY, zoom: 150 })}
            className={`text-[9.5px] px-2 py-0.5 rounded border transition-all ${
              currentZoom === 150 ? 'bg-[#073B78] text-white border-[#073B78]' : 'bg-white text-[#526783] border-[#DCE7F5] hover:bg-slate-50'
            }`}
          >
            150% (Zoom Fokus)
          </button>
        </div>
      </div>
    </div>
  );
}

export type AdminTab =
  | 'banners'
  | 'intro-features'
  | 'buying-process'
  | 'kpr-simulation'
  | 'promo-popup'
  | 'branding'
  | 'about'
  | 'leadership'
  | 'legal'
  | 'project'
  | 'activities'
  | 'contact'
  | 'inquiries';

const TAB_GROUPS: Record<
  AdminTab,
  {
    group: string;
    title: string;
    desc: string;
  }
> = {
  banners: {
    group: 'Tampilan Beranda',
    title: 'Slide Banner Promosi (Top Carousel)',
    desc: 'Kelola slide banner beranda di bagian paling atas (Puri Gunung Langgar, KPR FLPP 5%, Legalitas SHM, dll.).',
  },
  'intro-features': {
    group: 'Tampilan Beranda',
    title: 'Statistik & Keunggulan Beranda',
    desc: 'Kelola 4 indikator rekam jejak perseroan (bar biru di bawah banner), narasi sambutan, dan 4 kartu keunggulan PT. TBK.',
  },
  'buying-process': {
    group: 'Tampilan Beranda',
    title: 'Alur Pembelian Rumah Bersubsidi',
    desc: 'Kelola 4 langkah alur mudah kepemilikan rumah di PT. TBK.',
  },
  'kpr-simulation': {
    group: 'Tampilan Beranda',
    title: 'Kalkulator Simulasi KPR FLPP 5%',
    desc: 'Sesuaikan harga unit acuan, suku bunga subsidi pemerintah, dan rincian tenor angsuran.',
  },
  'promo-popup': {
    group: 'Tampilan Beranda',
    title: 'Popup Flyer Iklan Promo Beranda',
    desc: 'Aktifkan banner popup modal promosi yang muncul otomatis saat pengunjung membuka website.',
  },
  branding: {
    group: 'Profil Perusahaan',
    title: 'Branding, Identitas & Footer',
    desc: 'Kelola logo resmi perusahaan, slogan, favicon, dan teks hak cipta footer.',
  },
  about: {
    group: 'Profil Perusahaan',
    title: 'Tentang Perusahaan, Visi & Misi',
    desc: 'Perbarui narasi sejarah, visi, misi, dan nilai integritas PT. Terbang Bersama Kawan.',
  },
  leadership: {
    group: 'Profil Perusahaan',
    title: 'Struktur Dewan Pengurus & Direksi',
    desc: 'Kelola profil jajaran komisaris dan direksi perusahaan beserta foto dan jabatannya.',
  },
  legal: {
    group: 'Profil Perusahaan',
    title: 'Legalitas Resmi & Sertifikat SHM',
    desc: 'Kelola informasi akta pendirian, izin berusaha, notaris rekanan, dan jaminan sertifikat perumahan.',
  },
  project: {
    group: 'Proyek & Lapangan',
    title: 'Spesifikasi & Galeri Proyek Perumahan',
    desc: 'Kelola rincian unit perumahan Puri Gunung Langgar, spesifikasi bangunan, peta denah, dan masterplan.',
  },
  activities: {
    group: 'Proyek & Lapangan',
    title: 'Dokumentasi Kegiatan & Progres Lapangan',
    desc: 'Unggah dokumentasi foto dan video kegiatan pembangunan riil di lapangan.',
  },
  contact: {
    group: 'Interaksi & Kontak',
    title: 'Informasi Kontak & Titik Lokasi Kantor',
    desc: 'Kelola nomor telepon kantor, WhatsApp resmi, alamat email, dan link peta Google Maps.',
  },
  inquiries: {
    group: 'Interaksi & Kontak',
    title: 'Kotak Masuk Pesan & Formulir Pengunjung',
    desc: 'Daftar pesan konsultasi dan pertanyaan yang dikirim langsung oleh calon konsumen dari website.',
  },
};

const renderTabIcon = (tab: AdminTab) => {
  switch (tab) {
    case 'banners':
      return <Film className="w-5 h-5 text-[#FF9D2E]" />;
    case 'intro-features':
      return <Sparkles className="w-5 h-5 text-[#FF9D2E]" />;
    case 'buying-process':
      return <FileText className="w-5 h-5 text-[#FF9D2E]" />;
    case 'kpr-simulation':
      return <Calculator className="w-5 h-5 text-[#FF9D2E]" />;
    case 'promo-popup':
      return <Megaphone className="w-5 h-5 text-[#FF9D2E]" />;
    case 'branding':
      return <Sparkles className="w-5 h-5 text-[#FF9D2E]" />;
    case 'about':
      return <Building2 className="w-5 h-5 text-[#FF9D2E]" />;
    case 'leadership':
      return <Users className="w-5 h-5 text-[#FF9D2E]" />;
    case 'legal':
      return <ShieldCheck className="w-5 h-5 text-[#FF9D2E]" />;
    case 'project':
      return <Building className="w-5 h-5 text-[#FF9D2E]" />;
    case 'activities':
      return <HardHat className="w-5 h-5 text-[#FF9D2E]" />;
    case 'contact':
      return <PhoneCall className="w-5 h-5 text-[#FF9D2E]" />;
    case 'inquiries':
      return <Inbox className="w-5 h-5 text-[#FF9D2E]" />;
    default:
      return <Sparkles className="w-5 h-5 text-[#FF9D2E]" />;
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ id: number; name: string; username: string; role: string } | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChangeLoading, setPassChangeLoading] = useState(false);
  const [passChangeStatus, setPassChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [content, setContent] = useState<SiteContent>(initialSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('banners');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState<number | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  const handleGenericFileUpload = async (file: File, key: string, onSuccess: (url: string) => void) => {
    setUploadError('');
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onSuccess(data.url);
      } else {
        setUploadError(data.error || 'Gagal mengupload gambar.');
      }
    } catch {
      setUploadError('Terjadi kesalahan jaringan saat mengupload gambar.');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleUploadProjectImage = async (file: File, slideIdx?: number) => {
    setUploadError('');
    if (slideIdx !== undefined) {
      setUploadingSlide(slideIdx);
    } else {
      setUploadingCover(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (slideIdx !== undefined) {
          const newSlides = [...(content.project.slides || [])];
          if (newSlides[slideIdx]) {
            newSlides[slideIdx].image = data.url;
          }
          setContent({
            ...content,
            project: { ...content.project, slides: newSlides },
          });
        } else {
          setContent({
            ...content,
            project: { ...content.project, image: data.url },
          });
        }
      } else {
        setUploadError(data.error || 'Gagal mengupload gambar.');
      }
    } catch {
      setUploadError('Terjadi kesalahan saat mengupload gambar.');
    } finally {
      setUploadingSlide(null);
      setUploadingCover(false);
    }
  };

  // Check auth session and fetch current database content
  useEffect(() => {
    initDashboard();
    // Safety fallback: release loading screen if it takes more than 4 seconds
    const timeout = setTimeout(() => {
      if (typeof window !== 'undefined' && !adminUser) {
        window.location.replace('/A9MIN/login');
      }
    }, 4000);
    return () => clearTimeout(timeout);
  }, []);

  const initDashboard = async () => {
    setLoading(true);
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('tbk_admin_token') : null;
      const [authRes, contentRes] = await Promise.all([
        fetch('/api/auth/me', {
          cache: 'no-store',
          headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
        }),
        fetch('/api/content', { cache: 'no-store' }),
      ]);

      const authJson = await authRes.json().catch(() => ({ authenticated: false }));
      if (!authRes.ok || !authJson.authenticated) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tbk_admin_token');
          document.cookie = 'tbk_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.replace('/A9MIN/login');
        }
        return;
      }
      setAdminUser(authJson.user);

      const contentJson = await contentRes.json().catch(() => ({ success: false }));
      if (contentJson.success && contentJson.data) {
        setContent(contentJson.data);
      }
    } catch (err) {
      console.error('Session verification error:', err);
      if (typeof window !== 'undefined') {
        window.location.replace('/A9MIN/login');
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: 'error', message: 'Gagal membaca data dari database SQL.' });
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tbk_admin_token');
        sessionStorage.clear();
        document.cookie = 'tbk_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
      window.location.href = '/A9MIN/login';
    } catch (err) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tbk_admin_token');
        sessionStorage.clear();
        document.cookie = 'tbk_admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      console.error('Logout failed:', err);
      window.location.href = '/A9MIN/login';
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeStatus(null);

    if (!currPass || !newPass) {
      setPassChangeStatus({ type: 'error', message: 'Silakan isi kata sandi saat ini dan kata sandi baru.' });
      return;
    }

    if (newPass.length < 6) {
      setPassChangeStatus({ type: 'error', message: 'Kata sandi baru minimal harus 6 karakter.' });
      return;
    }

    if (newPass !== confirmPass) {
      setPassChangeStatus({ type: 'error', message: 'Konfirmasi kata sandi baru tidak sama.' });
      return;
    }

    setPassChangeLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassChangeStatus({ type: 'success', message: 'Kata sandi berhasil diperbarui!' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrPass('');
          setNewPass('');
          setConfirmPass('');
          setPassChangeStatus(null);
        }, 1500);
      } else {
        setPassChangeStatus({ type: 'error', message: data.error || 'Gagal mengubah kata sandi.' });
      }
    } catch (err) {
      setPassChangeStatus({ type: 'error', message: 'Terjadi gangguan jaringan saat memproses kata sandi.' });
    } finally {
      setPassChangeLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('tbk_admin_token') : null;
      const res = await fetch('/api/inquiries', {
        headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInquiries(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  const handleDeleteInquiry = async (id: number) => {
    if (!window.confirm('Hapus pesan ini secara permanen dari database?')) {
      return;
    }
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('tbk_admin_token') : null;
      const res = await fetch(`/api/inquiries?id=${id}`, {
        method: 'DELETE',
        headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        setSaveStatus({
          type: 'success',
          message: 'Pesan berhasil dihapus permanen dari database.',
        });
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({
          type: 'error',
          message: json.error || 'Gagal menghapus pesan.',
        });
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat menghapus pesan.',
      });
    }
  };

  const handleClearAllInquiries = async () => {
    if (
      !window.confirm(
        'PERINGATAN: Apakah Anda yakin ingin mengosongkan SELURUH pesan masuk? Data yang dihapus tidak dapat dipulihkan.'
      )
    ) {
      return;
    }
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('tbk_admin_token') : null;
      const res = await fetch('/api/inquiries?all=true', {
        method: 'DELETE',
        headers: localToken ? { Authorization: `Bearer ${localToken}` } : {},
      });
      const json = await res.json();
      if (json.success) {
        setInquiries([]);
        setSaveStatus({
          type: 'success',
          message: 'Seluruh pesan masuk berhasil dikosongkan dari database.',
        });
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({
          type: 'error',
          message: json.error || 'Gagal mengosongkan pesan.',
        });
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({
        type: 'error',
        message: 'Terjadi kesalahan saat mengosongkan pesan masuk.',
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('tbk_admin_token') : null;
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localToken ? { Authorization: `Bearer ${localToken}` } : {}),
        },
        body: JSON.stringify(content),
      });
      const json = await res.json();
      if (json.success) {
        setSaveStatus({ type: 'success', message: 'Seluruh perubahan berhasil disimpan secara permanen di database SQL!' });
        setTimeout(() => setSaveStatus(null), 5000);
      } else {
        setSaveStatus({ type: 'error', message: json.error || 'Gagal menyimpan perubahan.' });
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: 'error', message: 'Terjadi kesalahan jaringan saat menyimpan.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mereset seluruh data kembali ke DATA RESMI default? Perubahan yang belum disimpan akan hilang.')) {
      return;
    }
    setSaving(true);
    try {
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('tbk_admin_token') : null;
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localToken ? { Authorization: `Bearer ${localToken}` } : {}),
        },
        body: JSON.stringify({ action: 'reset' }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
        setSaveStatus({ type: 'success', message: 'Database telah direset ke DATA RESMI PT. Terbang Bersama Kawan.' });
        setTimeout(() => setSaveStatus(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: 'error', message: 'Gagal mereset data.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071C38] text-white flex flex-col items-center justify-center p-6 select-none">
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 flex items-center justify-center shadow-2xl">
            <img
              src={content.meta?.logo || "/assets/logo-tbk.png"}
              alt="Logo PT. TBK"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="absolute -inset-2 border-2 border-[#FF9D2E]/40 border-t-[#FF9D2E] rounded-3xl animate-spin" />
        </div>
        <div className="flex items-center gap-2 text-[#FF9D2E] font-semibold text-sm mb-1">
          <span className="tracking-wide">Memverifikasi Akses Admin Studio...</span>
        </div>
        <p className="text-xs text-white/50 font-mono">Panel Terproteksi • PT. Terbang Bersama Kawan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-[#102D52] selection:bg-[#073B78] selection:text-white font-sans">
      {/* Top Admin Navbar - Prestige Corporate Blue */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-[#073B78] via-[#0A4B91] to-[#102D52] backdrop-blur-md border-b border-[#0A4B91]/80 px-4 sm:px-6 lg:px-8 py-3 shadow-md shadow-[#073B78]/15 text-white">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          {/* Brand Left */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 shadow-inner">
              <img
                src={content.meta?.logo || "/assets/logo-tbk.png"}
                alt="Logo PT. TBK"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-syne font-bold text-sm sm:text-base text-white tracking-tight truncate">
                  PT. TBK Admin Studio
                </span>
                <span className="hidden md:inline-flex px-1.5 py-0.5 rounded-md bg-[#FF9D2E] text-[10px] font-bold text-[#073B78] tracking-wide uppercase">
                  CMS Pro
                </span>
              </div>
              <div className="text-[11px] text-blue-100/90 flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-medium text-white">Database SQL Terhubung</span>
                <span className="text-blue-300/60 hidden sm:inline">•</span>
                <span className="text-blue-200 hidden sm:inline font-mono text-[10px]">Puri Gunung Langgar</span>
              </div>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Quick Links Group */}
            <Link
              href="/"
              target="_blank"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-xs text-white flex items-center gap-1.5 transition-all shadow-xs"
              title="Pratinjau Website Publik"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF9D2E] shrink-0" />
              <span className="hidden md:inline font-medium">Lihat Website</span>
            </Link>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-xs text-white flex items-center gap-1.5 transition-all shadow-xs"
              title="Ganti Kata Sandi Admin"
            >
              <Key className="w-3.5 h-3.5 text-[#FF9D2E] shrink-0" />
              <span className="hidden md:inline font-medium">Password</span>
            </button>

            <button
              onClick={handleReset}
              disabled={saving}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-300/30 hover:bg-rose-500/30 text-white text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-xs"
              title="Reset ke DATA RESMI default"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden lg:inline font-medium">Reset</span>
            </button>

            {/* Primary Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#FF9D2E] hover:bg-[#F28A17] text-[#073B78] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#FF9D2E]/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 shrink-0" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>

            <div className="h-5 w-px bg-white/20 mx-0.5 hidden sm:block" />

            {/* User Profile Badge & Logout */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white">
                <div className="w-5 h-5 rounded-full bg-[#FF9D2E] text-[#073B78] flex items-center justify-center font-bold text-[10px]">
                  {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <span className="font-semibold text-white truncate max-w-[100px]">
                  {adminUser?.name || 'Admin'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="p-1.5 sm:p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-rose-500/30 text-white transition-all"
                title="Keluar dari Panel Admin"
              >
                <LogOut className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Save Notification Banner */}
      {saveStatus && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-medium shadow-sm ${
              saveStatus.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {saveStatus.type === 'success' ? (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              <span className="font-semibold">{saveStatus.message}</span>
            </div>
            <button
              onClick={() => setSaveStatus(null)}
              className="p-1 rounded-lg hover:bg-black/5 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Sidebar Tabs (Desktop >= lg) - Soothing Corporate Blue & Clean White */}
          <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#DCE7F5] rounded-2xl p-3 shadow-xs text-[#102D52] sticky top-16 max-h-[calc(100vh-4.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden admin-sidebar-scroll space-y-3">
            {/* GROUP 1: HALAMAN DEPAN (BERANDA) */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-[#073B78] px-3 py-1.5 tracking-wider flex items-center justify-between bg-[#F0F5FA] rounded-lg">
                <span>Tampilan Beranda</span>
                <span className="text-[9.5px] text-[#526783] font-semibold font-mono">5 Menu</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('banners')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'banners'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Film className={`w-4 h-4 shrink-0 ${activeTab === 'banners' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                  <span className="truncate">Banner Promosi Atas</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ml-1.5 ${
                  activeTab === 'banners' ? 'bg-white/20 text-white' : 'bg-[#F0F5FA] text-[#526783] border border-[#DCE7F5]'
                }`}>
                  {content.bannerSlides?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('intro-features')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'intro-features'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'intro-features' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Statistik &amp; Keunggulan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('buying-process')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'buying-process'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'buying-process' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                  <span className="truncate">Alur Pembelian Rumah</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ml-1.5 ${
                  activeTab === 'buying-process' ? 'bg-white/20 text-white' : 'bg-[#F0F5FA] text-[#526783] border border-[#DCE7F5]'
                }`}>
                  {content.buyingProcess?.steps?.length || 4}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kpr-simulation')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'kpr-simulation'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <Calculator className={`w-4 h-4 shrink-0 ${activeTab === 'kpr-simulation' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Simulasi KPR FLPP 5%</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('promo-popup')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'promo-popup'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Megaphone className={`w-4 h-4 shrink-0 ${activeTab === 'promo-popup' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                  <span className="truncate">Popup Iklan Promo</span>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ml-1.5 ${
                    content.promoPopup?.enabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {content.promoPopup?.enabled ? 'AKTIF' : 'OFF'}
                </span>
              </button>
            </div>

            {/* GROUP 2: PROFIL PERUSAHAAN */}
            <div className="space-y-1 pt-2 border-t border-[#DCE7F5]">
              <div className="text-[10px] uppercase font-bold text-[#073B78] px-3 py-1.5 tracking-wider flex items-center justify-between bg-[#F0F5FA] rounded-lg">
                <span>Profil Perusahaan</span>
                <span className="text-[9.5px] text-[#526783] font-semibold font-mono">4 Menu</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'branding'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <Sparkles className={`w-4 h-4 shrink-0 ${activeTab === 'branding' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Branding, Logo &amp; Footer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'about'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'about' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Tentang, Visi &amp; Misi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('leadership')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'leadership'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Users className={`w-4 h-4 shrink-0 ${activeTab === 'leadership' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                  <span className="truncate">Dewan Pengurus</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ml-1.5 ${
                  activeTab === 'leadership' ? 'bg-white/20 text-white' : 'bg-[#F0F5FA] text-[#526783] border border-[#DCE7F5]'
                }`}>
                  {content.leadership?.members?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('legal')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'legal'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'legal' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Legalitas &amp; Notaris</span>
              </button>
            </div>

            {/* GROUP 3: PROYEK & DOKUMENTASI */}
            <div className="space-y-1 pt-2 border-t border-[#DCE7F5]">
              <div className="text-[10px] uppercase font-bold text-[#073B78] px-3 py-1.5 tracking-wider flex items-center justify-between bg-[#F0F5FA] rounded-lg">
                <span>Proyek &amp; Lapangan</span>
                <span className="text-[9.5px] text-[#526783] font-semibold font-mono">2 Menu</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('project')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'project'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <Building className={`w-4 h-4 shrink-0 ${activeTab === 'project' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Proyek Puri Gunung Langgar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'activities'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <HardHat className={`w-4 h-4 shrink-0 ${activeTab === 'activities' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                  <span className="truncate">Kegiatan Lapangan Riil</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ml-1.5 ${
                  activeTab === 'activities' ? 'bg-white/20 text-white' : 'bg-[#F0F5FA] text-[#526783] border border-[#DCE7F5]'
                }`}>
                  {content.activities?.items?.length || 0}
                </span>
              </button>
            </div>

            {/* GROUP 4: INTERAKSI & FORMULIR */}
            <div className="space-y-1 pt-2 border-t border-[#DCE7F5]">
              <div className="text-[10px] uppercase font-bold text-[#073B78] px-3 py-1.5 tracking-wider flex items-center justify-between bg-[#F0F5FA] rounded-lg">
                <span>Interaksi &amp; Kontak</span>
                <span className="text-[9.5px] text-[#526783] font-semibold font-mono">2 Menu</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'contact'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <PhoneCall className={`w-4 h-4 shrink-0 ${activeTab === 'contact' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                <span className="truncate">Kontak &amp; Alamat Kantor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-[#073B78] text-white font-bold shadow-md shadow-[#073B78]/25'
                    : 'text-[#526783] hover:text-[#073B78] hover:bg-[#F0F5FA] font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Inbox className={`w-4 h-4 shrink-0 ${activeTab === 'inquiries' ? 'text-[#FF9D2E]' : 'text-[#0A4B91]'}`} />
                  <span className="truncate">Pesan Masuk (Formulir)</span>
                </div>
                {inquiries.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold shrink-0 ml-1.5">
                    {inquiries.length} baru
                  </span>
                )}
              </button>
            </div>
          </aside>

          {/* Mobile & Tablet Quick Navigation Selector (< lg) - Clean White & Blue */}
          <div className="lg:hidden col-span-1 space-y-3 bg-white border border-[#DCE7F5] rounded-2xl p-4 shadow-sm text-[#102D52] sticky top-16 z-30 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-[#DCE7F5] pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9D2E]" />
                <span className="text-xs font-bold text-[#073B78] uppercase tracking-wider">Bagian Konten Aktif</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF3FC] text-[#073B78] border border-[#073B78]/20 font-mono font-bold">
                13 Menu
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mobile-tab-select" className="text-[11px] text-[#526783] block font-medium">
                Pilih menu konten yang diedit:
              </label>
              <div className="relative">
                <select
                  id="mobile-tab-select"
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value as any);
                  }}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#073B78] font-bold text-xs sm:text-sm focus:outline-none focus:border-[#073B78] appearance-none cursor-pointer"
                >
                  <optgroup label="TAMPILAN BERANDA">
                    <option value="banners">Banner Promosi Atas ({content.bannerSlides?.length || 0})</option>
                    <option value="intro-features">Statistik &amp; Keunggulan</option>
                    <option value="buying-process">Alur Pembelian Rumah</option>
                    <option value="kpr-simulation">Simulasi KPR FLPP 5%</option>
                    <option value="promo-popup">Popup Iklan Promo ({content.promoPopup?.enabled ? 'AKTIF' : 'OFF'})</option>
                  </optgroup>
                  <optgroup label="PROFIL PERUSAHAAN">
                    <option value="branding">Branding, Logo &amp; Footer</option>
                    <option value="about">Tentang, Visi &amp; Misi</option>
                    <option value="leadership">Dewan Pengurus ({content.leadership?.members?.length || 0})</option>
                    <option value="legal">Legalitas &amp; Notaris</option>
                  </optgroup>
                  <optgroup label="PROYEK &amp; LAPANGAN">
                    <option value="project">Proyek Puri Gunung Langgar</option>
                    <option value="activities">Kegiatan Lapangan Riil ({content.activities?.items?.length || 0})</option>
                  </optgroup>
                  <optgroup label="INTERAKSI &amp; KONTAK">
                    <option value="contact">Kontak &amp; Alamat Kantor</option>
                    <option value="inquiries">Pesan Masuk (Formulir) {inquiries.length > 0 ? `(${inquiries.length} baru)` : ''}</option>
                  </optgroup>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#073B78]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Category Chips for Fast 1-Tap Switching */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
              {[
                { id: 'banners', label: 'Banner' },
                { id: 'intro-features', label: 'Keunggulan' },
                { id: 'buying-process', label: 'Alur Beli' },
                { id: 'kpr-simulation', label: 'KPR FLPP' },
                { id: 'promo-popup', label: 'Iklan Promo' },
                { id: 'branding', label: 'Branding' },
                { id: 'about', label: 'Tentang' },
                { id: 'leadership', label: 'Pengurus' },
                { id: 'legal', label: 'Legalitas' },
                { id: 'project', label: 'Proyek' },
                { id: 'activities', label: 'Kegiatan' },
                { id: 'contact', label: 'Kontak' },
                { id: 'inquiries', label: `Pesan ${inquiries.length > 0 ? `(${inquiries.length})` : ''}` },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(chip.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === chip.id
                      ? 'bg-[#073B78] text-white font-bold shadow-xs'
                      : 'bg-[#F8FAFD] text-[#526783] hover:text-[#073B78] border border-[#DCE7F5]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content Column (lg:col-span-9) */}
          <div className="lg:col-span-9 space-y-5">
            {/* Dynamic Executive Breadcrumbs & Tab Banner */}
            <div className="bg-white border border-[#DCE7F5] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#073B78] to-[#0A4B91] text-[#FF9D2E] flex items-center justify-center shrink-0 shadow-md border border-[#0A4B91]/30">
                  {renderTabIcon(activeTab)}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#526783] uppercase tracking-wider mb-0.5">
                    <span>Admin Studio</span>
                    <span>/</span>
                    <span className="text-[#073B78] font-extrabold">{TAB_GROUPS[activeTab]?.group}</span>
                  </div>
                  <h1 className="text-base sm:text-lg font-bold text-[#073B78] tracking-tight">
                    {TAB_GROUPS[activeTab]?.title}
                  </h1>
                  <p className="text-xs text-[#526783] mt-0.5 max-w-2xl leading-relaxed">
                    {TAB_GROUPS[activeTab]?.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl bg-[#073B78] hover:bg-[#0A4B91] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-[#073B78]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 shrink-0" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Form Content Editor Container */}
            <div id="admin-form-editor" className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs">
            {/* TAB: PROMO BANNERS CAROUSEL */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                      <Film className="w-5 h-5 text-[#FF9D2E]" />
                      Slide Banner Promosi Berjalan (Top Carousel)
                    </h2>
                    <p className="text-xs text-[#526783] mt-1">
                      Kelola slide banner beranda di bagian paling atas (Puri Gunung Langgar, KPR FLPP 5%, Legalitas SHM, dll.).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSlides = Array.isArray(content.bannerSlides) ? content.bannerSlides : [];
                      const newSlide: BannerSlide = {
                        id: `slide-${Date.now()}`,
                        eyebrow: 'PROMO UNGGULAN • TERBARU',
                        headlineFirstLine: 'Hunian Nyaman Impian Anda,',
                        headlineHighlight: 'bersama PT. TBK Lampung.',
                        supportingText: 'Perumahan bersubsidi berkualitas dengan kemudahan akses, angsuran terjangkau, dan legalitas resmi terjamin.',
                        primaryCtaText: 'Lihat Detail',
                        primaryCtaHref: '/proyek',
                        secondaryCtaText: 'Konsultasi WhatsApp',
                        secondaryCtaHref: 'https://wa.me/6281278901234',
                        isSecondaryExternal: true,
                        image: '',
                        imageAlt: '',
                        mediaType: 'image',
                        videoUrl: '',
                      };
                      setContent({ ...content, bannerSlides: [...currentSlides, newSlide] });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-bold shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Slide Banner Baru</span>
                  </button>
                </div>

                {/* Slides List */}
                <div className="space-y-6">
                  {(!content.bannerSlides || content.bannerSlides.length === 0) ? (
                    <div className="p-8 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] text-center text-[#526783] text-sm">
                      Belum ada slide banner kustom. Klik tombol di atas untuk menambahkan slide baru.
                    </div>
                  ) : (
                    content.bannerSlides.map((slide, sIdx) => (
                      <div
                        key={slide.id || sIdx}
                        className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] hover:border-[#FF9D2E]/50 shadow-xs transition-all space-y-5"
                      >
                        {/* Slide Card Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE7F5] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-[#073B78] text-[#FF9D2E] font-bold text-xs flex items-center justify-center shadow-xs">
                              {sIdx + 1}
                            </span>
                            <span className="font-bold text-[#073B78] text-sm">
                              {slide.eyebrow || `Slide Banner #${sIdx + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={sIdx === 0}
                              onClick={() => {
                                const newSlides = [...(content.bannerSlides || [])];
                                const temp = newSlides[sIdx];
                                newSlides[sIdx] = newSlides[sIdx - 1];
                                newSlides[sIdx - 1] = temp;
                                setContent({ ...content, bannerSlides: newSlides });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-[#EBF3FC] text-[#073B78] border border-[#DCE7F5] disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Geser Ke Atas"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={sIdx === (content.bannerSlides?.length || 1) - 1}
                              onClick={() => {
                                const newSlides = [...(content.bannerSlides || [])];
                                const temp = newSlides[sIdx];
                                newSlides[sIdx] = newSlides[sIdx + 1];
                                newSlides[sIdx + 1] = temp;
                                setContent({ ...content, bannerSlides: newSlides });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-[#EBF3FC] text-[#073B78] border border-[#DCE7F5] disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Geser Ke Bawah"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newSlides = (content.bannerSlides || []).filter((_, i) => i !== sIdx);
                                setContent({ ...content, bannerSlides: newSlides });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Slide banner berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan secara permanen.',
                                });
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 ml-1"
                              title="Hapus Slide Ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Banner Media (Foto atau Video) */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                          <div className="md:col-span-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-bold text-[#073B78]">
                                Media Background Banner
                              </label>
                              {/* Toggle Foto vs Video */}
                              <div className="inline-flex rounded-lg bg-[#EBF3FC] p-0.5 border border-[#DCE7F5]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].mediaType = 'image';
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                                    (slide.mediaType || 'image') === 'image'
                                      ? 'bg-[#073B78] text-white shadow-xs'
                                      : 'text-[#073B78] hover:text-[#0A4B91]'
                                  }`}
                                >
                                  <ImageIcon className="w-3 h-3" />
                                  <span>Foto</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].mediaType = 'video';
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                                    slide.mediaType === 'video'
                                      ? 'bg-[#FF9D2E] text-[#071C38] shadow-xs'
                                      : 'text-[#073B78] hover:text-[#0A4B91]'
                                  }`}
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Video</span>
                                </button>
                              </div>
                            </div>

                            <LivePreviewBadge />
                            {/* PREVIEW CONTAINER */}
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black border border-[#DCE7F5] group">
                              {slide.mediaType === 'video' && slide.videoUrl ? (
                                getYouTubeEmbedUrl(slide.videoUrl) ? (
                                  <iframe
                                    src={getYouTubeEmbedUrl(slide.videoUrl)!}
                                    title="Preview YouTube Banner"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  />
                                ) : (
                                  <video
                                    src={slide.videoUrl}
                                    controls
                                    poster={slide.image || undefined}
                                    className="w-full h-full object-cover"
                                  />
                                )
                              ) : slide.image ? (
                                <img
                                  src={slide.image}
                                  alt={slide.imageAlt || 'Banner preview'}
                                  style={{
                                    objectFit: slide.imageFit || 'cover',
                                    objectPosition: `${slide.imageOffsetX !== undefined ? slide.imageOffsetX : 50}% ${slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}%`,
                                    transform: `scale(${(slide.imageZoom !== undefined ? slide.imageZoom : 100) / 100})`,
                                  }}
                                  className="w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4F7FC] text-[#526783] text-xs p-4 text-center">
                                  <ImageIcon className="w-8 h-8 text-[#526783]/40 mb-1.5" />
                                  <span className="font-semibold text-[#073B78]">Belum Ada Foto / Media</span>
                                  <span className="text-[10.5px] text-[#526783]">Upload foto atau masukkan link video</span>
                                </div>
                              )}
                            </div>

                            {/* VIDEO CONTROLS */}
                            {slide.mediaType === 'video' ? (
                              <div className="space-y-2 pt-1">
                                <div className="space-y-1">
                                  <label className="text-[11px] font-semibold text-[#073B78] block">
                                    Link Video (YouTube atau URL MP4)
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="https://youtube.com/watch?v=... atau /uploads/...mp4"
                                      value={slide.videoUrl || ''}
                                      onChange={(e) => {
                                        let val = e.target.value;
                                        if (val.includes('<iframe') || /src=["']/i.test(val)) {
                                          const match = val.match(/src=["']([^"']+)["']/i);
                                          if (match && match[1]) val = match[1];
                                        }
                                        const newSlides = [...(content.bannerSlides || [])];
                                        newSlides[sIdx].videoUrl = val;
                                        newSlides[sIdx].mediaType = 'video';
                                        setContent({ ...content, bannerSlides: newSlides });
                                      }}
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono font-semibold"
                                    />
                                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#FF9D2E] hover:bg-[#F28A17] text-[#071C38] text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>{uploadingKey === `banner-video-${sIdx}` ? 'Uploading...' : 'Upload MP4'}</span>
                                      <input
                                        type="file"
                                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                        className="hidden"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleGenericFileUpload(e.target.files[0], `banner-video-${sIdx}`, (url) => {
                                              const newSlides = [...(content.bannerSlides || [])];
                                              newSlides[sIdx].videoUrl = url;
                                              newSlides[sIdx].mediaType = 'video';
                                              setContent({ ...content, bannerSlides: newSlides });
                                            });
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>

                                {/* Poster Fallback Image */}
                                <div className="space-y-1 pt-1">
                                  <label className="text-[11px] text-[#526783] block font-medium">
                                    Foto Cover / Poster (Muncul saat video loading):
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="URL Cover (Opsional)"
                                      value={slide.image || ''}
                                      onChange={(e) => {
                                        const newSlides = [...(content.bannerSlides || [])];
                                        newSlides[sIdx].image = e.target.value;
                                        setContent({ ...content, bannerSlides: newSlides });
                                      }}
                                      className="flex-1 px-3 py-1 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono"
                                    />
                                    <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-[#DCE7F5] text-xs text-[#073B78] font-semibold flex items-center gap-1 shrink-0">
                                      <Upload className="w-3 h-3" />
                                      <span>Poster</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleGenericFileUpload(e.target.files[0], `banner-poster-${sIdx}`, (url) => {
                                              const newSlides = [...(content.bannerSlides || [])];
                                              newSlides[sIdx].image = url;
                                              setContent({ ...content, bannerSlides: newSlides });
                                            });
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* FOTO / GAMBAR CONTROLS */
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 pt-1">
                                  <input
                                    type="text"
                                    placeholder="/assets/... atau URL gambar"
                                    value={slide.image}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      const isVideoLink = val.includes('youtube.com') || val.includes('youtu.be') || val.endsWith('.mp4') || val.endsWith('.webm');
                                      const newSlides = [...(content.bannerSlides || [])];
                                      if (isVideoLink) {
                                        newSlides[sIdx].videoUrl = val;
                                        newSlides[sIdx].mediaType = 'video';
                                      } else {
                                        newSlides[sIdx].image = val;
                                      }
                                      setContent({ ...content, bannerSlides: newSlides });
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono font-semibold"
                                  />
                                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{uploadingKey === `banner-${sIdx}` ? '...' : 'Upload'}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleGenericFileUpload(e.target.files[0], `banner-${sIdx}`, (url) => {
                                            const newSlides = [...(content.bannerSlides || [])];
                                            newSlides[sIdx].image = url;
                                            setContent({ ...content, bannerSlides: newSlides });
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                                {slide.image && (<ImageAdjustmentControl
                                    title="Ukuran, Posisi & Crop Banner"
                                    fit={slide.imageFit || 'cover'}
                                    offsetX={slide.imageOffsetX !== undefined ? slide.imageOffsetX : 50}
                                    offsetY={slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}
                                    zoom={slide.imageZoom !== undefined ? slide.imageZoom : 100}
                                    onChange={({ fit, offsetX, offsetY, zoom }) => {
                                      const newSlides = [...(content.bannerSlides || [])];
                                      newSlides[sIdx].imageFit = fit;
                                      newSlides[sIdx].imageOffsetX = offsetX;
                                      newSlides[sIdx].imageOffsetY = offsetY;
                                      newSlides[sIdx].imageZoom = zoom;
                                      setContent({ ...content, bannerSlides: newSlides });
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Banner Text Fields */}
                          <div className="md:col-span-8 space-y-3.5">
                            <div>
                              <label className="block text-xs font-bold text-[#073B78] mb-1">
                                Label Atas (Eyebrow Badge)
                              </label>
                              <input
                                type="text"
                                value={slide.eyebrow}
                                placeholder="Contoh: Puri Gunung Langgar • Proyek Berjalan"
                                onChange={(e) => {
                                  const newSlides = [...(content.bannerSlides || [])];
                                  newSlides[sIdx].eyebrow = e.target.value;
                                  setContent({ ...content, bannerSlides: newSlides });
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-[#073B78] mb-1">
                                  Headline Baris 1 (Putih)
                                </label>
                                <input
                                  type="text"
                                  value={slide.headlineFirstLine}
                                  placeholder="Contoh: Hunian bersubsidi yang layak,"
                                  onChange={(e) => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].headlineFirstLine = e.target.value;
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#C76A08] mb-1">
                                  Headline Highlight (Warna Emas / Kuning)
                                </label>
                                <input
                                  type="text"
                                  value={slide.headlineHighlight}
                                  placeholder="Contoh: dibangun dari Lampung."
                                  onChange={(e) => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].headlineHighlight = e.target.value;
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#C76A08] text-xs focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-bold"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#073B78] mb-1">
                                Deskripsi Pendukung (Paragraf Ringkas)
                              </label>
                              <textarea
                                rows={2}
                                value={slide.supportingText}
                                onChange={(e) => {
                                  const newSlides = [...(content.bannerSlides || [])];
                                  newSlides[sIdx].supportingText = e.target.value;
                                  setContent({ ...content, bannerSlides: newSlides });
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                              />
                            </div>

                            {/* CTA Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-[#DCE7F5]">
                              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#DCE7F5]">
                                <span className="text-[11px] font-bold text-[#073B78] uppercase">Tombol Utama 1</span>
                                <input
                                  type="text"
                                  placeholder="Label Tombol (misal: Lihat Proyek)"
                                  value={slide.primaryCtaText}
                                  onChange={(e) => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].primaryCtaText = e.target.value;
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                                />
                                <input
                                  type="text"
                                  placeholder="Tujuan Link (misal: /proyek)"
                                  value={slide.primaryCtaHref}
                                  onChange={(e) => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].primaryCtaHref = e.target.value;
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783] font-mono"
                                />
                              </div>

                              <div className="space-y-1.5 p-3 rounded-xl bg-white border border-[#DCE7F5]">
                                <span className="text-[11px] font-bold text-[#073B78] uppercase">Tombol Sekunder 2</span>
                                <input
                                  type="text"
                                  placeholder="Label Tombol (misal: Konsultasi WhatsApp)"
                                  value={slide.secondaryCtaText}
                                  onChange={(e) => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].secondaryCtaText = e.target.value;
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                                />
                                <input
                                  type="text"
                                  placeholder="Tujuan Link (misal: /kontak atau wa URL)"
                                  value={slide.secondaryCtaHref}
                                  onChange={(e) => {
                                    const newSlides = [...(content.bannerSlides || [])];
                                    newSlides[sIdx].secondaryCtaHref = e.target.value;
                                    setContent({ ...content, bannerSlides: newSlides });
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783] font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: HOME INTRO & 4 FEATURES */}
            {activeTab === 'intro-features' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF9D2E]" />
                    Statistik &amp; Keunggulan Beranda
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Kelola 4 angka indikator rekam jejak perseroan (bar biru di bawah banner), narasi sambutan, dan 4 kartu keunggulan PT. TBK.
                  </p>
                </div>

                {/* 1. 4 STATISTIK & REKAM JEJAK PERSEROAN */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <div className="border-b border-[#DCE7F5] pb-3">
                    <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF9D2E]" />
                      <span>4 Indikator Rekam Jejak Perseroan (Bar Biru Beranda)</span>
                    </h3>
                    <p className="text-xs text-[#526783] mt-0.5">
                      Nilai dan label resmi yang tampil pada bar biru tepat di bawah banner berjalan beranda.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(content.hero?.stats || [
                      { label: "Domisili Perusahaan", value: "Bandar Lampung" },
                      { label: "Pengesahan Kemenkumham", value: "2021" },
                      { label: "Proyek Utama", value: "Puri Gunung Langgar" },
                      { label: "Kategori Pembangunan", value: "Hunian Bersubsidi" }
                    ]).map((stat, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#DCE7F5] space-y-2">
                        <span className="text-[10px] font-bold text-[#FF9D2E] uppercase">Indikator #{idx + 1}</span>
                        <div>
                          <label className="text-[11px] text-[#526783] block font-medium mb-1">Nilai / Angka</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...(content.hero?.stats || [])];
                              newStats[idx] = { ...newStats[idx], value: e.target.value };
                              setContent({
                                ...content,
                                hero: { ...content.hero, stats: newStats },
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] text-[#102D52] text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-[#526783] block font-medium mb-1">Keterangan Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...(content.hero?.stats || [])];
                              newStats[idx] = { ...newStats[idx], label: e.target.value };
                              setContent({
                                ...content,
                                hero: { ...content.hero, stats: newStats },
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-[#526783] text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bagian Kiri: Headline & Intro Beranda */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider">
                    Narasi Perkenalan Beranda (Kolom Kiri)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Label Badge Kecil
                      </label>
                      <input
                        type="text"
                        value={content.about.homeIntroBadge || 'Tentang Kami'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, homeIntroBadge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Judul Baris 1
                      </label>
                      <input
                        type="text"
                        value={content.about.homeIntroTitle || 'Membangun Rumah,'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, homeIntroTitle: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#C76A08] mb-1">
                        Judul Baris 2 (Highlight)
                      </label>
                      <input
                        type="text"
                        value={content.about.homeIntroHighlight || 'Mewujudkan Masa Depan.'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, homeIntroHighlight: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#C76A08] text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi Paragraf Singkat
                    </label>
                    <textarea
                      rows={3}
                      value={content.about.homeIntroText || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, homeIntroText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Teks Tombol CTA
                      </label>
                      <input
                        type="text"
                        value={content.about.homeIntroCtaText || 'Kenal Lebih Dekat'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, homeIntroCtaText: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Tautan Tombol CTA (Link)
                      </label>
                      <input
                        type="text"
                        value={content.about.homeIntroCtaLink || '/tentang'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, homeIntroCtaLink: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#526783] text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Kartu Keunggulan (Grid 2x2) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7F5] pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-2">
                        <span>Kartu Keunggulan Beranda</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 font-sans font-semibold">
                          {(Array.isArray(content.about.features) ? content.about.features : [
                            { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                            { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                            { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                            { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                          ]).length} Kartu
                        </span>
                      </h3>
                      <p className="text-xs text-[#526783] mt-0.5">
                        Kartu ringkas yang menampilkan keunggulan hunian bersubsidi PT. TBK di kolom kanan seksi Tentang Kami.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const currentFeatures = Array.isArray(content.about.features)
                          ? [...content.about.features]
                          : [
                              { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                              { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                              { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                              { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                            ];
                        setContent({
                          ...content,
                          about: {
                            ...content.about,
                            features: [
                              ...currentFeatures,
                              {
                                title: 'Keunggulan Baru',
                                desc: 'Deskripsi singkat keunggulan perumahan...',
                                icon: 'home',
                              },
                            ],
                          },
                        });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Kartu Keunggulan</span>
                    </button>
                  </div>

                  {/* Feature Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {(Array.isArray(content.about.features)
                      ? content.about.features
                      : [
                          { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                          { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                          { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                          { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                        ]
                    ).length === 0 ? (
                      <div className="sm:col-span-2 p-8 rounded-xl bg-white border border-[#DCE7F5] text-center text-[#526783] space-y-2">
                        <Sparkles className="w-8 h-8 mx-auto text-[#526783]" />
                        <p className="text-xs font-medium text-[#526783]">Belum ada kartu keunggulan.</p>
                        <p className="text-[11px] text-[#526783]">Klik &quot;Tambah Kartu Keunggulan&quot; di atas untuk menambahkan poin keunggulan baru.</p>
                      </div>
                    ) : (
                      (Array.isArray(content.about.features)
                        ? content.about.features
                        : [
                            { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                            { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                            { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                            { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                          ]
                      ).map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3 relative group hover:border-[#FF9D2E]/30 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 border-b border-[#DCE7F5] pb-2">
                            <span className="text-xs font-bold text-[#FF9D2E]">
                              Kartu #{fIdx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-[#526783]">Ikon:</span>
                                <select
                                  value={feature.icon || 'home'}
                                  onChange={(e) => {
                                    const currentFeatures = Array.isArray(content.about.features)
                                      ? [...content.about.features]
                                      : [
                                          { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                                          { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                                          { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                                          { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                                        ];
                                    currentFeatures[fIdx].icon = e.target.value;
                                    setContent({
                                      ...content,
                                      about: { ...content.about, features: currentFeatures },
                                    });
                                  }}
                                  className="px-2 py-1 rounded bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                                >
                                  <option value="home">Rumah (Home)</option>
                                  <option value="shield">Perlindungan / Harga (Shield)</option>
                                  <option value="map">Lokasi Strategis (MapPin)</option>
                                  <option value="leaf">Lingkungan Asri (Leaf)</option>
                                  <option value="wallet">Finansial / Angsuran (Wallet)</option>
                                  <option value="building">Kawasan (Building)</option>
                                </select>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const currentFeatures = Array.isArray(content.about.features)
                                    ? [...content.about.features]
                                    : [];
                                  const newFeatures = currentFeatures.filter((_, i) => i !== fIdx);
                                  setContent({
                                    ...content,
                                    about: { ...content.about, features: newFeatures },
                                  });
                                  setSaveStatus({
                                    type: 'success',
                                    message: 'Kartu keunggulan berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan.',
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs flex items-center gap-1 transition-colors"
                                title="Hapus kartu ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Hapus</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-[#526783] mb-1">
                              Judul Keunggulan
                            </label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                const currentFeatures = Array.isArray(content.about.features)
                                  ? [...content.about.features]
                                  : [
                                      { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                                      { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                                      { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                                      { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                                    ];
                                currentFeatures[fIdx].title = e.target.value;
                                setContent({
                                  ...content,
                                  about: { ...content.about, features: currentFeatures },
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-[#526783] mb-1">
                              Deskripsi Singkat
                            </label>
                            <textarea
                              rows={2}
                              value={feature.desc}
                              onChange={(e) => {
                                const currentFeatures = Array.isArray(content.about.features)
                                  ? [...content.about.features]
                                  : [
                                      { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                                      { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                                      { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                                      { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                                    ];
                                currentFeatures[fIdx].desc = e.target.value;
                                setContent({
                                  ...content,
                                  about: { ...content.about, features: currentFeatures },
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BUYING PROCESS STEPS */}
            {activeTab === 'buying-process' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#FF9D2E]" />
                      Tahapan Pembelian Rumah Subsidi (Panduan Konsumen)
                    </h2>
                    <p className="text-xs text-[#526783] mt-1">
                      Kelola 4 langkah alur pengajuan dari pemilihan unit/kavling hingga serah terima kunci.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSteps = Array.isArray(content.buyingProcess?.steps) ? content.buyingProcess.steps : [];
                      const stepNumber = String(currentSteps.length + 1).padStart(2, '0');
                      const newStep: PurchaseStep = {
                        step: stepNumber,
                        title: 'Langkah Pembelian Baru',
                        desc: 'Deskripsi penjelasan tahapan pengajuan yang perlu dipersiapkan oleh konsumen.',
                        highlight: 'Didampingi tim admin resmi',
                      };
                      setContent({
                        ...content,
                        buyingProcess: {
                          badge: content.buyingProcess?.badge || 'PANDUAN KONSUMEN',
                          title: content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi',
                          subtitle: content.buyingProcess?.subtitle || 'Alur pengajuan yang transparan dan terstruktur bagi masyarakat, dari pemilihan kavling hingga serah terima kunci.',
                          steps: [...currentSteps, newStep],
                        },
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-bold shadow-xs flex items-center gap-2 transition-all self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Langkah Baru</span>
                  </button>
                </div>

                {/* Header Information */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Label Badge Bagian
                      </label>
                      <input
                        type="text"
                        value={content.buyingProcess?.badge || 'PANDUAN KONSUMEN'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            buyingProcess: {
                              badge: e.target.value,
                              title: content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi',
                              subtitle: content.buyingProcess?.subtitle || '',
                              steps: content.buyingProcess?.steps || [],
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Judul Utama Bagian
                      </label>
                      <input
                        type="text"
                        value={content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            buyingProcess: {
                              badge: content.buyingProcess?.badge || 'PANDUAN KONSUMEN',
                              title: e.target.value,
                              subtitle: content.buyingProcess?.subtitle || '',
                              steps: content.buyingProcess?.steps || [],
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={content.buyingProcess?.subtitle || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          buyingProcess: {
                            badge: content.buyingProcess?.badge || 'PANDUAN KONSUMEN',
                            title: content.buyingProcess?.title || 'Tahapan Pembelian Rumah Subsidi',
                            subtitle: e.target.value,
                            steps: content.buyingProcess?.steps || [],
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                    />
                  </div>
                </div>

                {/* Steps Cards */}
                <div className="space-y-4">
                  {(content.buyingProcess?.steps || []).map((stepItem, stepIdx) => (
                    <div
                      key={stepIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] hover:border-[#FF9D2E]/50 shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-[#DCE7F5] pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="text"
                            value={stepItem.step}
                            onChange={(e) => {
                              const newSteps = [...(content.buyingProcess?.steps || [])];
                              newSteps[stepIdx].step = e.target.value;
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                            }}
                            className="w-14 px-2.5 py-1 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] text-center font-mono font-bold text-[#FF9D2E] text-xs"
                            placeholder="01"
                          />
                          <input
                            type="text"
                            value={stepItem.title}
                            onChange={(e) => {
                              const newSteps = [...(content.buyingProcess?.steps || [])];
                              newSteps[stepIdx].title = e.target.value;
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                            }}
                            className="flex-1 px-3 py-1 rounded-lg bg-white border border-[#DCE7F5] text-[#102D52] font-semibold text-xs"
                            placeholder="Judul Tahapan"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={stepIdx === 0}
                            onClick={() => {
                              const newSteps = [...(content.buyingProcess?.steps || [])];
                              const temp = newSteps[stepIdx];
                              newSteps[stepIdx] = newSteps[stepIdx - 1];
                              newSteps[stepIdx - 1] = temp;
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#526783] hover:text-white disabled:opacity-30"
                            title="Geser Naik"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={stepIdx === (content.buyingProcess?.steps?.length || 1) - 1}
                            onClick={() => {
                              const newSteps = [...(content.buyingProcess?.steps || [])];
                              const temp = newSteps[stepIdx];
                              newSteps[stepIdx] = newSteps[stepIdx + 1];
                              newSteps[stepIdx + 1] = temp;
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#526783] hover:text-white disabled:opacity-30"
                            title="Geser Turun"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newSteps = (content.buyingProcess?.steps || []).filter((_, i) => i !== stepIdx);
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                              setSaveStatus({
                                type: 'success',
                                message: 'Langkah tahapan berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan secara permanen.',
                              });
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 ml-1"
                            title="Hapus Langkah"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                        <div className="sm:col-span-8">
                          <label className="block text-[11px] font-medium text-[#526783] mb-1">
                            Deskripsi Tahapan
                          </label>
                          <textarea
                            rows={2}
                            value={stepItem.desc}
                            onChange={(e) => {
                              const newSteps = [...(content.buyingProcess?.steps || [])];
                              newSteps[stepIdx].desc = e.target.value;
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                          />
                        </div>
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-medium text-[#526783] mb-1">
                            Pita Highlight Bawah
                          </label>
                          <input
                            type="text"
                            value={stepItem.highlight}
                            onChange={(e) => {
                              const newSteps = [...(content.buyingProcess?.steps || [])];
                              newSteps[stepIdx].highlight = e.target.value;
                              setContent({
                                ...content,
                                buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                              });
                            }}
                            placeholder="Contoh: Sertifikat Hak Milik (SHM)"
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#C76A08]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: KPR SIMULATION CONFIG */}
            {activeTab === 'kpr-simulation' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#FF9D2E]" />
                    Simulasi Angsuran KPR & Program Subsidi FLPP
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Kelola parameter kalkulator simulasi angsuran di beranda beserta daftar poin keuntungan program FLPP 5%.
                  </p>
                </div>

                {/* Headings */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider">
                    Judul & Teks Bagian
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Label Badge Bagian
                      </label>
                      <input
                        type="text"
                        value={content.kprSimulation?.badge || 'KALKULATOR FINANSIAL'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            kprSimulation: {
                              ...content.kprSimulation!,
                              badge: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Judul Utama
                      </label>
                      <input
                        type="text"
                        value={content.kprSimulation?.title || 'Simulasi Angsuran KPR Bersubsidi'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            kprSimulation: {
                              ...content.kprSimulation!,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi Subtitle
                    </label>
                    <textarea
                      rows={2}
                      value={content.kprSimulation?.subtitle || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          kprSimulation: {
                            ...content.kprSimulation!,
                            subtitle: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs"
                    />
                  </div>
                </div>

                {/* Parameter Kalkulator */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider">
                    Nilai Default & Parameter Simulasi FLPP
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Harga Rumah Default (Rp)
                      </label>
                      <input
                        type="number"
                        value={content.kprSimulation?.defaultPrice || 166000000}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            kprSimulation: {
                              ...content.kprSimulation!,
                              defaultPrice: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Uang Muka (DP) Default (Rp)
                      </label>
                      <input
                        type="number"
                        value={content.kprSimulation?.defaultDp || 2000000}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            kprSimulation: {
                              ...content.kprSimulation!,
                              defaultDp: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Tenor Default (Tahun)
                      </label>
                      <input
                        type="number"
                        value={content.kprSimulation?.defaultTenor || 20}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            kprSimulation: {
                              ...content.kprSimulation!,
                              defaultTenor: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Suku Bunga Tetap Per Tahun (Desimal, misal 0.05 = 5%)
                      </label>
                      <input
                        type="number"
                        step="0.005"
                        value={content.kprSimulation?.annualInterestRate || 0.05}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            kprSimulation: {
                              ...content.kprSimulation!,
                              annualInterestRate: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#C76A08] text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider">
                      Daftar Keuntungan / Benefit Program KPR Subsidi
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const currentBenefits = Array.isArray(content.kprSimulation?.benefits)
                          ? content.kprSimulation.benefits
                          : [];
                        setContent({
                          ...content,
                          kprSimulation: {
                            ...content.kprSimulation!,
                            benefits: [...currentBenefits, 'Keuntungan baru program KPR bersubsidi'],
                          },
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    {(content.kprSimulation?.benefits || []).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...(content.kprSimulation?.benefits || [])];
                            newBenefits[bIdx] = e.target.value;
                            setContent({
                              ...content,
                              kprSimulation: {
                                ...content.kprSimulation!,
                                benefits: newBenefits,
                              },
                            });
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBenefits = (content.kprSimulation?.benefits || []).filter((_, i) => i !== bIdx);
                            setContent({
                              ...content,
                              kprSimulation: {
                                ...content.kprSimulation!,
                                benefits: newBenefits,
                              },
                            });
                            setSaveStatus({
                              type: 'success',
                              message: 'Poin keuntungan KPR berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan secara permanen.',
                            });
                          }}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: POPUP IKLAN PROMO */}
            {activeTab === 'promo-popup' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-[#FF9D2E]" />
                        Popup Iklan Promo (Muncul Saat Baru Buka)
                      </h2>
                      <p className="text-xs text-[#526783] mt-1">
                        Atur banner promo yang otomatis muncul saat pengunjung baru membuka website. Iklan dapat ditutup pengunjung dengan tombol [X].
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 ${
                          content.promoPopup?.enabled
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            content.promoPopup?.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        />
                        <span>{content.promoPopup?.enabled ? 'Status: Iklan Aktif' : 'Status: Dinonaktifkan'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* MASTER SWITCH: ON / OFF BANNER PROMO */}
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    content.promoPopup?.enabled
                      ? 'bg-gradient-to-r from-emerald-50/80 via-white to-white border-emerald-300 shadow-sm'
                      : 'bg-[#F8FAFD] border-[#DCE7F5]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#073B78]">
                          Aktivasi Pop-up Iklan Promo di Beranda
                        </span>
                        {content.promoPopup?.enabled ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-600 text-white uppercase tracking-wider">
                            Aktif Tayang
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-400 text-white uppercase tracking-wider">
                            Mati (OFF)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#526783] max-w-xl leading-relaxed">
                        {content.promoPopup?.enabled
                          ? '✅ Iklan sedang AKTIF. Setiap pengunjung yang baru membuka halaman beranda akan langsung melihat pop-up iklan ini (bisa ditutup dengan tombol "X").'
                          : '⭕ Iklan sedang NONAKTIF. Pengunjung tidak akan melihat pop-up iklan saat membuka website.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newEnabled = !(content.promoPopup?.enabled);
                        setContent({
                          ...content,
                          promoPopup: {
                            ...(content.promoPopup || {
                              image: '/assets/project-workspace.jpg',
                              badge: 'PROMO SPESIAL TERBATAS',
                              title: 'Program Subsidi KPR Puri Gunung Langgar',
                              description: 'Dapatkan subsidi uang muka dan kemudahan proses berkas!',
                              ctaText: 'Konsultasi Promo WhatsApp',
                              ctaUrl: 'https://wa.me/6281278901234',
                            }),
                            enabled: newEnabled,
                          },
                        });
                        setSaveStatus({
                          type: 'success',
                          message: newEnabled
                            ? 'Iklan Promo DIAKTIFKAN! Jangan lupa klik "Simpan ke SQL" di pojok kanan atas.'
                            : 'Iklan Promo DINONAKTIFKAN! Jangan lupa klik "Simpan ke SQL" di pojok kanan atas.',
                        });
                      }}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm ${
                        content.promoPopup?.enabled
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                          : 'bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78]'
                      }`}
                    >
                      {content.promoPopup?.enabled ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Matikan Iklan Promo</span>
                        </>
                      ) : (
                        <>
                          <Megaphone className="w-4 h-4 text-[#FF9D2E]" />
                          <span>Nyalakan Iklan Promo Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* FORM PENGATURAN FOTO & KONTEN IKLAN */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Form Inputs */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Upload Banner Foto */}
                    <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                      <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider">
                        Foto / Banner Iklan Promo
                      </label>
                      <p className="text-[11px] text-[#526783]">
                        Upload gambar brosur, poster promo perumahan, atau banner diskon (rekomendasi rasio horizontal 16:9 atau 4:3).
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="w-28 h-20 rounded-lg bg-white border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                          {content.promoPopup?.image ? (
                            <img
                              src={content.promoPopup.image}
                              alt="Banner Promo"
                              style={{
                                objectFit: content.promoPopup.imageFit || 'cover',
                                objectPosition: `${content.promoPopup.imageOffsetX !== undefined ? content.promoPopup.imageOffsetX : 50}% ${content.promoPopup.imageOffsetY !== undefined ? content.promoPopup.imageOffsetY : 50}%`,
                                transform: `scale(${(content.promoPopup.imageZoom !== undefined ? content.promoPopup.imageZoom : 100) / 100})`,
                              }}
                              className="w-full h-full"
                            />
                          ) : (
                            <span className="text-[10px] text-[#526783]">Belum ada foto</span>
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <input
                            type="text"
                            value={content.promoPopup?.image || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                promoPopup: {
                                  ...(content.promoPopup || { enabled: false }),
                                  image: e.target.value,
                                },
                              })
                            }
                            placeholder="URL gambar (/assets/... atau /uploads/...)"
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                          />

                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingKey === 'promoPopupImage' ? 'Mengupload...' : 'Upload Foto Iklan'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingKey === 'promoPopupImage'}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleGenericFileUpload(e.target.files[0], 'promoPopupImage', (url) => {
                                      setContent({
                                        ...content,
                                        promoPopup: {
                                          ...(content.promoPopup || { enabled: false }),
                                          image: url,
                                        },
                                      });
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {content.promoPopup?.image && (<ImageAdjustmentControl
                                    title="Ukuran, Posisi & Crop Foto Iklan Promo"
                          fit={content.promoPopup.imageFit || 'contain'}
                          offsetX={content.promoPopup.imageOffsetX !== undefined ? content.promoPopup.imageOffsetX : 50}
                          offsetY={content.promoPopup.imageOffsetY !== undefined ? content.promoPopup.imageOffsetY : 50}
                          zoom={content.promoPopup.imageZoom !== undefined ? content.promoPopup.imageZoom : 100}
                          onChange={({ fit, offsetX, offsetY, zoom }) => {
                            setContent({
                              ...content,
                              promoPopup: {
                                ...(content.promoPopup || { enabled: false, image: '' }),
                                imageFit: fit,
                                imageOffsetX: offsetX,
                                imageOffsetY: offsetY,
                                imageZoom: zoom,
                              },
                            });
                          }}
                        />
                      )}
                    </div>

                    {/* Link Tujuan WhatsApp / CTA */}
                    <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                      <label className="block text-xs font-bold text-[#073B78]">
                        Link Tujuan saat Banner Diklik (WhatsApp / Website)
                      </label>
                      <p className="text-[11px] text-[#526783]">
                        Masukkan tautan WhatsApp pemasaran atau link promosi (misal: <code className="bg-white px-1.5 py-0.5 rounded border border-[#DCE7F5] text-[#073B78]">https://wa.me/62812...</code>).
                      </p>
                      <input
                        type="text"
                        value={content.promoPopup?.ctaUrl || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            promoPopup: {
                              ...(content.promoPopup || { enabled: false, image: '' }),
                              ctaUrl: e.target.value,
                            },
                          })
                        }
                        placeholder="https://wa.me/6281278901234?text=Halo%20saya%20tertarik%20promo"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>

                    {/* Judul & Alt Teks Brosur */}
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Keterangan / Nama Promosi (Alt Teks)
                      </label>
                      <input
                        type="text"
                        value={content.promoPopup?.title || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            promoPopup: {
                              ...(content.promoPopup || { enabled: false, image: '' }),
                              title: e.target.value,
                            },
                          })
                        }
                        placeholder="Contoh: Promo Spesial Unit Subsidi Puri Gunung Langgar"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-[#073B78] leading-relaxed space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-xs text-[#073B78]">
                        <span>💡 Format Pop-up Banner Flyer Murni:</span>
                      </p>
                      <p>
                        Saat pengunjung membuka beranda, poster flyer akan langsung muncul utuh di tengah layar dengan tombol tutup <strong>&quot;X&quot;</strong> di pojok kanan atas banner.
                      </p>
                      <p>
                        Jika pengunjung mengklik banner tersebut, sistem akan langsung mengarahkan mereka ke WhatsApp pemasaran resmi PT. TBK.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Live Mockup Preview (Exact Match to Web Popup) */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-[#FF9D2E]" />
                        <span>Live Preview (Sesuai Tampilan Asli Website)</span>
                      </label>
                      <span className="text-[10px] text-[#526783] bg-white px-2 py-0.5 rounded border border-[#DCE7F5]">
                        Simulasi Layar Pengunjung
                      </span>
                    </div>

                    {/* Preview Box - Exact dark translucent backdrop */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-black/85 backdrop-blur-md border border-slate-700/60 flex items-center justify-center min-h-[460px] relative overflow-hidden">
                      {/* Modal Mockup Box - Pure Flyer Banner with X button */}
                      <div className="relative inline-block max-w-[280px] sm:max-w-xs shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/20">
                        {/* Mock Close Button X */}
                        <div
                          className="absolute top-2 right-2 z-30 w-7 h-7 bg-black/75 text-white flex items-center justify-center border border-white/50 cursor-pointer hover:bg-red-600 transition-colors shadow-lg"
                          title="Tombol X Tutup Iklan (Pengunjung dapat menutup pop-up)"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                        </div>

                        {/* Foto Banner Murni */}
                        {content.promoPopup?.image ? (
                          <a
                            href={content.promoPopup?.ctaUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                            title="Klik untuk tes link WhatsApp"
                          >
                            <img
                              src={content.promoPopup.image}
                              alt={content.promoPopup.title || 'Iklan Banner Promo PT. TBK'}
                              style={{
                                objectFit: content.promoPopup.imageFit || 'contain',
                                objectPosition: `center ${content.promoPopup.imageOffsetY !== undefined ? content.promoPopup.imageOffsetY : 50}%`,
                                transform: `scale(${(content.promoPopup.imageZoom !== undefined ? content.promoPopup.imageZoom : 100) / 100})`,
                              }}
                              className="w-full h-auto max-h-[380px] block group-hover:opacity-95 transition-opacity"
                            />
                          </a>
                        ) : (
                          <div className="h-64 w-48 flex flex-col items-center justify-center p-4 bg-slate-800 text-center text-slate-300">
                            <ImageIcon className="w-8 h-8 text-[#FF9D2E] mb-2 opacity-60" />
                            <span className="text-xs font-semibold">Belum Ada Banner</span>
                            <span className="text-[10px] text-slate-400 mt-1">Upload gambar brosur promo di kolom sebelah kiri</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-[#526783] text-center italic">
                      {content.promoPopup?.enabled
                        ? '✅ Pop-up banner murni ini aktif dan akan otomatis muncul begitu pengunjung membuka website.'
                        : '⭕ Iklan sedang MATI (OFF). Klik tombol aktifkan di atas jika ingin menampilkan pop-up.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BRANDING & IDENTITAS */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF9D2E]" />
                    Branding, Logo & Informasi Footer
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Kelola logo resmi perusahaan, slogan/tagline, judul meta SEO, serta identitas yang tampil di navigasi dan footer website.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Logo Perusahaan Uploader */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFD] border border-[#FF9D2E]/40 shadow-xs space-y-3">
                    <label className="block text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                      Logo Resmi Perusahaan (PT. TBK)
                    </label>
                    <p className="text-xs text-[#526783]">
                      Tampil di header navigasi utama, footer, serta panel admin. Disarankan format PNG transparan atau SVG.
                    </p>
                    <LivePreviewBadge title="LIVE PREVIEW LOGO RESMI (HEADER & NAVBAR)" />
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-1">
                      <div className="h-16 w-36 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] p-2 flex items-center justify-center shrink-0">
                        <img
                          src={content.meta?.logo || '/assets/logo-tbk.png'}
                          alt="Logo Preview"
                          className="h-full w-auto object-contain"
                        />
                      </div>
                      <div className="flex-1 w-full space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Path atau URL logo (/assets/logo-tbk.png atau /uploads/...)"
                            value={content.meta?.logo || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                meta: { ...content.meta, logo: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                          />
                          <label className="cursor-pointer px-3.5 py-2 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingKey === 'company-logo' ? 'Mengupload...' : 'Upload Logo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === 'company-logo'}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'company-logo', (url) => {
                                    setContent({
                                      ...content,
                                      meta: { ...content.meta, logo: url },
                                    });
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slogan & Meta SEO */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Slogan / Tagline Perusahaan
                      </label>
                      <input
                        type="text"
                        value={content.meta?.tagline || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            meta: { ...content.meta, tagline: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Judul Meta Browser (Title Tag SEO)
                      </label>
                      <input
                        type="text"
                        value={content.meta?.title || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            meta: { ...content.meta, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi Meta SEO Website
                    </label>
                    <textarea
                      rows={2}
                      value={content.meta?.description || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          meta: { ...content.meta, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  {/* Pengaturan Footer */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-4">
                    <h3 className="text-sm font-bold text-[#073B78] uppercase tracking-wider">
                      Informasi Footer Website
                    </h3>

                    {/* Logo Khusus Footer */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#FF9D2E]" />
                          <span>Logo / Lambang Perusahaan di Footer</span>
                        </label>
                        <p className="text-xs text-[#526783] mt-0.5">
                          Upload foto atau logo khusus untuk bagian footer website (tampil di latar belakang biru gelap #102D52).
                        </p>
                      </div>

                      
                      <LivePreviewBadge title="LIVE PREVIEW LOGO FOOTER (LATAR BIRU GELAP)" /><div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-1">
                        {/* Live Preview Box with exact Footer Navy background */}
                        <div className="w-16 h-16 rounded-xl bg-[#102D52] border border-white/20 p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                          {content.footer?.logo && content.footer.logo.trim() !== '' ? (
                            <img
                              src={content.footer.logo}
                              alt="Logo Footer Preview"
                              style={{
                                objectFit: content.footer.logoFit || 'contain',
                                objectPosition: `center ${content.footer.logoOffsetY !== undefined ? content.footer.logoOffsetY : 50}%`,
                                transform: `scale(${(content.footer.logoZoom !== undefined ? content.footer.logoZoom : 100) / 100})`,
                              }}
                              className="w-full h-full"
                            />
                          ) : content.meta?.logo && content.meta.logo.trim() !== '' ? (
                            <img
                              src={content.meta.logo}
                              alt="Logo Footer Preview"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-[#FF9D2E]" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 21h18M5 21V7l5-4v18M14 21V9l5 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 9h.01M8 13h.01M8 17h.01M16 15h.01M16 18h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                          )}
                        </div>

                        <div className="flex-1 w-full space-y-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Path atau URL logo footer (/assets/... atau /uploads/...)"
                              value={content.footer?.logo || ''}
                              onChange={(e) =>
                                setContent({
                                  ...content,
                                  footer: { ...content.footer, logo: e.target.value },
                                })
                              }
                              className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                            />
                            <label className="cursor-pointer px-3.5 py-2 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{uploadingKey === 'footer-logo' ? 'Mengupload...' : 'Upload Logo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingKey === 'footer-logo'}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleGenericFileUpload(e.target.files[0], 'footer-logo', (url) => {
                                      setContent({
                                        ...content,
                                        footer: { ...content.footer, logo: url },
                                      });
                                    });
                                  }
                                }}
                              />
                            </label>
                            {content.footer?.logo && (
                              <button
                                type="button"
                                onClick={() =>
                                  setContent({
                                    ...content,
                                    footer: { ...content.footer, logo: '' },
                                  })
                                }
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs transition-colors"
                                title="Hapus logo khusus footer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <span className="text-[10.5px] text-[#526783] block">
                            Jika logo khusus footer dikosongkan, sistem otomatis menggunakan logo utama perusahaan atau lambang resmi PT. TBK.
                          </span>
                        </div>
                      </div>

                      {content.footer?.logo && (<ImageAdjustmentControl
                                    title="Ukuran, Posisi & Crop Logo Footer"
                          fit={content.footer.logoFit || 'contain'}
                          offsetX={content.footer.logoOffsetX !== undefined ? content.footer.logoOffsetX : 50}
                          offsetY={content.footer.logoOffsetY !== undefined ? content.footer.logoOffsetY : 50}
                          zoom={content.footer.logoZoom !== undefined ? content.footer.logoZoom : 100}
                          onChange={({ fit, offsetX, offsetY, zoom }) => {
                            setContent({
                              ...content,
                              footer: {
                                ...content.footer,
                                logoFit: fit,
                                logoOffsetX: offsetX,
                                logoOffsetY: offsetY,
                                logoZoom: zoom,
                              },
                            });
                          }}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#073B78] mb-1">
                          Nama Lengkap Perusahaan di Footer
                        </label>
                        <input
                          type="text"
                          value={content.footer?.companyName || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              footer: { ...content.footer, companyName: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#073B78] mb-1">
                          Singkatan Nama Perusahaan
                        </label>
                        <input
                          type="text"
                          value={content.footer?.shortName || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              footer: { ...content.footer, shortName: e.target.value },
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Slogan / Tagline di Bawah Nama Perusahaan (Footer)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Pengembang Properti Bandar Lampung"
                        value={content.footer?.tagline || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, tagline: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Ringkasan Perusahaan di Footer
                      </label>
                      <textarea
                        rows={2}
                        value={content.footer?.summary || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, summary: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Teks Hak Cipta (Copyright)
                      </label>
                      <input
                        type="text"
                        value={content.footer?.copyrightText || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            footer: { ...content.footer, copyrightText: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ABOUT & VISION MISSION */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#FF9D2E]" />
                    Tentang Perusahaan, Visi & Misi
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Kelola narasi profil perusahaan, visi, dan butir misi resmi PT. Terbang Bersama Kawan.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Background Banner Header Halaman /tentang */}
                  <div className="p-5 rounded-2xl bg-[#F8FAFD] border-2 border-[#073B78]/25 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#FF9D2E]" />
                          Background Banner Header Halaman Tentang (/tentang)
                        </div>
                        <p className="text-[11px] text-[#526783] mt-0.5">
                          Ganti latar biru di bagian atas halaman &quot;Tentang Perusahaan&quot; dengan foto proyek, perumahan, atau arsitektur bangunan.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-44 h-24 rounded-xl bg-gradient-to-br from-[#073B78] via-[#0A4B91] to-[#102D52] border border-[#DCE7F5] overflow-hidden shrink-0 relative flex items-center justify-center shadow-xs">
                        {content.about?.headerBgImage && content.about.headerBgImage.trim() !== '' ? (
                          <>
                            <img
                              src={content.about.headerBgImage}
                              alt="Preview Background Header"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#073B78]/40" />
                            <span className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                              Gambar Aktif
                            </span>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <ImageIcon className="w-5 h-5 text-white/50 mx-auto mb-1" />
                            <span className="text-[10px] text-white/80 font-medium block">Biru Default (Gradiasi)</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={content.about?.headerBgImage || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              about: { ...content.about, headerBgImage: e.target.value },
                            })
                          }
                          placeholder="URL atau path gambar background (/assets/... atau /uploads/...)"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer px-3.5 py-2 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                            <Upload className="w-3.5 h-3.5 text-[#FF9D2E]" />
                            <span>{uploadingKey === 'aboutHeaderBg' ? 'Mengupload...' : 'Upload Gambar Background'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === 'aboutHeaderBg'}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'aboutHeaderBg', (url) => {
                                    setContent({
                                      ...content,
                                      about: { ...content.about, headerBgImage: url },
                                    });
                                  });
                                }
                              }}
                            />
                          </label>
                          {content.about?.headerBgImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setContent({
                                  ...content,
                                  about: { ...content.about, headerBgImage: '' },
                                })
                              }
                              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                              title="Kembalikan ke latar biru default"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reset ke Biru Default</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Sub-Judul / Teks Pengantar Header
                      </label>
                      <input
                        type="text"
                        value={content.about?.headerSubtitle || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, headerSubtitle: e.target.value },
                          })
                        }
                        placeholder="Mengenal lebih dekat dedikasi PT. Terbang Bersama Kawan..."
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Label Badge
                    </label>
                    <input
                      type="text"
                      value={content.about.badge}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, badge: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Judul Bagian Tentang
                    </label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi Profil Perusahaan
                    </label>
                    <textarea
                      rows={4}
                      value={content.about.description}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#FF9D2E]/30 shadow-xs space-y-3">
                    <div className="text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                      Visi Perusahaan
                    </div>
                    <input
                      type="text"
                      value={content.about.visionTitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, visionTitle: e.target.value },
                        })
                      }
                      placeholder="Judul Visi"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                    />
                    <textarea
                      rows={2}
                      value={content.about.visionText}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, visionText: e.target.value },
                        })
                      }
                      placeholder="Pernyataan Visi"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-sm text-[#C76A08] italic font-playfair"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#FF9D2E]/30 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                        Misi Perusahaan ({content.about.missions?.length || 0} Butir)
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              missions: [...content.about.missions, 'Misi baru...'],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-[#FFF7EB] text-[#C76A08] hover:bg-[#FF9D2E]/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Misi
                      </button>
                    </div>

                    <div className="space-y-2">
                      {content.about.missions?.map((misi, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-[#FFF7EB] text-[#FF9D2E] text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={misi}
                            onChange={(e) => {
                              const newMissions = [...content.about.missions];
                              newMissions[idx] = e.target.value;
                              setContent({
                                ...content,
                                about: { ...content.about, missions: newMissions },
                              });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newMissions = content.about.missions.filter((_, i) => i !== idx);
                              setContent({
                                ...content,
                                about: { ...content.about, missions: newMissions },
                              });
                            }}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foto Kantor Pusat */}
                  <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                    <label className="block text-xs font-bold text-[#073B78]">
                      Foto Kantor Pusat (Tampil di Beranda)
                    </label>
                    <p className="text-[11px] text-[#526783]">
                      Foto ini ditampilkan di halaman utama (beranda) pada bagian &quot;Tentang Kami&quot; sebagai visual kantor perusahaan.
                    </p>
                    <LivePreviewBadge title="LIVE PREVIEW FOTO KANTOR PUSAT" />
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-28 h-20 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                        {content.about.officeImage && content.about.officeImage.trim() !== '' ? (
                          <img
                            src={content.about.officeImage}
                            alt="Kantor Pusat"
                            style={{
                              objectFit: content.about.officeImageFit || 'cover',
                              objectPosition: `${content.about.officeImageOffsetX !== undefined ? content.about.officeImageOffsetX : 50}% ${content.about.officeImageOffsetY !== undefined ? content.about.officeImageOffsetY : 50}%`,
                              transform: `scale(${(content.about.officeImageZoom !== undefined ? content.about.officeImageZoom : 100) / 100})`,
                            }}
                            className="w-full h-full"
                          />
                        ) : (
                          <span className="text-[10px] text-[#526783]">Belum ada foto</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={content.about.officeImage || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              about: { ...content.about, officeImage: e.target.value },
                            })
                          }
                          placeholder="URL atau path foto kantor (/assets/... atau /uploads/...)"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                        />
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingKey === 'officeImage' ? 'Mengupload...' : 'Upload Foto Kantor'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === 'officeImage'}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'officeImage', (url) => {
                                    setContent({
                                      ...content,
                                      about: { ...content.about, officeImage: url },
                                    });
                                  });
                                }
                              }}
                            />
                          </label>
                          {content.about.officeImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setContent({
                                  ...content,
                                  about: { ...content.about, officeImage: '' },
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                              title="Hapus foto kantor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {content.about.officeImage && (<ImageAdjustmentControl
                                    title="Ukuran, Posisi & Crop Foto Kantor Pusat"
                        fit={content.about.officeImageFit || 'cover'}
                        offsetX={content.about.officeImageOffsetX !== undefined ? content.about.officeImageOffsetX : 50}
                        offsetY={content.about.officeImageOffsetY !== undefined ? content.about.officeImageOffsetY : 50}
                        zoom={content.about.officeImageZoom !== undefined ? content.about.officeImageZoom : 100}
                        onChange={({ fit, offsetX, offsetY, zoom }) => {
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              officeImageFit: fit,
                              officeImageOffsetX: offsetX,
                              officeImageOffsetY: offsetY,
                              officeImageZoom: zoom,
                            },
                          });
                        }}
                      />
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Caption / Keterangan Foto Kantor
                      </label>
                      <input
                        type="text"
                        value={content.about.officeCaption || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            about: { ...content.about, officeCaption: e.target.value },
                          })
                        }
                        placeholder="Contoh: Kantor Pusat - Bandar Lampung, Provinsi Lampung"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  {/* 4 Pilar Kepercayaan / Nilai Mutu Perusahaan */}
                  <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider">
                          4 Pilar Kepercayaan / Standar Mutu ({content.about.values?.length || 4} Nilai)
                        </label>
                        <p className="text-[11px] text-[#526783]">
                          Tampil di halaman /tentang sebagai 4 kartu pilar integritas pembangunan perseroan.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = content.about.values || [
                            {
                              title: "Legalitas & Kepastian Hukum",
                              desc: "Beroperasi berlandaskan Akta Pendirian Notaris resmi dan SK Pengesahan Kemenkumham RI Tahun 2021 untuk keamanan hak kepemilikan konsumen."
                            },
                            {
                              title: "Standar Mutu Konstruksi",
                              desc: "Pondasi batu belah, struktur beton bertulang, dinding plester aci, dan sanitasi terencana sesuai standar teknis Kementerian PUPR."
                            },
                            {
                              title: "Kemitraan Perbankan FLPP",
                              desc: "Bekerja sama dengan bank penyalur KPR bersubsidi guna memudahkan proses persetujuan kredit dengan suku bunga ringan flat 5%."
                            },
                            {
                              title: "Transparansi Layanan",
                              desc: "Keterbukaan informasi harga, tahapan berkas, progres fisik lapangan, serta pendampingan langsung hingga serah terima kunci unit."
                            }
                          ];
                          setContent({
                            ...content,
                            about: {
                              ...content.about,
                              values: [...curr, { title: 'Pilar Baru', desc: 'Deskripsi pilar integritas perseroan...' }],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-[#FFF7EB] text-[#C76A08] hover:bg-[#FF9D2E]/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Pilar
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(content.about.values || [
                        {
                          title: "Legalitas & Kepastian Hukum",
                          desc: "Beroperasi berlandaskan Akta Pendirian Notaris resmi dan SK Pengesahan Kemenkumham RI Tahun 2021 untuk keamanan hak kepemilikan konsumen."
                        },
                        {
                          title: "Standar Mutu Konstruksi",
                          desc: "Pondasi batu belah, struktur beton bertulang, dinding plester aci, dan sanitasi terencana sesuai standar teknis Kementerian PUPR."
                        },
                        {
                          title: "Kemitraan Perbankan FLPP",
                          desc: "Bekerja sama dengan bank penyalur KPR bersubsidi guna memudahkan proses persetujuan kredit dengan suku bunga ringan flat 5%."
                        },
                        {
                          title: "Transparansi Layanan",
                          desc: "Keterbukaan informasi harga, tahapan berkas, progres fisik lapangan, serta pendampingan langsung hingga serah terima kunci unit."
                        }
                      ]).map((val, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#DCE7F5] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#FF9D2E] uppercase">Pilar #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = content.about.values || [];
                                setContent({
                                  ...content,
                                  about: { ...content.about, values: curr.filter((_, i) => i !== idx) },
                                });
                              }}
                              className="text-rose-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={val.title}
                            onChange={(e) => {
                              const curr = [...(content.about.values || [])];
                              curr[idx].title = e.target.value;
                              setContent({ ...content, about: { ...content.about, values: curr } });
                            }}
                            placeholder="Judul Pilar (misal: Legalitas & Kepastian Hukum)"
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs font-bold text-[#102D52]"
                          />
                          <textarea
                            rows={2}
                            value={val.desc}
                            onChange={(e) => {
                              const curr = [...(content.about.values || [])];
                              curr[idx].desc = e.target.value;
                              setContent({ ...content, about: { ...content.about, values: curr } });
                            }}
                            placeholder="Uraian pilar mutu dan komitmen perseroan..."
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LEADERSHIP */}
            {activeTab === 'leadership' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7F5] pb-4">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#FF9D2E]" />
                      Dewan Pengurus (Pimpinan Resmi)
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 font-sans font-semibold">
                        {content.leadership.members?.length || 0} Pengurus
                      </span>
                    </h2>
                    <p className="text-xs text-[#526783] mt-1">
                      Susunan pengurus PT. Terbang Bersama Kawan sesuai dengan Akta Pendirian dan Anggaran Dasar (bisa tambah, ubah, urutkan, dan ganti foto).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentMembers = content.leadership.members || [];
                      setContent({
                        ...content,
                        leadership: {
                          ...content.leadership,
                          members: [
                            ...currentMembers,
                            {
                              name: 'Nama Pengurus Baru',
                              role: 'Jabatan Resmi',
                              department: 'Divisi Operasional',
                              roleDescription: 'Deskripsi tugas, tanggung jawab, dan kewenangan kepengurusan...',
                              image: '',
                            },
                          ],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9D2E] text-[#071C38] font-bold text-xs hover:bg-[#F28A17] transition-all shrink-0 shadow-md shadow-[#FF9D2E]/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Pengurus Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Label Badge Atas
                      </label>
                      <input
                        type="text"
                        value={content.leadership.badge || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            leadership: { ...content.leadership, badge: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Judul Bagian Pimpinan
                      </label>
                      <input
                        type="text"
                        value={content.leadership.title}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            leadership: { ...content.leadership, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Subjudul / Deskripsi Bagian
                    </label>
                    <textarea
                      rows={2}
                      value={content.leadership.subtitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          leadership: { ...content.leadership, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {content.leadership.members?.map((member, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#F8FAFD] border border-[#FF9D2E]/30 shadow-xs space-y-3">
                        <div className="flex items-center justify-between border-b border-[#DCE7F5] pb-2.5">
                          <span className="text-xs font-bold text-[#FF9D2E] uppercase tracking-wider flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30">
                              #{idx + 1}
                            </span>
                            <span>{member.role || 'Pengurus'}</span>
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const members = [...content.leadership.members];
                                const temp = members[idx];
                                members[idx] = members[idx - 1];
                                members[idx - 1] = temp;
                                setContent({
                                  ...content,
                                  leadership: { ...content.leadership, members },
                                });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-[#EBF3FC] text-[#073B78] border border-[#DCE7F5] disabled:opacity-30 transition-colors"
                              title="Pindahkan ke atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={idx === content.leadership.members.length - 1}
                              onClick={() => {
                                const members = [...content.leadership.members];
                                const temp = members[idx];
                                members[idx] = members[idx + 1];
                                members[idx + 1] = temp;
                                setContent({
                                  ...content,
                                  leadership: { ...content.leadership, members },
                                });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-[#EBF3FC] text-[#073B78] border border-[#DCE7F5] disabled:opacity-30 transition-colors"
                              title="Pindahkan ke bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const newMembers = [...content.leadership.members];
                                newMembers.splice(idx, 1);
                                setContent({
                                  ...content,
                                  leadership: { ...content.leadership, members: newMembers },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Data pengurus berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                                });
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center gap-1 transition-colors border border-red-500/20 ml-1"
                              title="Hapus pengurus ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] text-[#526783] mb-1">Nama Lengkap</label>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => {
                                const newMembers = [...content.leadership.members];
                                newMembers[idx].name = e.target.value;
                                setContent({
                                  ...content,
                                  leadership: { ...content.leadership, members: newMembers },
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs sm:text-sm text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#526783] mb-1">Jabatan Resmi</label>
                            <input
                              type="text"
                              value={member.role}
                              onChange={(e) => {
                                const newMembers = [...content.leadership.members];
                                newMembers[idx].role = e.target.value;
                                setContent({
                                  ...content,
                                  leadership: { ...content.leadership, members: newMembers },
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs sm:text-sm text-[#C76A08] font-bold focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-[#526783] mb-1">Divisi / Kategori</label>
                            <input
                              type="text"
                              placeholder="Contoh: Divisi Keuangan"
                              value={member.department || ''}
                              onChange={(e) => {
                                const newMembers = [...content.leadership.members];
                                newMembers[idx].department = e.target.value;
                                setContent({
                                  ...content,
                                  leadership: { ...content.leadership, members: newMembers },
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs sm:text-sm text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#526783] mb-1">Deskripsi Kewenangan / Peran</label>
                          <textarea
                            rows={2}
                            value={member.roleDescription}
                            onChange={(e) => {
                              const newMembers = [...content.leadership.members];
                              newMembers[idx].roleDescription = e.target.value;
                              setContent({
                                ...content,
                                leadership: { ...content.leadership, members: newMembers },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                          />
                        </div>

                        <div className="pt-2 border-t border-[#DCE7F5] space-y-2">
                          <label className="block text-[11px] font-semibold text-[#526783]">
                            Foto / Avatar Pengurus
                          </label>
                          <LivePreviewBadge title="LIVE PREVIEW PAS FOTO PENGURUS" />
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            {/* Portrait Preview with live transform */}
                            <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-[#FF9D2E]/60 bg-[#073B78] shrink-0 flex items-center justify-center shadow-md relative">
                              {member.image && member.image.trim() !== '' ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-full h-full transition-all duration-200"
                                  style={{
                                    objectFit: member.imageFit || 'cover',
                                    objectPosition: `${member.imageOffsetX !== undefined ? member.imageOffsetX : 50}% ${member.imageOffsetY !== undefined ? member.imageOffsetY : 15}%`,
                                    transform: `scale(${(member.imageZoom !== undefined ? member.imageZoom : 100) / 100})`,
                                  }}
                                />
                              ) : (
                                <div className="text-[#FF9D2E] font-bold text-xs font-serif text-center px-1">
                                  {member.name ? member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'TBK'}
                                </div>
                              )}
                            </div>

                            {/* Upload & Path Controls */}
                            <div className="flex-1 w-full space-y-1.5">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Path atau URL foto pengurus"
                                  value={member.image || ''}
                                  onChange={(e) => {
                                    const newMembers = [...content.leadership.members];
                                    newMembers[idx].image = e.target.value;
                                    setContent({
                                      ...content,
                                      leadership: { ...content.leadership, members: newMembers },
                                    });
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                                />
                                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{uploadingKey === `leader-${idx}` ? 'Mengupload...' : 'Upload Foto'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingKey === `leader-${idx}`}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleGenericFileUpload(e.target.files[0], `leader-${idx}`, (url) => {
                                          const newMembers = [...content.leadership.members];
                                          newMembers[idx].image = url;
                                          setContent({
                                            ...content,
                                            leadership: { ...content.leadership, members: newMembers },
                                          });
                                        });
                                      }
                                    }}
                                  />
                                </label>
                                {member.image && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMembers = [...content.leadership.members];
                                      newMembers[idx].image = '';
                                      setContent({
                                        ...content,
                                        leadership: { ...content.leadership, members: newMembers },
                                      });
                                    }}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                                    title="Hapus foto pengurus (gunakan avatar inisial)"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <span className="text-[10px] text-[#526783] block">
                                Format: JPG, PNG, atau WebP. Disarankan pas foto portrait vertikal (rasio 3:4 atau 4:5).
                              </span>

                              {/* Panel Pas Foto: Fit Mode, 2D Pan, Offset Sliders, & Zoom Slider */}
                              {member.image && (
                                <ImageAdjustmentControl
                                  title="Pengaturan Posisi, Crop & Pas Foto Wajah"
                                  fit={member.imageFit || 'cover'}
                                  offsetX={member.imageOffsetX !== undefined ? member.imageOffsetX : 50}
                                  offsetY={member.imageOffsetY !== undefined ? member.imageOffsetY : 15}
                                  defaultOffsetY={15}
                                  zoom={member.imageZoom !== undefined ? member.imageZoom : 100}
                                  onChange={({ fit, offsetX, offsetY, zoom }) => {
                                    const newMembers = [...content.leadership.members];
                                    newMembers[idx].imageFit = fit;
                                    newMembers[idx].imageOffsetX = offsetX;
                                    newMembers[idx].imageOffsetY = offsetY;
                                    newMembers[idx].imageZoom = zoom;
                                    setContent({
                                      ...content,
                                      leadership: { ...content.leadership, members: newMembers },
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tombol Tambah di Bawah */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const currentMembers = content.leadership.members || [];
                        setContent({
                          ...content,
                          leadership: {
                            ...content.leadership,
                            members: [
                              ...currentMembers,
                              {
                                name: 'Nama Pengurus Baru',
                                role: 'Jabatan Resmi',
                                department: 'Divisi Operasional',
                                roleDescription: 'Deskripsi tugas, tanggung jawab, dan kewenangan kepengurusan...',
                                image: '',
                              },
                            ],
                          },
                        });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 text-xs font-semibold transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Pengurus Baru</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LEGAL */}
            {activeTab === 'legal' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#FF9D2E]" />
                    Legalitas & Pengesahan Perseroan
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Data akta pendirian, notaris rekanan, dan pengesahan Kemenkumham RI.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Nomor Akta Pendirian
                      </label>
                      <input
                        type="text"
                        value={content.legal.aktaNumber}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            legal: { ...content.legal, aktaNumber: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Tanggal Akta
                      </label>
                      <input
                        type="text"
                        value={content.legal.aktaDate}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            legal: { ...content.legal, aktaDate: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Nama Notaris Lengkap Beserta Gelar
                    </label>
                    <input
                      type="text"
                      value={content.legal.notary}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legal: { ...content.legal, notary: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Nomor SK Kemenkumham
                      </label>
                      <input
                        type="text"
                        value={content.legal.skMenkumham}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            legal: { ...content.legal, skMenkumham: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Tanggal Pengesahan SK
                      </label>
                      <input
                        type="text"
                        value={content.legal.skDate}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            legal: { ...content.legal, skDate: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Ketentuan Kewenangan Direktur
                    </label>
                    <textarea
                      rows={2}
                      value={content.legal.directorAuthority}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legal: { ...content.legal, directorAuthority: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1C5795]/40">
                    <div>
                      <label className="block text-xs font-bold text-[#C76A08] mb-1">
                        Status Hak Atas Tanah & Sertifikat
                      </label>
                      <input
                        type="text"
                        value={content.legal.landStatus || 'Sertifikat Hak Milik (SHM)'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            legal: { ...content.legal, landStatus: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm font-semibold"
                        placeholder="Contoh: Sertifikat Hak Milik (SHM)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Keterangan Legalitas Lahan
                      </label>
                      <input
                        type="text"
                        value={content.legal.landStatusDetail || 'Hak kepemilikan mutlak dan sah atas nama pembeli'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            legal: { ...content.legal, landStatusDetail: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                        placeholder="Contoh: Hak kepemilikan mutlak dan sah atas nama pembeli"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACTIVITIES */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7F5] pb-4">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                      <HardHat className="w-5 h-5 text-[#FF9D2E]" />
                      Kegiatan Lapangan Riil (CRUD)
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 font-sans font-semibold">
                        {content.activities.items?.length || 0} Tahapan
                      </span>
                    </h2>
                    <p className="text-xs text-[#526783] mt-1">
                      Dokumentasi resmi pekerjaan fisik di lapangan. Anda dapat menambah, mengubah, mengurutkan, menghapus, serta menyematkan foto dan video YouTube untuk setiap kegiatan.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentItems = content.activities.items || [];
                      setContent({
                        ...content,
                        activities: {
                          ...content.activities,
                          items: [
                            ...currentItems,
                            {
                              title: 'Pekerjaan Lapangan Baru',
                              description: 'Deskripsi pekerjaan konstruksi fisik dan persiapan di lapangan...',
                              image: '',
                              tag: `Tahap 0${currentItems.length + 1}`,
                              videoUrl: '',
                            },
                          ],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9D2E] text-[#071C38] font-bold text-xs hover:bg-[#F28A17] transition-all shrink-0 shadow-md shadow-[#FF9D2E]/25"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kegiatan Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Label Badge Bagian
                      </label>
                      <input
                        type="text"
                        value={content.activities.badge || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            activities: { ...content.activities, badge: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Judul Utama Bagian Kegiatan
                      </label>
                      <input
                        type="text"
                        value={content.activities.title}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            activities: { ...content.activities, title: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi / Subjudul Bagian Kegiatan
                    </label>
                    <textarea
                      rows={2}
                      value={content.activities.subtitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          activities: { ...content.activities, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {content.activities.items?.map((item, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#F8FAFD] border border-[#FF9D2E]/25 space-y-4 hover:border-[#FF9D2E]/30 transition-colors">
                        {/* Header bar with tag and reorder controls */}
                        <div className="flex items-center justify-between border-b border-[#DCE7F5] pb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 font-bold text-xs">
                              #{idx + 1}
                            </span>
                            <input
                              type="text"
                              value={item.tag}
                              placeholder="Tag / Tahap (misal: Tahap 1)"
                              onChange={(e) => {
                                const newItems = [...content.activities.items];
                                newItems[idx].tag = e.target.value;
                                setContent({
                                  ...content,
                                  activities: { ...content.activities, items: newItems },
                                });
                              }}
                              className="px-3 py-1 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#C76A08] font-semibold w-28 sm:w-36 text-center"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Reorder Up */}
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const items = [...content.activities.items];
                                const temp = items[idx];
                                items[idx] = items[idx - 1];
                                items[idx - 1] = temp;
                                setContent({
                                  ...content,
                                  activities: { ...content.activities, items },
                                });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-[#EBF3FC] text-[#073B78] border border-[#DCE7F5] disabled:opacity-30 transition-colors"
                              title="Pindahkan ke atas (naikkan tahapan)"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Reorder Down */}
                            <button
                              type="button"
                              disabled={idx === content.activities.items.length - 1}
                              onClick={() => {
                                const items = [...content.activities.items];
                                const temp = items[idx];
                                items[idx] = items[idx + 1];
                                items[idx + 1] = temp;
                                setContent({
                                  ...content,
                                  activities: { ...content.activities, items },
                                });
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-[#EBF3FC] text-[#073B78] border border-[#DCE7F5] disabled:opacity-30 transition-colors"
                              title="Pindahkan ke bawah (turunkan tahapan)"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = [...content.activities.items];
                                newItems.splice(idx, 1);
                                setContent({
                                  ...content,
                                  activities: { ...content.activities, items: newItems },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Kegiatan lapangan berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                                });
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center gap-1 transition-colors border border-red-500/20 ml-1"
                              title="Hapus kegiatan ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          </div>
                        </div>

                        {/* Judul Kegiatan */}
                        <div>
                          <label className="block text-xs font-bold text-[#073B78] mb-1">
                            Judul Kegiatan Lapangan
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newItems = [...content.activities.items];
                              newItems[idx].title = e.target.value;
                              setContent({
                                ...content,
                                activities: { ...content.activities, items: newItems },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs sm:text-sm text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                          />
                        </div>

                        {/* Deskripsi Kegiatan */}
                        <div>
                          <label className="block text-xs font-bold text-[#073B78] mb-1">
                            Deskripsi Tahapan & Rincian Lapangan
                          </label>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...content.activities.items];
                              newItems[idx].description = e.target.value;
                              setContent({
                                ...content,
                                activities: { ...content.activities, items: newItems },
                              });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs sm:text-sm text-[#526783] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                          />
                        </div>

                        {/* Foto Dokumentasi Lapangan */}
                        <div className="space-y-2 pt-2 border-t border-[#DCE7F5]">
                          <label className="block text-xs font-bold text-[#073B78] flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#FF9D2E]" />
                            <span>Foto Dokumentasi Lapangan</span>
                          </label>
                          <LivePreviewBadge title="LIVE PREVIEW FOTO DOKUMENTASI KEGIATAN" />
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="w-24 h-16 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                              {item.image && item.image.trim() !== '' ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  style={{
                                    objectFit: item.imageFit || 'cover',
                                    objectPosition: `${item.imageOffsetX !== undefined ? item.imageOffsetX : 50}% ${item.imageOffsetY !== undefined ? item.imageOffsetY : 50}%`,
                                    transform: `scale(${(item.imageZoom !== undefined ? item.imageZoom : 100) / 100})`,
                                  }}
                                  className="w-full h-full"
                                />
                              ) : (
                                <span className="text-[10px] text-[#526783] text-center px-1">Tanpa Foto</span>
                              )}
                            </div>
                            <div className="flex-1 w-full space-y-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Path atau URL foto kegiatan"
                                  value={item.image || ''}
                                  onChange={(e) => {
                                    const newItems = [...content.activities.items];
                                    newItems[idx].image = e.target.value;
                                    setContent({
                                      ...content,
                                      activities: { ...content.activities, items: newItems },
                                    });
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                                />
                                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{uploadingKey === `act-${idx}` ? 'Mengupload...' : 'Upload Foto'}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingKey === `act-${idx}`}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleGenericFileUpload(e.target.files[0], `act-${idx}`, (url) => {
                                          const newItems = [...content.activities.items];
                                          newItems[idx].image = url;
                                          setContent({
                                            ...content,
                                            activities: { ...content.activities, items: newItems },
                                          });
                                        });
                                      }
                                    }}
                                  />
                                </label>
                                {item.image && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItems = [...content.activities.items];
                                      newItems[idx].image = '';
                                      setContent({
                                        ...content,
                                        activities: { ...content.activities, items: newItems },
                                      });
                                    }}
                                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                                    title="Hapus foto ini"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <span className="text-[10px] text-[#526783] block">
                                Format: JPG, PNG, atau WebP. Gambar lanskap (16:10) disarankan.
                              </span>
                              {item.image && (<ImageAdjustmentControl
                                    title="Ukuran, Posisi & Crop Foto Dokumentasi"
                                  fit={item.imageFit || 'cover'}
                                  offsetX={item.imageOffsetX !== undefined ? item.imageOffsetX : 50}
                                  offsetY={item.imageOffsetY !== undefined ? item.imageOffsetY : 50}
                                  zoom={item.imageZoom !== undefined ? item.imageZoom : 100}
                                  onChange={({ fit, offsetX, offsetY, zoom }) => {
                                    const newItems = [...content.activities.items];
                                    newItems[idx].imageFit = fit;
                                    newItems[idx].imageOffsetX = offsetX;
                                    newItems[idx].imageOffsetY = offsetY;
                                    newItems[idx].imageZoom = zoom;
                                    setContent({
                                      ...content,
                                      activities: { ...content.activities, items: newItems },
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Video Dokumentasi Lapangan (Opsional) */}
                        <div className="space-y-2 pt-2 border-t border-[#DCE7F5]">
                          <label className="block text-xs font-bold text-[#073B78] flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-[#FF9D2E]" />
                            <span>Link Video YouTube Dokumentasi Lapangan (Opsional)</span>
                          </label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                              value={item.videoUrl || ''}
                              onChange={(e) => {
                                const newItems = [...content.activities.items];
                                newItems[idx].videoUrl = e.target.value;
                                setContent({
                                  ...content,
                                  activities: { ...content.activities, items: newItems },
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                            />
                            {getYouTubeEmbedUrl(item.videoUrl) && (
                              <div className="pt-1">
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mb-1.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Preview Video Terdeteksi:</span>
                                </span>
                                <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border border-[#DCE7F5] bg-black">
                                  <iframe
                                    src={getYouTubeEmbedUrl(item.videoUrl)!}
                                    title={`Preview Video Kegiatan ${idx + 1}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tombol Tambah di Bawah List */}
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const currentItems = content.activities.items || [];
                        setContent({
                          ...content,
                          activities: {
                            ...content.activities,
                            items: [
                              ...currentItems,
                              {
                                title: 'Pekerjaan Lapangan Baru',
                                description: 'Deskripsi pekerjaan konstruksi fisik dan persiapan di lapangan...',
                                image: '',
                                tag: `Tahap 0${currentItems.length + 1}`,
                                videoUrl: '',
                              },
                            ],
                          },
                        });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 text-xs font-semibold transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Kegiatan Baru</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PROJECT PURI GUNUNG LANGGAR */}
            {activeTab === 'project' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#FF9D2E]" />
                    Proyek Resmi: Puri Gunung Langgar
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Kelola nama, status, lokasi, deskripsi, gambar, dan spesifikasi unit perumahan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Nama Proyek
                      </label>
                      <input
                        type="text"
                        value={content.project.name}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            project: { ...content.project, name: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Jenis Proyek
                      </label>
                      <input
                        type="text"
                        value={content.project.type}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            project: { ...content.project, type: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Status Pembangunan
                      </label>
                      <input
                        type="text"
                        value={content.project.status}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            project: { ...content.project, status: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Desa / Kecamatan
                      </label>
                      <input
                        type="text"
                        value={content.project.location}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            project: { ...content.project, location: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Kabupaten
                      </label>
                      <input
                        type="text"
                        value={content.project.district}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            project: { ...content.project, district: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi Proyek
                    </label>
                    <textarea
                      rows={3}
                      value={content.project.description}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          project: { ...content.project, description: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                    />
                  </div>

                  {/* FOTO COVER / SAMPUL UTAMA PROYEK (TAMPIL DI BERANDA) */}
                  <div className="p-5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] flex items-center gap-1.5 uppercase tracking-wider">
                        <ImageIcon className="w-4 h-4 text-[#FF9D2E]" />
                        <span>Foto Sampul / Gambar Utama Proyek (Tampil di Beranda)</span>
                      </label>
                      <p className="text-xs text-[#526783] mt-0.5">
                        Foto ini adalah gambar utama proyek Puri Gunung Langgar yang tampil di halaman depan (beranda). Anda dapat mengganti, mengupload foto baru, atau menghapusnya.
                      </p>
                    </div>

                    
                    <LivePreviewBadge title="LIVE PREVIEW FOTO SAMPUL UTAMA PROYEK" /><div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-36 h-24 rounded-xl bg-[#073B78]/5 border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                        {content.project.image && content.project.image.trim() !== '' ? (
                          <img
                            src={content.project.image}
                            alt="Sampul Proyek"
                            style={{
                              objectFit: content.project.imageFit || 'cover',
                              objectPosition: `${content.project.imageOffsetX !== undefined ? content.project.imageOffsetX : 50}% ${content.project.imageOffsetY !== undefined ? content.project.imageOffsetY : 50}%`,
                              transform: `scale(${(content.project.imageZoom !== undefined ? content.project.imageZoom : 100) / 100})`,
                            }}
                            className="w-full h-full"
                          />
                        ) : (
                          <span className="text-[10px] text-[#526783] text-center px-2">Tanpa Foto Sampul</span>
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={content.project.image || ''}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              project: { ...content.project, image: e.target.value },
                            })
                          }
                          placeholder="Path atau URL gambar (/assets/... atau /uploads/...)"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                        />

                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-3.5 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingKey === 'projectCover' ? 'Mengupload...' : 'Upload Foto Baru'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === 'projectCover'}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'projectCover', (url) => {
                                    setContent({
                                      ...content,
                                      project: { ...content.project, image: url },
                                    });
                                    setSaveStatus({
                                      type: 'success',
                                      message: 'Foto sampul proyek berhasil diganti! Klik "Simpan ke SQL" di atas untuk menyimpan.',
                                    });
                                  });
                                }
                              }}
                            />
                          </label>

                          {content.project.image && (
                            <button
                              type="button"
                              onClick={() => {
                                setContent({
                                  ...content,
                                  project: { ...content.project, image: '' },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Foto sampul proyek berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan.',
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="Hapus foto utama ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus Foto Sampul</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {content.project.image && (<ImageAdjustmentControl
                                    title="Ukuran, Posisi & Crop Foto Sampul Proyek"
                        fit={content.project.imageFit || 'cover'}
                        offsetX={content.project.imageOffsetX !== undefined ? content.project.imageOffsetX : 50}
                        offsetY={content.project.imageOffsetY !== undefined ? content.project.imageOffsetY : 50}
                        zoom={content.project.imageZoom !== undefined ? content.project.imageZoom : 100}
                        onChange={({ fit, offsetX, offsetY, zoom }) => {
                          setContent({
                            ...content,
                            project: {
                              ...content.project,
                              imageFit: fit,
                              imageOffsetX: offsetX,
                              imageOffsetY: offsetY,
                              imageZoom: zoom,
                            },
                          });
                        }}
                      />
                    )}
                  </div>

                  {/* PENGATURAN MEDIA PROYEK: FOTO SLIDESHOW ATAU VIDEO YOUTUBE */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-sm font-bold text-[#073B78] uppercase tracking-wider flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#FF9D2E]" />
                          <span>Media Showcase Proyek (Video / Galeri Foto)</span>
                        </label>
                        <p className="text-xs text-[#526783] mt-0.5">
                          Pilih format tampilan utama proyek: Galeri Foto yang bergeser otomatis (slideshow) atau Video YouTube.
                        </p>
                      </div>

                      {/* Format Selector Buttons */}
                      <div className="flex items-center gap-2 bg-[#F8FAFD] p-1 rounded-xl border border-[#DCE7F5] self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() =>
                            setContent({
                              ...content,
                              project: { ...content.project, mediaType: 'photo' },
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            content.project.mediaType !== 'video'
                              ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow'
                              : 'text-[#526783] hover:text-white'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Foto / Slideshow</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setContent({
                              ...content,
                              project: { ...content.project, mediaType: 'video' },
                            })
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            content.project.mediaType === 'video'
                              ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow'
                              : 'text-[#526783] hover:text-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Video YouTube</span>
                        </button>
                      </div>
                    </div>

                    {uploadError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{uploadError}</span>
                      </div>
                    )}

                    {/* JIKA FORMAT VIDEO YOUTUBE TERPILIH */}
                    {content.project.mediaType === 'video' ? (
                      <div className="p-5 rounded-xl bg-[#F8FAFD] border border-[#FF9D2E]/40 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#C76A08] uppercase tracking-wider">
                          <Film className="w-4 h-4 text-[#FF9D2E]" />
                          <span>Link Video YouTube (Ringan & Cepat)</span>
                        </div>
                        <p className="text-xs text-[#526783] leading-relaxed">
                          Cukup masukkan URL video YouTube di bawah ini (misalnya dokumentasi proyek, drone lapangan, atau video perumahan). Sistem otomatis meng-embed video langsung dari YouTube sehingga server tetap ringan, hemat bandwidth, dan loading sangat cepat!
                        </p>

                        <div>
                          <label className="block text-xs font-bold text-[#073B78] mb-1">
                            URL Video YouTube (bisa link biasa, share link youtu.be, atau embed)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau https://youtu.be/..."
                            value={content.project.videoUrl || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                project: { ...content.project, videoUrl: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                          />
                        </div>

                        {/* Live YouTube Preview */}
                        {getYouTubeEmbedUrl(content.project.videoUrl) ? (
                          <div className="space-y-2 pt-2">
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Preview Video Terdeteksi:</span>
                            </span>
                            <div className="relative aspect-video max-w-lg rounded-xl overflow-hidden border border-[#DCE7F5] bg-black">
                              <iframe
                                src={getYouTubeEmbedUrl(content.project.videoUrl)!}
                                title="Preview Video YouTube"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        ) : content.project.videoUrl ? (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                            Format URL belum dikenali. Harap pastikan link dari YouTube (contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/...).
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      /* JIKA FORMAT FOTO / SLIDESHOW TERPILIH */
                      <div className="p-5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE7F5] pb-3">
                          <div>
                            <div className="text-xs font-bold text-[#C76A08] uppercase tracking-wider flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-[#FF9D2E]" />
                              <span>Galeri Slideshow Foto Proyek ({content.project.slides?.length || 0} Foto)</span>
                            </div>
                            <p className="text-xs text-[#526783] mt-0.5">
                              Foto-foto ini akan otomatis bergeser (slideshow) setiap 5 detik di halaman depan dengan kontrol next/prev dan zoom.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Tombol Kosongkan Semua Foto */}
                            {content.project.slides && content.project.slides.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setContent({
                                    ...content,
                                    project: {
                                      ...content.project,
                                      slides: [],
                                    },
                                  });
                                  setSaveStatus({
                                    type: 'success',
                                    message: 'Semua foto galeri proyek dikosongkan! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                                  });
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Kosongkan Semua Foto</span>
                              </button>
                            )}

                            {/* Tombol Tambah Slide */}
                            <button
                              type="button"
                              onClick={() => {
                                const currentSlides = content.project.slides || [];
                                setContent({
                                  ...content,
                                  project: {
                                    ...content.project,
                                    slides: [
                                      ...currentSlides,
                                      {
                                        image: '',
                                        caption: 'Dokumentasi Proyek Puri Gunung Langgar',
                                      },
                                    ],
                                  },
                                });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Tambah Slide</span>
                            </button>
                          </div>
                        </div>

                        {/* Slide Items List */}
                        <div className="space-y-3 pt-1">
                          {(content.project.slides || []).map((slide, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3 relative group"
                            >
                              <div className="flex items-center justify-between border-b border-[#DCE7F5] pb-2">
                                <span className="text-xs font-bold text-[#FF9D2E]">
                                  Slide Proyek #{idx + 1}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const slides = [...(content.project.slides || [])];
                                      const temp = slides[idx];
                                      slides[idx] = slides[idx - 1];
                                      slides[idx - 1] = temp;
                                      setContent({
                                        ...content,
                                        project: { ...content.project, slides },
                                      });
                                    }}
                                    className="p-1 rounded hover:bg-white/10 text-[#526783] disabled:opacity-30 disabled:hover:bg-transparent"
                                    title="Pindahkan ke atas"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (content.project.slides || []).length - 1}
                                    onClick={() => {
                                      const slides = [...(content.project.slides || [])];
                                      const temp = slides[idx];
                                      slides[idx] = slides[idx + 1];
                                      slides[idx + 1] = temp;
                                      setContent({
                                        ...content,
                                        project: { ...content.project, slides },
                                      });
                                    }}
                                    className="p-1 rounded hover:bg-white/10 text-[#526783] disabled:opacity-30 disabled:hover:bg-transparent"
                                    title="Pindahkan ke bawah"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const slides = [...(content.project.slides || [])];
                                      slides.splice(idx, 1);
                                      setContent({
                                        ...content,
                                        project: { ...content.project, slides },
                                      });
                                      setSaveStatus({
                                        type: 'success',
                                        message: 'Foto slide proyek berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                                      });
                                    }}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400 text-xs ml-1"
                                    title="Hapus slide ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                {/* Thumbnail */}
                                <div className="sm:col-span-3">
                                  <div className="aspect-[16/10] w-full rounded-lg bg-black border border-[#DCE7F5] overflow-hidden flex items-center justify-center">
                                    {slide.image ? (
                                      <img
                                        src={slide.image}
                                        alt={`Slide ${idx + 1}`}
                                        style={{
                                          objectFit: slide.imageFit || 'cover',
                                          objectPosition: `${slide.imageOffsetX !== undefined ? slide.imageOffsetX : 50}% ${slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}%`,
                                          transform: `scale(${(slide.imageZoom !== undefined ? slide.imageZoom : 100) / 100})`,
                                        }}
                                        className="w-full h-full"
                                      />
                                    ) : (
                                      <span className="text-[10px] text-[#526783]">Tanpa Foto</span>
                                    )}
                                  </div>
                                </div>

                                {/* Inputs & Upload Button */}
                                <div className="sm:col-span-9 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Path foto (/assets/... atau /uploads/...)"
                                      value={slide.image}
                                      onChange={(e) => {
                                        const slides = [...(content.project.slides || [])];
                                        slides[idx].image = e.target.value;
                                        setContent({
                                          ...content,
                                          project: { ...content.project, slides },
                                        });
                                      }}
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                                    />
                                    {/* Upload Foto Biasa Button */}
                                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#102D52] text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
                                      <Upload className="w-3.5 h-3.5 text-[#FF9D2E]" />
                                      <span>
                                        {uploadingSlide === idx ? 'Mengupload...' : 'Upload Foto'}
                                      </span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploadingSlide === idx}
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleUploadProjectImage(e.target.files[0], idx);
                                          }
                                        }}
                                      />
                                    </label>
                                    {slide.image && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const slides = [...(content.project.slides || [])];
                                          slides[idx].image = '';
                                          setContent({
                                            ...content,
                                            project: { ...content.project, slides },
                                          });
                                        }}
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                                        title="Hapus foto dari slide ini"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Keterangan / Caption foto (misal: Pematangan Lahan Zona B)"
                                      value={slide.caption || ''}
                                      onChange={(e) => {
                                        const slides = [...(content.project.slides || [])];
                                        slides[idx].caption = e.target.value;
                                        setContent({
                                          ...content,
                                          project: { ...content.project, slides },
                                        });
                                      }}
                                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                                    />
                                  </div>

                                  {slide.image && (<ImageAdjustmentControl
                                    title={`Ukuran, Posisi & Crop Slide #${idx + 1}`}
                                      fit={slide.imageFit || 'cover'}
                                      offsetX={slide.imageOffsetX !== undefined ? slide.imageOffsetX : 50}
                                      offsetY={slide.imageOffsetY !== undefined ? slide.imageOffsetY : 50}
                                      zoom={slide.imageZoom !== undefined ? slide.imageZoom : 100}
                                      onChange={({ fit, offsetX, offsetY, zoom }) => {
                                        const slides = [...(content.project.slides || [])];
                                        slides[idx].imageFit = fit;
                                        slides[idx].imageOffsetX = offsetX;
                                        slides[idx].imageOffsetY = offsetY;
                                        slides[idx].imageZoom = zoom;
                                        setContent({
                                          ...content,
                                          project: { ...content.project, slides },
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Dynamic Specs Editor */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                        Spesifikasi & Rincian Unit ({content.project.specs?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setContent({
                            ...content,
                            project: {
                              ...content.project,
                              specs: [...content.project.specs, { label: 'Spesifikasi Baru', value: '[ISI: Nilai]' }],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-[#FFF7EB] text-[#C76A08] hover:bg-[#FF9D2E]/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Rincian
                      </button>
                    </div>

                    <div className="space-y-2">
                      {content.project.specs?.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5]">
                          <input
                            type="text"
                            placeholder="Label (contoh: Jumlah Unit)"
                            value={spec.label}
                            onChange={(e) => {
                              const newSpecs = [...content.project.specs];
                              newSpecs[idx].label = e.target.value;
                              setContent({
                                ...content,
                                project: { ...content.project, specs: newSpecs },
                              });
                            }}
                            className="w-1/3 px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                          />
                          <input
                            type="text"
                            placeholder="Nilai (contoh: [ISI: Jumlah Unit] atau 120 Unit)"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...content.project.specs];
                              newSpecs[idx].value = e.target.value;
                              setContent({
                                ...content,
                                project: { ...content.project, specs: newSpecs },
                              });
                            }}
                            className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#C76A08] font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = content.project.specs.filter((_, i) => i !== idx);
                              setContent({
                                ...content,
                                project: { ...content.project, specs: newSpecs },
                              });
                              setSaveStatus({
                                type: 'success',
                                message: 'Spesifikasi unit berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                              });
                            }}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Bar Editor */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider">
                          Bar Ringkasan Cepat Halaman Proyek ({content.project.highlights?.length || 4} Indikator)
                        </label>
                        <p className="text-[11px] text-[#526783]">
                          Muncul tepat di bawah header halaman proyek (Tipe Rumah, Bunga KPR, Status Lahan, dsb).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = content.project.highlights || [
                            { label: "Tipe Rumah", value: "Tipe 36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                            { label: "Suku Bunga KPR", value: "5.0% Flat", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                            { label: "Legalitas Lahan", value: "Sertifikat Resmi", subtext: "Proses Pemecahan BPN", icon: "shield" },
                            { label: "Status Proyek", value: "Tahap Konstruksi", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                          ];
                          setContent({
                            ...content,
                            project: {
                              ...content.project,
                              highlights: [...curr, { label: 'Label Baru', value: 'Nilai Baru', subtext: 'Keterangan', icon: 'home' }],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-[#FFF7EB] text-[#C76A08] hover:bg-[#FF9D2E]/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Indikator
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(content.project.highlights || [
                        { label: "Tipe Rumah", value: "Tipe 36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                        { label: "Suku Bunga KPR", value: "5.0% Flat", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                        { label: "Legalitas Lahan", value: "Sertifikat Resmi", subtext: "Proses Pemecahan BPN", icon: "shield" },
                        { label: "Status Proyek", value: "Tahap Konstruksi", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                      ]).map((hl, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#FF9D2E] uppercase">Indikator #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = content.project.highlights || [
                                  { label: "Tipe Rumah", value: "Tipe 36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                                  { label: "Suku Bunga KPR", value: "5.0% Flat", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                                  { label: "Legalitas Lahan", value: "Sertifikat Resmi", subtext: "Proses Pemecahan BPN", icon: "shield" },
                                  { label: "Status Proyek", value: "Tahap Konstruksi", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                                ];
                                setContent({
                                  ...content,
                                  project: { ...content.project, highlights: curr.filter((_, i) => i !== idx) },
                                });
                              }}
                              className="text-rose-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              placeholder="Label (contoh: Tipe Rumah)"
                              value={hl.label}
                              onChange={(e) => {
                                const curr = [...(content.project.highlights || [
                                  { label: "Tipe Rumah", value: "Tipe 36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                                  { label: "Suku Bunga KPR", value: "5.0% Flat", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                                  { label: "Legalitas Lahan", value: "Sertifikat Resmi", subtext: "Proses Pemecahan BPN", icon: "shield" },
                                  { label: "Status Proyek", value: "Tahap Konstruksi", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                                ])];
                                curr[idx].label = e.target.value;
                                setContent({ ...content, project: { ...content.project, highlights: curr } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                            />
                            <input
                              type="text"
                              placeholder="Nilai Utama (contoh: Tipe 36 / 72 m²)"
                              value={hl.value}
                              onChange={(e) => {
                                const curr = [...(content.project.highlights || [
                                  { label: "Tipe Rumah", value: "Tipe 36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                                  { label: "Suku Bunga KPR", value: "5.0% Flat", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                                  { label: "Legalitas Lahan", value: "Sertifikat Resmi", subtext: "Proses Pemecahan BPN", icon: "shield" },
                                  { label: "Status Proyek", value: "Tahap Konstruksi", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                                ])];
                                curr[idx].value = e.target.value;
                                setContent({ ...content, project: { ...content.project, highlights: curr } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] font-bold"
                            />
                            <input
                              type="text"
                              placeholder="Subteks (contoh: Luas Bangunan & Kavling)"
                              value={hl.subtext}
                              onChange={(e) => {
                                const curr = [...(content.project.highlights || [
                                  { label: "Tipe Rumah", value: "Tipe 36 / 72 m²", subtext: "Luas Bangunan & Kavling", icon: "home" },
                                  { label: "Suku Bunga KPR", value: "5.0% Flat", subtext: "FLPP Tetap Sampai Lunas", icon: "calculator" },
                                  { label: "Legalitas Lahan", value: "Sertifikat Resmi", subtext: "Proses Pemecahan BPN", icon: "shield" },
                                  { label: "Status Proyek", value: "Tahap Konstruksi", subtext: "Pematangan Lahan & Struktur", icon: "hardhat" }
                                ])];
                                curr[idx].subtext = e.target.value;
                                setContent({ ...content, project: { ...content.project, highlights: curr } });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-[11px] text-[#526783]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Floor Plan Editor */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider">
                          Denah & Pembagian Ruang Hunian ({content.project.floorPlan?.length || 6} Ruangan)
                        </label>
                        <p className="text-[11px] text-[#526783]">
                          Kelola ukuran dan rincian ruangan tipe hunian (Kamar tidur, ruang keluarga, dsb).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const curr = content.project.floorPlan || [
                            { label: "Kamar Tidur Utama", value: "3.00 × 3.00 m" },
                            { label: "Kamar Tidur Anak", value: "3.00 × 2.75 m" },
                            { label: "Ruang Tamu & Keluarga", value: "Terbuka & Fleksibel" },
                            { label: "Kamar Mandi / WC", value: "1.50 × 1.50 m" },
                            { label: "Halaman Depan & Carport", value: "Tersedia Area Parkir" },
                            { label: "Sisa Lahan Belakang", value: "Bisa untuk Dapur / Taman" }
                          ];
                          setContent({
                            ...content,
                            project: {
                              ...content.project,
                              floorPlan: [...curr, { label: 'Ruangan Baru', value: '3.00 × 3.00 m' }],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded bg-[#FFF7EB] text-[#C76A08] hover:bg-[#FF9D2E]/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Ruangan
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(content.project.floorPlan || [
                        { label: "Kamar Tidur Utama", value: "3.00 × 3.00 m" },
                        { label: "Kamar Tidur Anak", value: "3.00 × 2.75 m" },
                        { label: "Ruang Tamu & Keluarga", value: "Terbuka & Fleksibel" },
                        { label: "Kamar Mandi / WC", value: "1.50 × 1.50 m" },
                        { label: "Halaman Depan & Carport", value: "Tersedia Area Parkir" },
                        { label: "Sisa Lahan Belakang", value: "Bisa untuk Dapur / Taman" }
                      ]).map((fp, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5]">
                          <input
                            type="text"
                            placeholder="Nama Ruangan"
                            value={fp.label}
                            onChange={(e) => {
                              const curr = [...(content.project.floorPlan || [
                                { label: "Kamar Tidur Utama", value: "3.00 × 3.00 m" },
                                { label: "Kamar Tidur Anak", value: "3.00 × 2.75 m" },
                                { label: "Ruang Tamu & Keluarga", value: "Terbuka & Fleksibel" },
                                { label: "Kamar Mandi / WC", value: "1.50 × 1.50 m" },
                                { label: "Halaman Depan & Carport", value: "Tersedia Area Parkir" },
                                { label: "Sisa Lahan Belakang", value: "Bisa untuk Dapur / Taman" }
                              ])];
                              curr[idx].label = e.target.value;
                              setContent({ ...content, project: { ...content.project, floorPlan: curr } });
                            }}
                            className="w-1/2 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                          />
                          <input
                            type="text"
                            placeholder="Ukuran / Keterangan"
                            value={fp.value}
                            onChange={(e) => {
                              const curr = [...(content.project.floorPlan || [
                                { label: "Kamar Tidur Utama", value: "3.00 × 3.00 m" },
                                { label: "Kamar Tidur Anak", value: "3.00 × 2.75 m" },
                                { label: "Ruang Tamu & Keluarga", value: "Terbuka & Fleksibel" },
                                { label: "Kamar Mandi / WC", value: "1.50 × 1.50 m" },
                                { label: "Halaman Depan & Carport", value: "Tersedia Area Parkir" },
                                { label: "Sisa Lahan Belakang", value: "Bisa untuk Dapur / Taman" }
                              ])];
                              curr[idx].value = e.target.value;
                              setContent({ ...content, project: { ...content.project, floorPlan: curr } });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#073B78] font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const curr = content.project.floorPlan || [
                                { label: "Kamar Tidur Utama", value: "3.00 × 3.00 m" },
                                { label: "Kamar Tidur Anak", value: "3.00 × 2.75 m" },
                                { label: "Ruang Tamu & Keluarga", value: "Terbuka & Fleksibel" },
                                { label: "Kamar Mandi / WC", value: "1.50 × 1.50 m" },
                                { label: "Halaman Depan & Carport", value: "Tersedia Area Parkir" },
                                { label: "Sisa Lahan Belakang", value: "Bisa untuk Dapur / Taman" }
                              ];
                              setContent({
                                ...content,
                                project: { ...content.project, floorPlan: curr.filter((_, i) => i !== idx) },
                              });
                            }}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Advantages Editor */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-3">
                    <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider">
                      3 Keunggulan Strategis Kawasan Proyek
                    </label>
                    <div className="space-y-3">
                      {(content.project.locationAdvantages || [
                        {
                          number: "01",
                          title: "Dekat Perbatasan Kota",
                          desc: "Akses lancar menuju pusat perkantoran, perbelanjaan, dan fasilitas umum di Kota Bandar Lampung maupun Sukarame."
                        },
                        {
                          number: "02",
                          title: "Lingkungan Asri & Bebas Banjir",
                          desc: "Kontur tanah berbukit yang terbebas dari genangan air banjir, dengan sirkulasi udara segar alami perbukitan."
                        },
                        {
                          number: "03",
                          title: "Infrastruktur Terpadu",
                          desc: "Jalan lingkungan memadai untuk akses kendaraan roda empat, jaringan drainase kawasan, dan fasilitas listrik PLN."
                        }
                      ]).map((adv, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={adv.number}
                              onChange={(e) => {
                                const curr = [...(content.project.locationAdvantages || [
                                  { number: "01", title: "Dekat Perbatasan Kota", desc: "..." },
                                  { number: "02", title: "Lingkungan Asri & Bebas Banjir", desc: "..." },
                                  { number: "03", title: "Infrastruktur Terpadu", desc: "..." }
                                ])];
                                curr[idx].number = e.target.value;
                                setContent({ ...content, project: { ...content.project, locationAdvantages: curr } });
                              }}
                              className="w-14 px-2.5 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs font-bold text-[#FF9D2E]"
                            />
                            <input
                              type="text"
                              value={adv.title}
                              onChange={(e) => {
                                const curr = [...(content.project.locationAdvantages || [
                                  { number: "01", title: "Dekat Perbatasan Kota", desc: "..." },
                                  { number: "02", title: "Lingkungan Asri & Bebas Banjir", desc: "..." },
                                  { number: "03", title: "Infrastruktur Terpadu", desc: "..." }
                                ])];
                                curr[idx].title = e.target.value;
                                setContent({ ...content, project: { ...content.project, locationAdvantages: curr } });
                              }}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs font-bold text-[#102D52]"
                              placeholder="Judul Keunggulan"
                            />
                          </div>
                          <textarea
                            rows={2}
                            value={adv.desc}
                            onChange={(e) => {
                              const curr = [...(content.project.locationAdvantages || [
                                { number: "01", title: "Dekat Perbatasan Kota", desc: "..." },
                                { number: "02", title: "Lingkungan Asri & Bebas Banjir", desc: "..." },
                                { number: "03", title: "Infrastruktur Terpadu", desc: "..." }
                              ])];
                              curr[idx].desc = e.target.value;
                              setContent({ ...content, project: { ...content.project, locationAdvantages: curr } });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                            placeholder="Uraian keunggulan kawasan..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Survey CTA Editor */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-3">
                    <label className="block text-xs font-bold text-[#073B78] uppercase tracking-wider">
                      Banner Ajakan Jadwal Survei (Bagian Bawah Halaman Proyek)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#526783] mb-1">Judul Ajakan</label>
                        <input
                          type="text"
                          value={content.project.surveyCta?.title || 'Jadwalkan Survei Lokasi Proyek Sekarang'}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              project: {
                                ...content.project,
                                surveyCta: {
                                  ...(content.project.surveyCta || {
                                    title: 'Jadwalkan Survei Lokasi Proyek Sekarang',
                                    subtitle: 'Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.',
                                    buttonText: 'Isi Formulir Survei',
                                    waButtonText: 'WhatsApp Pemasaran'
                                  }),
                                  title: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#526783] mb-1">Teks Tombol Form</label>
                        <input
                          type="text"
                          value={content.project.surveyCta?.buttonText || 'Isi Formulir Survei'}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              project: {
                                ...content.project,
                                surveyCta: {
                                  ...(content.project.surveyCta || {
                                    title: 'Jadwalkan Survei Lokasi Proyek Sekarang',
                                    subtitle: 'Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.',
                                    buttonText: 'Isi Formulir Survei',
                                    waButtonText: 'WhatsApp Pemasaran'
                                  }),
                                  buttonText: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#526783] mb-1">Deskripsi Ajakan</label>
                      <textarea
                        rows={2}
                        value={content.project.surveyCta?.subtitle || 'Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.'}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            project: {
                              ...content.project,
                              surveyCta: {
                                ...(content.project.surveyCta || {
                                  title: 'Jadwalkan Survei Lokasi Proyek Sekarang',
                                  subtitle: 'Tim lapangan PT. TBK siap mendampingi Anda melihat langsung lokasi kavling dan unit contoh di Puri Gunung Langgar.',
                                  buttonText: 'Isi Formulir Survei',
                                  waButtonText: 'WhatsApp Pemasaran'
                                }),
                                subtitle: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACT */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-[#FF9D2E]" />
                    Kontak, Alamat Kantor & Jam Operasional
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Atur kota domisili kantor, alamat resmi, nomor WhatsApp, email, dan jam pelayanan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Kota Domisili Kantor
                    </label>
                    <input
                      type="text"
                      value={content.contact.city}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, city: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Alamat Kantor Lengkap
                    </label>
                    <textarea
                      rows={2}
                      value={content.contact.address}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, address: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Nomor WhatsApp
                      </label>
                      <input
                        type="text"
                        value={content.contact.whatsapp}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            contact: { ...content.contact, whatsapp: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Email Kantor
                      </label>
                      <input
                        type="text"
                        value={content.contact.email}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            contact: { ...content.contact, email: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Jam Operasional Kantor
                    </label>
                    <input
                      type="text"
                      value={content.contact.operatingHours}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, operatingHours: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm"
                    />
                  </div>

                  {/* Pengaturan Google Maps Kantor */}
                  <div className="pt-4 border-t border-[#DCE7F5] space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FF9D2E]" />
                      <label className="block text-xs font-bold text-[#FF9D2E] uppercase tracking-wider">
                        Peta Lokasi Kantor Google Maps (Tampil di Footer)
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-[#526783]">
                          URL Sematan Peta (Google Maps Embed iframe)
                        </label>
                        <span className="text-[11px] text-[#526783]">
                          Dari Google Maps: Bagikan &rarr; Sematkan peta &rarr; Salin link src
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        value={content.contact.mapsEmbedUrl || ''}
                        onChange={(e) => {
                          let val = e.target.value.trim();
                          // Jika user copy seluruh tag <iframe src="...">, ekstrak URL src-nya otomatis
                          if (val.includes('<iframe') || /src=["']/i.test(val)) {
                            const match = val.match(/src=["']([^"']+)["']/i);
                            if (match && match[1]) val = match[1];
                          }
                          setContent({
                            ...content,
                            contact: { ...content.contact, mapsEmbedUrl: val },
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Tautan Rute / Petunjuk Arah (Link Langsung Google Maps)
                      </label>
                      <input
                        type="text"
                        placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/?q=..."
                        value={content.contact.mapsUrl || ''}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            contact: { ...content.contact, mapsUrl: e.target.value.trim() },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-xs font-mono focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                      <span className="text-[10.5px] text-[#526783] block mt-1">
                        Link ini akan dibuka saat pengunjung menekan tombol &quot;Petunjuk Arah&quot; atau &quot;Buka Maps&quot; di footer.
                      </span>
                    </div>

                    {/* Live Preview Peta di Admin */}
                    {content.contact.mapsEmbedUrl ? (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Preview Peta Google Maps Terdeteksi:</span>
                        </span>
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#DCE7F5] bg-white">
                          <iframe
                            src={content.contact.mapsEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Preview Peta Admin"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                        Peta Google Maps saat ini menggunakan titik default Kota Bandar Lampung. Masukkan link embed di atas untuk mengarahkan ke koordinat kantor Anda secara presisi.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-[#FF9D2E]" />
                      Pesan Masuk dari Formulir Website
                      {inquiries.length > 0 && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 font-sans font-semibold">
                          {inquiries.length} Pesan
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-[#526783] mt-1">
                      Data kontak dan pertanyaan yang dikirimkan oleh pengunjung melalui formulir minat website.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {inquiries.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllInquiries}
                        className="p-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs flex items-center gap-1.5 transition-colors"
                        title="Kosongkan Semua Pesan Masuk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Kosongkan Semua</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={fetchInquiries}
                      disabled={inquiriesLoading}
                      className="p-2 px-3 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] text-[#526783] hover:text-[#102D52] text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${inquiriesLoading ? 'animate-spin' : ''}`} />
                      <span>Segarkan</span>
                    </button>
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-12 text-center text-[#526783] rounded-xl bg-[#F8FAFD] border border-[#DCE7F5]">
                    <Inbox className="w-10 h-10 mx-auto text-[#526783] mb-3" />
                    <p className="text-sm font-medium">Belum ada pesan masuk.</p>
                    <p className="text-xs text-[#526783] mt-1">
                      Setiap formulir minat yang disubmit pengunjung di landing page akan otomatis muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-2 relative group hover:border-[#FF9D2E]/30 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#DCE7F5] pb-2">
                          <div className="font-syne font-bold text-[#073B78] text-sm flex items-center gap-2">
                            <span>{inq.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] text-[#526783]">
                              {new Date(inq.created_at).toLocaleString('id-ID')}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs flex items-center gap-1 transition-colors"
                              title="Hapus pesan ini permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Hapus</span>
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-[#C76A08]">
                          <div>WA/Telp: <span className="text-[#102D52] font-mono font-semibold">{inq.phone}</span></div>
                          {inq.email && <div>Email: <span className="text-[#102D52] font-medium">{inq.email}</span></div>}
                        </div>
                        {inq.message && (
                          <div className="text-xs text-[#526783] bg-white p-3 rounded-lg border border-[#DCE7F5]">
                            {inq.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073B78]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-[#DCE7F5] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-[#073B78]/20">
            {/* Top Corporate Gradient Accent */}
            <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-r from-[#073B78] via-[#0A4B91] to-[#FF9D2E] rounded-t-full" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#DCE7F5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#073B78]/10 text-[#073B78] flex items-center justify-center shadow-xs">
                  <Key className="w-5 h-5 text-[#FF9D2E]" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-[#073B78] text-base">Ganti Kata Sandi</h3>
                  <p className="text-xs text-[#526783]">Ubah password akun admin Anda</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassChangeStatus(null);
                  setCurrPass('');
                  setNewPass('');
                  setConfirmPass('');
                }}
                className="p-1.5 rounded-lg text-[#526783] hover:text-[#073B78] hover:bg-[#F8FAFD] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status alerts */}
            {passChangeStatus && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  passChangeStatus.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-800'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-800'
                }`}
              >
                {passChangeStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span className="font-medium">{passChangeStatus.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#073B78] mb-1.5">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Masukkan password saat ini..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/60 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#073B78] focus:ring-4 focus:ring-[#073B78]/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B78] mb-1.5">
                  Kata Sandi Baru (Minimal 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Masukkan password baru..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/60 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#073B78] focus:ring-4 focus:ring-[#073B78]/10 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B78] mb-1.5">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ketik ulang password baru..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/60 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#073B78] focus:ring-4 focus:ring-[#073B78]/10 transition-all font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passChangeLoading}
                  className="px-4 py-2 rounded-xl bg-[#F8FAFD] hover:bg-[#EDF3FA] text-xs font-semibold text-[#526783] border border-[#DCE7F5] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passChangeLoading}
                  className="px-5 py-2 rounded-xl bg-[#073B78] hover:bg-[#0A4B91] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#073B78]/25 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  {passChangeLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Password Baru</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
