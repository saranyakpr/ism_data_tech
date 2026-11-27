import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Globe2 } from "lucide-react";
import Projects from "../components/sections/Projects.jsx";
import GlobalReach from "../components/sections/GlobalReach.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import CTA from "../components/sections/CTA.jsx";
import { fadeLeft, stagger, item, vp } from "../lib/motion.js";

const MARKETS = ["United States", "United Kingdom", "France", "Australia"];

export default function WorkPage() {
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
            width: 580,
            height: 580,
            background: "radial-gradient(circle, rgba(0,85,255,0.26) 0%, transparent 68%)",
            filter: "blur(22px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.78, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: "-18%",
            left: "-6%",
            width: 440,
            height: 440,
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(18px)",
          }}
          animate={{ scale: [1, 1.14, 1], opacity: [0.28, 0.55, 0.28] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
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
                  Our Work
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
                Projects That{" "}
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg,#fff 0%,#b9d1ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Deliver Results
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
                Successful deliveries for international clients across the US, UK, France
                and Australia — spanning data digitisation, healthcare, voice support,
                and software development.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/contact#quote"
                    className="btn-primary"
                    style={{ color: "#fff" }}
                  >
                    Start a Project <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/services"
                    className="btn-outline"
                    style={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)" }}
                  >
                    View Services
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right — markets */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {MARKETS.map((market) => (
                <motion.div
                  key={market}
                  variants={item}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(12px)",
                  }}
                  whileHover={{ scale: 1.03, background: "rgba(0,85,255,0.15)" }}
                >
                  <Globe2
                    size={16}
                    style={{ color: "#b9d1ff", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {market}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Work content sections ── */}
      <Projects />
      <GlobalReach />
      <Testimonials />
      <CTA />
    </main>
  );
}
