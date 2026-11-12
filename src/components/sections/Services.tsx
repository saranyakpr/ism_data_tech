"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowRight,
  BookMarked,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Code2,
  CreditCard,
  Database,
  FileCheck,
  FileStack,
  FileText,
  Globe,
  HeartPulse,
  Keyboard,
  Languages,
  Newspaper,
  Phone,
  Receipt,
  ScrollText,
  Target,
  type LucideIcon,
} from "lucide-react";
import { fadeUp, item, stagger, vp } from "@/lib/motion";
import { SERVICE_PILLARS, SERVICES } from "@/lib/data";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  Archive,
  BookMarked,
  BookOpen,
  Code2,
  CreditCard,
  Database,
  FileCheck,
  FileStack,
  FileText,
  Globe,
  HeartPulse,
  Keyboard,
  Languages,
  Newspaper,
  Phone,
  Receipt,
  ScrollText,
  Target,
};

function ServiceIcon({ name }: { name: string }) {
  const Icon = SERVICE_ICONS[name] ?? Database;
  return <Icon size={20} aria-hidden="true" />;
}

export default function Services() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="services" className="py-24 relative overflow-hidden" style={{ background: "var(--d1)" }}>
      <div className="absolute inset-0 fine-grid opacity-60 pointer-events-none" />
      <div
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,85,255,0.08) 0%,transparent 70%)", transform: "translate(20%,-20%)" }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}>
            <div className="eyebrow mb-5">Our Expertise</div>
            <h2 style={{ fontSize: "clamp(2rem,5vw,3.75rem)", color: "var(--ism-slate)", lineHeight: 1.06 }}>
              Services for<br /><span className="tg-main">Every Workflow</span>
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp}>
            <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 17 }}>
              Explore {SERVICES.length} services across {SERVICE_PILLARS.length} pillars, from data preparation and document digitisation to customer support and software development.
            </p>
          </motion.div>
        </div>

        <div className="space-y-12">
          {SERVICE_PILLARS.map((pillar, index) => {
            const pillarServices = SERVICES.filter((service) => service.pillar === pillar.id);

            return (
              <motion.section
                key={pillar.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                aria-labelledby={`pillar-${pillar.id}`}
                className="rounded-3xl p-5 sm:p-8 lg:p-10"
                style={{
                  background: "linear-gradient(160deg,var(--d0),var(--d3))",
                  border: "1px solid rgba(0,85,255,0.18)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
                  <div>
                    <div className="eyebrow mb-3">{String.fromCharCode(65 + index)} · Service Pillar</div>
                    <h3
                      id={`pillar-${pillar.id}`}
                      style={{ fontSize: "clamp(1.45rem,3vw,2rem)", color: "var(--ism-slate)", marginBottom: 8 }}
                    >
                      {pillar.title}
                    </h3>
                    <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, maxWidth: 680 }}>
                      {pillar.description}
                    </p>
                  </div>
                  <span
                    className="self-start sm:self-auto whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{ background: "rgba(0,85,255,0.08)", color: "var(--ism-navy)", border: "1px solid rgba(1,35,103,0.16)" }}
                  >
                    {pillarServices.length} {pillarServices.length === 1 ? "service" : "services"}
                  </span>
                </div>

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={vp}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {pillarServices.map((service) => {
                    const isExpanded = expanded === service.id;
                    const detailsId = `service-details-${service.id}`;

                    return (
                      <motion.article
                        key={service.id}
                        variants={item}
                        className="card-glow overflow-hidden flex flex-col"
                        whileHover={{ y: -5, boxShadow: "0 24px 56px rgba(1,35,103,0.2)" }}
                      >
                        <div className="p-5 sm:p-6 flex-1">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                            style={{ background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.22)", color: "var(--ism-navy)" }}
                          >
                            <ServiceIcon name={service.icon} />
                          </div>
                          <div className="h-0.5 w-7 rounded-full mb-3" style={{ background: "linear-gradient(90deg,#012367,#0055ff)" }} />
                          <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 800, fontSize: 16, color: "var(--ism-slate)", lineHeight: 1.4, marginBottom: 8 }}>
                            {service.title}
                          </h4>
                          <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.72, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {service.description}
                          </p>

                          {service.screenshots && service.screenshots.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                              {service.screenshots.map((screenshot) => (
                                <div key={screenshot.src} className="relative aspect-video overflow-hidden rounded-xl">
                                  <Image
                                    src={screenshot.src}
                                    alt={screenshot.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div
                          className="flex items-center justify-between gap-3 px-5 py-3"
                          style={{ borderTop: "1px solid rgba(1,35,103,0.10)" }}
                        >
                          <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : service.id)}
                            aria-expanded={isExpanded}
                            aria-controls={detailsId}
                            className="inline-flex items-center gap-2 text-sm font-bold"
                            style={{ background: "none", color: isExpanded ? "var(--cyan)" : "var(--text2)" }}
                          >
                            {isExpanded ? "Hide details" : "Details"}
                            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>
                          <Link
                            href="/contact#quote"
                            className="inline-flex items-center gap-1.5 text-sm font-bold"
                            style={{ color: "var(--ism-navy)" }}
                          >
                            Enquire <ArrowRight size={14} />
                          </Link>
                        </div>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              id={detailsId}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(1,35,103,0.10)" }}>
                                <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.72 }}>
                                  {service.description}
                                </p>
                                {service.capabilities && service.capabilities.length > 0 && (
                                  <ul className="mt-4 space-y-2">
                                    {service.capabilities.map((capability) => (
                                      <li key={capability} className="flex items-start gap-2 text-sm" style={{ color: "var(--text2)" }}>
                                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2" style={{ background: "var(--blue)" }} />
                                        {capability}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
