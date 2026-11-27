import { motion } from "framer-motion";
import { stagger, item, fadeUp, vp } from "../../lib/motion.js";
import AnimatedCounter from "../ui/AnimatedCounter.jsx";
import { COMPANY_INFO } from "../../lib/data.js";
export default function TrustStats() {
    return (<section className="py-20 relative overflow-hidden" style={{ background: "var(--d2)" }}>
      <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none"/>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(0,85,255,0.4),transparent)" }}/>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="lg:col-span-2">
            <div className="eyebrow mb-4">By the Numbers</div>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", color: "var(--ism-slate)", marginBottom: 12 }}>
              Performance You<br /><span className="tg-main">Can Count On</span>
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 16, lineHeight: 1.8 }}>
              Verified metrics from day one. Honest, consistent delivery across every project and client.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="lg:col-span-3 grid grid-cols-2 gap-4">
            {COMPANY_INFO.stats.map((s, i) => (<motion.div key={i} variants={item} className="card-glow p-6 group" whileHover={{ scale: 1.03 }}>
                <div style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 42, letterSpacing: "-0.03em", lineHeight: 1, background: "var(--g-text)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <AnimatedCounter end={s.value} suffix={s.suffix}/>
                </div>
                <div style={{ fontSize: 15, color: "var(--text2)", fontWeight: 600, marginTop: 8 }}>{s.label}</div>
              </motion.div>))}
          </motion.div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(0,85,255,0.3),transparent)" }}/>
    </section>);
}
