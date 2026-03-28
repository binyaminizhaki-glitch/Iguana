import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Zap, Shield, MapPin, Bell, UserCheck } from 'lucide-react';
import { IguanaMascot } from './IguanaMascot';

const SWIPE_CONFIDENCE_THRESHOLD = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  Visual: () => React.JSX.Element;
  primaryBtn: string;
  primaryAction?: () => void;
  secondaryBtn?: string;
  secondaryAction?: () => void;
}

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  // Define steps
  // Notice RTL direction: swiping LEFT means returning to previous, swiping RIGHT means next
  // Actually, standard RTL: Next is to the Left. So swipe left -> next screen.
  
  const handleFinish = () => {
    localStorage.setItem('iguana_onboarding_completed', 'true');
    onComplete();
  };

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const requestPermissions = async () => {
    try {
      // Clean stub for permissions
      if ('Notification' in window && Notification.permission === 'default') {
        // We aren't awaiting a real permission right now so it doesn't block the UI
        // In reality, we could do await Notification.requestPermission();
      }
      if ('geolocation' in navigator) {
        // Stub
      }
    } catch (e) {
      console.warn("Permission stub failed", e);
    } finally {
      handleFinish();
    }
  };

  const slides: SlideData[] = [
    {
      id: 0,
      title: "איגואנה יודעת\nמה קורה עכשיו",
      subtitle: "האפליקציה שעוזרת לך לראות מי בחוץ, מה קורה בקמפוס, ואיך להצטרף בלי סיבוך.",
      Visual: () => <IguanaMascot className="mt-8 mb-4 scale-110" />,
      primaryBtn: "מתחילים",
      secondaryBtn: "דלג",
      secondaryAction: handleSkip
    },
    {
      id: 1,
      title: "רואים מי בחוץ,\nבזמן אמת",
      subtitle: "חברים, שכבה, קבוצות לימוד, ומפגשים שקורים עכשיו.",
      Visual: () => (
        <div className="relative w-full max-w-xs mx-auto aspect-square flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-[10%] w-[80%] bg-surface rounded-2xl shadow-xl p-4 flex items-center gap-4 rotate-[-4deg]"
          >
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
               <Users className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-surface-container rounded"></div>
              <div className="h-3 w-16 bg-surface-container-high rounded"></div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="absolute top-[42%] left-[5%] w-[85%] bg-surface rounded-2xl shadow-2xl z-10 p-4 border border-surface-container-high flex items-center gap-4 rotate-[2deg]"
          >
             <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
               <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-surface-container rounded"></div>
              <div className="h-3 w-20 bg-surface-container-high rounded"></div>
            </div>
          </motion.div>
        </div>
      ),
      primaryBtn: "הבא",
      secondaryBtn: "דלג",
      secondaryAction: handleSkip
    },
    {
      id: 2,
      title: "בלחיצה אחת,\nגם אתה בחוץ",
      subtitle: "עדכון קצר, זמן, אזור, וזהו. האנשים הנכונים יראו אותך.",
      Visual: () => (
        <div className="relative w-full max-w-[260px] mx-auto aspect-square flex items-center justify-center">
           <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-32 h-32 rounded-[40px] bg-primary-container shadow-2xl flex flex-col items-center justify-center gap-3 border-[6px] border-surface"
            >
              <motion.div 
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserCheck className="w-10 h-10 text-on-primary-container" />
              </motion.div>
              <div className="font-bold text-on-primary-container">אני בחוץ</div>
           </motion.div>
        </div>
      ),
      primaryBtn: "הבא",
      secondaryBtn: "דלג",
      secondaryAction: handleSkip
    },
    {
      id: 3,
      title: "אתה בוחר\nמה רואים עליך",
      subtitle: "רק חברים, רק שכבה, רק אזור כללי. תמיד בשליטה.",
      Visual: () => (
        <div className="relative w-full max-w-xs mx-auto flex flex-col gap-3 py-2 px-4">
           <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-surface p-4 rounded-xl shadow-sm border border-surface-container-high flex items-center gap-4">
             <Shield className="w-6 h-6 text-primary" />
             <span className="font-bold">רק חברים קרובים</span>
           </motion.div>
           <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-surface p-4 rounded-xl shadow-sm border border-surface-container-high flex items-center gap-4">
             <Users className="w-6 h-6 text-secondary" />
             <span className="font-bold">כולם בשכבה</span>
           </motion.div>
        </div>
      ),
      primaryBtn: "המשך להרשאות",
      secondaryBtn: "דלג",
      secondaryAction: handleSkip
    },
    {
      id: 4,
      title: "כדי שאיגואנה תעבוד טוב,\nצריך לאשר שני דברים",
      subtitle: "מיקום והתראות, כדי שתראה מה קורה מסביבך ותוכל להצטרף בזמן.",
      Visual: () => (
         <div className="relative w-full max-w-[320px] mx-auto flex flex-col gap-4 py-2 px-4">
           <div className="bg-surface-container-low p-5 rounded-2xl flex items-start gap-4 text-start shadow-sm border border-surface-container-high transition-transform hover:scale-[1.02]">
             <div className="mt-1 bg-primary/10 p-2.5 rounded-full"><MapPin className="w-5 h-5 text-primary" /></div>
             <div>
               <h3 className="font-bold text-lg text-primary">מיקום</h3>
               <p className="text-sm opacity-85 leading-relaxed mt-1">לדעת אילו אירועים קרובים אליך ולצרף אותך לאזורי ישיבה.</p>
             </div>
           </div>
           <div className="bg-surface-container-low p-5 rounded-2xl flex items-start gap-4 text-start shadow-sm border border-surface-container-high transition-transform hover:scale-[1.02]">
             <div className="mt-1 bg-secondary/10 p-2.5 rounded-full"><Bell className="w-5 h-5 text-secondary" /></div>
             <div>
               <h3 className="font-bold text-lg text-secondary">התראות</h3>
               <p className="text-sm opacity-85 leading-relaxed mt-1">לקבל עדכון כשחברים יוצאים או כשמתחיל אירוע מעניין.</p>
             </div>
           </div>
         </div>
      ),
      primaryBtn: "אשר והמשך",
      primaryAction: requestPermissions,
      secondaryBtn: "אולי אחר כך",
      secondaryAction: handleFinish
    }
  ];

  const currentSlide = slides[step];

  // For RTL: swipe right means dragging x > 0 (prev), left means x < 0 (next)
  // Our interface is RTL: direction="rtl" in root styling usually handles layout,
  // but framer-motion drag gestures rely on physical pixel direction.
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
      // Swiping left (next in RTL)
      handleNext();
    } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
      // Swiping right (prev in RTL)
      if (step > 0) setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#fffcf8] text-on-surface flex flex-col pt-10 sm:pt-14 overflow-hidden" dir="rtl">
      {/* Background soft color shift based on step */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-1000"
        animate={{
          backgroundColor: step === 0 ? '#fffcf8' : step === 4 ? '#f28c381a' : '#3d653e0d'
        }}
      />

      <div className="relative flex-1 w-full max-w-md mx-auto flex flex-col justify-between px-6 pt-4 h-full">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mb-8 mt-2 h-2 z-10 w-full">
          {slides.map((s, idx) => (
            <motion.div
              key={s.id}
              className={`h-2 rounded-full ${idx === step ? 'bg-primary' : 'bg-surface-container-highest'}`}
              animate={{ width: idx === step ? 24 : 8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="relative flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <div className="flex-1 flex items-center justify-center min-h-[30vh] sm:min-h-[40vh]">
                <currentSlide.Visual />
              </div>
              
              <div className="mt-auto pb-4 sm:pb-8 text-center space-y-3 sm:space-y-4">
                <motion.h1 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="text-3xl sm:text-4xl font-extrabold text-primary leading-[1.3] tracking-normal whitespace-pre-wrap px-4 drop-shadow-sm"
                >
                  {currentSlide.title}
                </motion.h1>
                <motion.p 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   className="text-base sm:text-lg opacity-85 max-w-[300px] mx-auto text-on-surface-variant font-medium leading-relaxed px-2"
                >
                  {currentSlide.subtitle}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 py-6 pb-safe z-10 bg-gradient-to-t from-[#fffcf8] via-[#fffcf8] to-transparent">
          <button
            onClick={currentSlide.primaryAction || handleNext}
            className="primary-cta w-full py-4 rounded-[28px] font-bold text-xl active:scale-[0.98] transition-all duration-300 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span>{currentSlide.primaryBtn}</span>
            {step < slides.length - 1 && <ArrowLeft className="w-5 h-5" />}
          </button>
          
          <div className="h-14 flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {currentSlide.secondaryBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={currentSlide.secondaryAction}
                  className="px-6 py-3 font-semibold text-on-surface-variant/70 hover:text-on-surface-variant active:scale-95 transition-all text-base rounded-full"
                >
                  {currentSlide.secondaryBtn}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
