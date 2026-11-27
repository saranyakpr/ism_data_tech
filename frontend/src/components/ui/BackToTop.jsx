"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.65, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.65, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-6 z-50 w-13 h-13 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            width: 52,
            height: 52,
            background: "linear-gradient(135deg, #012367 0%, #0055ff 100%)",
            color: "#ffffff",
            border: "2px solid rgba(255,255,255,0.35)",
            boxShadow:
              "0 8px 28px rgba(0,85,255,0.55), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={22} strokeWidth={2.5} color="#ffffff" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
