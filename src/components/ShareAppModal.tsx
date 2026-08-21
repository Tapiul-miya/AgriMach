import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Smartphone, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Download,
  Archive,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { AppIcon } from './AppIcon';
import { appIconMaster, appIconAlt } from '../assets/images';

export const ShareAppModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen } = useShop();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isShareModalOpen) return null;

  const appUrl = 'https://agrimach-parts.web.app/';
  const shareTitle = 'AgriMach - ট্র্যাক্টর, জেসিবি ও হার্ভেস্টার';
  const shareText = 'খুচরা যন্ত্রাংশ শপ';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      window.prompt('অ্যাপের লিংক কপি করুন:', appUrl);
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();
      const folder = zip.folder('agrimach-all-images');

      const filesToDownload = [
        { url: '/app-icon.png', name: 'app-icon.png' },
        { url: '/app-icon-512.png', name: 'app-icon-512.png' },
        { url: '/app-icon-192.png', name: 'app-icon-192.png' },
        { url: '/og-image.jpg', name: 'og-image.jpg' },
        { url: '/preview.jpg', name: 'preview.jpg' },
        { url: '/app-icon-master.jpg', name: 'app-icon-master.jpg' },
        { url: '/app-icon.svg', name: 'app-icon.svg' },
        { url: '/favicon.ico', name: 'favicon.ico' },
        { url: '/favicon.svg', name: 'favicon.svg' },
        { url: '/icon.svg', name: 'icon.svg' },
        { url: '/manifest.json', name: 'manifest.json' },
        { url: appIconMaster, name: 'src-assets-master-icon.jpg' },
        { url: appIconAlt, name: 'src-assets-alt-icon.jpg' }
      ];

      await Promise.all(
        filesToDownload.map(async (file) => {
          try {
            const response = await fetch(file.url);
            if (response.ok) {
              const blob = await response.blob();
              folder?.file(file.name, blob);
            }
          } catch (err) {
            console.error(`Failed to fetch ${file.url}`, err);
          }
        })
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'agrimach-all-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 4000);
    } catch (error) {
      console.error('Error generating zip:', error);
      alert('ইমেজ ডাউনলোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsZipping(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        // Attempt to fetch icon and share as file if supported
        let sharePayload: ShareData = {
          title: shareTitle,
          text: `${shareText}\n${appUrl}`,
          url: appUrl,
        };

        try {
          const res = await fetch(appIconMaster);
          if (res.ok) {
            const blob = await res.blob();
            const file = new File([blob], 'agrimach-icon.jpg', { type: 'image/jpeg' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              sharePayload.files = [file];
            }
          }
        } catch {
          // fallback to text only
        }

        await navigator.share(sharePayload);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Direct Social Links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${shareText}\n${appUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;

  // Direct QR Code generator API URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&color=0f172a&bgcolor=f8fafc&margin=2`;

  return (
    <AnimatePresence>
      <div 
        id="share-app-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsShareModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base sm:text-lg">অ্যাপ শেয়ার করুন</h3>
                <p className="text-xs text-slate-400">বন্ধুদের সাথে AgriMach অ্যাপ লিংক ও আইকন শেয়ার করুন</p>
              </div>
            </div>
            <button
              id="close-share-modal-btn"
              onClick={() => setIsShareModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-5">
            {/* Visual Icon & App Preview Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/30 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Visual Icon Thumbnail */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1.5 bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 shadow-xl flex items-center justify-center ring-2 ring-amber-400/40">
                    <img 
                      src={appIconMaster} 
                      alt="AgriMach App Icon" 
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        // Fallback to vector icon if image fails
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="hidden only:flex w-full h-full items-center justify-center">
                      <AppIcon className="w-full h-full" />
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md border border-slate-900">
                    OEM
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>অফিসিয়াল স্পেয়ার্স হাব</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base sm:text-lg leading-tight truncate">
                    AgriMach - ট্র্যাক্টর, জেসিবি ও হার্ভেস্টার
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    খুচরা যন্ত্রাংশ শপ
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Share Platforms */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
                সরাসরি প্ল্যাটফর্মে পাঠান
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* WhatsApp */}
                <a
                  id="share-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/40 hover:border-emerald-500 transition group text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.667-.699c.987.54 1.761.802 2.793.802h.001c3.181 0 5.768-2.586 5.768-5.766 0-3.18-2.587-5.768-5.769-5.788zm3.364 8.167c-.146.411-.741.763-1.026.793-.284.03-.647.147-2.146-.481-1.809-.757-2.957-2.597-3.048-2.719-.09-.12-.73-1.01-.73-1.927 0-.917.478-1.368.648-1.554.17-.186.371-.233.495-.233.123 0 .248.002.355.007.114.005.267-.043.418.321.156.378.534 1.306.58 1.4.047.093.078.203.016.326-.062.124-.093.2-.186.309-.093.108-.196.242-.28.326-.093.093-.19.194-.082.38.109.186.484.798 1.038 1.291.713.634 1.314.83 1.5.923.186.093.295.078.403-.047.109-.124.466-.543.59-.73.124-.186.248-.155.418-.093.171.062 1.085.512 1.272.605.186.093.31.14.357.217.046.078.046.45-.1 861z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300">হোয়াটসঅ্যাপ</span>
                </a>

                {/* Facebook */}
                <a
                  id="share-facebook-btn"
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/40 hover:border-blue-500 transition group text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-blue-300">ফেসবুক</span>
                </a>

                {/* Telegram */}
                <a
                  id="share-telegram-btn"
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-600/40 hover:border-sky-500 transition group text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-105 transition">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-sky-300">টেলিগ্রাম</span>
                </a>

                {/* Twitter / X */}
                <a
                  id="share-twitter-btn"
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition group text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-105 transition">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-300">Twitter / X</span>
                </a>
              </div>
            </div>

            {/* Copy Link Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                ওয়েব লিংক কপি করুন
              </label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 pl-3">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="bg-transparent text-xs text-amber-300 font-mono flex-1 outline-none select-all"
                />
                <button
                  id="copy-link-action-btn"
                  onClick={handleCopyLink}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                    copied
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Native Share & QR Code Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                id="native-device-share-btn"
                onClick={handleNativeShare}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>ডিভাইসের মাধ্যমে শেয়ার</span>
              </button>

              <button
                id="toggle-qr-code-btn"
                onClick={() => setShowQr(!showQr)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  showQr 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                }`}
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{showQr ? 'QR কোড লুকান' : 'QR কোড স্ক্যান করুন'}</span>
              </button>
            </div>

            {/* Direct Icon Download Formats & One-Click All Images ZIP */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-amber-400" />
                  অরিজিনাল ইমেজ ও আইকন ডাউনলোড
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  Clean Binary Assets
                </span>
              </div>

              {/* Individual Image Download Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href="/app-icon-512.png"
                  download="app-icon-512.png"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      PNG
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white group-hover:text-amber-300">512×512 Icon</div>
                      <div className="text-[10px] text-slate-400">PWA ও স্প্ল্যাশ স্ক্রিন</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </a>

                <a
                  href="/app-icon-192.png"
                  download="app-icon-192.png"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      PNG
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white group-hover:text-amber-300">192×192 Icon</div>
                      <div className="text-[10px] text-slate-400">মোবাইল হোমস্ক্রিন</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </a>

                <a
                  href="/app-icon-master.jpg"
                  download="agrimach-logo-master.jpg"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      JPG
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white group-hover:text-amber-300">Master Logo</div>
                      <div className="text-[10px] text-slate-400">1024×1024 হাই-রেজোলিউশন</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </a>

                <a
                  href="/app-icon.svg"
                  download="app-icon.svg"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 transition group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                      SVG
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white group-hover:text-amber-300">Vector SVG</div>
                      <div className="text-[10px] text-slate-400">স্কেলেবল ভেক্টর ফাইল</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </a>
              </div>

              {/* One Click Download All ZIP Button */}
              <button
                id="download-all-images-zip-btn"
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition shadow-lg cursor-pointer ${
                  zipSuccess
                    ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                    : isZipping
                    ? 'bg-amber-600/70 text-white cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 hover:text-black shadow-amber-500/20 active:scale-[0.99]'
                }`}
              >
                {isZipping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ইমেজগুলো জিপ (ZIP) তৈরি হচ্ছে...</span>
                  </>
                ) : zipSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>ZIP ফাইল সফলভাবে ডাউনলোড হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4" />
                    <span className="font-bold">এক ক্লিকে সব ইমেজ (All Assets .ZIP) ডাউনলোড করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Code Viewer */}
            <AnimatePresence>
              {showQr && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center overflow-hidden"
                >
                  <p className="text-xs text-slate-400 mb-3 text-center">
                    স্মার্টফোন ক্যামেরা দিয়ে স্ক্যান করে সরাসরি অ্যাপটি খুলুন
                  </p>
                  <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-amber-400">
                    <img 
                      src={qrCodeUrl} 
                      alt="AgriMach QR Code" 
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-amber-400/90 font-mono mt-2.5">
                    agrimach-parts.web.app
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% নিরাপদ অফিসিয়াল পিডব্লিউএ লিংক
            </span>
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="text-slate-400 hover:text-white font-medium"
            >
              বন্ধ করুন
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
