/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, type LocationMode, type UserDTO, type VisibilityScope } from './api';
import { supabase, getCurrentUser } from './supabase';
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

const GRADE_OPTIONS = ['י׳', 'י״א', 'י״ב'];
const VISIBILITY_OPTIONS: Array<{ value: VisibilityScope; label: string; description: string }> = [
  { value: 'friends', label: 'רק חברים', description: 'יראו אתכם רק חברים מאושרים.' },
  { value: 'grade', label: 'כל השכבה', description: 'גם תלמידים מהשכבה שלך יראו שאתה בחוץ.' },
  { value: 'all', label: 'כולם', description: 'כל תלמידי בית הספר יוכלו לראות אותך.' },
];

type GeoPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'error';

function getCurrentPositionPromise(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported in this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 12000,
      maximumAge: 30000,
    });
  });
}

function isProfileComplete(user: UserDTO | null): boolean {
  if (!user) {
    return false;
  }

  const fullName = user.fullName.trim();
  const grade = user.grade.trim().toLowerCase();

  return (
    fullName.length >= 2 &&
    fullName.toLowerCase() !== 'new user' &&
    grade.length > 0 &&
    grade !== 'unknown'
  );
}

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
    <nav className="fixed bottom-0 w-full z-50 glass-nav rounded-t-[24px] flex justify-around items-center h-[76px] sm:h-20 pb-safe px-1 sm:px-2">
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

function ProfileSetupWizard({
  initialUser,
  onComplete,
  onLogout,
}: {
  initialUser: UserDTO | null;
  onComplete: (user: UserDTO) => void;
  onLogout: () => void;
}) {
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: initialUser?.fullName && initialUser.fullName !== 'New User' ? initialUser.fullName : '',
    grade: initialUser?.grade && initialUser.grade !== 'unknown' ? initialUser.grade : '',
    defaultVisibility: (initialUser?.defaultVisibility ?? 'all') as VisibilityScope,
    avatarUrl: initialUser?.avatarUrl ?? '',
    preciseLocationEnabled: initialUser?.preciseLocationEnabled ?? true,
  });

  const stepTitles = ['עליך', 'לימודים', 'פרטיות', 'תמונה'];
  const isLastStep = step === stepTitles.length - 1;

  const validateStep = (index: number): boolean => {
    const nextErrors: Record<string, string> = {};

    if (index === 0) {
      if (form.fullName.trim().length < 2) {
        nextErrors.fullName = 'צריך להזין שם מלא של לפחות 2 תווים.';
      }
    }

    if (index === 1) {
      if (!form.grade) {
        nextErrors.grade = 'יש לבחור כיתה.';
      }
    }

    if (index === 2) {
      if (!VISIBILITY_OPTIONS.some((option) => option.value === form.defaultVisibility)) {
        nextErrors.defaultVisibility = 'יש לבחור הגדרת פרטיות.';
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }
    setSubmitError(null);
    setStep((prev) => Math.min(prev + 1, stepTitles.length - 1));
  };

  const handleBack = () => {
    setFieldErrors({});
    setSubmitError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(0)) {
      setStep(0);
      return;
    }

    if (!validateStep(1)) {
      setStep(1);
      return;
    }

    if (!validateStep(2)) {
      setStep(2);
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      const response = await api.updateMyProfile({
        fullName: form.fullName.trim(),
        grade: form.grade,
        defaultVisibility: form.defaultVisibility,
        avatarUrl: form.avatarUrl.trim() || undefined,
        preciseLocationEnabled: form.preciseLocationEnabled,
      });

      if (!response.user) {
        throw new Error('לא התקבלו נתוני משתמש מהשרת.');
      }

      onComplete(response.user);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'שמירת הפרופיל נכשלה. נסה שוב.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen app-bg text-on-surface antialiased overflow-hidden px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-xl mx-auto">
        <div className="section-card p-5 sm:p-7">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-on-surface-variant font-semibold">כניסה ראשונה</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">בוא נסדר את הפרופיל שלך</h1>
              <p className="text-sm text-on-surface-variant mt-2">זה חד-פעמי ולוקח פחות מדקה.</p>
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm font-semibold text-error bg-danger-soft rounded-full"
            >
              יציאה
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-7">
            {stepTitles.map((title, index) => (
              <div key={title} className="space-y-2">
                <div className={`h-1.5 rounded-full ${index <= step ? 'bg-primary' : 'bg-surface-container'}`} />
                <p className={`text-xs font-semibold text-center ${index <= step ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {title}
                </p>
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-primary">שם מלא</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="לדוגמה: נועה כהן"
                className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/15 focus:bg-surface-container-highest transition-all outline-none"
              />
              {fieldErrors.fullName && <p className="text-sm text-error font-semibold">{fieldErrors.fullName}</p>}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">כיתה</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADE_OPTIONS.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, grade }))}
                      className={`py-3 rounded-xl text-sm font-bold transition-colors ${form.grade === grade ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
                {fieldErrors.grade && <p className="text-sm text-error font-semibold mt-2">{fieldErrors.grade}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {VISIBILITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, defaultVisibility: option.value }))}
                  className={`w-full text-right p-4 rounded-2xl border transition-colors ${form.defaultVisibility === option.value ? 'border-primary bg-primary-soft' : 'border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low'}`}
                >
                  <p className="font-bold text-primary">{option.label}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{option.description}</p>
                </button>
              ))}
              {fieldErrors.defaultVisibility && <p className="text-sm text-error font-semibold">{fieldErrors.defaultVisibility}</p>}

              <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low">
                <div>
                  <p className="font-semibold text-primary">מיקום מדויק</p>
                  <p className="text-xs text-on-surface-variant mt-1">אם כבוי, יוצג אזור כללי בלבד.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.preciseLocationEnabled}
                  onClick={() => setForm((prev) => ({ ...prev, preciseLocationEnabled: !prev.preciseLocationEnabled }))}
                  className={`w-12 h-7 rounded-full relative transition-colors ${form.preciseLocationEnabled ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${form.preciseLocationEnabled ? 'right-1' : 'right-6'}`} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="mx-auto w-24 h-24 rounded-[1.5rem] overflow-hidden shadow-lg">
                <img
                  src={form.avatarUrl.trim() || PROFILE_MAIN}
                  alt="תצוגת תמונת פרופיל"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="block text-sm font-bold text-primary">קישור לתמונת פרופיל (אופציונלי)</label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full bg-surface-container-low border-none rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/60 focus:ring-2 focus:ring-primary/15 focus:bg-surface-container-highest transition-all outline-none"
              />
              <p className="text-xs text-on-surface-variant">אפשר לדלג עכשיו ולהעלות תמונה אחר כך.</p>
            </div>
          )}

          {submitError && (
            <div className="mt-5 rounded-xl bg-danger-soft p-3 text-sm text-error font-semibold">
              {submitError}
            </div>
          )}

          <div className="mt-7 flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0 || isSaving}
              className="flex-1 py-3 rounded-full font-bold bg-surface-container text-primary disabled:opacity-45 disabled:cursor-not-allowed"
            >
              חזרה
            </button>

            {!isLastStep && (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSaving}
                className="flex-1 py-3 rounded-full font-bold primary-cta disabled:opacity-50 disabled:cursor-not-allowed"
              >
                המשך
              </button>
            )}

            {isLastStep && (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-full font-bold primary-cta disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'שומר...' : 'סיום וכניסה'}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-full font-bold bg-surface-container text-primary disabled:opacity-45 disabled:cursor-not-allowed"
                  title="דלג על תמונת פרופיל וסיים את ההגדרה"
                >
                  {isSaving ? 'דלג...' : 'דלג'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivationSheet({
  onClose,
  onActivate,
  defaultVisibility,
  preciseEnabled,
}: {
  onClose: () => void;
  onActivate: (config: any) => void;
  defaultVisibility?: VisibilityScope;
  preciseEnabled?: boolean;
}) {
  const [duration, setDuration] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<VisibilityScope>(defaultVisibility ?? 'all');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [locationMode, setLocationMode] = useState<LocationMode>('precise');
  const [geoPermission, setGeoPermission] = useState<GeoPermissionState>('idle');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number; accuracyM?: number } | null>(null);

  useEffect(() => {
    setVisibility(defaultVisibility ?? 'all');
  }, [defaultVisibility]);

  const handleActivate = () => {
    onActivate({
      endTime: duration ? Date.now() + duration * 60000 : null,
      visibility,
      location: location || 'בקמפוס',
      note,
      locationMode,
      coordinates,
    });
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setGeoPermission('unsupported');
      setGeoError('הדפדפן לא תומך בשירותי מיקום.');
      return;
    }

    setGeoPermission('requesting');
    setGeoError(null);
    try {
      const position = await getCurrentPositionPromise();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracyM = position.coords.accuracy;

      setCoordinates({ latitude, longitude, accuracyM });
      setGeoPermission('granted');
      setLocation(`GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    } catch (error) {
      const geoMessage = error instanceof GeolocationPositionError
        ? error.code === error.PERMISSION_DENIED
          ? 'הגישה למיקום נדחתה. אפשר להמשיך עם הזנה ידנית.'
          : 'לא הצלחנו למשוך מיקום כרגע. נסו שוב.'
        : 'לא הצלחנו למשוך מיקום כרגע.';
      setGeoPermission('denied');
      setGeoError(geoMessage);
    }
  };

  const canUsePrecise = preciseEnabled ?? true;

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
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={() => setLocationMode('zone')}
            className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${locationMode === 'zone' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
          >
            אזור בלבד
          </button>
          <button
            type="button"
            onClick={() => setLocationMode('manual')}
            className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${locationMode === 'manual' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}
          >
            ידני
          </button>
          <button
            type="button"
            disabled={!canUsePrecise}
            onClick={() => setLocationMode('precise')}
            className={`px-3 py-2 rounded-full text-xs font-bold transition-colors ${locationMode === 'precise' ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'} ${!canUsePrecise ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            מדויק (GPS)
          </button>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="px-3 py-2 rounded-full text-xs font-bold bg-accent-soft text-accent-foreground"
          >
            השתמש במיקום שלי
          </button>
        </div>
        {geoPermission === 'requesting' && <p className="text-xs text-on-surface-variant mb-2">מבקש הרשאת מיקום...</p>}
        {geoPermission === 'granted' && <p className="text-xs text-primary mb-2">מיקום עודכן מהטלפון.</p>}
        {geoError && <p className="text-xs text-error mb-2">{geoError}</p>}
        {!canUsePrecise && <p className="text-xs text-on-surface-variant mb-2">שיתוף מדויק כבוי בפרטיות שלך, לכן נשלח אזור בלבד.</p>}
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

function NowScreen({
  isOutside,
  setIsOutside,
  outsideConfig,
  setOutsideConfig,
  onOpenMessages,
  onOpenChat,
  currentUserId,
  currentUser,
}: any) {
  const [showActivation, setShowActivation] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [friendsOutside, setFriendsOutside] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadOutside = async () => {
      try {
        const data = await api.getOutsideLocationFeed();
        if (!mounted) {
          return;
        }
        setFriendsOutside(data.results.filter((r) => r.user.id !== currentUserId));
      } catch {
        if (mounted) {
          setFriendsOutside([]);
        }
      }
    };

    loadOutside();
    const interval = setInterval(loadOutside, 20000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [currentUserId, isOutside]);

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

  const handleActivate = async (config: any) => {
    setShowActivation(false);
    setIsSyncing(true);
    try {
      if (config.locationMode === 'precise') {
        await api.recordLocationConsent({
          isGranted: true,
          policyVersion: 'v1',
        });
      }

      const response = await api.activateStatus({
        locationLabel: config.location,
        note: config.note ?? '',
        visibility: config.visibility,
        durationMinutes: config.endTime ? Math.max(1, Math.round((config.endTime - Date.now()) / 60000)) : 0,
      });

      if (config.coordinates) {
        await api.createLocationSample({
          latitude: config.coordinates.latitude,
          longitude: config.coordinates.longitude,
          accuracyM: config.coordinates.accuracyM,
          source: 'gps',
          locationMode: config.locationMode,
        });
      }

      const status = response.status;
      setOutsideConfig({
        ...config,
        endTime: status.expiresAt ? new Date(status.expiresAt).getTime() : null,
        location: status.locationLabel,
        visibility: status.visibility,
        note: status.note,
      });
      setIsOutside(true);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTurnOff = async () => {
    setIsSyncing(true);
    try {
      await api.deactivateStatus();
      setIsOutside(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExtend = async () => {
    setIsSyncing(true);
    try {
      const response = await api.extendStatus(10);
      setOutsideConfig({
        ...outsideConfig,
        endTime: response.status.expiresAt ? new Date(response.status.expiresAt).getTime() : outsideConfig.endTime,
      });
    } finally {
      setIsSyncing(false);
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
            <h3 className="text-xl font-bold">{friendsOutside.length} חברים בדרך אליך</h3>
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
          {friendsOutside.length === 0 && (
            <div className="bg-surface-container-lowest p-4 rounded-2xl text-sm text-on-surface-variant">
              אין כרגע חברים פעילים בחוץ.
            </div>
          )}
          {friendsOutside.slice(0, showAllFriends ? friendsOutside.length : 3).map((item) => (
            <div key={item.status.id} className="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 transition-transform active:scale-[0.98]">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden flex items-center justify-center text-primary font-bold">
                  {item.user.name.slice(0, 1)}
                </div>
                <span className="status-live-dot absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex-1 text-right">
                <p className="font-bold text-primary">{item.user.name}</p>
                <p className="text-xs text-on-surface-variant">{item.status.locationLabel}</p>
                {item.sample?.capturedAt && (
                  <p className="text-[11px] text-on-surface-variant/80">
                    עודכן: {new Date(item.sample.capturedAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
              <button
                onClick={() => onOpenChat?.({ id: item.user.id, name: item.user.name })}
                aria-label={`פתח צ'אט עם ${item.user.name}`}
                className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:text-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
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
            <ActivationSheet
              onClose={() => setShowActivation(false)}
              onActivate={handleActivate}
              defaultVisibility={currentUser?.defaultVisibility}
              preciseEnabled={currentUser?.preciseLocationEnabled}
            />
          </>
        )}
      </AnimatePresence>
      {isSyncing && <div className="text-xs text-on-surface-variant">מסנכרן מול השרת...</div>}
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

function OutsideScreen({ onOpenMessages, onOpenChat }: { onOpenMessages?: () => void, onOpenChat?: (user: any) => void }) {
  const [audience, setAudience] = useState<'friends' | 'all'>('friends');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [outsideUsers, setOutsideUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedActivityType, setSelectedActivityType] = useState<string | null>('\u05dc\u05d9\u05de\u05d5\u05d3/\u05de\u05e4\u05d2\u05e9');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadOutside = async (showLoader = false) => {
      if (showLoader) {
        setIsLoading(true);
      }
      setLoadError(null);

      try {
        const data = await api.getOutsideLocationFeed();
        if (!mounted) {
          return;
        }

        const mapped = data.results.map((item) => ({
          id: item.user.id,
          name: item.user.name,
          grade: item.user.grade,
          time: new Date(item.sample?.capturedAt ?? item.status.updatedAt).toLocaleTimeString('he-IL', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: item.status.locationLabel,
          zoneId: item.sample?.zoneId ?? item.status.zoneId,
          img: `https://picsum.photos/seed/${item.user.id}/100/100`,
          isFriend: Boolean((item.user as any).isFriend),
        }));

        setOutsideUsers(mapped);
      } catch {
        if (mounted) {
          setOutsideUsers([]);
          setLoadError('לא הצלחנו לטעון נתוני מפה כרגע.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadOutside(true);
    const interval = setInterval(() => loadOutside(false), 20000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const visibleUsers = outsideUsers.filter(u => {
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
            חברים ({outsideUsers.filter((u) => u.isFriend).length})
          </button>
          <button 
            onClick={() => setAudience('all')}
            className={`flex-1 py-1.5 text-sm font-bold rounded-full transition-all ${audience === 'all' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            כולם ({outsideUsers.length})
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
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-container-low p-6 rounded-2xl text-center text-on-surface-variant"
          >
            טוען נתוני מיקום...
          </motion.div>
        ) : loadError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-danger-soft p-6 rounded-2xl text-center text-error"
          >
            {loadError}
          </motion.div>
        ) : (
          viewMode === 'map' ? (
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
                  <h4 className="font-bold text-primary">עוד {outsideUsers.length} אנשים בחוץ</h4>
                  <p className="text-sm text-on-surface-variant">מרביתם כרגע באזור הקפיטריה</p>
                </div>
                <Users className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </motion.div>
          )
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
  setActiveChat,
  currentUserId,
}: { 
  showMessages: boolean, 
  setShowMessages: (show: boolean) => void, 
  activeChat: any, 
  setActiveChat: (chat: any) => void,
  currentUserId: string,
}) {
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  useEffect(() => {
    if (!showMessages) {
      return;
    }

    let mounted = true;
    setIsLoadingConversations(true);
    api
      .getConversations()
      .then((data) => {
        if (mounted) {
          setConversations(data.conversations);
        }
      })
      .catch(() => {
        if (mounted) {
          setConversations([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoadingConversations(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [showMessages, currentUserId]);

  const openConversation = async (chat: any) => {
    setActiveChat(chat);
    if (!chat.conversationId) {
      setChatMessages([]);
      return;
    }

    setIsLoadingMessages(true);
    try {
      const data = await api.getMessages(chat.conversationId);
      setChatMessages(data.messages);
    } catch {
      setChatMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    if (!activeChat?.conversationId) {
      setMessageInput('');
      return;
    }

    const text = messageInput.trim();
    setMessageInput('');
    try {
      const response = await api.sendMessage(activeChat.conversationId, text);
      setChatMessages((prev) => [...prev, response.message]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChat.conversationId
            ? { ...c, lastMessage: { text, createdAt: response.message.createdAt, senderId: currentUserId }, updatedAt: response.message.createdAt }
            : c
        )
      );
    } catch {
      setMessageInput(text);
    }
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
            {isLoadingConversations && <p className="text-sm text-on-surface-variant">טוען שיחות...</p>}
            {!isLoadingConversations && conversations.length === 0 && (
              <p className="text-sm text-on-surface-variant">אין שיחות להצגה כרגע.</p>
            )}
            {conversations.map((chat) => (
              <div 
                key={chat.id} 
                onClick={() =>
                  openConversation({
                    id: chat.id,
                    conversationId: chat.id,
                    name: chat.peer?.name ?? 'שיחה',
                    msg: chat.lastMessage?.text ?? 'התחל שיחה חדשה',
                    time: chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '',
                    unread: (chat.unreadCount ?? 0) > 0,
                    img: 'https://picsum.photos/seed/chat/100/100',
                  })
                }
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="relative">
                  <img src={'https://picsum.photos/seed/chat/100/100'} alt={chat.peer?.name ?? 'שיחה'} className="w-12 h-12 rounded-full object-cover" />
                  {(chat.unreadCount ?? 0) > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-surface"></div>}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`font-bold ${(chat.unreadCount ?? 0) > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{chat.peer?.name ?? 'שיחה'}</h4>
                    <span className="text-xs text-on-surface-variant">{chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <p className={`text-sm ${(chat.unreadCount ?? 0) > 0 ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>{chat.lastMessage?.text ?? 'התחל שיחה חדשה'}</p>
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
                  {isLoadingMessages && <p className="text-sm text-on-surface-variant">טוען הודעות...</p>}
                  {!isLoadingMessages && chatMessages.length === 0 && (
                    <p className="text-sm text-on-surface-variant">אין הודעות בשיחה הזאת עדיין.</p>
                  )}
                  <div className="flex flex-col gap-2">
                    {chatMessages.map((message) => {
                      const isMine = message.senderId === currentUserId;
                      return (
                        <div
                          key={message.id}
                          className={`${isMine ? 'self-end bg-primary text-white rounded-tl-sm' : 'self-start bg-surface-container-low text-on-surface rounded-tr-sm'} p-3 rounded-2xl max-w-[80%]`}
                        >
                          <p className="text-sm">{message.body}</p>
                          <span className={`text-[10px] mt-1 block ${isMine ? 'text-white/70 text-left' : 'text-on-surface-variant'}`}>
                            {new Date(message.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
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
  currentUser,
  onUserUpdated,
  key 
}: { 
  onLogout: () => void, 
  onOpenMessages?: () => void,
  currentUser: UserDTO | null,
  onUserUpdated?: (user: UserDTO) => void,
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
  const [privacyVisibility, setPrivacyVisibility] = useState<VisibilityScope>(currentUser?.defaultVisibility ?? 'all');
  const [privacyPreciseEnabled, setPrivacyPreciseEnabled] = useState<boolean>(currentUser?.preciseLocationEnabled ?? true);
  const [privacySaving, setPrivacySaving] = useState(false);

  useEffect(() => {
    setPrivacyVisibility(currentUser?.defaultVisibility ?? 'all');
    setPrivacyPreciseEnabled(currentUser?.preciseLocationEnabled ?? true);
  }, [currentUser?.defaultVisibility, currentUser?.preciseLocationEnabled]);

  const handlePrivacyVisibilityChange = async (nextVisibility: VisibilityScope) => {
    setPrivacyVisibility(nextVisibility);
    setPrivacySaving(true);
    try {
      const response = await api.updateMyPrivacy({ defaultVisibility: nextVisibility });
      if (response.user) {
        onUserUpdated?.(response.user);
      }
    } finally {
      setPrivacySaving(false);
    }
  };

  const handleTogglePrecise = async () => {
    const nextPrecise = !privacyPreciseEnabled;
    setPrivacyPreciseEnabled(nextPrecise);
    setPrivacySaving(true);
    try {
      const response = await api.recordLocationConsent({ isGranted: nextPrecise, policyVersion: 'v1' });
      if (response.user) {
        onUserUpdated?.(response.user);
      }
    } finally {
      setPrivacySaving(false);
    }
  };

  const displayName = currentUser?.fullName && currentUser.fullName !== 'New User' ? currentUser.fullName : 'משתמש חדש';
  const displayGrade = currentUser?.grade && currentUser.grade !== 'unknown' ? currentUser.grade : 'לא הוגדר';
  const avatarSrc = currentUser?.avatarUrl || PROFILE_MAIN;

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
            <img alt="Profile Photo" className="w-full h-full object-cover" src={avatarSrc} />
          </div>
          <div className="absolute -bottom-1 -left-1 bg-accent w-8 h-8 rounded-full flex items-center justify-center text-on-accent shadow-[0_10px_22px_rgba(242,140,56,0.18)] border-4 border-background">
            <Pencil className="w-4 h-4 fill-current" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-primary font-manrope mb-1">{displayName}</h1>
        <p className="text-on-surface-variant font-medium mb-6">כיתה {displayGrade}</p>

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
                      <select
                        value={privacyVisibility}
                        disabled={privacySaving}
                        onChange={(e) => handlePrivacyVisibilityChange(e.target.value as VisibilityScope)}
                        className="bg-surface-container-highest text-sm font-bold text-primary rounded-lg px-3 py-2 border-none outline-none disabled:opacity-50"
                      >
                        <option value="friends">רק חברים</option>
                        <option value="grade">כל השכבה</option>
                        <option value="all">כולם</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-primary">הסתר מיקום מדויק</h4>
                        <p className="text-xs text-on-surface-variant">הצג רק אזור כללי</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleTogglePrecise}
                        disabled={privacySaving}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${privacyPreciseEnabled ? 'bg-primary' : 'bg-surface-container-high'} disabled:opacity-50`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${privacyPreciseEnabled ? 'right-1' : 'right-7'}`}></div>
                      </button>
                    </div>
                    {privacySaving && <p className="text-xs text-on-surface-variant">שומר הגדרות פרטיות...</p>}
                    <p className="text-xs text-on-surface-variant">
                      {privacyPreciseEnabled
                        ? 'מיקום מדויק יוצג רק לחברים מאושרים.'
                        : 'מיקום מדויק כבוי. תוצג רק תצוגת אזור.'}
                    </p>
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserDTO | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTab, setCurrentTab] = useState('onboarding');
  const [isOutside, setIsOutside] = useState(false);
  const [showMessagesGlobal, setShowMessagesGlobal] = useState(false);
  const [activeChatGlobal, setActiveChatGlobal] = useState<any>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [outsideConfig, setOutsideConfig] = useState({
    endTime: null as number | null,
    location: 'על הדשא הגדול',
    visibility: 'all'
  });

  const loadCurrentProfile = async (): Promise<UserDTO | null> => {
    const meResponse = await api.getMe();
    setCurrentUserProfile(meResponse.user);
    return meResponse.user;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    api.clearAuthToken();
    setCurrentUserId(null);
    setCurrentUserProfile(null);
    setCurrentTab('onboarding');
    setShowMessagesGlobal(false);
    setActiveChatGlobal(null);
  };

  const handleTabChange = (tab: string) => {
    if (currentUserId && !isProfileComplete(currentUserProfile)) {
      setCurrentTab('profile-setup');
      return;
    }
    setCurrentTab(tab);
  };

  const handleDevLogin = async () => {
    localStorage.setItem('iasa_dev_user_id', 'u4');
    setCurrentUserId('u4');
    api.setAuthToken('', 'u4');

    try {
      const profile = await loadCurrentProfile();
      setCurrentTab(isProfileComplete(profile) ? 'now' : 'profile-setup');
    } catch (_error) {
      setCurrentUserProfile(null);
      setCurrentTab('profile-setup');
    }
  };

  // Initialize auth on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('iasa_auth_token');
        if (token) {
          api.setAuthToken(token, 'temp-id');
          const { user: user_data, error } = await getCurrentUser();
          if (!error && user_data?.id) {
            setCurrentUserId(user_data.id);
            api.setAuthToken(token, user_data.id);
            const profile = await loadCurrentProfile();
            setCurrentTab(isProfileComplete(profile) ? 'now' : 'profile-setup');
            return;
          }
        }

        setCurrentTab('onboarding');
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!isInitializing && currentUserId && currentUserProfile && !isProfileComplete(currentUserProfile) && currentTab !== 'profile-setup') {
      setCurrentTab('profile-setup');
    }
  }, [isInitializing, currentUserId, currentUserProfile, currentTab]);

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

  if (isInitializing) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center px-6">
        <div className="section-card px-6 py-5 text-center max-w-sm w-full">
          <p className="text-primary text-lg font-extrabold">טוענים את הפרופיל שלך...</p>
          <p className="text-on-surface-variant text-sm mt-2">עוד רגע בפנים.</p>
        </div>
      </div>
    );
  }

  if (currentTab === 'onboarding') {
    return <OnboardingScreen onLogin={handleDevLogin} />;
  }

  if (!currentUserId) {
    return <OnboardingScreen onLogin={handleDevLogin} />;
  }

  if (currentTab === 'profile-setup') {
    return (
      <ProfileSetupWizard
        initialUser={currentUserProfile}
        onComplete={(user) => {
          setCurrentUserProfile(user);
          setCurrentTab('now');
        }}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen app-bg text-on-surface pb-[calc(6.25rem+env(safe-area-inset-bottom))] font-heebo">
      <TopNav 
        onMessagesClick={() => setShowMessagesGlobal(true)} 
        onProfileClick={() => handleTabChange('profile')}
        onNotificationsClick={() => setShowNotificationsModal(true)}
      />
      <main className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentTab === 'now' && (
            <NowScreen 
              isOutside={isOutside} 
              setIsOutside={setIsOutside} 
              outsideConfig={outsideConfig} 
              setOutsideConfig={setOutsideConfig} 
              onOpenMessages={() => setShowMessagesGlobal(true)}
              onOpenChat={handleOpenChat}
              currentUserId={currentUserId}
              currentUser={currentUserProfile}
            />
          )}
          {currentTab === 'outside' && <OutsideScreen onOpenMessages={() => setShowMessagesGlobal(true)} onOpenChat={handleOpenChat} />}
          {currentTab === 'events' && <EventsScreen onOpenMessages={() => setShowMessagesGlobal(true)} onOpenChat={handleOpenChat} />}
          {currentTab === 'profile' && (
            <ProfileScreen 
              onLogout={handleLogout}
              onOpenMessages={() => setShowMessagesGlobal(true)}
              currentUser={currentUserProfile}
              onUserUpdated={setCurrentUserProfile}
            />
          )}
        </AnimatePresence>
      </main>
      <BottomNav currentTab={currentTab} onChange={handleTabChange} />
      
      <MessageOverlay 
        showMessages={showMessagesGlobal} 
        setShowMessages={setShowMessagesGlobal} 
        activeChat={activeChatGlobal} 
        setActiveChat={setActiveChatGlobal}
        currentUserId={currentUserId}
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
