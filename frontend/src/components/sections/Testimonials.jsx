import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp, vp } from "../../lib/motion.js";
import { TESTIMONIALS } from "../../lib/data.js";
export default function Testimonials() {
    const [cur, setCur] = useState(0);
    const [dir, setDir] = useState(1);
    const go = (n) => { setDir(n > cur ? 1 : -1); setCur((n + TESTIMONIALS.length) % TESTIMONIALS.length); };
    const t = TESTIMONIALS[cur];
    return (<section id="testimonials" className="py-24 relative overflow-hidden" style={{ background: "var(--d3)" }}>
      <div className="absolute inset-0 fine-grid opacity-40 pointer-events-none"/>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,85,255,0.07) 0%, transparent 70%)" }}/>
      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
          <div className="eyebrow justify-center mb-4">Client Testimonials</div>
          <h2 style={{ fontSize: "clamp(2rem,5vw,3.75rem)", color: "var(--ism-slate)" }}>
            Stories of <span className="tg-main">Satisfaction</span>
          </h2>
        </motion.div>

        <div style={{ minHeight: 300, position: "relative", overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div key={cur} initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }} exit={{ x: dir * -60, opacity: 0, transition: { duration: 0.3 } }} className="card-glow p-10 md:p-14 relative">
              <div style={{ fontSize: 100, lineHeight: 1, position: "absolute", top: 12, left: 24, fontFamily: "Georgia,serif", color: "var(--blue)", opacity: 0.1, pointerEvents: "none", userSelect: "none" }}>&ldquo;</div>
              <p style={{ fontSize: "clamp(1rem,2vw,1.18rem)", color: "var(--text)", lineHeight: 1.8, fontStyle: "italic", marginBottom: 36, position: "relative", zIndex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base" style={{ background: "var(--g-main)", fontFamily: "var(--font-sans)" }}>{t.initials}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 800, color: "var(--ism-slate)" }}>{t.name}</div>
                    <div style={{ color: "var(--cyan)", fontSize: 12, fontWeight: 700 }}>{t.location}</div>
                  </div>
                </div>
                <div style={{ fontSize: 16, color: "#f59e0b" }}>{"★".repeat(t.rating)}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          {[{ fn: () => go(cur - 1), icon: <ChevronLeft size={18}/> }, { fn: () => go(cur + 1), icon: <ChevronRight size={18}/> }].map((b, i) => (<motion.button key={i} onClick={b.fn} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.93 }} className="w-11 h-11 rounded-full flex items-center justify-center cursor-pointer card-dark" style={{ color: "var(--cyan)" }}>{b.icon}</motion.button>))}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (<motion.button key={i} onClick={() => go(i)} animate={{ width: i === cur ? 28 : 8, background: i === cur ? "var(--blue)" : "rgba(1,35,103,0.18)" }} style={{ height: 6, borderRadius: 4, border: "none", cursor: "pointer" }} transition={{ duration: 0.3 }}/>))}
          </div>
        </div>
      </div>
    </section>);
}
