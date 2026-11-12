"use client";
import { motion } from "framer-motion";
import { stagger, item, fadeUp, fadeLeft, vp } from "@/lib/motion";
const PROJECTS = [
  {
    title: "USA Tax Filing Voice Support",
    cat: "Voice Support",
    desc: "Voice-based assistance for UK and US tax-filing workflows, supporting clear and efficient customer interactions.",
    col: "#0055ff",
    bg: "rgba(0,85,255,0.08)",
  },
  {
    title: "Healthcare Records Management",
    cat: "Healthcare",
    desc: "Healthcare record processing and information management with a focus on accuracy and confidentiality.",
    col: "#2d465e",
    bg: "rgba(0,85,255,0.08)",
  },
  {
    title: "Historical Baptism Records Index",
    cat: "Digitisation",
    desc: "Handwritten historical baptism records transcribed and indexed to support digital preservation and retrieval.",
    col: "#2d465e",
    bg: "rgba(140,164,188,0.08)",
  },
  {
    title: "USA Vital Records Processing",
    cat: "Digitisation",
    desc: "Processing and organising birth, death and marriage certificate records for digital record management.",
    col: "#0055ff",
    bg: "rgba(0,85,255,0.08)",
  },
  {
    title: "Australian Business Leads",
    cat: "Data Research",
    desc: "Business data research and contact information collection to support Australian market research.",
    col: "#2d465e",
    bg: "rgba(0,85,255,0.08)",
  },
  {
    title: "Newspaper Zoning & Indexing",
    cat: "Digitisation",
    desc: "Newspaper archive classification and indexing to make historical content easier to organise and retrieve.",
    col: "#2d465e",
    bg: "rgba(140,164,188,0.08)",
  },
  {
    title: "Filipino Civil Registry Entry",
    cat: "Data Processing",
    desc: "Data entry and verification of civil registry records, including birth, marriage and death information.",
    col: "#0055ff",
    bg: "rgba(0,85,255,0.08)",
  },
  {
    title: "Medical Billing – Exela Technologies",
    cat: "Healthcare",
    desc: "Back-office medical billing support, including claims-related data processing.",
    col: "#2d465e",
    bg: "rgba(0,85,255,0.08)",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden" style={{ background:"var(--d1)" }}>
      <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background:"radial-gradient(circle, rgba(0,85,255,0.06) 0%, transparent 70%)", transform:"translate(-20%,20%)" }}/>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
            <div className="eyebrow mb-4">Our Work</div>
            <h2 style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--ism-slate)", lineHeight:1.06 }}>
              Projects That<br /><span className="tg-main">Deliver Results</span>
            </h2>
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}
            className="max-w-md" style={{ color:"var(--text2)", fontSize:16, lineHeight:1.8 }}>
            Successful deliveries for international clients across the US, France and Australia.
          </motion.p>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROJECTS.map((p,i) => (
            <motion.div key={i} variants={item}
              className="overflow-hidden rounded-2xl group cursor-default"
              style={{ background:p.bg, border:`1px solid ${p.col}22` }}
              whileHover={{ y:-8, boxShadow:`0 24px 56px ${p.col}25`, borderColor:`${p.col}55` }}>
              <div className="p-6">
                <motion.div className="h-0.5 rounded-full mb-5" style={{ background:`linear-gradient(90deg, ${p.col}, transparent)`, width:32 }}
                  whileHover={{ width:52 }} transition={{ duration:0.3 }}/>
                <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10, color:p.col }}>{p.cat}</div>
                <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:16, color:"var(--ism-slate)", lineHeight:1.4, marginBottom:9 }}>{p.title}</h3>
                <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72 }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
