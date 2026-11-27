import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Heart, Star, Sparkles } from "lucide-react";
import LifeAtISM from "../components/sections/LifeAtISM.jsx";
import CTA from "../components/sections/CTA.jsx";
import { fadeLeft, stagger, item, vp } from "../lib/motion.js";

const PILLARS = [
  { icon: Users,    label: "Collaborative Team" },
  { icon: Heart,    label: "Inclusive Culture" },
  { icon: Star,     label: "Performance Recognition" },
  { icon: Sparkles, label: "Vibrant Celebrations" },
];

export default function LifeAtISMPage() {
  return (
    <main className="pt-[72px]">
      {/* ── Page Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #06132f 0%, #012367 55%, #2d465e 100%)",
          minHeight: "440px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "-20%",
            right: "-8%",
            width: 560,
            height: 560,
            background: "radial-gradient(circle, rgba(0,85,255,0.26) 0%, transparent 68%)",
            filter: "blur(22px)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: "-18%",
            left: "-6%",
            width: 420,
            height: 420,
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            filter: "blur(18px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.58, 0.28] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(0,85,255,0.5),transparent)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div variants={fadeLeft} initial="hidden" animate="show">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(0,85,255,0.18)",
                  border: "1px solid rgba(117,165,255,0.34)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#b9d1ff", animation: "pulseDot 2s ease-in-out infinite" }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#b9d1ff",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Life at ISM
                </span>
              </motion.div>

              <h1
                style={{
                  fontSize: "clamp(2.5rem,6.5vw,4.75rem)",
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.04,
                  marginBottom: 20,
                }}
              >
                More Than Work.{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg,#fff 0%,#b9d1ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  It&apos;s a Community.
                </span>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.82)",
                  fontSize: "clamp(1rem,1.3vw,1.1rem)",
                  lineHeight: 1.8,
                  maxWidth: 520,
                  marginBottom: 36,
                }}
              >
                At ISM Data Technology, we build more than a workplace. From Onam
                celebrations to team outings and performance awards — these are the
                moments that define who we are.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/careers"
                    className="btn-primary"
                    style={{ color: "#fff" }}
                  >
                    Join Our Team <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/about"
                    className="btn-outline"
                    style={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)" }}
                  >
                    About ISM
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — culture pillars */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {PILLARS.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  variants={item}
                  className="flex flex-col items-center justify-center gap-3 px-5 py-6 rounded-2xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                  }}
                  whileHover={{ scale: 1.04, background: "rgba(0,85,255,0.15)" }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(0,85,255,0.2)",
                      border: "1px solid rgba(0,85,255,0.35)",
                    }}
                  >
                    <Icon size={19} style={{ color: "#b9d1ff" }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.88)",
                      lineHeight: 1.3,
                    }}
                  >
                    {label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Life at ISM content ── */}
      <LifeAtISM />
      <CTA />
    </main>
  );
}
