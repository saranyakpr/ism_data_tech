
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CLIENT_LOCATIONS, COMPANY_INFO } from "@/lib/data";

/* ── Premium AI visual ─────────────────── */

function DataNetwork({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

      {/* Ambient glow */}
      <div
        className="absolute w-[75%] aspect-square rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(65,105,255,0.22), rgba(139,92,246,0.12) 45%, transparent 72%)",
          filter: "blur(35px)",
        }}
      />

      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-[78%] aspect-square rounded-full"
        style={{
          border: "1px solid rgba(130,155,255,0.22)",
          boxShadow: "0 0 35px rgba(75,100,255,0.08)",
        }}
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute top-[10%] left-[14%] w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
      </motion.div>

      {/* Middle rotating ring */}
      <motion.div
        className="absolute w-[62%] aspect-square rounded-full"
        style={{
          border: "1px solid rgba(167,139,250,0.3)",
        }}
        animate={reducedMotion ? {} : { rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute top-[5%] left-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_18px_#a78bfa]" />
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute w-[48%] aspect-square rounded-full"
        style={{
          border: "1px solid rgba(96,165,250,0.3)",
        }}
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Central glass orb */}
      <motion.div
        className="relative z-10 w-[34%] max-w-[175px] aspect-square rounded-full flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 32% 25%, rgba(191,219,254,0.95), rgba(59,130,246,0.65) 24%, rgba(49,46,129,0.9) 58%, rgba(10,18,55,0.98) 100%)",
          border: "1px solid rgba(191,219,254,0.5)",
          boxShadow:
            "0 0 45px rgba(59,130,246,0.4), 0 0 100px rgba(124,58,237,0.22), inset -12px -15px 35px rgba(5,10,40,0.65), inset 8px 8px 25px rgba(255,255,255,0.18)",
        }}
        animate={
          reducedMotion
            ? {}
            : { y: [0, -9, 0], scale: [1, 1.025, 1] }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="text-center">
          <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            AI
          </div>
          <div className="text-[9px] sm:text-[10px] tracking-[0.3em] text-blue-100 mt-1">
            INTELLIGENCE
          </div>
        </div>
      </motion.div>

      {/* Light accents */}
      <motion.div
        className="absolute top-[22%] right-[22%] w-3 h-3 rounded-full"
        style={{
          background: "#a78bfa",
          boxShadow: "0 0 25px #8b5cf6",
        }}
        animate={reducedMotion ? {} : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-[24%] left-[18%] w-2 h-2 rounded-full"
        style={{
          background: "#60a5fa",
          boxShadow: "0 0 20px #3b82f6",
        }}
        animate={reducedMotion ? {} : { opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

     
    </div>
  );
}

/* ── Floating information card ─────────── */

function FloatingCard({
  title,
  subtitle,
  className,
  reducedMotion,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  className: string;
  reducedMotion: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute z-20 rounded-xl px-4 py-3 ${className}`}
      style={{
        background: "rgba(12,25,58,0.85)",
        border: "1px solid rgba(96,165,250,0.3)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, -7, 0] }
      }
      transition={{
        opacity: { duration: 0.7, delay },
        y: {
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <p className="text-xs font-bold text-white">{title}</p>
      <p className="text-[10px] text-blue-200 mt-1">{subtitle}</p>
    </motion.div>
  );
}

/* ── Hero statistics ───────────────────── */

const HERO_STATS = [
  {
    value: String(CLIENT_LOCATIONS.length),
    label: "Documented Markets",
  },
  {
    value: COMPANY_INFO.launchDate.slice(-4),
    label: "Established",
  },
  {
    value: null,
    label: "Seats",
  },
  {
    value: null,
    label: "Team Members",
  },
  {
    value: null,
    label: "Records Processed",
  },
];

/* ── Ticker items ──────────────────────── */

const TICKER = [
  "Data Entry",
  "EPUB Conversion",
  "Healthcare Records",
  "Vital Records USA",
  "Voice Support",
  "Australian Leads",
  "XML Processing",
  "Baptism Indexing",
  "Newspaper Zoning",
];

/* ── Headline lines ────────────────────── */

const LINES = [
  { text: "AI, Data &", serif: false },
  { text: "Technology", serif: true },
  { text: "for Global Business.", grad: true },
];

/* ── Main Hero component ───────────────── */

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, {
    stiffness: 20,
    damping: 30,
  });

  const sy = useSpring(my, {
    stiffness: 20,
    damping: 30,
  });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 58]
  );

  const mediaScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.04, 1.12]
  );

  const prefersReducedMotion = useReducedMotion() ?? false;

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;

    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();

    mx.set(((event.clientX - left) / width - 0.5) * 20);
    my.set(((event.clientY - top) / height - 0.5) * 20);
  };

  return (
    <section
      ref={heroRef}
      className="hero-section relative overflow-hidden"
      style={{
        background: "var(--d1)",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* Background */}
      <motion.div
        className="hero-media"
        aria-hidden="true"
        style={{
          y: prefersReducedMotion ? 0 : mediaY,
          scale: prefersReducedMotion ? 1 : mediaScale,
          background:
            "linear-gradient(135deg, #06132f 0%, #012367 55%, #2d465e 100%)",
        }}
      />

      <div className="hero-media-overlay" aria-hidden="true" />

      {/* Ambient lighting */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: "var(--g-hero)" }}
        />

        <div className="absolute inset-0 hex-grid opacity-40" />

        {/* Blue ambient glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: "-20%",
            right: "-10%",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(0,85,255,0.22) 0%, transparent 68%)",
            filter: "blur(15px)",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.12, 1],
                  opacity: [0.5, 0.8, 0.5],
                }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Purple ambient glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            bottom: "-15%",
            left: "-10%",
            width: 550,
            height: 550,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(15px)",
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.65, 0.35],
                }
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Top highlight */}
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(0,85,255,0.8), transparent)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center max-w-7xl mx-auto w-full px-5 sm:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center w-full">

          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-7"
              style={{
                background: "rgba(0,85,255,0.18)",
                border: "1px solid rgba(117,165,255,0.34)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--cyan)",
                  animation: prefersReducedMotion
                    ? "none"
                    : "pulseDot 2s ease-in-out infinite",
                }}
              />

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--cyan)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Global Data & IT Services
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="mb-8">
              {LINES.map((line, index) => (
                <div
                  key={index}
                  style={{ overflow: "hidden", lineHeight: 1 }}
                >
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? false
                        : { y: "115%", opacity: 0 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.85,
                      delay: prefersReducedMotion
                        ? 0
                        : 0.12 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      display: "block",
                      fontFamily: line.serif
                        ? "var(--font-serif)"
                        : "var(--font-sans)",
                      fontStyle: line.serif ? "italic" : "normal",
                      fontWeight: 800,
                      fontSize: "clamp(2.45rem, 6.2vw, 4.9rem)",
                      lineHeight: 1.06,
                      letterSpacing: "-0.04em",
                      paddingBottom: "0.04em",
                      color: line.grad ? "transparent" : "var(--white)",
                      backgroundImage: line.grad
                        ? "linear-gradient(135deg,#fff 0%,#b9d1ff 100%)"
                        : "none",
                      WebkitBackgroundClip: line.grad ? "text" : "unset",
                      WebkitTextFillColor: line.grad
                        ? "transparent"
                        : "unset",
                      backgroundClip: line.grad ? "text" : "unset",
                    }}
                  >
                    {line.text}
                  </motion.div>
                </div>
              ))}
            </h1>

            {/* Description */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.65 }}
              style={{
                color: "#e1e9f5",
                fontSize: "clamp(1rem,1.35vw,1.15rem)",
                lineHeight: 1.8,
                maxWidth: 500,
                marginBottom: 36,
              }}
            >
              AI data services, healthcare billing, document and archive
              digitisation, and IT/software development for clients across the
              UK, US and Australia. We help teams improve accuracy and scale
              with dependable delivery.
            </motion.p>

            {/* Working hours */}
            <p
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: 13,
                lineHeight: 1.6,
                marginTop: -20,
                marginBottom: 28,
              }}
            >
              Operations 24/7 (3 shifts) · Sales desk Mon–Sat 9 AM–6 PM IST
            </p>

            {/* Buttons */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <Link href="/#services" className="btn-primary">
                  Explore Services <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <Link href="/contact" className="btn-outline">
                  Let&apos;s Talk <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="flex flex-wrap gap-8 pt-7"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {HERO_STATS.filter((stat) => stat.value !== null).map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 800,
                      fontSize: 22,
                      letterSpacing: "-0.02em",
                      background:
                        "linear-gradient(135deg,#fff 0%,#b9d1ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text2)",
                      fontWeight: 600,
                      marginTop: 3,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT TECHNOLOGY VISUAL */}
          <motion.div
            style={{
              x: prefersReducedMotion ? 0 : sx,
              y: prefersReducedMotion ? 0 : sy,
            }}
            className="relative block w-full h-[300px] sm:h-[400px] lg:h-[480px] max-w-[520px] mx-auto lg:mx-0"
          >
            <DataNetwork reducedMotion={prefersReducedMotion} />

            <FloatingCard
              title="AI Solutions"
              subtitle="Intelligent data services"
              className="top-[12%] right-0 sm:right-[-2%]"
              reducedMotion={prefersReducedMotion}
              delay={0.8}
            />

            <FloatingCard
              title="Global Operations"
              subtitle="Serving international clients"
              className="bottom-[23%] left-0 sm:left-[-2%]"
              reducedMotion={prefersReducedMotion}
              delay={1.2}
            />

            <FloatingCard
              title="Secure Data"
              subtitle="Confidential operations"
              className="bottom-[7%] right-[3%]"
              reducedMotion={prefersReducedMotion}
              delay={1.5}
            />
          </motion.div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div
        className="relative z-10 w-full overflow-hidden py-3.5"
        style={{
          borderTop: "1px solid rgba(0,85,255,0.15)",
          background: "rgba(8,13,27,0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="anim-marquee flex gap-10 w-max">
          {[...TICKER, ...TICKER].map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
              style={{ color: "var(--text3)" }}
            >
              {item}
              <span style={{ color: "var(--blue)", fontSize: 8 }}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
