import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Stars, Gift, Volume2, VolumeX, Sparkles, ChevronRight, Lock, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

const BirthdayApp = () => {
  const GF_NAME = "Agnes Jebarani";
  const TARGET_DATE = new Date(2026, 1, 9, 1, 17, 0);

  const [isBirthday, setIsBirthday] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  
  const audioRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const messages = [
    "On your special day, I just want to say how much you mean to me.",
    "You make my life beautiful, and I hope your day is as amazing as you are!",
    "Every moment with you is a blessing. Happy Birthday, My Love!",
    "To the most wonderful person I know... Stay happy always! ❤️"
  ];

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;
      if (difference <= 0) {
        setIsBirthday(true);
        return true;
      } else {
        setIsBirthday(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
        return false;
      }
    };
    const finished = calculateTime();
    if (!finished) {
      const timer = setInterval(() => {
        const isDone = calculateTime();
        if (isDone) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const triggerConfetti = () => {
    const end = Date.now() + 6 * 1000;
    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff69b4', '#ffd700', '#ffffff'] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff69b4', '#ffd700', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleOpenGift = () => {
    setIsOpen(true);
    triggerConfetti();
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio blocked", e));
    }
  };

  const sendLove = () => {
    setHeartCount(prev => prev + 1);
    confetti({
      particleCount: 15,
      angle: Math.random() * 360,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#ff0000', '#ff69b4', '#fb7185']
    });
  };

  return (
    <div className="w-screen min-h-screen bg-[#fff1f2] flex items-center justify-center m-0 p-4 overflow-hidden relative font-sans">
      <audio ref={audioRef} src="/birthday-song.mpeg" loop />

      {isOpen && Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, rotate: 0 }}
          animate={{ y: "-20vh", rotate: 360 }}
          transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay: i * 2, ease: "linear" }}
          className="absolute text-rose-200/50 pointer-events-none"
        >
          <Heart size={Math.random() * 30 + 20} fill="currentColor" />
        </motion.div>
      ))}

      <div className="w-full max-w-md z-10">
        <AnimatePresence mode="wait">
          {!isBirthday ? (
            <motion.div 
              key="countdown"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-rose-100 text-center flex flex-col items-center"
            >
              <div className="bg-rose-50 p-4 rounded-full mb-4">
                <Timer size={48} className="text-rose-500 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2 italic">Almost There!</h2>
              <p className="text-gray-500 text-sm mb-6">Something special for Agnes is arriving in...</p>
              <div className="flex gap-2">
                {Object.entries(timeLeft).map(([label, value]) => (
                  <div key={label} className="flex flex-col items-center">
                    <div className="bg-rose-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-200">
                      {value}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 mt-1">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : !isOpen ? (
            <motion.div 
              key="gift"
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 2, filter: "blur(20px)", opacity: 0 }}
              onClick={handleOpenGift}
              className="cursor-pointer bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-rose-50 flex flex-col items-center group relative overflow-hidden"
            >
              <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Gift size={130} className="text-rose-500 relative z-10" />
              </motion.div>
              <h2 className="mt-6 text-rose-500 font-black tracking-widest text-center animate-pulse">
                A SURPRISE FOR<br/>{GF_NAME.toUpperCase()}
              </h2>
            </motion.div>
          ) : (
            <motion.div
              style={{ rotateX, rotateY, perspective: 1000 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { x.set(0); y.set(0); }}
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white/90 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white relative"
            >
              <button onClick={() => { setIsMuted(!isMuted); audioRef.current.muted = !isMuted; }} className="absolute top-6 right-6 z-20 p-2 bg-rose-50 rounded-full text-rose-500">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 py-10 text-center">
                <Stars className="text-yellow-300 mx-auto mb-2" size={32} />
                <h1 className="text-3xl font-black text-white px-4 italic uppercase">Happy Birthday!</h1>
              </div>
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-36 h-36 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6">
                  <img src="/gf-photo.jpeg" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1 italic">Dearest {GF_NAME}</h2>
                <div className="h-24 flex items-center justify-center mb-4 text-gray-600 italic px-4">
                  "{messages[messageIndex]}"
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }} onClick={sendLove}
                  className="bg-rose-500 text-white px-6 py-2.5 rounded-full font-bold shadow-lg flex items-center gap-2 mb-6"
                >
                  <Heart fill="white" size={18} /> Send Love ({heartCount})
                </motion.button>
                {!showSecret ? (
                  <button onClick={() => setShowSecret(true)} className="text-rose-400 text-sm font-semibold italic flex items-center gap-1">
                    <Lock size={12} /> Secret note from me <ChevronRight size={14} />
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-rose-50 p-4 rounded-2xl text-rose-700 text-sm italic">
                    "Unna mathiri oru thanga katti kedaika naan romba kuduthu vachukanum. Always be mine! ❤️"
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BirthdayApp;
