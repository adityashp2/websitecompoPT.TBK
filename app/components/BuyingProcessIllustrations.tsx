import React from 'react';

/**
 * Architectural House Outline for Section Header (Monochrome)
 */
export function HeaderHousesIllustration({ className = 'w-32 h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <line x1="10" y1="110" x2="230" y2="110" stroke="#3a3a3a" strokeWidth="1.5" />
      {/* House 1 */}
      <path d="M30 110 V65 L70 35 L110 65 V110" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="miter" />
      <rect x="55" y="80" width="30" height="30" stroke="#999999" strokeWidth="1" />
      <line x1="70" y1="80" x2="70" y2="110" stroke="#999999" strokeWidth="1" />
      {/* House 2 */}
      <path d="M120 110 V50 L165 20 L210 50 V110" stroke="#cccccc" strokeWidth="1.5" strokeLinejoin="miter" />
      <rect x="145" y="65" width="40" height="45" stroke="#999999" strokeWidth="1" />
      <line x1="165" y1="65" x2="165" y2="110" stroke="#999999" strokeWidth="1" />
    </svg>
  );
}

/**
 * Step 1: Konsultasi & Lokasi (Architectural Compass & Map Pin)
 */
export function Step1ConsultationIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="32" stroke="#3a3a3a" strokeWidth="1" />
      <path d="M40 20 V60" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M20 40 H60" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="2 2" />
      {/* Pin / Pointer */}
      <path d="M40 24 C34 24 30 28.5 30 34.5 C30 42 40 54 40 54 C40 54 50 42 50 34.5 C50 28.5 46 24 40 24 Z" stroke="#ffffff" strokeWidth="1.5" fill="#141414" />
      <circle cx="40" cy="34" r="3" fill="#ffffff" />
    </svg>
  );
}

/**
 * Step 2: Berkas & Verifikasi Legal (Architectural Technical Sheet)
 */
export function Step2DocumentIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background document */}
      <rect x="22" y="16" width="36" height="48" stroke="#3a3a3a" strokeWidth="1" fill="#0d0d0d" />
      {/* Main document */}
      <rect x="28" y="22" width="36" height="48" stroke="#ffffff" strokeWidth="1.5" fill="#141414" />
      {/* Specs lines */}
      <line x1="34" y1="32" x2="56" y2="32" stroke="#cccccc" strokeWidth="1.5" />
      <line x1="34" y1="40" x2="52" y2="40" stroke="#777777" strokeWidth="1" />
      <line x1="34" y1="46" x2="54" y2="46" stroke="#777777" strokeWidth="1" />
      <line x1="34" y1="52" x2="48" y2="52" stroke="#777777" strokeWidth="1" />
      {/* Check stamp */}
      <circle cx="54" cy="58" r="6" stroke="#ffffff" strokeWidth="1.2" fill="#000000" />
      <path d="M51 58 L53 60 L57 56" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Step 3: Bank Partner & Analisis KPR (Architectural Pillar & Ratio Grid)
 */
export function Step3BankIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Outer framing circle */}
      <circle cx="40" cy="40" r="32" stroke="#262626" strokeWidth="1" />
      {/* Pediment roof */}
      <path d="M22 34 L40 22 L58 34 H22 Z" stroke="#ffffff" strokeWidth="1.5" fill="#141414" />
      <rect x="24" y="34" width="32" height="3" stroke="#ffffff" strokeWidth="1" fill="#ffffff" />
      {/* 3 Pillars */}
      <line x1="28" y1="37" x2="28" y2="54" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="40" y1="37" x2="40" y2="54" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="52" y1="37" x2="52" y2="54" stroke="#ffffff" strokeWidth="1.5" />
      {/* Base */}
      <rect x="20" y="54" width="40" height="4" stroke="#ffffff" strokeWidth="1" fill="#141414" />
    </svg>
  );
}

/**
 * Step 4: Serah Terima Kunci & Akad (Key & Handover Symbol)
 */
export function Step4HandshakeIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Key head */}
      <circle cx="34" cy="36" r="10" stroke="#ffffff" strokeWidth="1.5" fill="#141414" />
      <circle cx="34" cy="36" r="4" stroke="#3a3a3a" strokeWidth="1" />
      {/* Key shaft */}
      <line x1="44" y1="36" x2="62" y2="36" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" />
      {/* Key teeth */}
      <line x1="56" y1="36" x2="56" y2="42" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" />
      <line x1="60" y1="36" x2="60" y2="44" stroke="#ffffff" strokeWidth="2" strokeLinecap="square" />
      {/* Horizontal foundation baseline */}
      <line x1="18" y1="58" x2="62" y2="58" stroke="#3a3a3a" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}
