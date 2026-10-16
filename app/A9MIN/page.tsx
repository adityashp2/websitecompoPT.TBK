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
  ChevronDown
} from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  created_at: string;
}

export type AdminTab =
  | 'banners'
  | 'intro-features'
  | 'hero'
  | 'buying-process'
  | 'kpr-simulation'
  | 'branding'
  | 'about'
  | 'leadership'
  | 'legal'
  | 'project'
  | 'activities'
  | 'contact'
  | 'inquiries';

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
  }, []);

  const initDashboard = async () => {
    setLoading(true);
    try {
      // 1. Verify authentication
      const authRes = await fetch('/api/auth/me');
      const authJson = await authRes.json();
      if (!authRes.ok || !authJson.authenticated) {
        router.replace('/A9MIN/login');
        return;
      }
      setAdminUser(authJson.user);
    } catch (err) {
      console.error('Session verification error:', err);
      router.replace('/A9MIN/login');
      return;
    }

    // 2. Fetch site content safely
    try {
      await fetchContent();
    } catch (err) {
      console.error('Failed to load initial site content:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      if (json.success && json.data) {
        setContent(json.data);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: 'error', message: 'Gagal membaca data dari database SQL.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Apakah Anda yakin ingin keluar (logout) dari panel admin?')) {
      return;
    }
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/A9MIN/login');
    } catch (err) {
      console.error('Logout failed:', err);
      router.replace('/A9MIN/login');
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
      const res = await fetch('/api/inquiries');
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
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
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
      const res = await fetch('/api/inquiries?all=true', { method: 'DELETE' });
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
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <div className="min-h-screen bg-[#F4F7FC] text-[#102D52] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#FF9D2E]">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-syne font-semibold">Memuat Data Panel Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-[#102D52] selection:bg-[#FF9D2E] selection:text-[#071C38]">
      {/* Top Admin Navbar */}
      <nav className="sticky top-0 z-40 bg-[#073B78] border-b border-[#0A4B91] px-4 sm:px-6 lg:px-8 py-3.5 shadow-lg shadow-[#071C38]/20">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 lg:gap-6">
          {/* Brand Left */}
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 p-1 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src={content.meta?.logo || "/assets/logo-tbk.png"}
                  alt="Logo PT. TBK"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div>
                <div className="font-syne font-bold text-sm sm:text-base text-white">
                  CMS Panel Administrasi
                </div>
                <div className="text-[11px] text-[#FF9D2E] font-semibold">
                  PT. Terbang Bersama Kawan (PT. TBK)
                </div>
              </div>
            </div>

            {/* Mobile-only User Pill & Logout */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#102D52] border border-[#1C5795] text-[11px] text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-[#FF9D2E] truncate max-w-[90px]">
                  {adminUser?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="p-1.5 rounded-lg bg-[#102D52] border border-[#1C5795] hover:bg-rose-600 hover:border-rose-600 text-white/90 hover:text-white transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {/* Desktop User badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#102D52] border border-[#1C5795] text-xs text-white shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 text-[11px]">Admin:</span>
              <span className="font-semibold text-[#FF9D2E] truncate max-w-[140px]">
                {adminUser?.name || 'Administrator'}
              </span>
            </div>

            {/* Quick Links Group */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-[#102D52] border border-[#1C5795] hover:border-[#FF9D2E] hover:bg-[#163E70] text-xs text-white/90 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#FF9D2E]" />
                <span className="hidden sm:inline">Lihat Website</span>
                <span className="sm:hidden">Web</span>
              </Link>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-[#102D52] border border-[#1C5795] hover:border-[#FF9D2E] hover:bg-[#163E70] text-xs text-white/90 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
                title="Ganti Kata Sandi Admin"
              >
                <Key className="w-3.5 h-3.5 text-[#FF9D2E]" />
                <span className="hidden sm:inline">Ganti Password</span>
                <span className="sm:hidden">Sandi</span>
              </button>

              <button
                onClick={handleReset}
                disabled={saving}
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-100 hover:bg-rose-500/30 text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                title="Reset ke DATA RESMI default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Data</span>
                <span className="sm:hidden">Reset</span>
              </button>
            </div>

            {/* Primary Action Button (Simpan) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-[#FF9D2E] to-[#F28A17] text-[#071C38] font-bold text-xs flex items-center gap-1.5 hover:brightness-105 shadow-md shadow-[#FF9D2E]/30 transition-all disabled:opacity-50 shrink-0"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan ke SQL</span>
                  </>
                )}
              </button>

              {/* Desktop Logout button */}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="hidden lg:flex px-3 py-2 rounded-lg bg-[#102D52] border border-[#1C5795] hover:bg-rose-600 hover:border-rose-600 text-xs text-white/90 hover:text-white items-center gap-1.5 transition-colors shrink-0"
                title="Keluar dari Panel Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Save Notification Banner */}
      {saveStatus && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              saveStatus.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {saveStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            )}
            <span>{saveStatus.message}</span>
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Tabs (Visible on Desktop >= lg) - Pinned Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-3 space-y-4 bg-[#0A2548] border border-[#1C5795]/50 rounded-2xl p-4 shadow-sm text-white sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto admin-sidebar-scroll">
            {/* GROUP 1: HALAMAN DEPAN (BERANDA) */}
            <div className="space-y-1">
              <div className="text-[11px] uppercase font-bold text-[#FF9D2E] px-3 py-1 tracking-wider flex items-center justify-between">
                <span>Tampilan Beranda</span>
                <span className="text-[10px] text-white/60 font-semibold">5 Bagian</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('banners')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'banners'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 shrink-0 text-[#FF9D2E]" />
                  <span>Banner Promosi Atas</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 text-white font-mono font-semibold">
                  {content.bannerSlides?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('intro-features')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'intro-features'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#FF9D2E]" />
                <span>Intro & 4 Keunggulan</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'hero'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Hero & Statistik Utama</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('buying-process')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'buying-process'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Alur Pembelian Rumah</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 text-white font-mono font-semibold">
                  {content.buyingProcess?.steps?.length || 4}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('kpr-simulation')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'kpr-simulation'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Calculator className="w-4 h-4 shrink-0" />
                <span>Simulasi KPR FLPP 5%</span>
              </button>
            </div>

            {/* GROUP 2: PROFIL PERUSAHAAN */}
            <div className="space-y-1 pt-2 border-t border-[#1C5795]/40">
              <div className="text-[11px] uppercase font-bold text-[#FF9D2E] px-3 py-1 tracking-wider flex items-center justify-between">
                <span>Profil Perusahaan</span>
                <span className="text-[10px] text-white/60 font-semibold">4 Bagian</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('branding')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'branding'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0 text-[#FF9D2E]" />
                <span>Branding, Logo & Footer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'about'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Tentang, Visi & Misi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('leadership')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'leadership'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Dewan Pengurus</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 text-white font-mono font-semibold">
                  {content.leadership?.members?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('legal')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'legal'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Legalitas & Notaris</span>
              </button>
            </div>

            {/* GROUP 3: PROYEK & DOKUMENTASI */}
            <div className="space-y-1 pt-2 border-t border-[#1C5795]/40">
              <div className="text-[11px] uppercase font-bold text-[#FF9D2E] px-3 py-1 tracking-wider flex items-center justify-between">
                <span>Proyek & Lapangan</span>
                <span className="text-[10px] text-white/60 font-semibold">2 Bagian</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('project')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'project'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <Building className="w-4 h-4 shrink-0" />
                <span>Proyek Puri Gunung Langgar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'activities'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HardHat className="w-4 h-4 shrink-0" />
                  <span>Kegiatan Lapangan Riil</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 text-white font-mono font-semibold">
                  {content.activities?.items?.length || 0}
                </span>
              </button>
            </div>

            {/* GROUP 4: INTERAKSI & FORMULIR */}
            <div className="space-y-1 pt-2 border-t border-[#1C5795]/40">
              <div className="text-[11px] uppercase font-bold text-[#FF9D2E] px-3 py-1 tracking-wider flex items-center justify-between">
                <span>Interaksi & Kontak</span>
                <span className="text-[10px] text-white/60 font-semibold">2 Bagian</span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Kontak & Alamat Kantor</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-md shadow-[#FF9D2E]/25'
                    : 'text-white/80 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 shrink-0" />
                  <span>Pesan Masuk (Formulir)</span>
                </div>
                {inquiries.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold animate-pulse">
                    {inquiries.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Quick Navigation Selector (< lg) - Sticky Navigation */}
          <div className="lg:hidden col-span-1 space-y-3 bg-[#0A2548] border border-[#1C5795]/50 rounded-2xl p-4 shadow-lg text-white sticky top-16 z-30 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-[#DCE7F5] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9D2E]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Bagian Konten Aktif</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFF7EB] text-[#C76A08] border border-[#FF9D2E]/30 font-mono font-semibold">
                13 Menu
              </span>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="mobile-tab-select" className="text-[11px] text-white/70 block font-medium">
                Pilih bagian yang ingin Anda edit:
              </label>
              <div className="relative">
                <select
                  id="mobile-tab-select"
                  value={activeTab}
                  onChange={(e) => {
                    setActiveTab(e.target.value as any);
                    const editorEl = document.getElementById('admin-form-editor');
                    if (editorEl) {
                      editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#071C38] border border-[#1C5795] text-white font-semibold text-xs sm:text-sm focus:outline-none focus:border-[#FF9D2E] appearance-none cursor-pointer"
                >
                  <optgroup label="TAMPILAN BERANDA">
                    <option value="banners">Banner Promosi Atas ({content.bannerSlides?.length || 0})</option>
                    <option value="intro-features">Intro & 4 Keunggulan</option>
                    <option value="hero">Hero & Statistik Utama</option>
                    <option value="buying-process">Alur Pembelian Rumah</option>
                    <option value="kpr-simulation">Simulasi KPR FLPP 5%</option>
                  </optgroup>
                  <optgroup label="PROFIL PERUSAHAAN">
                    <option value="branding">Branding, Logo & Footer</option>
                    <option value="about">Tentang, Visi & Misi</option>
                    <option value="leadership">Dewan Pengurus ({content.leadership?.members?.length || 0})</option>
                    <option value="legal">Legalitas & Notaris</option>
                  </optgroup>
                  <optgroup label="PROYEK & LAPANGAN">
                    <option value="project">Proyek Puri Gunung Langgar</option>
                    <option value="activities">Kegiatan Lapangan Riil ({content.activities?.items?.length || 0})</option>
                  </optgroup>
                  <optgroup label="INTERAKSI & KONTAK">
                    <option value="contact">Kontak & Alamat Kantor</option>
                    <option value="inquiries">Pesan Masuk (Formulir) {inquiries.length > 0 ? `(${inquiries.length} baru)` : ''}</option>
                  </optgroup>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF9D2E]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Category Chips for Fast 1-Tap Switching */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
              {[
                { id: 'banners', label: 'Banner' },
                { id: 'hero', label: 'Statistik' },
                { id: 'about', label: 'Tentang' },
                { id: 'project', label: 'Proyek' },
                { id: 'activities', label: 'Kegiatan' },
                { id: 'legal', label: 'Legalitas' },
                { id: 'contact', label: 'Kontak' },
                { id: 'inquiries', label: `Pesan ${inquiries.length > 0 ? `(${inquiries.length})` : ''}` },
              ].map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(chip.id as any);
                    const editorEl = document.getElementById('admin-form-editor');
                    if (editorEl) {
                      editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === chip.id
                      ? 'bg-[#FF9D2E] text-[#071C38] font-bold shadow-xs'
                      : 'bg-[#102D52] text-white/80 hover:text-white border border-[#1C5795]'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content Editor */}
          <div id="admin-form-editor" className="lg:col-span-9 bg-white border border-[#DCE7F5] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
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
                        image: '/assets/hero-marketing.jpg',
                        imageAlt: 'Perumahan Subsidi PT. Terbang Bersama Kawan',
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
                                if (window.confirm(`Hapus slide banner "${slide.eyebrow}"?`)) {
                                  const newSlides = (content.bannerSlides || []).filter((_, i) => i !== sIdx);
                                  setContent({ ...content, bannerSlides: newSlides });
                                  setSaveStatus({
                                    type: 'success',
                                    message: 'Slide banner berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan secara permanen.',
                                  });
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 ml-1"
                              title="Hapus Slide Ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Banner Image Preview & Upload */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                          <div className="md:col-span-4 space-y-2">
                            <label className="block text-xs font-bold text-[#073B78]">
                              Foto Background Banner
                            </label>
                            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#F8FAFD] border border-[#DCE7F5] group">
                              <img
                                src={slide.image || '/assets/hero-marketing.jpg'}
                                alt={slide.imageAlt || 'Banner preview'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="text"
                                placeholder="/assets/... atau URL gambar"
                                value={slide.image}
                                onChange={(e) => {
                                  const newSlides = [...(content.bannerSlides || [])];
                                  newSlides[sIdx].image = e.target.value;
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
                    Intro Beranda & 4 Kartu Keunggulan
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Kelola teks narasi singkat di beranda (bawah banner) dan 4 kartu keunggulan utama PT. Terbang Bersama Kawan.
                  </p>
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
                                  if (window.confirm(`Hapus kartu keunggulan "${feature.title}"?`)) {
                                    const currentFeatures = Array.isArray(content.about.features)
                                      ? [...content.about.features]
                                      : [
                                          { title: 'Hunian Berkualitas', desc: 'Rumah nyaman dengan infrastruktur yang memadai.', icon: 'home' },
                                          { title: 'Harga Terjangkau', desc: 'Solusi hunian untuk keluarga Indonesia.', icon: 'shield' },
                                          { title: 'Lokasi Strategis', desc: 'Mudah diakses dan dekat dengan fasilitas umum.', icon: 'map' },
                                          { title: 'Lingkungan Asri', desc: 'Hidup lebih sehat di lingkungan yang hijau.', icon: 'leaf' },
                                        ];
                                    const newFeatures = currentFeatures.filter((_, i) => i !== fIdx);
                                    setContent({
                                      ...content,
                                      about: { ...content.about, features: newFeatures },
                                    });
                                    setSaveStatus({
                                      type: 'success',
                                      message: 'Kartu keunggulan berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan.',
                                    });
                                  }
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
                              if (window.confirm(`Hapus langkah "${stepItem.title}"?`)) {
                                const newSteps = (content.buyingProcess?.steps || []).filter((_, i) => i !== stepIdx);
                                setContent({
                                  ...content,
                                  buyingProcess: { ...content.buyingProcess!, steps: newSteps },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Langkah tahapan berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan perubahan secara permanen.',
                                });
                              }
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

            {/* TAB: HERO */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="border-b border-[#DCE7F5] pb-4">
                  <h2 className="font-syne text-xl font-bold text-[#073B78] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF9D2E]" />
                    Pengaturan Hero & Banner Utama
                  </h2>
                  <p className="text-xs text-[#526783] mt-1">
                    Ubah teks judul, subjudul, tombol CTA, latar belakang, dan 4 kartu statistik di bagian atas website.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Label Badge Atas
                    </label>
                    <input
                      type="text"
                      value={content.hero.badge}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, badge: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Judul Utama (Heading)
                    </label>
                    <input
                      type="text"
                      value={content.hero.heading}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, heading: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#073B78] mb-1">
                      Deskripsi / Subheading
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.subheading}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, subheading: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Teks Tombol Utama
                      </label>
                      <input
                        type="text"
                        value={content.hero.primaryCtaText}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, primaryCtaText: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Link Tombol Utama (contoh: #proyek)
                      </label>
                      <input
                        type="text"
                        value={content.hero.primaryCtaLink}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, primaryCtaLink: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Teks Tombol Sekunder
                      </label>
                      <input
                        type="text"
                        value={content.hero.secondaryCtaText}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, secondaryCtaText: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#073B78] mb-1">
                        Link Tombol Sekunder (contoh: #kontak)
                      </label>
                      <input
                        type="text"
                        value={content.hero.secondaryCtaLink}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, secondaryCtaLink: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                      />
                    </div>
                  </div>

                  {/* Hero Background Image */}
                  <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                    <label className="block text-xs font-bold text-[#073B78]">
                      Gambar Latar Belakang Hero (Full Header Background)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-24 h-16 rounded-lg bg-black/40 border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                        {content.hero.backgroundImage ? (
                          <img
                            src={content.hero.backgroundImage}
                            alt="Preview Hero Background"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#526783]" />
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="URL atau path gambar latar hero"
                            value={content.hero.backgroundImage || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, backgroundImage: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                          />
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingKey === 'hero-bg' ? 'Mengupload...' : 'Upload Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === 'hero-bg'}
                              onClick={(e) => {
                                (e.target as HTMLInputElement).value = '';
                              }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'hero-bg', (url) => {
                                    setContent({
                                      ...content,
                                      hero: { ...content.hero, backgroundImage: url },
                                    });
                                    setSaveStatus({
                                      type: 'success',
                                      message: 'Foto latar hero berhasil diupload! Klik "Simpan Perubahan" di pojok kanan atas untuk menerapkannya ke website.',
                                    });
                                  });
                                }
                              }}
                            />
                          </label>
                          {content.hero.backgroundImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setContent({
                                  ...content,
                                  hero: { ...content.hero, backgroundImage: '' },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Foto latar hero dihapus. Klik "Simpan Perubahan" di pojok kanan atas untuk menerapkan.',
                                });
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                              title="Hapus foto background"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        {uploadError && (
                          <div className="p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                            {uploadError}
                          </div>
                        )}
                        <p className="text-[11px] text-[#526783]">
                          Format: JPG, PNG, atau WebP (disarankan orientasi lanskap 1920x1080).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SLIDESHOW MANAGER UNTUK HERO */}
                  <div className="pt-6 border-t border-[#DCE7F5] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-sm font-bold text-[#073B78] uppercase tracking-wider">
                          Slideshow Foto Unit / Kawasan Hero (Otomatis)
                        </label>
                        <p className="text-xs text-[#526783] mt-0.5">
                          Kelola foto-foto yang bergeser otomatis di bagian kanan hero website.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {content.hero.slides && content.hero.slides.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Kosongkan semua foto slideshow hero?')) {
                                setContent({
                                  ...content,
                                  hero: { ...content.hero, slides: [] },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Semua foto slideshow hero dikosongkan! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                                });
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Kosongkan Slide</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const currentSlides = content.hero.slides || [];
                            setContent({
                              ...content,
                              hero: {
                                ...content.hero,
                                slides: [
                                  ...currentSlides,
                                  {
                                    image: '',
                                    caption: 'Unit Puri Gunung Langgar, Tanjung Bintang, Lampung Selatan.',
                                  },
                                ],
                              },
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Slide</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {(content.hero.slides || []).map((slide, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-[#F8FAFD] rounded-xl border border-[#DCE7F5] space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between border-b border-[#DCE7F5] pb-2">
                            <span className="text-xs font-bold text-[#526783]">
                              Slide #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newSlides = [...(content.hero.slides || [])];
                                newSlides.splice(idx, 1);
                                setContent({
                                  ...content,
                                  hero: { ...content.hero, slides: newSlides },
                                });
                                setSaveStatus({
                                  type: 'success',
                                  message: 'Slide foto hero berhasil dihapus! Klik "Simpan ke SQL" di kanan atas untuk menyimpan secara permanen.',
                                });
                              }}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-colors text-xs flex items-center gap-1"
                              title="Hapus slide ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                            {/* Preview thumbnail */}
                            <div className="sm:col-span-3">
                              <div className="aspect-[4/3] w-full rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] overflow-hidden flex items-center justify-center">
                                {slide.image && slide.image.trim() !== '' ? (
                                  <img
                                    src={slide.image}
                                    alt={`Preview Slide ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[11px] text-[#526783] text-center px-2">
                                    [Kotak Abu Standar]
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Inputs */}
                            <div className="sm:col-span-9 space-y-2">
                              <div>
                                <label className="block text-[11px] font-medium text-[#526783] mb-0.5">
                                  Foto Slide (Upload dari perangkat atau masukkan URL)
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="misal: /uploads/... atau URL gambar"
                                    value={slide.image || ''}
                                    onChange={(e) => {
                                      const newSlides = [...(content.hero.slides || [])];
                                      newSlides[idx].image = e.target.value;
                                      setContent({
                                        ...content,
                                        hero: { ...content.hero, slides: newSlides },
                                      });
                                    }}
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                                  />
                                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>{uploadingKey === `hero-slide-${idx}` ? 'Mengupload...' : 'Upload Foto'}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      disabled={uploadingKey === `hero-slide-${idx}`}
                                      onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                          handleGenericFileUpload(e.target.files[0], `hero-slide-${idx}`, (url) => {
                                            const newSlides = [...(content.hero.slides || [])];
                                            newSlides[idx].image = url;
                                            setContent({
                                              ...content,
                                              hero: { ...content.hero, slides: newSlides },
                                            });
                                          });
                                        }
                                      }}
                                    />
                                  </label>
                                  {slide.image && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSlides = [...(content.hero.slides || [])];
                                        newSlides[idx].image = '';
                                        setContent({
                                          ...content,
                                          hero: { ...content.hero, slides: newSlides },
                                        });
                                      }}
                                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                                      title="Hapus foto dari slide ini"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-medium text-[#526783] mb-0.5">
                                  Teks Caption di Bawah Foto (13px abu-abu)
                                </label>
                                <input
                                  type="text"
                                  placeholder="Keterangan unit..."
                                  value={slide.caption}
                                  onChange={(e) => {
                                    const newSlides = [...(content.hero.slides || [])];
                                    newSlides[idx].caption = e.target.value;
                                    setContent({
                                      ...content,
                                      hero: { ...content.hero, slides: newSlides },
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!content.hero.slides || content.hero.slides.length === 0) && (
                        <div className="p-4 bg-[#F8FAFD] rounded-xl border border-dashed border-[#DCE7F5] text-center text-xs text-[#526783]">
                          Belum ada slide khusus. Slideshow akan menampilkan slide standar default.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DCE7F5]">
                    <label className="block text-xs font-bold text-[#FF9D2E] uppercase tracking-wider mb-3">
                      4 Kartu Ringkasan Hero (Stats)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.hero.stats?.map((stat, idx) => (
                        <div key={idx} className="p-3 bg-[#F8FAFD] rounded-xl border border-[#DCE7F5] space-y-2">
                          <input
                            type="text"
                            placeholder="Label (contoh: Domisili)"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...content.hero.stats];
                              newStats[idx].label = e.target.value;
                              setContent({
                                ...content,
                                hero: { ...content.hero, stats: newStats },
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#526783]"
                          />
                          <input
                            type="text"
                            placeholder="Nilai (contoh: Bandar Lampung)"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...content.hero.stats];
                              newStats[idx].value = e.target.value;
                              setContent({
                                ...content,
                                hero: { ...content.hero, stats: newStats },
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#C76A08] font-bold"
                          />
                        </div>
                      ))}
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
                                if (window.confirm(`Apakah Anda yakin ingin menghapus pengurus "${member.name}"?`)) {
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
                                }
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
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            {/* Portrait Preview */}
                            <div className="w-16 h-20 rounded-xl overflow-hidden border border-[#FF9D2E]/40 bg-white shrink-0 flex items-center justify-center shadow-md">
                              {member.image && member.image.trim() !== '' ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-full h-full object-cover object-top"
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
                                Format: JPG, PNG, atau WebP. Disarankan foto portrait vertikal (rasio 3:4 atau 4:5).
                              </span>
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
                                if (window.confirm(`Hapus kegiatan lapangan "${item.title || item.tag}"?`)) {
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
                                }
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
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="w-24 h-16 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                              {item.image && item.image.trim() !== '' ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
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

                  {/* Foto Sampul Utama Proyek */}
                  <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#DCE7F5] space-y-3">
                    <label className="block text-xs font-bold text-[#073B78]">
                      Foto Sampul Utama Proyek (Thumbnail & Cover Card)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-24 h-16 rounded-lg bg-[#F8FAFD] border border-[#DCE7F5] overflow-hidden shrink-0 flex items-center justify-center">
                        {content.project.image && content.project.image.trim() !== '' ? (
                          <img
                            src={content.project.image}
                            alt="Cover Proyek"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#526783]" />
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="URL atau path foto cover proyek"
                            value={content.project.image || ''}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                project: { ...content.project, image: e.target.value },
                              })
                            }
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-[#102D52] focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] font-mono"
                          />
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#073B78] hover:bg-[#0A4B91] text-white border border-[#073B78] text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingCover ? 'Mengupload...' : 'Upload Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingCover}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadProjectImage(e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          {content.project.image && (
                            <button
                              type="button"
                              onClick={() =>
                                setContent({
                                  ...content,
                                  project: { ...content.project, image: '' },
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                              title="Hapus foto cover"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
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
                                  if (window.confirm('Kosongkan semua foto galeri proyek Puri Gunung Langgar?')) {
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
                                  }
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
                                        className="w-full h-full object-cover"
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
                                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F5] text-xs text-gray-200 focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                                    />
                                  </div>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071C38]/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white border border-[#DCE7F5] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-[#071C38]/30">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#DCE7F5]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#FFF7EB] text-[#FF9D2E]">
                  <Key className="w-5 h-5" />
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
                className="p-1 rounded-lg text-[#526783] hover:text-[#073B78] hover:bg-[#EBF3FC] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status alerts */}
            {passChangeStatus && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                  passChangeStatus.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                }`}
              >
                {passChangeStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{passChangeStatus.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#073B78] mb-1">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Masukkan password saat ini..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 text-xs sm:text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B78] mb-1">
                  Kata Sandi Baru (Minimal 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Masukkan password baru..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 text-xs sm:text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#073B78] mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ketik ulang password baru..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#DCE7F5] text-[#102D52] placeholder-[#526783]/50 text-xs sm:text-sm focus:outline-none focus:border-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E] focus:ring-1 focus:ring-[#FF9D2E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passChangeLoading}
                  className="px-4 py-2 rounded-xl bg-[#F4F7FC] hover:bg-[#EBF3FC] text-xs font-semibold text-[#526783] border border-[#DCE7F5] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passChangeLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF9D2E] to-[#F28A17] text-[#071C38] font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md shadow-[#FF9D2E]/25 transition-all flex items-center gap-1.5"
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
