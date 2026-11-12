"use client";
import { motion } from "framer-motion";
import {
  Globe2,
  Handshake,
  Heart,
  ShieldCheck,
  TrendingUp,
  Users,
  LockKeyhole,
  Video,
  Smartphone,
  FileCheck,
  type LucideIcon,
} from "lucide-react";
import { stagger, item, fadeUp, vp } from "@/lib/motion";
import { WHY_CHOOSE } from "@/lib/data";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  Users,
  Globe2,
  TrendingUp,
  Handshake,
  Heart,
  LockKeyhole,
  Video,
  Smartphone,
  FileCheck,
};
const ACCS = ["var(--blue)","var(--cyan)","#8ca4bc","var(--blue)","var(--cyan)","#8ca4bc"];

export default function WhyChoose() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background:"var(--d3)" }}>
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none"/>
      <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 50% 100%, rgba(0,85,255,0.08) 0%, transparent 70%)" }}/>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
          <div className="eyebrow justify-center mb-4">Why Choose ISM</div>
          <h2 style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--ism-slate)" }}>
            The ISM <span className="tg-main">Advantage</span>
          </h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE.map((w,i) => {
            const Icon = ICONS[w.icon] ?? ShieldCheck;

            return (
              <motion.div key={i} variants={item} className="card-glow p-7 group" whileHover={{ y:-8 }}>
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background:`${ACCS[i]}18`, border:`1px solid ${ACCS[i]}35` }}
                  whileHover={{ rotate:[-4,4,-4,0], scale:1.12 }} transition={{ duration:0.4 }}>
                  <Icon size={21} strokeWidth={1.8} style={{ color:ACCS[i] }}/>
                </motion.div>
                <div className="h-0.5 w-8 rounded-full mb-4" style={{ background:"var(--g-main)" }}/>
                <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:17, color:"var(--ism-slate)", marginBottom:9 }}>{w.title}</h3>
                <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.75 }}>{w.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
