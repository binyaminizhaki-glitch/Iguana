/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  X,
  User,
  Zap,
  Map as MapIcon,
  List,
  Calendar,
  ChevronLeft,
  Pencil,
  UserPlus,
  Users,
  EyeOff,
  BellRing,
  Shield,
  LogOut,
  Music,
  BookOpen,
  Library,
  MapPin,
  Clock,
  Footprints,
  Plus,
  MessageCircle,
  Power,
  ArrowLeft,
  GraduationCap,
  Search,
  Send,
  Share2,
} from 'lucide-react';

// --- Shared Data & Assets ---
const LOGO_URL = "/יאסא לוגו.png";
const PROFILE_MAIN = "https://lh3.googleusercontent.com/aida-public/AB6AXuBCdFHXGt56yGTNMb79__BDXXEFttG5j9pUotTJdDK9GIKOpHjyCX0XUn2pCfem84KLUMd7kxzjhtPt4Wd-QmGooNXUMS0ZgpZYOIHgQCha-hMOIYW7Uxk8Cdft6VlpFwthLCAl8URShszeqANpYnLGUebkG3r86NCcXgMRFCdAAUPJJaHHbtbwsXzz57-ePXSMMwYmda7YO-Htc6TAHXwVvOH_-l7f8UzPR6bawEPJo9D_PGFilE-ny-HHUk8NndUYt3B4skejMeo";
const PROFILE_SMALL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDZP_4LZvgvJD4H3mcygq1Kp6FS3JrR-eKHr-pIMsZfooNQ7R1wHNR9LqX7T7StQfy7n9Nz5xTRzsZtY1-8Qr_jUr3n2sQ0WixEd-oI5T-GDa2lO4UM18z5bfmnL82enJi5Dsr4559IxelWlnwnIZbHmvWW8BVIpVJNvYG0hjRE5AT5jKbmpGjLFrp31YDpMTxZx4Xz76a2eySxUMbPqLV2S5r208yQwyGh4414oat5QlBXhlM-YJOswKUywSs2UeVeP27Bghbm4fw";
const EVENT_IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuBSlYo09fLDqC9XOu4mEwjQ3Tm9Zm8ILofBvvvUyjpWfv5T6sSbYsf8HhVEHKFQZfquOY4afyVxjMt9N-90mVZ57crxCM8b2vXFHF1Af-rf71NOkcxtqe9mwFX_ew7IcseFiu_4Jw91degJOu4CC30UUfHo2uGMnO-G9GiYKAHQxsVO534dLrCAv6uU0mt9iuXRoE3O_7Iy-2qj-mG2A1FTIvhdfKKIGe5NasXa1sWGRloIqdnOru_9RAWiElkvQbehEOv2gvms3MI";
const AVATAR_NOA = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7BEWAGjEoq3GxsacsBH4N6i8t895Mj1AwcR1XhxdoNDVqnVCKiTtDRL7mlnlAuZuKIFo3Jv79aX2HvRfv-8ex6ZYt4CTRiiYr9t_VThZQX9g9u4zsgKTVr-4FKOIRwtVRbKu9G868F1iovIhU6KCgUonvtiuTdV-3SJGY15deHYzmJdOLKJnooqW4xLJHD0i9d8qukDDK7KzMRKLa7MIibaDDeDndFqdxwSwtJPtgSpRb506GqVkybkOicivW8PPirE4371e_Ano";
const AVATAR_ITAY = "https://lh3.googleusercontent.com/aida-public/AB6AXuASwUgI7Z5vV6PpIKTSqLJOcngrPfI6hbyAfbIXWnrLugUh3hhUvvs72W71ViU9YmPpkCUkIBkUpRL3L179NyU1k7wGo3NRYdGkqUNbhW_ckv30cUToVvifv8Xj6V7yltATJhOJmjJJFk4vn3v4XkCCXuiHDcZAM5mgWvyov-6qr9yRSjyMf7HY0ch69GdvKUQlvsqAzzDS1DvCtnWTL4AN3WFg7ZEB7jMk5HK9v7R4wp-0FathFYdLWchnsH81uuJQdJwy0tzRsT8";
const AVATAR_MAYA = "https://lh3.googleusercontent.com/aida-public/AB6AXuD3t9wQREi4hO5_ASFariOpY90WXzi4905x5u6jqoZNPO5f_0ANi2_iTj6Zkqepc_ZRYBG4B0UZW1lYrEgJFHXy2nL7SSXi_CJpgGQnfZHjGc4_Q5N_YtWLJ10MNH1fmlsLR4NlcaU86i84qZnUWbgxXFf4L_H3l-9UGjTDv6GiYa0pl61o9of_Z-SHml3eB0lf1wRBoPG3zy76qqz1JVAy6_c4dEaSbIHm8SGQSNhSsWvGQ88rYtSHmDJbggi_0hv7V5ZhcalgGBk";
const ONBOARDING_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuB8a8QkEfd7fc7Uq4jg5wwTykVfdsAslA1CM3aUl1FYijsMGvsP9ZTnhcHYx-8NM4L1l5lWoxv_C8UhU2IADNn70rExy8f-5RXAIJsCGC4FU6Kv3s1ogydqEeqbjqy1ZHAP3g7fjkN4uFOw1vXdysCNtHCWhQhMYu_TigigDJ-8Xi_uFeFFoLSRXThaJDgshxVEh_ayO0ifjAfUihev8do67gvBn64GsDrczXqbu3qlsf06j9xV5mfRVC0t513BYVaFMQQt9n4XefM";

// --- Components ---

function TopNav({ onMessagesClick, onProfileClick, onNotificationsClick }: { onMessagesClick?: () => void, onProfileClick?: () => void, onNotificationsClick?: () => void }) {
  return (
    <header className="fixed top-0 w-full z-50 glass-nav flex flex-row-reverse justify-between items-center px-4 sm:px-6 h-[62px] sm:h-16">
      <div className="flex items-center gap-3">
        <button 
          onClick={onNotificationsClick}
          aria-label="פתח התראות" 
          className="text-primary hover:opacity-80 transition-opacity active:scale-95"
        >
          <Bell className="w-6 h-6" />
        </button>
        <button 
          onClick={onMessagesClick}
          aria-label="פתח הודעות"
          className="text-primary hover:opacity-80 transition-opacity active:scale-95 relative"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-surface"></span>
        </button>
      </div>
      <img alt="IASA Logo" className="h-7 sm:h-8 w-auto object-contain" src={LOGO_URL} />
      <button 
        onClick={onProfileClick}
        aria-label="פתח פרופיל" 
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-surface-container-highest active:scale-95 transition-transform cursor-pointer"
      >
        <img alt="Profile" className="w-full h-full object-cover" src={PROFILE_SMALL} />
      </button>
    </header>
  );
}

function BottomNav({ currentTab, onChange }: { currentTab: string, onChange: (tab: string) => void }) {
  const tabs = [
    { id: 'now', icon: Zap, label: 'עכשיו' },
    { id: 'outside', icon: MapIcon, label: 'בחוץ' },
    { id: 'events', icon: Calendar, label: 'אירועים' },
    { id: 'profile', icon: User, label: 'אני' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 glass-nav rounded-t-[24px] flex flex-row-reverse justify-around items-center h-[76px] sm:h-20 pb-safe px-1 sm:px-2">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            aria-label={`עבור ללשונית ${tab.label}`}
            aria-current={isActive ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center flex-1 h-14 sm:h-16 transition-colors duration-300 z-10 ${
              isActive ? 'text-primary' : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-1 bg-primary-soft rounded-2xl -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110 fill-current' : 'scale-100'}`} />
            <span className={`font-medium text-[11px] sm:text-[10px] font-heebo transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// --- Screens ---

function OnboardingScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="relative min-h-screen bg-surface text-on-surface antialiased overflow-hidden flex flex-col items-center justify-between px-5 sm:px-8 pt-10 pb-8 sm:py-16 text-center">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/80 to-surface"></div>
        <img className="w-full h-full object-cover opacity-20 blur-xl scale-110" src={ONBOARDING_BG} alt="Campus Background" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-between h-full w-full max-w-md flex-1">
        <div className="mt-8 sm:mt-12">
          <img alt="IASA Logo" className="h-20 sm:h-24 w-auto mx-auto object-contain shadow-sm" src={LOGO_URL} />
        </div>

        <div className="space-y-4 my-auto">
          <h1 className="text-primary font-heebo font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.15]">
            ברוכים הבאים<br />ליאסא עכשיו
          </h1>
          <p className="text-on-surface-variant font-heebo text-base sm:text-lg md:text-xl leading-relaxed max-w-[320px] mx-auto opacity-80">
            הדרך הקלה ביותר לדעת מי בחוץ ולהיפגש ברגע.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4 mt-auto">
          <button
            onClick={onLogin}
            aria-label="התחלת עבודה"
            className="primary-cta w-full py-4 sm:py-5 rounded-full font-heebo font-bold text-lg sm:text-xl active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span>התחלת עבודה</span>
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={onLogin}
            aria-label="כניסה עם אימייל בית הספר"
            className="bg-surface-container-high hover:bg-surface-container-highest text-primary w-full py-4 sm:py-5 rounded-full font-heebo font-semibold text-base sm:text-lg transition-colors flex items-center justify-center gap-3"
          >
            <GraduationCap className="w-6 h-6" />
            <span>כניסה עם אימייל בית הספר</span>
          </button>
          
          <p className="mt-4 text-on-surface-variant/60 font-heebo text-sm">
            בהתחברות, הינך מסכים לתנאי השימוש שלנו
          </p>
        </div>
      </main>

      <div className="fixed top-1/4 -right-12 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
    </div>
  );
}

function ActivationSheet({ onClose, onActivate }: { onClose: () => void, onActivate: (config: any) => void }) {
  const [duration, setDuration] = useState<number | null>(15);
  const [visibility, setVisibility] = useState('friends');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');

  const handleActivate = () => {
    onActivate({
      endTime: duration ? Date.now() + duration * 60000 : null,
      visibility,
      location: location || 'בקמפוס',
      note
    });
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-[60] soft-sheet rounded-t-[28px] sm:rounded-t-[32px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary font-manrope">הגדרות נוכחות</h2>
        <button aria-label="סגור הגדרות נוכחות" onClick={onClose} className="p-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors rounded-full text-on-surface-variant">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6 text-right">
        <h3 className="text-sm font-bold text-primary mb-3">לכמה זמן?</h3>
        <div className="flex flex-wrap gap-2">
          {[5, 10, 15, 20].map(mins => (
            <button
              key={mins}
              onClick={() => setDuration(mins)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${duration === mins ? 'bg-accent text-on-accent' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
            >
              {mins} דקות
            </button>
          ))}
          <button
            onClick={() => setDuration(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${duration === null ? 'bg-accent text-on-accent' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
          >
            עד שאכבה
          </button>
        </div>
      </div>

      <div className="mb-6 text-right">
        <h3 className="text-sm font-bold text-primary mb-3">מי יכול לראות?</h3>
        <div className="flex gap-2">
          {[
            { id: 'friends', label: 'חברים' },
            { id: 'grade', label: 'השכבה שלי' },
            { id: 'all', label: 'כולם' }
          ].map(vis => (
            <button
              key={vis.id}
              onClick={() => setVisibility(vis.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${visibility === vis.id ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
            >
              {vis.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 text-right">
        <h3 className="text-sm font-bold text-primary mb-3">איפה אתה? (אופציונלי)</h3>
        <input
          type="text"
          aria-label="מיקום"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="לדוגמה: דשא גדול, קפיטריה..."
          className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/15 focus:bg-surface-container-highest transition-all outline-none mb-4"
        />
        <h3 className="text-sm font-bold text-primary mb-3">הערה (אופציונלי)</h3>
        <input
          type="text"
          aria-label="הערה"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="לדוגמה: מביא גיטרה, לומד למבחן..."
          className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/15 focus:bg-surface-container-highest transition-all outline-none"
        />
      </div>

      <button
        onClick={handleActivate}
        className="primary-cta soft-ambient w-full py-4 rounded-full font-bold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <Zap className="w-5 h-5 fill-current" />
        <span>הפעל עכשיו</span>
      </button>
    </motion.div>
  );
}

function NowScreen({ isOutside, setIsOutside, outsideConfig, setOutsideConfig, onOpenMessages, onOpenChat }: any) {
  const [showActivation, setShowActivation] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showAllFriends, setShowAllFriends] = useState(false);

  useEffect(() => {
    if (!isOutside || !outsideConfig.endTime) {
      setTimeLeft('עד שאכבה');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = outsideConfig.endTime - now;
      if (diff <= 0) {
        setIsOutside(false);
        setTimeLeft('');
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOutside, outsideConfig.endTime, setIsOutside]);

  const handleActivate = (config: any) => {
    setOutsideConfig(config);
    setIsOutside(true);
    setShowActivation(false);
  };

  const handleTurnOff = () => {
    setIsOutside(false);
  };

  const handleExtend = () => {
    if (outsideConfig.endTime) {
      setOutsideConfig({
        ...outsideConfig,
        endTime: outsideConfig.endTime + 10 * 60000
      });
    }
  };

  const visibilityLabels: Record<string, string> = {
    friends: 'גלוי לחברים',
    grade: 'גלוי לשכבה',
    all: 'גלוי לכולם'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center text-center space-y-8 pt-4"
    >
      {isOutside ? (
        <>
          <div className="relative flex items-center justify-center w-64 h-64 my-4">
        {/* Radar Ripples */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 rounded-full border-2 border-primary/25"
            animate={{
              scale: [1, 2.5],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
          />
        ))}
        
        {/* Main Button */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="primary-cta relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center border-4 border-surface"
        >
          <Zap className="w-12 h-12 mb-1 fill-current" />
          <span className="text-xl font-bold tracking-wide">אני בחוץ</span>
        </motion.button>

        {/* Status Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-surface-container-lowest px-4 py-2 rounded-full shadow-[0_10px_24px_rgba(36,69,37,0.08)] border border-outline-variant/10 flex items-center gap-2 whitespace-nowrap">
          <motion.span 
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="status-live-dot w-2.5 h-2.5 rounded-full"
          />
          <span className="text-xs font-bold text-primary">{visibilityLabels[outsideConfig.visibility] || 'גלוי לחברים'}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-primary font-heebo">
          {timeLeft === 'עד שאכבה' ? 'פעיל עד שאכבה' : `פעיל לעוד ${timeLeft} דקות`}
        </h2>
        <div className="flex flex-col items-center justify-center gap-1.5 text-secondary font-semibold">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{outsideConfig.location}</span>
          </div>
          {outsideConfig.note && (
            <span className="text-sm text-on-surface-variant font-normal mt-1">{outsideConfig.note}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        <button onClick={() => setShowActivation(true)} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
          <MapPin className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
          <span className="text-xs font-bold">עדכן מקום</span>
        </button>
        <button onClick={handleExtend} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
          <Clock className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
          <span className="text-xs font-bold">הארך זמן</span>
        </button>
        <button onClick={handleTurnOff} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors group">
          <Power className="w-6 h-6 text-error" />
          <span className="text-xs font-bold text-error">כבה</span>
        </button>
      </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center space-y-6 pt-8 pb-12">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowActivation(true)}
            className="primary-cta soft-ambient w-48 h-48 rounded-full flex flex-col items-center justify-center transition-transform duration-300 group"
          >
            <Zap className="w-12 h-12 mb-2 text-white" />
            <span className="text-lg font-bold tracking-wide">אני בחוץ עכשיו</span>
          </motion.button>
          <p className="text-on-surface-variant font-medium max-w-[250px]">
            לחץ כדי לעדכן את החברים שאתה זמין למפגש בקמפוס.
          </p>
        </div>
      )}

      <section className="bg-primary-soft text-primary rounded-3xl p-6 shadow-[0_18px_40px_rgba(61,101,62,0.10)] border border-primary/10 relative overflow-hidden w-full max-w-sm">
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 text-right">
            <p className="text-sm opacity-70 font-medium">מי רואה אותי?</p>
            <h3 className="text-xl font-bold">3 חברים בדרך אליך</h3>
          </div>
          <div className="flex -space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-full border-2 border-primary-soft bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover" src={AVATAR_NOA} alt="Friend" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-soft bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover" src={AVATAR_ITAY} alt="Friend" />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary-soft bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover" src={AVATAR_MAYA} alt="Friend" />
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent opacity-15 rounded-full blur-2xl"></div>
      </section>

      <section className="space-y-4 w-full max-w-sm text-right">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-lg font-bold text-primary">חברים בחוץ עכשיו</h4>
          <button 
            onClick={() => setShowAllFriends(true)}
            className="text-sm font-bold text-secondary hover:text-primary transition-colors"
          >
            הצג הכל
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden">
                <img className="w-full h-full object-cover" src={AVATAR_NOA} alt="Noa" />
              </div>
              <span className="status-live-dot absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1 text-right">
              <p className="font-bold text-primary">נועה לוי</p>
              <p className="text-xs text-on-surface-variant">בספריה למשפטים • עוד 45 דק׳</p>
            </div>
            <button 
              onClick={() => onOpenChat?.({ name: 'נועה לוי', img: AVATAR_NOA })}
              aria-label="פתח צ'אט עם נועה לוי"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:text-accent transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden">
                <img className="w-full h-full object-cover" src={AVATAR_ITAY} alt="Itay" />
              </div>
              <span className="status-live-dot absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1 text-right">
              <p className="font-bold text-primary">איתי אברהם</p>
              <p className="text-xs text-on-surface-variant">בקפיטריה המרכזית • הרגע יצא</p>
            </div>
            <button 
              onClick={() => onOpenChat?.({ name: 'איתי אברהם', img: AVATAR_ITAY })}
              aria-label="פתח צ'אט עם איתי אברהם"
              className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:text-accent transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showActivation && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActivation(false)}
              className="fixed inset-0 z-[50] bg-on-surface/40 backdrop-blur-sm"
            />
            <ActivationSheet onClose={() => setShowActivation(false)} onActivate={handleActivate} />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const MOCK_USERS = [
  { id: 1, name: 'נועה כהן', grade: 'י"א', time: '15 דק׳', location: 'דשא גדול', zoneId: 'grass', img: 'https://picsum.photos/seed/noa/100/100', isFriend: true },
  { id: 2, name: 'איתי לוי', grade: 'י"ב', time: '5 דק׳', location: 'קפיטריה', zoneId: 'cafeteria', img: 'https://picsum.photos/seed/itay/100/100', isFriend: true },
  { id: 3, name: 'שירה גולן', grade: 'י"', time: '20 דק׳', location: 'ספריה', zoneId: 'library', img: 'https://picsum.photos/seed/shira/100/100', isFriend: true },
  { id: 4, name: 'עומר דן', grade: 'י"א', time: '10 דק׳', location: 'דשא גדול', zoneId: 'grass', img: 'https://picsum.photos/seed/omer/100/100', isFriend: false },
  { id: 5, name: 'רוני שחר', grade: 'י"ב', time: '30 דק׳', location: 'מגורים', zoneId: 'dorms', img: 'https://picsum.photos/seed/roni/100/100', isFriend: false },
  { id: 6, name: 'דניאל כץ', grade: 'י"א', time: '12 דק׳', location: 'מעבדות', zoneId: 'labs', img: 'https://picsum.photos/seed/daniel/100/100', isFriend: false },
];

const CAMPUS_ZONES = [
  { id: 'grass', name: 'דשא גדול', className: 'top-[20%] left-[20%] w-[60%] h-[40%] rounded-[40px] map-zone-live' },
  { id: 'cafeteria', name: 'קפיטריה', className: 'bottom-[5%] right-[5%] w-[40%] h-[30%] rounded-3xl map-zone-accent' },
  { id: 'library', name: 'ספריה', className: 'top-[5%] right-[5%] w-[35%] h-[25%] rounded-3xl map-zone-study' },
  { id: 'dorms', name: 'מגורים', className: 'top-[5%] left-[5%] w-[30%] h-[25%] rounded-3xl map-zone-muted' },
  { id: 'labs', name: 'מעבדות', className: 'bottom-[5%] left-[5%] w-[45%] h-[25%] rounded-3xl map-zone-quiet' },
];

function OutsideScreen({ onOpenMessages, onOpenChat, key }: { onOpenMessages?: () => void, onOpenChat?: (user: any) => void, key?: string }) {
  const [audience, setAudience] = useState<'friends' | 'all'>('friends');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>('\u05dc\u05d9\u05de\u05d5\u05d3/\u05de\u05e4\u05d2\u05e9');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);

  const visibleUsers = MOCK_USERS.filter(u => {
    if (audience === 'friends' && !u.isFriend) return false;
    if (searchQuery && !u.name.includes(searchQuery)) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      {/* Segmented Control & View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-surface-container-low p-1 rounded-full flex-1">
          <button 
            onClick={() => setAudience('friends')}
            className={`flex-1 py-1.5 text-sm font-bold rounded-full transition-all ${audience === 'friends' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            חברים ({MOCK_USERS.filter(u => u.isFriend).length})
          </button>
          <button 
            onClick={() => setAudience('all')}
            className={`flex-1 py-1.5 text-sm font-bold rounded-full transition-all ${audience === 'all' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            כולם ({MOCK_USERS.length})
          </button>
        </div>
        <button 
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-xl text-sm font-bold text-primary active:scale-95 transition-all shadow-sm"
        >
          {viewMode === 'list' ? (
            <>
              <MapIcon className="w-5 h-5" />
              <span>מפה</span>
            </>
          ) : (
            <>
              <List className="w-5 h-5" />
              <span>רשימה</span>
            </>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        <input 
          className="w-full h-14 pr-12 pl-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/15 focus:bg-surface-container-highest transition-all outline-none" 
          placeholder="חפש חברים או מקום..." 
          aria-label="חיפוש חברים או מקום"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button 
          onClick={() => setShowFilterMenu(showFilterMenu === 'grade' ? null : 'grade')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedGrade ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          שכבה
        </button>
        <button 
          onClick={() => setShowFilterMenu(showFilterMenu === 'location' ? null : 'location')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedLocation ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          מקום
        </button>
        <button 
          onClick={() => setShowFilterMenu(showFilterMenu === 'activity' ? null : 'activity')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors ${selectedActivityType ? 'bg-accent-soft text-accent-foreground' : 'bg-accent-soft text-accent-foreground'}`}
        >
          לימוד/מפגש
        </button>
        <button 
          onClick={() => setShowFilterMenu(showFilterMenu === 'time' ? null : 'time')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedTime ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          זמן
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="map-grid relative w-full aspect-square bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden shadow-inner"
          >
            {CAMPUS_ZONES.map(zone => (
              <div key={zone.id} className={`absolute flex flex-col items-center justify-center p-2 transition-all ${zone.className}`}>
                <span className="text-[10px] font-bold opacity-60 mb-1 tracking-wide">{zone.name}</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {visibleUsers.filter(u => u.zoneId === zone.id).map(u => (
                    <motion.img 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      key={u.id} 
                      src={u.img} 
                      alt={u.name} 
                      className="w-8 h-8 rounded-full border-2 border-surface shadow-sm object-cover" 
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {visibleUsers.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p>לא נמצאו אנשים בחוץ כרגע.</p>
              </div>
            ) : (
              visibleUsers.map((user) => (
                <div key={user.id} className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0px_12px_32px_rgba(36,69,37,0.07)] border border-outline-variant/10 flex flex-col gap-4 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img alt="Avatar" className="w-14 h-14 rounded-2xl object-cover shadow-sm" src={user.img} />
                        <span className="status-live-dot absolute -bottom-1 -left-1 w-4 h-4 rounded-full border-2 border-white"></span>
                      </div>
                      <div className="flex flex-col text-right">
                        <h3 className="font-bold text-lg text-primary leading-tight">{user.name}</h3>
                        <span className="text-sm text-on-surface-variant font-medium">{user.grade}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1 text-secondary font-bold text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{user.time}</span>
                      </div>
                      <span className="text-xs text-on-surface-variant block mt-1">{user.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button className="flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
                      <Footprints className="w-4 h-4" />
                      <span>בדרך</span>
                    </button>
                    <button className="flex-1 h-11 rounded-full border border-outline-variant/30 text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-surface-container transition-all active:scale-95">
                      <Plus className="w-4 h-4" />
                      <span>הצטרף</span>
                    </button>
                    <button 
                      onClick={() => onOpenChat?.(user)}
                      aria-label={`פתח צ'אט עם ${user.name}`}
                      className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:text-accent transition-colors active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}

            <div className="bg-primary/5 p-1 rounded-2xl border border-primary/10 mt-2">
              <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between">
                <div className="text-right">
                  <h4 className="font-bold text-primary">עוד {MOCK_USERS.length} אנשים בחוץ</h4>
                  <p className="text-sm text-on-surface-variant">מרביתם כרגע באזור הקפיטריה</p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const MOCK_EVENTS = [
  { id: 1, type: 'study', title: 'לומדים למבחן במתמטיקה', subject: 'מתמטיקה 5 יח׳', time: '16:00 - 18:00', location: 'ספריה, קומה 2', participants: 4, maxParticipants: 6, creator: 'נועה כהן', img: 'https://picsum.photos/seed/math/100/100' },
  { id: 2, type: 'event', title: 'טורניר כדורסל שכבת י"א', subject: 'ספורט', time: '17:30 - 19:30', location: 'אולם ספורט', participants: 12, maxParticipants: 20, creator: 'איתי לוי', img: 'https://picsum.photos/seed/bball/100/100' },
  { id: 3, type: 'study', title: 'הכנה לבגרות בהיסטוריה', subject: 'היסטוריה', time: '19:00 - 21:00', location: 'חדר עיון', participants: 2, maxParticipants: 4, creator: 'שירה גולן', img: 'https://picsum.photos/seed/history/100/100' },
  { id: 4, type: 'event', title: 'חזרות לטקס יום הזיכרון', subject: 'תרבות', time: '14:00 - 16:00', location: 'אודיטוריום', participants: 8, maxParticipants: 15, creator: 'עומר דן', img: 'https://picsum.photos/seed/ceremony/100/100' },
];

function EventsScreen({ onOpenMessages, onOpenChat, key }: { onOpenMessages?: () => void, onOpenChat?: (user: any) => void, key?: string }) {
  const [activeTab, setActiveTab] = useState<'events' | 'study'>('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventSubject, setNewEventSubject] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const visibleItems = events.filter(item => {
    if (item.type !== activeTab) return false;
    if (searchQuery && !item.title.includes(searchQuery) && !item.subject.includes(searchQuery)) return false;
    return true;
  });

  const handleCreateEvent = () => {
    if (!newEventTitle || !newEventTime || !newEventLocation) return;
    
    const newEvent = {
      id: Date.now(),
      type: activeTab,
      title: newEventTitle,
      subject: newEventSubject || 'כללי',
      time: newEventTime,
      location: newEventLocation,
      participants: 1,
      maxParticipants: 10,
      creator: 'עידו ישראלי', // Current user
      img: `https://picsum.photos/seed/${Date.now()}/100/100`
    };

    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
    setNewEventTitle('');
    setNewEventSubject('');
    setNewEventTime('');
    setNewEventLocation('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 pb-20"
    >
      {/* Segmented Control */}
      <div className="flex bg-surface-container-low p-1 rounded-full w-full max-w-sm mx-auto shadow-sm">
        <button 
          onClick={() => setActiveTab('study')}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'study' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
        >
          למידה משותפת
        </button>
        <button 
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'events' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
        >
          אירועים
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        <input 
          className="w-full h-14 pr-12 pl-4 bg-surface-container-low border-none rounded-2xl text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/15 focus:bg-surface-container-highest transition-all outline-none" 
          placeholder={`חפש ${activeTab === 'study' ? 'קבוצת למידה' : 'אירוע'}...`} 
          aria-label="חיפוש אירועים וקבוצות"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button 
          onClick={() => setSelectedDate(selectedDate === 'today' ? null : 'today')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedDate === 'today' ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          היום
        </button>
        <button 
          onClick={() => setSelectedDate(selectedDate === 'tomorrow' ? null : 'tomorrow')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedDate === 'tomorrow' ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          מחר
        </button>
        <button 
          onClick={() => setSelectedSubject(selectedSubject ? null : 'general')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedSubject ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          מקצוע
        </button>
        <button 
          onClick={() => setSelectedLocation(selectedLocation ? null : 'general')}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${selectedLocation ? 'bg-primary text-white' : 'border border-outline-variant/30 hover:bg-surface-container-high'}`}
        >
          מקום
        </button>
      </div>

      {/* Content List */}
      <div className="flex flex-col gap-5">
        <AnimatePresence mode="popLayout">
          {visibleItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12 text-on-surface-variant"
            >
              <p>לא נמצאו תוצאות.</p>
            </motion.div>
          ) : (
            visibleItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id} 
                className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0px_12px_32px_rgba(36,69,37,0.07)] flex flex-col gap-4 relative overflow-hidden group border border-outline-variant/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden shrink-0">
                      <img className="w-full h-full object-cover" src={item.img} alt={item.subject} />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-secondary mb-1">{item.subject}</span>
                      <h3 className="font-bold text-lg text-primary leading-tight">{item.title}</h3>
                      <span className="text-sm text-on-surface-variant font-medium mt-1">יוזם: {item.creator}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-on-surface-variant bg-surface-container-low/50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-primary/60" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary/60" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary/60" />
                    <span>{item.participants}/{item.maxParticipants} משתתפים</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button className="flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    <span>הצטרף</span>
                  </button>
                  <button 
                    onClick={() => onOpenChat?.(item)}
                    aria-label={`פתח צ'אט עבור ${item.title}`}
                    className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-surface-container transition-colors active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      const shareText = `${item.title} - ${item.location} ב-${item.time}`;
                      if (navigator.share) {
                        navigator.share({ title: 'IASA עכשיו', text: shareText });
                      } else {
                        alert(`שתף: ${shareText}`);
                      }
                    }}
                    aria-label="שתף" 
                    className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-surface-container transition-colors active:scale-95"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 left-4 sm:left-6 w-14 h-14 bg-accent text-on-accent rounded-2xl shadow-[0_12px_28px_rgba(242,140,56,0.18)] flex items-center justify-center z-10"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 soft-scrim flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="soft-modal w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-primary">
                  יצירת {activeTab === 'study' ? 'קבוצת למידה' : 'אירוע'} חדש
                </h2>
                <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-primary">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <input 
                type="text" 
                placeholder="כותרת" 
                aria-label="כותרת האירוע"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full p-4 bg-surface-container-low rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
              />
              
              {activeTab === 'study' && (
                <input 
                  type="text" 
                  placeholder="מקצוע" 
                  aria-label="מקצוע"
                  value={newEventSubject}
                  onChange={(e) => setNewEventSubject(e.target.value)}
                  className="w-full p-4 bg-surface-container-low rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              )}

              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="שעה (לדוג׳ 16:00)" 
                  aria-label="שעה"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="w-full p-4 bg-surface-container-low rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
                <input 
                  type="text" 
                  placeholder="מיקום" 
                  aria-label="מיקום"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full p-4 bg-surface-container-low rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button 
                onClick={handleCreateEvent}
                disabled={!newEventTitle || !newEventTime || !newEventLocation}
                className="w-full mt-4 py-4 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                צור {activeTab === 'study' ? 'קבוצה' : 'אירוע'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MessageOverlay({ 
  showMessages, 
  setShowMessages, 
  activeChat, 
  setActiveChat 
}: { 
  showMessages: boolean, 
  setShowMessages: (show: boolean) => void, 
  activeChat: any, 
  setActiveChat: (chat: any) => void 
}) {
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput('');
    // In a real app, this would send the message
  };

  return (
    <AnimatePresence>
      {showMessages && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-surface flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
            <h2 className="text-2xl font-bold text-primary">הודעות</h2>
            <button 
              onClick={() => {
                setShowMessages(false);
                setActiveChat(null);
              }}
              aria-label="סגור הודעות"
              className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {[
              { id: 1, name: 'נועה כהן', msg: 'איפה אתם יושבים?', time: '14:30', unread: true, img: 'https://picsum.photos/seed/noa/100/100' },
              { id: 2, name: 'איתי לוי', msg: 'אני מביא את הגיטרה', time: '12:15', unread: false, img: 'https://picsum.photos/seed/itay/100/100' },
              { id: 3, name: 'קבוצת למידה מתמטיקה', msg: 'שירה: נתראה בספריה', time: 'אתמול', unread: true, img: 'https://picsum.photos/seed/math/100/100' },
            ].map((chat) => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat)}
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="relative">
                  <img src={chat.img} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                  {chat.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-surface"></div>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold ${chat.unread ? 'text-primary' : 'text-on-surface-variant'}`}>{chat.name}</h4>
                    <span className="text-xs text-on-surface-variant">{chat.time}</span>
                  </div>
                  <p className={`text-sm ${chat.unread ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>{chat.msg}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active Chat View */}
          <AnimatePresence>
            {activeChat && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-10 bg-surface flex flex-col"
              >
                <div className="flex items-center gap-4 p-4 border-b border-outline-variant/10 bg-surface-container-lowest">
                  <button 
                    onClick={() => setActiveChat(null)}
                    aria-label="חזרה לרשימת שיחות"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img src={activeChat.img} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                  <h3 className="font-bold text-primary">{activeChat.name}</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest/50">
                  {/* Mock Chat History */}
                  <div className="flex flex-col gap-2">
                    <div className="self-start bg-surface-container-low p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm text-on-surface">היי, איפה אתם?</p>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">14:25</span>
                    </div>
                    <div className="self-end bg-primary text-white p-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                      <p className="text-sm">אנחנו בדשא הגדול, ליד העץ</p>
                      <span className="text-[10px] text-white/70 mt-1 block text-left">14:28</span>
                    </div>
                    <div className="self-start bg-surface-container-low p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm text-on-surface">{activeChat.msg}</p>
                      <span className="text-[10px] text-on-surface-variant mt-1 block">{activeChat.time}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-surface border-t border-outline-variant/10 flex gap-2">
                  <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="הקלד הודעה..." 
                    aria-label="הקלד הודעה"
                    className="flex-1 bg-surface-container-low border-none rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/15"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5 -ml-1" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProfileScreen({ 
  onLogout, 
  onOpenMessages,
  key 
}: { 
  onLogout: () => void, 
  onOpenMessages?: () => void,
  key?: string 
}) {
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    friendRequests: true,
    events: true,
    friendsOutside: false,
    sound: true,
  });
  const [notificationDigest, setNotificationDigest] = useState<'live' | 'hourly' | 'daily'>('live');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col pb-20 relative"
    >
      <section className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-[2rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 shadow-xl">
            <img alt="Profile Photo" className="w-full h-full object-cover" src={PROFILE_MAIN} />
          </div>
          <div className="absolute -bottom-1 -left-1 bg-accent w-8 h-8 rounded-full flex items-center justify-center text-on-accent shadow-[0_10px_22px_rgba(242,140,56,0.18)] border-4 border-background">
            <Pencil className="w-4 h-4 fill-current" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-primary font-manrope mb-1">עידו ישראלי</h1>
        <p className="text-on-surface-variant font-medium mb-6">כיתה י״ב | מסלול פיזיקה-מדמ״ח</p>

        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 bg-surface-container-low rounded-2xl p-4 text-center">
            <span className="block text-2xl font-extrabold text-primary">142</span>
            <span className="text-xs text-on-surface-variant font-medium">חברים</span>
          </div>
          <button 
            onClick={() => setShowAddFriend(true)}
            className="primary-cta flex-[2] h-full rounded-full flex items-center justify-center gap-2 font-bold transition-all active:scale-95 py-4"
          >
            <UserPlus className="w-5 h-5" />
            <span>הוסף חבר</span>
          </button>
        </div>
      </section>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div 
            onClick={() => onOpenMessages?.()}
            className="group flex items-center justify-between p-5 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="font-semibold text-primary">הודעות</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-accent-soft text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">2 חדשות</span>
              <ChevronLeft className="w-5 h-5 text-outline-variant" />
            </div>
          </div>

          <div 
            onClick={() => setShowFriendRequests(true)}
            className="group flex items-center justify-between p-5 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-semibold text-primary">בקשות חברות</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-accent-soft text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">3 חדשות</span>
              <ChevronLeft className="w-5 h-5 text-outline-variant" />
            </div>
          </div>

          <div className="bg-surface-container-low rounded-[2rem] p-2 space-y-1">
            <div 
              onClick={() => setShowPrivacySettings(!showPrivacySettings)}
              className="group flex items-center justify-between p-4 bg-surface-container-lowest/80 rounded-2xl hover:bg-surface-container-lowest transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <EyeOff className="w-5 h-5" />
                </div>
                <span className="font-semibold text-primary">פרטיות וניראות</span>
              </div>
              <ChevronLeft className={`w-5 h-5 text-outline-variant transition-transform ${showPrivacySettings ? '-rotate-90' : ''}`} />
            </div>

            <AnimatePresence>
              {showPrivacySettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden px-4"
                >
                  <div className="py-4 space-y-4 border-t border-outline-variant/10 mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-primary">מי יכול לראות אותי?</h4>
                        <p className="text-xs text-on-surface-variant">ברירת מחדל כשאתה בחוץ</p>
                      </div>
                      <select className="bg-surface-container-highest text-sm font-bold text-primary rounded-lg px-3 py-2 border-none outline-none">
                        <option>רק חברים</option>
                        <option>כל השכבה</option>
                        <option>כולם</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-primary">הסתר מיקום מדויק</h4>
                        <p className="text-xs text-on-surface-variant">הצג רק אזור כללי</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {[
              { icon: BellRing, label: 'התראות', onClick: () => setShowNotifications(true) },
              { icon: Users, label: 'רשימת חברים', onClick: () => setShowFriendsList(true) },
            ].map((item, i) => (
              <div 
                key={i} 
                onClick={item.onClick}
                className="group flex items-center justify-between p-4 bg-surface-container-lowest/80 rounded-2xl hover:bg-surface-container-lowest transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-primary">{item.label}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-outline-variant" />
              </div>
            ))}
          </div>

          <div 
            onClick={() => setShowSafety(true)}
            className="group flex items-center justify-between p-5 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-danger-soft flex items-center justify-center text-error">
                <Shield className="w-6 h-6" />
              </div>
              <span className="font-semibold text-primary">בטיחות ודיווח</span>
            </div>
            <ChevronLeft className="w-5 h-5 text-outline-variant" />
          </div>
        </div>
      </div>

      <div className="mt-12 mb-8 text-center">
        <button onClick={onLogout} className="inline-flex items-center gap-2 text-error font-semibold hover:opacity-70 transition-opacity">
          <LogOut className="w-5 h-5" />
          <span>התנתקות מהמערכת</span>
        </button>
        <p className="text-xs text-on-surface-variant/55 mt-4 tracking-wide font-heebo">גרסה 2.4.0 • אוצר אקדמי</p>
      </div>
        {/* Add Friend Modal */}
        <AnimatePresence>
          {showAddFriend && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[100] bg-surface flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary">הוסף חבר</h2>
                <button 
                  onClick={() => setShowAddFriend(false)}
                  className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">שומר כהן</p>
                    <p className="text-sm text-on-surface-variant">כיתה י״ב</p>
                  </div>
                  <UserPlus className="w-5 h-5 text-accent" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">ליאור לוי</p>
                    <p className="text-sm text-on-surface-variant">כיתה י״ב</p>
                  </div>
                  <UserPlus className="w-5 h-5 text-accent" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Friend Requests Modal */}
        <AnimatePresence>
          {showFriendRequests && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[100] bg-surface flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary">בקשות חברות</h2>
                <button 
                  onClick={() => setShowFriendRequests(false)}
                  className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div>
                      <p className="font-bold text-primary">רות כהנים</p>
                      <p className="text-sm text-on-surface-variant">כיתה י״א</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-bold">אישור</button>
                    <button className="px-3 py-1.5 bg-surface-container text-primary rounded-full text-sm font-bold">דחייה</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div>
                      <p className="font-bold text-primary">דן אלרן</p>
                      <p className="text-sm text-on-surface-variant">כיתה י״ב</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-bold">אישור</button>
                    <button className="px-3 py-1.5 bg-surface-container text-primary rounded-full text-sm font-bold">דחייה</button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div>
                      <p className="font-bold text-primary">טלי מזרחי</p>
                      <p className="text-sm text-on-surface-variant">כיתה י״ב</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-bold">אישור</button>
                    <button className="px-3 py-1.5 bg-surface-container text-primary rounded-full text-sm font-bold">דחייה</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Modal */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[100] bg-surface flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary">הגדרות התראות</h2>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-4 bg-surface-container-highest rounded-2xl">
                  <h3 className="font-bold text-primary mb-3">תדירות התראות</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'live', label: 'מיידי' },
                      { id: 'hourly', label: 'שעתי' },
                      { id: 'daily', label: 'יומי' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setNotificationDigest(option.id as 'live' | 'hourly' | 'daily')}
                        className={`py-2 rounded-xl text-sm font-bold transition-colors ${notificationDigest === option.id ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'messages', title: 'הודעות חדשות', description: 'התראה כשמגיעה הודעה בצ׳אט', icon: MessageCircle },
                  { key: 'friendRequests', title: 'בקשות חברות', description: 'התראה על בקשה חדשה או אישור', icon: Users },
                  { key: 'events', title: 'אירועים וקבוצות', description: 'תזכורות לאירועים וללמידה משותפת', icon: Calendar },
                  { key: 'friendsOutside', title: 'חברים בחוץ', description: 'התראה כשחבר מסמן שהוא בחוץ', icon: Zap },
                  { key: 'sound', title: 'צליל ורטט', description: 'הפעלת צליל/רטט בהתראה', icon: Bell },
                ].map((item) => {
                  const enabled = notificationSettings[item.key as keyof typeof notificationSettings];

                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface-container-highest rounded-2xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-primary">{item.title}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        aria-label={`הפעל ${item.title}`}
                        onClick={() =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof notificationSettings],
                          }))
                        }
                        className={`w-12 h-7 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-surface-container'}`}
                      >
                        <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${enabled ? 'right-1' : 'right-6'}`} />
                      </button>
                    </div>
                  );
                })}

                <div className="p-4 bg-primary-soft rounded-2xl border border-primary/10">
                  <p className="font-semibold text-primary">התראות חכמות</p>
                  <p className="text-sm text-on-surface-variant mt-1">המערכת מפחיתה התראות כפולות כשכמה חברים שולחים עדכון דומה.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Friends List Modal */}
        <AnimatePresence>
          {showFriendsList && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[100] bg-surface flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary">רשימת חברים</h2>
                <button 
                  onClick={() => setShowFriendsList(false)}
                  className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <input 
                  type="text" 
                  placeholder="חפש חברים..." 
                  className="w-full px-4 py-2.5 bg-surface-container-highest text-primary rounded-full text-sm placeholder-on-surface-variant/50"
                />
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">נועה לוי</p>
                    <p className="text-sm text-on-surface-variant">בספריה • כיתה י״ב</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">איתי אברהם</p>
                    <p className="text-sm text-on-surface-variant">בקפיטריה • כיתה י״ב</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-surface-container-highest rounded-2xl hover:bg-surface-container-high cursor-pointer transition-colors">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">מיכאל סלע</p>
                    <p className="text-sm text-on-surface-variant">בחוץ • כיתה י״א</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safety Modal */}
        <AnimatePresence>
          {showSafety && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[100] bg-surface flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                <h2 className="text-2xl font-bold text-primary">בטיחות ודיווח</h2>
                <button 
                  onClick={() => setShowSafety(false)}
                  className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-4 bg-surface-container-highest rounded-2xl">
                  <h3 className="font-bold text-primary mb-2">דווח על בעיה</h3>
                  <p className="text-sm text-on-surface-variant mb-4">אם נתקלת בעדכון בעייתי או התנהגות לא תקינה</p>
                  <button className="w-full px-4 py-2.5 bg-error text-white rounded-full font-bold text-sm">דווח</button>
                </div>
                <div className="p-4 bg-surface-container-highest rounded-2xl">
                  <h3 className="font-bold text-primary mb-2">חסום משתמש</h3>
                  <p className="text-sm text-on-surface-variant mb-4">לא תראה עדכונים ממשתמש זה</p>
                  <button className="w-full px-4 py-2.5 bg-surface-container text-primary rounded-full font-bold text-sm">חסום</button>
                </div>
                <div className="p-4 bg-surface-container-highest rounded-2xl">
                  <h3 className="font-bold text-primary mb-2">נתונים אישיים</h3>
                  <p className="text-sm text-on-surface-variant">למידע נוסף על כיצד אנו משתמשים בנתונים שלך</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  );
}

// --- Main App ---

export default function App() {
  const [currentTab, setCurrentTab] = useState('onboarding');
  const [isOutside, setIsOutside] = useState(false);
  const [showMessagesGlobal, setShowMessagesGlobal] = useState(false);
  const [activeChatGlobal, setActiveChatGlobal] = useState<any>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [outsideConfig, setOutsideConfig] = useState({
    endTime: null as number | null,
    location: 'על הדשא הגדול',
    visibility: 'friends'
  });

  const handleOpenChat = (user: any) => {
    setActiveChatGlobal({
      id: user.id || Math.random(),
      name: user.name || user.creator,
      msg: 'היי, מה קורה?',
      time: 'עכשיו',
      unread: false,
      img: user.img || 'https://picsum.photos/seed/user/100/100'
    });
    setShowMessagesGlobal(true);
  };

  if (currentTab === 'onboarding') {
    return <OnboardingScreen onLogin={() => setCurrentTab('now')} />;
  }

  return (
    <div className="min-h-screen app-bg text-on-surface pb-[calc(6.25rem+env(safe-area-inset-bottom))] font-heebo">
      <TopNav 
        onMessagesClick={() => setShowMessagesGlobal(true)} 
        onProfileClick={() => setCurrentTab('profile')}
        onNotificationsClick={() => setShowNotificationsModal(true)}
      />
      <main className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentTab === 'now' && (
            <NowScreen 
              key="now" 
              isOutside={isOutside} 
              setIsOutside={setIsOutside} 
              outsideConfig={outsideConfig} 
              setOutsideConfig={setOutsideConfig} 
              onOpenMessages={() => setShowMessagesGlobal(true)}
              onOpenChat={handleOpenChat}
            />
          )}
          {currentTab === 'outside' && <OutsideScreen key="outside" onOpenMessages={() => setShowMessagesGlobal(true)} onOpenChat={handleOpenChat} />}
          {currentTab === 'events' && <EventsScreen key="events" onOpenMessages={() => setShowMessagesGlobal(true)} onOpenChat={handleOpenChat} />}
          {currentTab === 'profile' && (
            <ProfileScreen 
              key="profile" 
              onLogout={() => setCurrentTab('onboarding')} 
              onOpenMessages={() => setShowMessagesGlobal(true)}
            />
          )}
        </AnimatePresence>
      </main>
      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
      
      <MessageOverlay 
        showMessages={showMessagesGlobal} 
        setShowMessages={setShowMessagesGlobal} 
        activeChat={activeChatGlobal} 
        setActiveChat={setActiveChatGlobal} 
      />

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotificationsModal && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-[100] bg-surface flex flex-col"
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-outline-variant/10">
              <h2 className="text-2xl font-bold text-primary">התראות</h2>
              <button 
                onClick={() => setShowNotificationsModal(false)}
                aria-label="סגור התראות"
                className="w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {[
                { id: 1, title: 'נועה הצטרפה לקבוצת הלימודה שלך', time: '14:30', icon: Users },
                { id: 2, title: 'לָךְ זמן לאירוע "טורניר כדורסל"', time: '12:15', icon: Calendar },
                { id: 3, title: 'איתי שינה את סטטוסו ל"בחוץ"', time: 'אתמול', icon: Zap },
              ].map((notif) => (
                <div key={notif.id} className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <notif.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface">{notif.title}</p>
                    <span className="text-xs text-on-surface-variant">{notif.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
