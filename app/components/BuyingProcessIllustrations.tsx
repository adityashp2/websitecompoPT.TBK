import React from 'react';

/**
 * Townhouse / Houses illustration for the section header
 */
export function HeaderHousesIllustration({ className = 'w-40 h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background Soft Hill */}
      <path
        d="M0 135 C60 125, 180 125, 240 135 L240 140 L0 140 Z"
        fill="#E2E8F0"
      />

      {/* House 1 (Left - Smaller) */}
      <g>
        {/* Wall */}
        <path d="M20 70 L75 70 L75 135 L20 135 Z" fill="#F8FAFC" stroke="#102D52" strokeWidth="2.5" />
        {/* Roof */}
        <path d="M12 72 L47.5 40 L83 72 Z" fill="#1E40AF" stroke="#102D52" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Windows */}
        <rect x="28" y="80" width="16" height="20" rx="2" fill="#BAE6FD" stroke="#102D52" strokeWidth="2" />
        <line x1="36" y1="80" x2="36" y2="100" stroke="#102D52" strokeWidth="1.5" />
        <line x1="28" y1="90" x2="44" y2="90" stroke="#102D52" strokeWidth="1.5" />

        <rect x="52" y="80" width="16" height="20" rx="2" fill="#BAE6FD" stroke="#102D52" strokeWidth="2" />
        <line x1="60" y1="80" x2="60" y2="100" stroke="#102D52" strokeWidth="1.5" />
        <line x1="52" y1="90" x2="68" y2="90" stroke="#102D52" strokeWidth="1.5" />

        {/* Door */}
        <rect x="38" y="108" width="18" height="27" rx="2" fill="#3B82F6" stroke="#102D52" strokeWidth="2" />
        <circle cx="51" cy="122" r="1.5" fill="#FCD34D" />
      </g>

      {/* House 2 (Center-Right - Main & Taller) */}
      <g>
        {/* Main Wall */}
        <path d="M75 55 L165 55 L165 135 L75 135 Z" fill="#FFFFFF" stroke="#102D52" strokeWidth="2.5" />
        {/* Roof Gable */}
        <path d="M68 58 L120 22 L172 58 Z" fill="#102D52" stroke="#102D52" strokeWidth="2.5" strokeLinejoin="round" />
        
        {/* Attic Window */}
        <circle cx="120" cy="42" r="6" fill="#BAE6FD" stroke="#102D52" strokeWidth="1.5" />
        <line x1="120" y1="36" x2="120" y2="48" stroke="#102D52" strokeWidth="1.5" />
        <line x1="114" y1="42" x2="126" y2="42" stroke="#102D52" strokeWidth="1.5" />

        {/* 2nd Floor Windows */}
        <rect x="88" y="66" width="22" height="22" rx="2" fill="#BAE6FD" stroke="#102D52" strokeWidth="2" />
        <line x1="99" y1="66" x2="99" y2="88" stroke="#102D52" strokeWidth="1.5" />
        <line x1="88" y1="77" x2="110" y2="77" stroke="#102D52" strokeWidth="1.5" />

        <rect x="130" y="66" width="22" height="22" rx="2" fill="#BAE6FD" stroke="#102D52" strokeWidth="2" />
        <line x1="141" y1="66" x2="141" y2="88" stroke="#102D52" strokeWidth="1.5" />
        <line x1="130" y1="77" x2="152" y2="77" stroke="#102D52" strokeWidth="1.5" />

        {/* 1st Floor Door & Porch */}
        <rect x="125" y="100" width="24" height="35" rx="2" fill="#1E40AF" stroke="#102D52" strokeWidth="2" />
        <circle cx="143" cy="118" r="1.5" fill="#FCD34D" />

        {/* 1st Floor Large Living Window */}
        <rect x="86" y="98" width="26" height="26" rx="2" fill="#BAE6FD" stroke="#102D52" strokeWidth="2" />
        <line x1="99" y1="98" x2="99" y2="124" stroke="#102D52" strokeWidth="1.5" />
        <line x1="86" y1="111" x2="112" y2="111" stroke="#102D52" strokeWidth="1.5" />
      </g>

      {/* House 3 (Right - Extension) */}
      <g>
        <path d="M165 65 L215 65 L215 135 L165 135 Z" fill="#F1F5F9" stroke="#102D52" strokeWidth="2.5" />
        <path d="M158 68 L190 44 L222 68 Z" fill="#2563EB" stroke="#102D52" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="176" y="76" width="26" height="20" rx="2" fill="#BAE6FD" stroke="#102D52" strokeWidth="2" />
        <line x1="189" y1="76" x2="189" y2="96" stroke="#102D52" strokeWidth="1.5" />
        <line x1="176" y1="86" x2="202" y2="86" stroke="#102D52" strokeWidth="1.5" />
        <rect x="178" y="105" width="22" height="30" rx="2" fill="#3B82F6" stroke="#102D52" strokeWidth="2" />
      </g>

      {/* Trees & Vegetation */}
      <g>
        {/* Tree Left */}
        <rect x="6" y="112" width="4" height="23" fill="#78350F" />
        <circle cx="8" cy="105" r="12" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
        <circle cx="12" cy="100" r="8" fill="#34D399" />

        {/* Shrub Right */}
        <path
          d="M216 135 C216 122, 235 122, 235 135 Z"
          fill="#059669"
          stroke="#047857"
          strokeWidth="1.5"
        />
        <circle cx="225" cy="126" r="6" fill="#34D399" />
      </g>
    </svg>
  );
}

/**
 * Step 01: Consultation / Table discussion with house model
 */
export function Step1ConsultationIllustration({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background Soft Pill */}
      <circle cx="50" cy="50" r="46" fill="#EFF6FF" />

      {/* Table */}
      <path d="M26 65 L74 65" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <path d="M33 65 L33 82" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M67 65 L67 82" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Person 1 (Left - Client) */}
      <circle cx="24" cy="38" r="6" fill="#FDBA74" stroke="#1E293B" strokeWidth="2" />
      <path d="M15 58 C15 50, 33 50, 33 58 L33 65 L15 65 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      {/* Chair Left */}
      <path d="M12 45 L12 75" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      {/* Person 2 (Right - Consultant) */}
      <circle cx="76" cy="38" r="6" fill="#FDBA74" stroke="#1E293B" strokeWidth="2" />
      <path d="M67 58 C67 50, 85 50, 85 58 L85 65 L67 65 Z" fill="#F97316" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      {/* Chair Right */}
      <path d="M88 45 L88 75" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

      {/* House Model on Table */}
      <path d="M43 65 L57 65 L57 54 L43 54 Z" fill="#FEF08A" stroke="#1E293B" strokeWidth="1.8" />
      <path d="M41 54 L50 45 L59 54 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="47" y="58" width="4" height="7" fill="#1E293B" />
      
      {/* Discussion speech bubble / dots */}
      <circle cx="46" cy="35" r="1.5" fill="#3B82F6" />
      <circle cx="50" cy="33" r="1.8" fill="#F97316" />
      <circle cx="54" cy="35" r="1.5" fill="#3B82F6" />
    </svg>
  );
}

/**
 * Step 02: Document verification & route pin
 */
export function Step2DocumentIllustration({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background Soft Pill */}
      <circle cx="50" cy="50" r="46" fill="#F0FDF4" />

      {/* Map / Route background */}
      <rect x="20" y="24" width="42" height="52" rx="4" fill="#BFDBFE" stroke="#1E293B" strokeWidth="2" />
      {/* Dashed Route Path */}
      <path d="M26 36 Q38 36, 38 50 T50 64" stroke="#1D4ED8" strokeWidth="2" strokeDasharray="3 3" fill="none" />
      
      {/* Start Pin */}
      <circle cx="26" cy="36" r="3" fill="#F97316" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="26" cy="36" r="1" fill="#FFFFFF" />

      {/* Document Sheet (Foreground Right) */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))">
        <rect x="42" y="32" width="42" height="52" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
        {/* Document Fold Top Right */}
        <path d="M74 32 L84 42 L74 42 Z" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
        
        {/* Document Lines */}
        <line x1="49" y1="44" x2="68" y2="44" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="49" y1="52" x2="77" y2="52" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <line x1="49" y1="60" x2="72" y2="60" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        <line x1="49" y1="68" x2="65" y2="68" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

        {/* Verification Check Badge */}
        <circle cx="73" cy="73" r="6" fill="#10B981" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M70 73 L72 75 L76 71" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/**
 * Step 03: Bank Analysis & Chart
 */
export function Step3BankIllustration({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background Soft Pill */}
      <circle cx="50" cy="50" r="46" fill="#FFFBEB" />

      {/* Bank Building */}
      {/* Pediment (Triangle Roof) */}
      <path d="M22 38 L50 20 L78 38 Z" fill="#DBEAFE" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      <rect x="25" y="38" width="50" height="4" fill="#1E40AF" stroke="#1E293B" strokeWidth="1.5" />

      {/* Pillars */}
      <rect x="28" y="42" width="6" height="24" fill="#EFF6FF" stroke="#1E293B" strokeWidth="1.8" />
      <rect x="42" y="42" width="6" height="24" fill="#EFF6FF" stroke="#1E293B" strokeWidth="1.8" />
      <rect x="56" y="42" width="6" height="24" fill="#EFF6FF" stroke="#1E293B" strokeWidth="1.8" />
      <rect x="68" y="42" width="5" height="24" fill="#EFF6FF" stroke="#1E293B" strokeWidth="1.8" />

      {/* Base */}
      <rect x="22" y="66" width="56" height="5" fill="#1E40AF" stroke="#1E293B" strokeWidth="1.8" />
      <rect x="18" y="71" width="64" height="4" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.8" />

      {/* Growth Chart / Overlaying Graph */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
        {/* Chart Bars */}
        <rect x="52" y="60" width="5" height="15" rx="1" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.2" />
        <rect x="61" y="52" width="5" height="23" rx="1" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.2" />
        <rect x="70" y="44" width="5" height="31" rx="1" fill="#10B981" stroke="#1E293B" strokeWidth="1.2" />

        {/* Upward Trend Arrow */}
        <path d="M46 64 L60 52 L74 40 L82 36" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M76 35 L83 35 L83 42" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/**
 * Step 04: Handshake & Key Handover / Akad
 */
export function Step4HandshakeIllustration({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* Background Soft Pill */}
      <circle cx="50" cy="50" r="46" fill="#FDF2F8" />

      {/* Contract Paper in background */}
      <rect x="22" y="18" width="36" height="46" rx="3" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
      <line x1="28" y1="26" x2="48" y2="26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="32" x2="52" y2="32" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="38" x2="46" y2="38" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      {/* Official Gold Seal */}
      <circle cx="44" cy="52" r="5" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.2" />

      {/* Golden House Key dangling */}
      <g>
        <circle cx="68" cy="30" r="7" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
        <circle cx="68" cy="30" r="3" fill="#FFFBEB" stroke="#1E293B" strokeWidth="1.5" />
        <path d="M68 37 L68 56" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
        <path d="M68 37 L68 56" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M68 46 L73 46" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 52 L73 52" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Handshake in foreground */}
      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
        {/* Left Sleeve (Corporate Blue) */}
        <path d="M12 62 L26 62 L32 70 L18 80 Z" fill="#1E40AF" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
        {/* Right Sleeve (Warm Dark Gray) */}
        <path d="M88 62 L74 62 L68 70 L82 80 Z" fill="#334155" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />

        {/* Hands Clasping */}
        <path
          d="M26 62 L42 62 C46 62, 54 66, 56 70 L48 76 C44 76, 38 72, 32 70 Z"
          fill="#FED7AA"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M74 62 L58 62 C54 62, 46 66, 44 70 L52 76 C56 76, 62 72, 68 70 Z"
          fill="#FDBA74"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
