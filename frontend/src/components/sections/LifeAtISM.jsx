import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeUp, fadeLeft, vp } from "../../lib/motion.js";

const CATEGORY_ACCENT = {
  brainstorming: "#0055ff",
  cultural: "#0055ff",
  outing: "#8ca4bc",
  fun: "#0055ff",
};

const CATEGORY_LABEL = {
  brainstorming: "Brainstorming",
  cultural: "Cultural Events",
  outing: "Team Outings",
  fun: "Workplace Fun",
};

const FILTERS = [
  { value: "all", label: "All Moments" },
  { value: "brainstorming", label: "Brainstorming" },
  { value: "cultural", label: "Cultural Events" },
  { value: "outing", label: "Team Outings" },
  { value: "fun", label: "Workplace Fun" },
];

/* ─── Lightbox ──────────────────────────────────── */
function Lightbox({ item, onClose, onPrev, onNext, index, total }) {
  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(6,9,17,0.97)", backdropFilter: "blur(24px)" }}
      onClick={onClose} role="dialog" aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden w-full max-w-3xl"
        style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.7)", border: "1px solid rgba(0,85,255,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative" style={{ aspectRatio: "16/9", background: "var(--d0)" }}>
          <img src={item.src} alt={item.caption} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(6,9,17,0.65) 0%,transparent 55%)" }} />
        </div>
        <div className="p-6 sm:p-8" style={{ background: "var(--d2)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: `${item.accent}18`, color: item.accent, border: `1px solid ${item.accent}35` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.accent }} />
              {item.categoryLabel}
            </span>
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text3)" }}>{index + 1} / {total}</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 20, color: "var(--ism-slate)", marginBottom: 6 }}>{item.title}</h2>
          <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7 }}>{item.caption}</p>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 10 }}>← → navigate · Esc close</p>
        </div>
      </motion.div>

      <button onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,85,255,0.15)", border: "1px solid rgba(0,85,255,0.3)", color: "#fff" }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,85,255,0.15)", border: "1px solid rgba(0,85,255,0.3)", color: "#fff" }}>
        <ChevronRight size={20} />
      </button>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,85,255,0.15)", border: "1px solid rgba(0,85,255,0.3)", color: "#fff" }}>
        <X size={18} />
      </button>
    </motion.div>
  );
}

/* ─── Single carousel card ──────────────────────── */
function CarouselCard({ item, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer flex-shrink-0"
      style={{
        width: "100%", aspectRatio: "4/3",
        border: `1px solid ${hov ? item.accent + "50" : "rgba(255,255,255,0.07)"}`,
        transition: "border-color .3s, box-shadow .3s",
        boxShadow: hov ? `0 20px 50px rgba(0,85,255,0.2)` : "0 4px 16px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onClick()}
      tabIndex={0} role="button" aria-label={`Open ${item.title}`}
    >
      <div className="absolute inset-0" style={{ transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform .65s ease" }}>
        <img src={item.src} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top,rgba(6,9,17,0.88) 0%,rgba(6,9,17,0.2) 50%,transparent 80%)",
        opacity: hov ? 1 : 0.78, transition: "opacity .3s",
      }} />
      <motion.div className="absolute top-3 left-3" animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
          style={{ background: "rgba(8,13,27,0.84)", backdropFilter: "blur(10px)", color: "#e1e9f5", border: `1px solid ${item.accent}65` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.accent }} />
          {item.categoryLabel}
        </span>
      </motion.div>
      <motion.div className="absolute top-3 right-3" animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.75 }} transition={{ duration: 0.2 }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(8,13,27,0.75)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)" }}>
          <ZoomIn size={14} color="#fff" />
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 3, lineHeight: 1.25 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}>{item.caption}</p>
      </div>
    </div>
  );
}

/* ─── Carousel ──────────────────────────────────── */
function Carousel({ items }) {
  const [current, setCurrent] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const dragStart = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);

  const prev = useCallback(() => setCurrent(i => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % items.length), [items.length]);

  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => { setCurrent(0); }, [items]);

  useEffect(() => {
    if (shouldReduceMotion || isPaused || lightboxIdx !== null || items.length < 2) return;
    const id = window.setInterval(next, 3000);
    return () => window.clearInterval(id);
  }, [isPaused, items.length, lightboxIdx, next, shouldReduceMotion]);

  const onDragStart = (x) => { dragStart.current = x; };
  const onDragEnd = (x) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - x;
    if (Math.abs(delta) > 40) { delta > 0 ? next() : prev(); }
    dragStart.current = null;
  };
  const lbPrev = () => setLightboxIdx(i => i !== null ? (i - 1 + items.length) % items.length : null);
  const lbNext = () => setLightboxIdx(i => i !== null ? (i + 1) % items.length : null);

  return (
    <div>
      <div className="relative overflow-hidden" role="region" aria-label="Life at ISM photo gallery"
        onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
        onMouseDown={e => onDragStart(e.clientX)} onMouseUp={e => onDragEnd(e.clientX)}
        onTouchStart={e => { setIsPaused(true); onDragStart(e.touches[0].clientX); }}
        onTouchEnd={e => { onDragEnd(e.changedTouches[0].clientX); setIsPaused(false); }}
        style={{ cursor: "grab", userSelect: "none", touchAction: "pan-y" }}>
        <div className="relative h-[clamp(250px,40vw,440px)]">
          {items.map((it, index) => {
            let offset = (index - current + items.length) % items.length;
            if (offset > items.length / 2) offset -= items.length;
            const isVisible = Math.abs(offset) <= 2;
            return (
              <div key={it.id} aria-hidden={!isVisible}
                className="absolute top-1/2"
                style={{
                  width: "min(82vw, 560px)", left: "50%",
                  zIndex: 10 - Math.abs(offset),
                  pointerEvents: isVisible ? "auto" : "none",
                  transformOrigin: "center center", willChange: "transform, opacity",
                  transform: `translate(-50%, -50%) translateX(${offset * 58}%) scale(${offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.84 : 0.7}) rotate(${offset === 0 ? 0 : offset < 0 ? 1 : -1}deg)`,
                  opacity: offset === 0 ? 1 : isVisible ? Math.abs(offset) === 1 ? 0.78 : 0.4 : 0,
                  transition: !hasMounted || shouldReduceMotion ? "none" : "transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease",
                }}>
                <CarouselCard item={it} onClick={() => setLightboxIdx(index)} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <motion.button onClick={prev} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          aria-label="Previous photos"
          style={{ background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.3)", color: "var(--ism-navy)" }}>
          <ChevronLeft size={18} />
        </motion.button>
        <div className="flex gap-2 items-center">
          {items.map((item, i) => (
            <button key={item.id} onClick={() => setCurrent(i)} aria-label={`Show photo ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              style={{
                width: i === current ? 24 : 7, height: 7, borderRadius: 4,
                background: i === current ? "var(--blue)" : "rgba(1,35,103,0.18)",
                border: "none", cursor: "pointer", transition: "all .3s",
              }} />
          ))}
        </div>
        <motion.button onClick={next} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          aria-label="Next photos"
          style={{ background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.3)", color: "var(--ism-navy)" }}>
          <ChevronRight size={18} />
        </motion.button>
      </div>
      <p className="text-center mt-3" style={{ fontSize: 14, color: "var(--text2)" }}>
        Photo {current + 1} of {items.length}
      </p>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox item={items[lightboxIdx]} index={lightboxIdx} total={items.length}
            onClose={() => setLightboxIdx(null)} onPrev={lbPrev} onNext={lbNext} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main section ──────────────────────────────── */
export default function LifeAtISM() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch published photos from the API
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/life-at-ism");
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const photos = (data.photos ?? []).map((p) => ({
          id: p.id,
          title: p.title,
          caption: p.caption ?? "",
          category: p.category,
          categoryLabel: CATEGORY_LABEL[p.category] ?? p.category,
          src: p.image_url,
          accent: CATEGORY_ACCENT[p.category] ?? "#0055ff",
        }));
        setItems(photos);
      } catch {
        // Silently fail — section stays empty rather than crashing
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === "all" ? items : items.filter(i => i.category === filter);

  return (
    <section id="life" className="py-24 relative overflow-hidden" style={{ background: "var(--d2)" }}>
      <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,85,255,0.08) 0%, transparent 70%)", transform: "translate(20%,-20%)" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-12">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
            <div className="eyebrow mb-5">Life at ISM</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.75rem)", color: "var(--ism-slate)", lineHeight: 1.06 }}>
              More Than Work.<br />
              <em style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>It&apos;s a Community.</em>
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}>
            <p style={{ color: "var(--text2)", lineHeight: 1.82, fontSize: 17, marginBottom: 16 }}>
              At ISM Data Technology, exceptional results come from people who feel valued, inspired and connected.
              We celebrate wins, honour culture and build more than a workplace — we build a community.
            </p>
            <p style={{ color: "var(--text2)", lineHeight: 1.82, fontSize: 17 }}>
              From Onam celebrations to outdoor adventures, performer recognitions to team lunches — these are the moments that define us.
            </p>
          </motion.div>
        </div>

        {/* Category filters */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}
          className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
          {FILTERS.map(f => (
            <motion.button key={f.value} onClick={() => setFilter(f.value)} whileTap={{ scale: 0.96 }}
              className="px-4 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer"
              style={{
                fontFamily: "var(--font-sans)",
                background: filter === f.value ? "linear-gradient(135deg,#012367,#0055ff)" : "rgba(1,35,103,0.04)",
                color: filter === f.value ? "#fff" : "var(--text2)",
                border: filter === f.value ? "none" : "1px solid rgba(1,35,103,0.14)",
                boxShadow: filter === f.value ? "0 4px 18px rgba(0,85,255,0.35)" : "none",
              }} aria-pressed={filter === f.value}>
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery */}
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {loading ? (
              <div className="text-center py-16" style={{ color: "var(--text3)", fontSize: 14 }}>
                Loading gallery…
              </div>
            ) : filtered.length > 0 ? (
              <Carousel items={filtered} />
            ) : (
              <div className="text-center py-16" style={{ color: "var(--text3)" }}>
                No photos in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stats strip */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}
          className="mt-14 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          style={{ background: "linear-gradient(135deg,#012367,#0055ff)", boxShadow: "0 16px 48px rgba(0,85,255,0.3)" }}>
          {[["100%", "Skilled Team"], ["4", "Culture Pillars"], ["2024", "Founded"], ["∞", "Growth Opportunities"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: "clamp(1.5rem,3vw,2.25rem)", color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 14, color: "#fff", marginTop: 6, fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
