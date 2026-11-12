"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { stagger, item, fadeLeft, vp } from "@/lib/motion";
import { CLIENT_LOCATIONS } from "@/lib/data";

const NODES = [
  { id:"india",  label:"India HQ",      x:64, y:52, r:10, main:true,  c:"var(--blue)" },
  { id:"usa",    label:"United States", x:16, y:35, r:7,  main:false, c:"var(--cyan)" },
  { id:"uk",     label:"United Kingdom", x:39, y:19, r:7, main:false, c:"var(--cyan)" },
  { id:"france", label:"France",        x:47, y:27, r:7,  main:false, c:"#8ca4bc" },
  { id:"aus",    label:"Australia",     x:78, y:70, r:7,  main:false, c:"var(--cyan)" },
];
const LINES = [
  ["india", "usa"],
  ["india", "uk"],
  ["india", "france"],
  ["india", "aus"],
];
const g=(id:string)=>NODES.find(n=>n.id===id)!;

export default function GlobalReach() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background:"var(--d2)" }}>
      <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none"/>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background:"radial-gradient(circle, rgba(0,85,255,0.07) 0%, transparent 70%)" }}/>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
            <div className="eyebrow mb-6">International Reach</div>
            <h2 style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--ism-slate)", marginBottom:16, lineHeight:1.06 }}>
              Serving Clients<br /><span className="tg-cyan">Across the Globe</span>
            </h2>
            <p style={{ color:"var(--text2)", lineHeight:1.82, fontSize:17, marginBottom:30 }}>
              Based in Tenkasi, Tamil Nadu — delivering precision data services to verified international clients across three continents.
            </p>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="space-y-3">
              {CLIENT_LOCATIONS.map(loc=>(
                <motion.div key={loc.country} variants={item}
                  className="flex items-center gap-4 p-4 rounded-2xl cursor-default card-dark"
                  whileHover={{ x:6, borderColor:"rgba(0,85,255,0.3)" }}>
                  <MapPin size={22} strokeWidth={1.8} style={{ color:"var(--cyan)", flexShrink:0 }}/>
                  <div>
                    <div style={{ color:"var(--ism-slate)", fontWeight:800, fontSize:16, fontFamily:"var(--font-sans)" }}>{loc.country}</div>
                    <div style={{ color:"var(--text2)", fontSize:14 }}>{loc.description}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }}
            viewport={vp} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}>
            <div className="relative rounded-3xl overflow-hidden p-6 card-dark"
              style={{ aspectRatio:"1/1", maxWidth:460, margin:"0 auto" }}>
              <div className="absolute inset-0 dot-grid opacity-40"/>
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0055ff" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#0055ff" stopOpacity="0.5"/>
                  </linearGradient>
                </defs>
                {LINES.map(([f,t],i)=>{
                  const a=g(f),b=g(t);
                  return (
                    <motion.line key={i}
                      x1={`${a.x}%`} y1={`${a.y}%`} x2={`${b.x}%`} y2={`${b.y}%`}
                      stroke="url(#rg1)" strokeWidth="1.5" strokeDasharray="6 4"
                      initial={{ pathLength:0, opacity:0 }}
                      whileInView={{ pathLength:1, opacity:1 }}
                      viewport={{ once:false }}
                      transition={{ duration:1.8, delay:i*0.3 }}
                    />
                  );
                })}
              </svg>
              {NODES.map((n,i)=>(
                <motion.div key={n.id}
                  className="absolute flex flex-col items-center"
                  style={{ left:`${n.x}%`, top:`${n.y}%`, transform:"translate(-50%,-50%)" }}
                  initial={{ scale:0, opacity:0 }}
                  whileInView={{ scale:1, opacity:1 }}
                  viewport={{ once:false }}
                  transition={{ delay:0.3+i*0.15, type:"spring", stiffness:260 }}>
                  <motion.div className="rounded-full"
                    style={{ width:n.r*2, height:n.r*2, background:n.c, boxShadow:`0 0 20px ${n.c}` }}
                    animate={{ scale:[1,1.5,1] }} transition={{ duration:2.5+i*0.4, repeat:Infinity, ease:"easeInOut" }}/>
                  <div className="mt-1.5 px-2 py-0.5 rounded-lg text-center"
                    style={{ background:"rgba(8,13,27,0.88)", border:`1px solid ${n.c}40` }}>
                    <span style={{ fontSize:12, fontWeight:700, color:"#e1e9f5", whiteSpace:"nowrap" }}>{n.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
