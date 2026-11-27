import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import About from "../components/sections/About.jsx";
import CTA from "../components/sections/CTA.jsx";
import { fadeUp, fadeLeft, vp } from "../lib/motion.js";

export default function AboutPage() {
  return (
    <main className="pt-[72px]">
      {/* ── Page Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #06132f 0%, #012367 55%, #2d465e 100%)",
          minHeight: "420px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 hex-grid opacity-30 pointer-events-none" />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "-20%",
            right: "-8%",
            width: 560,
            height: 560,
            background: "radial-gradient(circle, rgba(0,85,255,0.28) 0%, transparent 68%)",
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            bottom: "-15%",
            left: "-6%",
            width: 420,
            height: 420,
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(18px)",
          }}
          animate={{ scale: [1, 1.14, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Top rule */}
        <div
          className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(0,85,255,0.5),transparent)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-24 w-full">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Badge */}
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
                Who We Are
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
              Discover Our Story at{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg,#fff 0%,#b9d1ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ISM Data Technology
              </span>
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "clamp(1rem,1.3vw,1.1rem)",
                lineHeight: 1.8,
                maxWidth: 560,
                marginBottom: 36,
              }}
            >
              Empowering global businesses through reliable data solutions while creating
              meaningful opportunities for rural communities across Tamil Nadu, India.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  className="btn-primary"
                  style={{ color: "#fff", borderColor: "transparent" }}
                >
                  Work With Us <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/services"
                  className="btn-outline"
                  style={{ color: "#fff", borderColor: "rgba(255,255,255,0.45)" }}
                >
                  Our Services
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── About content sections (reuses existing component, skip its internal hero) ── */}
      <About />

      {/* ── CTA ── */}
      <CTA />
    </main>
  );
}
