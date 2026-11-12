"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Eye, Target } from "lucide-react";
import { fadeUp, fadeLeft, fadeRight, stagger, item, vp } from "@/lib/motion";
import { TIMELINE, COMPANY_INFO } from "@/lib/data";

export default function About() {
  return (
    <section id="about">
      {/* ── Intro + MVV (dark section) ── */}
      <div className="py-24 relative overflow-hidden" style={{ background:"var(--d2)" }}>
        <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none"/>
        <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
          style={{ background:"radial-gradient(circle, rgba(140,164,188,0.08) 0%, transparent 70%)", transform:"translate(20%,-20%)" }}/>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp}>
              <div className="eyebrow mb-5">About ISM</div>
              <h2 style={{ fontSize:"clamp(2rem,5vw,3.75rem)", color:"var(--ism-slate)", marginBottom:20, lineHeight:1.06 }}>
                Building Accurate<br />
                <em style={{ fontFamily:"var(--font-serif)", fontStyle:"italic", fontWeight:400 }}>Data Services,</em><br />
                Brighter Futures for Rural Communities
              </h2>
              <p style={{ color:"var(--text2)", lineHeight:1.82, fontSize:17, maxWidth:500 }}>
                Providing end-to-end data services with accuracy and efficiency, helping international clients make informed decisions while creating meaningful employment for rural communities in India.
              </p>
            </motion.div>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={vp} className="space-y-4">
              {[
                { icon:Target, t:"Our Mission", c:"var(--blue)",  d:"Deliver smart, reliable data services that meet global standards — combining innovation with social responsibility." },
                { icon:Eye, t:"Our Vision",  c:"var(--cyan)",  d:"To be a trusted global leader in data solutions, known for precision and excellence, while fostering community growth." },
                { icon:Award, t:"Our Values",  c:"#8ca4bc",       d:"Excellence in quality, a client-centric approach, and a commitment to empowering rural women professionals." },
              ].map(c => (
                <motion.div key={c.t} variants={item}
                  className="card-glow p-5 flex gap-4"
                  whileHover={{ x:6, borderColor:"rgba(0,85,255,0.4)" }}>
                  <c.icon size={21} strokeWidth={1.8} style={{ color:c.c, flexShrink:0, marginTop:2 }}/>
                  <div>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:16, color:"var(--ism-slate)", marginBottom:5 }}>
                      {c.t}
                    </div>
                    <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72 }}>{c.d}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          </div>
          </div>
                
        

      {/* ── CEO portrait (deeper dark) ── */}
      <div className="py-24 relative overflow-hidden" style={{ background:"var(--d1)" }}>
        <div className="absolute inset-0 fine-grid opacity-40 pointer-events-none"/>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"radial-gradient(ellipse at 70% 50%, rgba(0,85,255,0.07) 0%, transparent 65%)" }}/>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
            <div className="eyebrow justify-center mb-3">Meet Our Leadership</div>
            <h2 style={{ fontSize:"clamp(1.75rem,4vw,3rem)", color:"var(--ism-slate)" }}>
              The Vision Behind <span className="tg-main">ISM Data Technology</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Bio */}
            <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp} className="order-2 lg:order-1">
              <div className="mb-7">
                <div className="relative inline-block" style={{ width:52, height:52, borderRadius:12, overflow:"hidden", border:"1px solid rgba(0,85,255,0.3)" }}>
                  <Image src="/images/brand/ismicon.jpeg" alt="ISM Data Technology" fill sizes="52px" className="object-contain"/>
                </div>
              </div>
              <h3 style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:"clamp(1.75rem,3.5vw,2.5rem)", color:"var(--ism-slate)", lineHeight:1.1, letterSpacing:"-0.025em", marginBottom:10 }}>
                {COMPANY_INFO.founder.name}
              </h3>
              <div className="mb-6">
                <span style={{ display:"inline-block", padding:"5px 16px", borderRadius:9999, fontSize:12, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", background:"rgba(0,85,255,0.12)", color:"var(--cyan)", border:"1px solid rgba(0,85,255,0.25)" }}>
                  {COMPANY_INFO.founder.title}
                </span>
              </div>
              <p style={{ color:"var(--text2)", lineHeight:1.85, fontSize:17, marginBottom:16 }}>
                Visionary leader driving ISM Data Technology&apos;s mission to deliver world-class data solutions while creating meaningful employment for rural women professionals across Tamil Nadu, India.
              </p>
              <p style={{ color:"var(--text2)", lineHeight:1.85, fontSize:17, marginBottom:32 }}>
                Under his leadership, ISM has grown from a local startup to a trusted international partner — serving clients across the United States, France and Australia since August 2024.
              </p>
              <div className="flex flex-wrap gap-3">
                {[["2024","Founded"],["3+","Partners"],["100%","Skilled"]].map(([v,l]) => (
                  <div key={l} className="px-4 py-2.5 rounded-2xl text-center card-glow" style={{ minWidth:88 }}>
                    <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:19, letterSpacing:"-0.02em", lineHeight:1, background:"var(--g-text)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
                    <div style={{ fontSize:12, color:"var(--text2)", fontWeight:600, marginTop:4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Portrait */}
            <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={vp}
              className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative" style={{ width:"100%", maxWidth:460 }}>
                <div className="absolute pointer-events-none"
                  style={{ inset:-24, borderRadius:36, background:"linear-gradient(135deg,rgba(0,85,255,0.15),rgba(140,164,188,0.10))", filter:"blur(36px)", zIndex:0 }}/>
                <motion.div
                  initial={{ opacity:0, scale:0.97 }}
                  whileInView={{ opacity:1, scale:1 }}
                  viewport={{ once:false, amount:0.2 }}
                  whileHover={{ scale:1.02 }}
                  transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
                  style={{ position:"relative", width:"100%", aspectRatio:"958 / 968", borderRadius:24, overflow:"hidden", boxShadow:"0 24px 60px rgba(1,35,103,0.18), 0 0 0 1px rgba(0,85,255,0.2)", zIndex:1 }}>
                  <Image src="/images/team/founder.jpeg"
                    alt="Mr. Muthu Kulathur — Founder & CEO of ISM Data Technology"
                    fill sizes="(max-width:640px) 90vw,(max-width:1024px) 50vw,460px"
                    className="object-contain" priority/>
                </motion.div>
                <motion.div
                  initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:false }} transition={{ delay:0.55, duration:0.5 }}
                  className="absolute left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl text-center whitespace-nowrap card-glow"
                  style={{ bottom:-20, zIndex:2 }}>
                  <div style={{ fontFamily:"var(--font-sans)", fontWeight:800, fontSize:15, color:"var(--ism-slate)" }}>{COMPANY_INFO.founder.name}</div>
                  <div style={{ fontSize:12, color:"var(--cyan)", fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>{COMPANY_INFO.founder.title}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Timeline (deepest dark) ── */}
      <div className="py-20 relative overflow-hidden" style={{ background:"var(--d0)" }}>
        <div className="absolute inset-0 fine-grid opacity-30 pointer-events-none"/>
        <div className="absolute inset-x-0 top-0 h-px" style={{ background:"linear-gradient(90deg,transparent,rgba(0,85,255,0.3),transparent)" }}/>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} className="text-center mb-14">
            <div className="eyebrow justify-center mb-4">Company Journey</div>
            <h2 style={{ fontSize:"clamp(1.75rem,4vw,3rem)", color:"var(--ism-slate)" }}>
              From Launch to <span className="tg-cyan">Global Reach</span>
            </h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{ background:"linear-gradient(to bottom, transparent, rgba(0,85,255,0.3), transparent)", transform:"translateX(-50%)" }}/>
            <div className="space-y-8">
              {TIMELINE.map((t,i) => (
                <motion.div key={i}
                  variants={i%2===0 ? fadeLeft : fadeRight}
                  initial="hidden" whileInView="show" viewport={vp}
                  className={`flex flex-col md:flex-row gap-6 items-center ${i%2!==0?"md:flex-row-reverse":""}`}>
                  <div className="flex-1">
                    <div className="card-glow p-6 md:max-w-sm">
                      <div style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"var(--cyan)", marginBottom:7 }}>{t.year}</div>
                      <h4 style={{ color:"var(--ism-slate)", fontFamily:"var(--font-sans)", marginBottom:8, fontSize:17 }}>{t.title}</h4>
                      <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.72 }}>{t.description}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border-2 z-10 flex-shrink-0"
                    style={{ background:"var(--d0)", borderColor:"var(--blue)", boxShadow:"0 0 12px rgba(0,85,255,0.5)" }}>
                    <div className="w-2 h-2 rounded-full m-auto mt-[1px]" style={{ background:"var(--blue)" }}/>
                  </div>
                  <div className="flex-1 hidden md:block"/>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
