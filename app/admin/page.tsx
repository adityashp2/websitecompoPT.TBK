'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteContent, initialSiteContent, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/initialData';
import {
  SlidersHorizontal,
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
  Play,
  ArrowUp,
  ArrowDown,
  Layers,
  Film,
  Check,
  LogOut,
  Key,
  Lock,
  UserCheck,
  X
} from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  created_at: string;
}

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
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'about' | 'leadership' | 'legal' | 'activities' | 'project' | 'contact' | 'inquiries'>('branding');
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
        router.replace('/admin/login');
        return;
      }
      setAdminUser(authJson.user);

      // 2. Fetch site content
      await fetchContent();
    } catch (err) {
      console.error(err);
      router.replace('/admin/login');
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
      router.replace('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
      router.replace('/admin/login');
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
      <div className="min-h-screen bg-[#0E1013] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gold-400">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="font-syne font-semibold">Memuat Data Panel Admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1013] text-[#FBF9F5] selection:bg-gold-500 selection:text-white">
      {/* Top Admin Navbar */}
      <nav className="sticky top-0 z-40 bg-[#14171C]/95 backdrop-blur-md border-b border-gold-500/20 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl shadow-black/40">
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
                <div className="text-[11px] text-gold-400 font-medium">
                  PT. Terbang Bersama Kawan (PT. TBK)
                </div>
              </div>
            </div>

            {/* Mobile-only User Pill & Logout */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold text-gold-400 truncate max-w-[90px]">
                  {adminUser?.name || 'Admin'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-2.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {/* Desktop User badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/50 text-[11px]">Admin:</span>
              <span className="font-semibold text-gold-400 truncate max-w-[140px]">
                {adminUser?.name || 'Administrator'}
              </span>
            </div>

            {/* Quick Links Group */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/"
                target="_blank"
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-[#0E1013] border border-white/10 hover:border-gold-500/40 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden sm:inline">Lihat Website</span>
                <span className="sm:hidden">Web</span>
              </Link>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-[#0E1013] border border-white/10 hover:border-gold-500/40 text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors shrink-0"
                title="Ganti Kata Sandi Admin"
              >
                <Key className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden sm:inline">Ganti Password</span>
                <span className="sm:hidden">Sandi</span>
              </button>

              <button
                onClick={handleReset}
                disabled={saving}
                className="px-2.5 sm:px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
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
                className="px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] via-[#C9A96A] to-[#B88E3F] text-[#0E1014] font-bold text-xs flex items-center gap-1.5 hover:opacity-95 shadow-md shadow-gold-500/20 transition-all disabled:opacity-50 shrink-0"
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
                className="hidden lg:flex px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 text-xs text-gray-300 hover:text-rose-300 items-center gap-1.5 transition-colors shrink-0"
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
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-1.5">
            <div className="text-xs uppercase font-bold text-gold-400 px-3 mb-2 tracking-wider">
              Identitas & Konten
            </div>

            <button
              onClick={() => setActiveTab('branding')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'branding'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-gold-400" />
              <span>Branding, Logo & Footer</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'hero'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Hero & Banner Utama</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'about'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Tentang, Visi & Misi</span>
            </button>

            <button
              onClick={() => setActiveTab('leadership')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'leadership'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Dewan Pengurus ({content.leadership?.members?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'legal'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Legalitas & Notaris</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'activities'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HardHat className="w-4 h-4 shrink-0" />
              <span>Kegiatan Lapangan Riil ({content.activities?.items?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('project')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'project'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building className="w-4 h-4 shrink-0" />
              <span>Proyek Puri Gunung Langgar</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'contact'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Kontak & Alamat Kantor</span>
            </button>

            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Inbox className="w-4 h-4 shrink-0" />
                <span>Pesan Masuk (Formulir)</span>
              </button>
            </div>
          </div>

          {/* Form Content Editor */}
          <div className="lg:col-span-9 bg-[#16191E] border border-white/10 rounded-2xl p-6 sm:p-8">
            {/* TAB: BRANDING & IDENTITAS */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                    Branding, Logo & Informasi Footer
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Kelola logo resmi perusahaan, slogan/tagline, judul meta SEO, serta identitas yang tampil di navigasi dan footer website.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Logo Perusahaan Uploader */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#0E1013] border border-gold-500/30 space-y-3">
                    <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider">
                      Logo Resmi Perusahaan (PT. TBK)
                    </label>
                    <p className="text-xs text-gray-400">
                      Tampil di header navigasi utama, footer, serta panel admin. Disarankan format PNG transparan atau SVG.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-1">
                      <div className="h-16 w-36 rounded-xl bg-[#16191E] border border-white/10 p-2 flex items-center justify-center shrink-0">
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
                            className="flex-1 px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                          />
                          <label className="cursor-pointer px-3.5 py-2 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
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
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {/* Pengaturan Footer */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-gold-400 uppercase tracking-wider">
                      Informasi Footer Website
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
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
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
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
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: HERO */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                    Pengaturan Hero & Banner Utama
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Ubah teks judul, subjudul, tombol CTA, latar belakang, dan 4 kartu statistik di bagian atas website.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Hero Background Image */}
                  <div className="p-4 rounded-xl bg-[#0E1013] border border-white/10 space-y-3">
                    <label className="block text-xs font-semibold text-gray-300">
                      Gambar Latar Belakang Hero (Full Header Background)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-24 h-16 rounded-lg bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {content.hero.backgroundImage ? (
                          <img
                            src={content.hero.backgroundImage}
                            alt="Preview Hero Background"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-600" />
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
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                          />
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingKey === 'hero-bg' ? 'Mengupload...' : 'Upload Foto'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingKey === 'hero-bg'}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleGenericFileUpload(e.target.files[0], 'hero-bg', (url) => {
                                    setContent({
                                      ...content,
                                      hero: { ...content.hero, backgroundImage: url },
                                    });
                                  });
                                }
                              }}
                            />
                          </label>
                          {content.hero.backgroundImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setContent({
                                  ...content,
                                  hero: { ...content.hero, backgroundImage: '' },
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                              title="Hapus foto background"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500">
                          Format: JPG, PNG, atau WebP (disarankan orientasi lanskap 1920x1080).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SLIDESHOW MANAGER UNTUK HERO */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-sm font-bold text-gold-400 uppercase tracking-wider">
                          Slideshow Foto Unit / Kawasan Hero (Otomatis)
                        </label>
                        <p className="text-xs text-gray-400 mt-0.5">
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold transition-all"
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
                          className="p-4 bg-[#0E1013] rounded-xl border border-white/10 space-y-3 relative group"
                        >
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-xs font-bold text-gray-300">
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
                              <div className="aspect-[4/3] w-full rounded-lg bg-[#16191E] border border-white/10 overflow-hidden flex items-center justify-center">
                                {slide.image && slide.image.trim() !== '' ? (
                                  <img
                                    src={slide.image}
                                    alt={`Preview Slide ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[11px] text-gray-500 text-center px-2">
                                    [Kotak Abu Standar]
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Inputs */}
                            <div className="sm:col-span-9 space-y-2">
                              <div>
                                <label className="block text-[11px] font-medium text-gray-400 mb-0.5">
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
                                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                                  />
                                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
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
                                <label className="block text-[11px] font-medium text-gray-400 mb-0.5">
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
                                  className="w-full px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-gold-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!content.hero.slides || content.hero.slides.length === 0) && (
                        <div className="p-4 bg-[#0E1013] rounded-xl border border-dashed border-white/10 text-center text-xs text-gray-400">
                          Belum ada slide khusus. Slideshow akan menampilkan slide standar default.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-3">
                      4 Kartu Ringkasan Hero (Stats)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {content.hero.stats?.map((stat, idx) => (
                        <div key={idx} className="p-3 bg-[#0E1013] rounded-xl border border-white/5 space-y-2">
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
                            className="w-full px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gray-300"
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
                            className="w-full px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gold-300 font-bold"
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
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-400" />
                    Tentang Perusahaan, Visi & Misi
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Kelola narasi profil perusahaan, visi, dan butir misi resmi PT. Terbang Bersama Kawan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#0E1013] border border-gold-500/20 space-y-3">
                    <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">
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
                      className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gray-300"
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
                      className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-sm text-gold-300 italic font-playfair"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#0E1013] border border-gold-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-gold-400 uppercase tracking-wider">
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
                        className="px-2.5 py-1 rounded bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Misi
                      </button>
                    </div>

                    <div className="space-y-2">
                      {content.about.missions?.map((misi, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-gold-500/20 text-gold-400 text-xs font-bold flex items-center justify-center shrink-0">
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
                            className="flex-1 px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-gold-400" />
                      Dewan Pengurus (Pimpinan Resmi)
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-sans font-semibold">
                        {content.leadership.members?.length || 0} Pengurus
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
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
                              roleDescription: 'Deskripsi tugas, tanggung jawab, dan kewenangan kepengurusan...',
                              image: '',
                            },
                          ],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs hover:bg-gold-400 transition-all shrink-0 shadow-md shadow-gold-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Pengurus Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {content.leadership.members?.map((member, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#0E1013] border border-gold-500/20 space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40">
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
                              className="p-1.5 rounded-lg bg-[#16191E] hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-[#16191E] transition-colors"
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
                              className="p-1.5 rounded-lg bg-[#16191E] hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-[#16191E] transition-colors"
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-gray-400 mb-1">Nama Lengkap</label>
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
                              className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-gold-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-gray-400 mb-1">Jabatan Resmi</label>
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
                              className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs sm:text-sm text-gold-300 font-bold focus:outline-none focus:border-gold-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-gray-400 mb-1">Deskripsi Kewenangan / Peran</label>
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
                            className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        <div className="pt-2 border-t border-white/5 space-y-2">
                          <label className="block text-[11px] font-semibold text-gray-300">
                            Foto / Avatar Pengurus
                          </label>
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            {/* Portrait Preview */}
                            <div className="w-16 h-20 rounded-xl overflow-hidden border border-gold-500/50 bg-[#16191E] shrink-0 flex items-center justify-center shadow-md">
                              {member.image && member.image.trim() !== '' ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <div className="text-gold-400 font-bold text-xs font-serif text-center px-1">
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
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                                />
                                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
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
                              <span className="text-[10px] text-gray-500 block">
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
                                roleDescription: 'Deskripsi tugas, tanggung jawab, dan kewenangan kepengurusan...',
                                image: '',
                              },
                            ],
                          },
                        });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-semibold transition-all"
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
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gold-400" />
                    Legalitas & Pengesahan Perseroan
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Data akta pendirian, notaris rekanan, dan pengesahan Kemenkumham RI.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ACTIVITIES */}
            {activeTab === 'activities' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                      <HardHat className="w-5 h-5 text-gold-400" />
                      Kegiatan Lapangan Riil (CRUD)
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 font-sans font-semibold">
                        {content.activities.items?.length || 0} Tahapan
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs hover:bg-gold-400 transition-all shrink-0 shadow-md shadow-gold-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kegiatan Baru</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="space-y-4 pt-2">
                    {content.activities.items?.map((item, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-xl bg-[#0E1013] border border-gold-500/25 space-y-4 hover:border-gold-500/40 transition-colors">
                        {/* Header bar with tag and reorder controls */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold text-xs">
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
                              className="px-3 py-1 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gold-300 font-semibold w-28 sm:w-36 text-center"
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
                              className="p-1.5 rounded-lg bg-[#16191E] hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-[#16191E] transition-colors"
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
                              className="p-1.5 rounded-lg bg-[#16191E] hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:bg-[#16191E] transition-colors"
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
                          <label className="block text-xs font-medium text-gray-300 mb-1">
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
                            className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        {/* Deskripsi Kegiatan */}
                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">
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
                            className="w-full px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs sm:text-sm text-gray-300 focus:outline-none focus:border-gold-500"
                          />
                        </div>

                        {/* Foto Dokumentasi Lapangan */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <label className="block text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                            <span>Foto Dokumentasi Lapangan</span>
                          </label>
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <div className="w-24 h-16 rounded-lg bg-[#16191E] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.image && item.image.trim() !== '' ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] text-gray-500 text-center px-1">Tanpa Foto</span>
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
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                                />
                                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
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
                              <span className="text-[10px] text-gray-500 block">
                                Format: JPG, PNG, atau WebP. Gambar lanskap (16:10) disarankan.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Video Dokumentasi Lapangan (Opsional) */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <label className="block text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-gold-400" />
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
                              className="w-full px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                            />
                            {getYouTubeEmbedUrl(item.videoUrl) && (
                              <div className="pt-1">
                                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mb-1.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Preview Video Terdeteksi:</span>
                                </span>
                                <div className="relative aspect-video max-w-sm rounded-lg overflow-hidden border border-white/20 bg-black">
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-semibold transition-all"
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
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-gold-400" />
                    Proyek Resmi: Puri Gunung Langgar
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Kelola nama, status, lokasi, deskripsi, gambar, dan spesifikasi unit perumahan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                    />
                  </div>

                  {/* Foto Sampul Utama Proyek */}
                  <div className="p-4 rounded-xl bg-[#0E1013] border border-white/10 space-y-3">
                    <label className="block text-xs font-semibold text-gray-300">
                      Foto Sampul Utama Proyek (Thumbnail & Cover Card)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-24 h-16 rounded-lg bg-[#16191E] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {content.project.image && content.project.image.trim() !== '' ? (
                          <img
                            src={content.project.image}
                            alt="Cover Proyek"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-gray-600" />
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
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#16191E] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                          />
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
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
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-sm font-bold text-gold-400 uppercase tracking-wider flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gold-400" />
                          <span>Media Showcase Proyek (Video / Galeri Foto)</span>
                        </label>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Pilih format tampilan utama proyek: Galeri Foto yang bergeser otomatis (slideshow) atau Video YouTube.
                        </p>
                      </div>

                      {/* Format Selector Buttons */}
                      <div className="flex items-center gap-2 bg-[#0E1013] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
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
                              ? 'bg-gold-500 text-slate-950 font-bold shadow'
                              : 'text-gray-400 hover:text-white'
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
                              ? 'bg-gold-500 text-slate-950 font-bold shadow'
                              : 'text-gray-400 hover:text-white'
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
                      <div className="p-5 rounded-xl bg-[#0E1013] border border-gold-500/30 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gold-300 uppercase tracking-wider">
                          <Film className="w-4 h-4 text-gold-400" />
                          <span>Link Video YouTube (Ringan & Cepat)</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Cukup masukkan URL video YouTube di bawah ini (misalnya dokumentasi proyek, drone lapangan, atau video perumahan). Sistem otomatis meng-embed video langsung dari YouTube sehingga server tetap ringan, hemat bandwidth, dan loading sangat cepat!
                        </p>

                        <div>
                          <label className="block text-xs font-medium text-gray-300 mb-1">
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
                            className="w-full px-4 py-2.5 rounded-xl bg-[#16191E] border border-white/10 text-white text-sm focus:outline-none focus:border-gold-500 font-mono"
                          />
                        </div>

                        {/* Live YouTube Preview */}
                        {getYouTubeEmbedUrl(content.project.videoUrl) ? (
                          <div className="space-y-2 pt-2">
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Preview Video Terdeteksi:</span>
                            </span>
                            <div className="relative aspect-video max-w-lg rounded-xl overflow-hidden border border-white/20 bg-black">
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
                      <div className="p-5 rounded-xl bg-[#0E1013] border border-white/10 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <div className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2">
                              <ImageIcon className="w-4 h-4 text-gold-400" />
                              <span>Galeri Slideshow Foto Proyek ({content.project.slides?.length || 0} Foto)</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
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
                              className="px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
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
                              className="p-3.5 rounded-xl bg-[#16191E] border border-white/10 space-y-3 relative group"
                            >
                              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <span className="text-xs font-bold text-gold-400">
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
                                    className="p-1 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent"
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
                                    className="p-1 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent"
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
                                  <div className="aspect-[16/10] w-full rounded-lg bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                                    {slide.image ? (
                                      <img
                                        src={slide.image}
                                        alt={`Slide ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[10px] text-gray-500">Tanpa Foto</span>
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
                                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#0E1013] border border-white/10 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                                    />
                                    {/* Upload Foto Biasa Button */}
                                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors">
                                      <Upload className="w-3.5 h-3.5 text-gold-400" />
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
                                      className="w-full px-3 py-1.5 rounded-lg bg-[#0E1013] border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-gold-500"
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
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider">
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
                        className="px-2.5 py-1 rounded bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 text-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Rincian
                      </button>
                    </div>

                    <div className="space-y-2">
                      {content.project.specs?.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-[#0E1013] border border-white/5">
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
                            className="w-1/3 px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gray-300"
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
                            className="flex-1 px-3 py-2 rounded-lg bg-[#16191E] border border-white/10 text-xs text-gold-300 font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = content.project.specs.filter((_, i) => i !== idx);
                              setContent({
                                ...content,
                                project: { ...content.project, specs: newSpecs },
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
                <div className="border-b border-white/10 pb-4">
                  <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-gold-400" />
                    Kontak, Alamat Kantor & Jam Operasional
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Atur kota domisili kantor, alamat resmi, nomor WhatsApp, email, dan jam pelayanan.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-sm"
                    />
                  </div>

                  {/* Pengaturan Google Maps Kantor */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold-400" />
                      <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider">
                        Peta Lokasi Kantor Google Maps (Tampil di Footer)
                      </label>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-gray-300">
                          URL Sematan Peta (Google Maps Embed iframe)
                        </label>
                        <span className="text-[11px] text-gray-400">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">
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
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-gold-500"
                      />
                      <span className="text-[10.5px] text-gray-400 block mt-1">
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
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 bg-[#16191E]">
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
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-gold-400" />
                      Pesan Masuk dari Formulir Website
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Data kontak dan pertanyaan yang dikirimkan oleh pengunjung melalui formulir minat website.
                    </p>
                  </div>
                  <button
                    onClick={fetchInquiries}
                    disabled={inquiriesLoading}
                    className="p-2 rounded-lg bg-[#0E1013] border border-white/10 text-gray-300 hover:text-white text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${inquiriesLoading ? 'animate-spin' : ''}`} />
                    Segarkan
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 rounded-xl bg-[#0E1013] border border-white/5">
                    <Inbox className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                    <p className="text-sm font-medium">Belum ada pesan masuk.</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Setiap formulir minat yang disubmit pengunjung di landing page akan otomatis muncul di sini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 rounded-xl bg-[#0E1013] border border-white/10 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="font-syne font-bold text-white text-sm">
                            {inq.name}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {new Date(inq.created_at).toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gold-300">
                          <div>WA/Telp: <span className="text-white font-mono">{inq.phone}</span></div>
                          {inq.email && <div>Email: <span className="text-white">{inq.email}</span></div>}
                        </div>
                        {inq.message && (
                          <div className="text-xs text-gray-300 bg-[#16191E] p-3 rounded-lg border border-white/5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#16191E] border border-gold-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-black/80">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-gold-500/10 text-gold-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-white text-base">Ganti Kata Sandi</h3>
                  <p className="text-xs text-white/50">Ubah password akun admin Anda</p>
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
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
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
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Masukkan password saat ini..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Kata Sandi Baru (Minimal 6 Karakter)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Masukkan password baru..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Ketik ulang password baru..."
                  disabled={passChangeLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1013] border border-white/10 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  disabled={passChangeLoading}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white/80 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passChangeLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C9A96A] to-[#B88E3F] text-[#0E1014] font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md shadow-gold-500/20 transition-all flex items-center gap-1.5"
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
