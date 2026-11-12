
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BackToTop from "@/components/ui/BackToTop";
import { MapPin, Mail, Clock, ExternalLink, Navigation } from "lucide-react";
import { COMPANY_INFO } from "@/lib/data";
import MapButtons from "@/components/contact/MapButtons";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with ISM Data Technology.",
};

/* Office map locations */

// Avudaiyanoor Main Office
const AVUDAIYANOOR_MAP_EMBED =
  "https://www.google.com/maps?q=8.8801077,77.3882174&z=17&output=embed";

const AVUDAIYANOOR_MAPS_SEARCH =
  "https://www.google.com/maps/place/ISM+DATA+TECHNOLOGY/@8.8801077,77.3882174,17z";

const AVUDAIYANOOR_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=8.8801077%2C77.3882174";

// Pavoorchatram Office
const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.1!2d77.2816!3d8.9639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0457fb000b3bad%3A0x3f6dcc6b92c2bc01!2sPayoorchatram%2C%20Tamil%20Nadu%20627808!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

const MAPS_SEARCH =
  "https://www.google.com/maps/search/Selva+Complex+VA+Nagar+Kadayam+Road+Pavoorchatram+Tenkasi+Tamil+Nadu+627808";

const DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Selva+Complex+VA+Nagar+Kadayam+Road+Pavoorchatram+Tenkasi+Tamil+Nadu+627808&travelmode=driving";

export default function ContactPage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />

      <main className="pt-[72px]">

        {/* Hero */}
        <div
          className="py-20 relative overflow-hidden"
          style={{ background: "var(--d1)" }}
        >
          <div className="absolute inset-0 fine-grid opacity-50 pointer-events-none" />

          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,rgba(0,85,255,0.10) 0%,transparent 70%)",
              transform: "translate(30%,-30%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
            <div className="eyebrow mb-5">Contact Us</div>

            <h1
              style={{
                fontSize: "clamp(2.5rem,6.5vw,4.5rem)",
                color: "var(--ism-slate)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                maxWidth: 700,
              }}
            >
              Let&apos;s Start a{" "}
              <span className="tg-main">Conversation</span>
            </h1>

            <p
              className="mt-5 max-w-md"
              style={{
                color: "var(--text2)",
                fontSize: 17,
                lineHeight: 1.8,
              }}
            >
              Have a data project in mind? Looking for a reliable partner?
              Reach out — we respond within 24 hours.
            </p>
          </div>
        </div>

        {/* Info cards + form */}
        <div
          className="py-16 relative overflow-hidden"
          style={{ background: "var(--d2)" }}
        >
          <div className="absolute inset-0 fine-grid opacity-40 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Info cards */}
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    col: "#0055ff",
                    title: "Our Offices",
                    body: (
                      <div className="space-y-5">
                        <div>
                          <p
                            className="font-bold mb-1"
                            style={{ color: "var(--ism-slate)" }}
                          >
                            Main Office – Avudaiyanoor
                          </p>

                          <p
                            style={{
                              color: "var(--text2)",
                              fontSize: 15,
                              lineHeight: 1.8,
                            }}
                          >
                            250-seat facility
                            <br />
                            5/138-1 AVR Building, Karuvel Nadar Street,
                            <br />
                            Avudayanoor, Kilapavoor,
                            <br />
                            Tenkasi, Tamil Nadu – 627808, India
                          </p>
                        </div>

                        <div>
                          <p
                            className="font-bold mb-1"
                            style={{ color: "var(--ism-slate)" }}
                          >
                            Pavoorchatram Office
                          </p>

                          <p
                            style={{
                              color: "var(--text2)",
                              fontSize: 15,
                              lineHeight: 1.8,
                            }}
                          >
                            Selva Complex, V.A. Nagar,
                            <br />
                            Kadayam Road, Pavoorchatram,
                            <br />
                            Tenkasi, Tamil Nadu – 627808, India
                          </p>

                          <a
                            href={MAPS_SEARCH}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold hover:underline"
                            style={{ color: "var(--cyan)" }}
                          >
                            Open in Maps <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ),
                  },
                  {
                    icon: Mail,
                    col: "#0055ff",
                    title: "Email Us",
                    body: (
                      <div className="space-y-2">
                        <div>
                          <p
                            style={{
                              color: "var(--text3)",
                              fontSize: 13,
                              marginBottom: 3,
                            }}
                          >
                            Business
                          </p>

                          <a
                            href={`mailto:${COMPANY_INFO.email}`}
                            className="text-base font-bold hover:underline"
                            style={{ color: "#0055ff" }}
                          >
                            {COMPANY_INFO.email}
                          </a>
                        </div>

                        <div>
                          <p
                            style={{
                              color: "var(--text3)",
                              fontSize: 13,
                              marginBottom: 3,
                            }}
                          >
                            HR / Careers
                          </p>

                          <a
                            href={`mailto:${COMPANY_INFO.hrEmail}`}
                            className="text-base font-bold hover:underline"
                            style={{ color: "#0055ff" }}
                          >
                            {COMPANY_INFO.hrEmail}
                          </a>
                        </div>
                      </div>
                    ),
                  },
                  {
                    icon: Clock,
                    col: "#8ca4bc",
                    title: "Business Hours",
                    body: (
                      <>
                        <p
                          style={{
                            color: "var(--text2)",
                            fontSize: 15,
                            lineHeight: 1.7,
                          }}
                        >
                          {COMPANY_INFO.businessHours}
                        </p>

                        <p
                          style={{
                            color: "var(--text2)",
                            fontSize: 15,
                            marginTop: 4,
                          }}
                        >
                          Sunday: Closed
                        </p>
                      </>
                    ),
                  },
                ].map(({ icon: Icon, col, title, body }) => (
                  <ScrollReveal
                    key={title}
                    delay={0.08}
                    className="card-glow p-6"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        background: `${col}15`,
                        border: `1px solid ${col}30`,
                      }}
                    >
                      <Icon size={17} style={{ color: col }} />
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 800,
                        fontSize: 16,
                        color: "var(--ism-slate)",
                        marginBottom: 10,
                      }}
                    >
                      {title}
                    </h3>

                    {body}
                  </ScrollReveal>
                ))}
              </div>

              {/* Enquiry form */}
              <div className="lg:col-span-2" id="quote">
                <div className="card-glow p-8">
                  <h2
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 22,
                      color: "var(--ism-slate)",
                      marginBottom: 24,
                    }}
                  >
                    Send Us a Business Enquiry
                  </h2>

                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office locations and maps */}
        <div
          className="py-16 relative overflow-hidden"
          style={{ background: "var(--d0)" }}
        >
          <div className="absolute inset-0 fine-grid opacity-30 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
            <div className="text-center mb-10">
              <div className="eyebrow justify-center mb-3">Find Us</div>

              <h2
                style={{
                  fontSize: "clamp(1.75rem,4vw,2.75rem)",
                  color: "var(--ism-slate)",
                }}
              >
                Our <span className="tg-main">Office Locations</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

              {/* Avudaiyanoor main office address card */}
              <div className="card-glow p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(0,85,255,0.15)",
                      border: "1px solid rgba(0,85,255,0.3)",
                    }}
                  >
                    <MapPin size={18} style={{ color: "var(--cyan)" }} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: "var(--ism-slate)",
                      }}
                    >
                      ISM Data Technology
                    </div>

                    <div style={{ fontSize: 13, color: "var(--text3)" }}>
                      Main Office – Avudaiyanoor
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(1,35,103,0.12)",
                    paddingTop: 16,
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      color: "var(--text2)",
                      fontSize: 15,
                      lineHeight: 1.9,
                    }}
                  >
                    250-seat facility
                    <br />
                    5/138-1 AVR Building, Karuvel Nadar Street,
                    <br />
                    Avudayanoor, Kilapavoor,
                    <br />
                    Tenkasi, Tamil Nadu – 627808,
                    <br />
                    India
                  </p>
                </div>

                <div className="space-y-3">
                  <MapButtons
                    mapsSearch={AVUDAIYANOOR_MAPS_SEARCH}
                    directions={AVUDAIYANOOR_DIRECTIONS}
                  />
                </div>
              </div>

              {/* Avudaiyanoor main office map */}
              <div
                className="lg:col-span-2 overflow-hidden rounded-2xl"
                style={{
                  border: "1px solid rgba(0,85,255,0.2)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                }}
              >
                <iframe
                  title="ISM Data Technology – Main Office, Avudaiyanoor, Tenkasi"
                  src={AVUDAIYANOOR_MAP_EMBED}
                  width="100%"
                  height="400"
                  style={{
                    display: "block",
                    border: 0,
                    filter:
                      "hue-rotate(200deg) saturate(0.7) brightness(0.85)",
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                <div
                  className="flex items-center justify-between flex-wrap gap-3 px-5 py-4"
                  style={{
                    background: "rgba(12,18,37,0.95)",
                    borderTop: "1px solid rgba(0,85,255,0.15)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 800,
                        fontSize: 15,
                        color: "var(--ism-slate)",
                      }}
                    >
                      ISM Data Technology – Main Office
                    </p>

                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text2)",
                        marginTop: 3,
                      }}
                    >
                      5/138-1 AVR Building, Karuvel Nadar Street,
                      Avudayanoor, Tenkasi – 627808
                    </p>
                  </div>

                  <a
                    href={AVUDAIYANOOR_DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      fontSize: 14,
                      padding: "10px 18px",
                      flexShrink: 0,
                    }}
                  >
                    <Navigation size={13} /> Directions
                  </a>
                </div>
              </div>

              {/* Pavoorchatram registered office address card */}
              <div className="card-glow p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(0,85,255,0.15)",
                      border: "1px solid rgba(0,85,255,0.3)",
                    }}
                  >
                    <MapPin size={18} style={{ color: "var(--cyan)" }} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 800,
                        fontSize: 16,
                        color: "var(--ism-slate)",
                      }}
                    >
                      ISM Data Technology
                    </div>

                    <div style={{ fontSize: 13, color: "var(--text3)" }}>
                      Registered Office – Pavoorchatram
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(1,35,103,0.12)",
                    paddingTop: 16,
                    marginBottom: 16,
                  }}
                >
                  <p
                    style={{
                      color: "var(--text2)",
                      fontSize: 15,
                      lineHeight: 1.9,
                    }}
                  >
                    Selva Complex, V.A. Nagar,
                    <br />
                    Kadayam Road, Pavoorchatram,
                    <br />
                    Tenkasi, Tamil Nadu – 627808,
                    <br />
                    India
                  </p>
                </div>

                <div className="space-y-3">
                  <MapButtons
                    mapsSearch={MAPS_SEARCH}
                    directions={DIRECTIONS}
                  />
                </div>

                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: "1px solid rgba(1,35,103,0.12)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text2)",
                      lineHeight: 1.7,
                    }}
                  >
                    {COMPANY_INFO.businessHours}
                  </p>
                </div>
              </div>

              {/* Pavoorchatram registered office map */}
              <div
                className="lg:col-span-2 overflow-hidden rounded-2xl"
                style={{
                  border: "1px solid rgba(0,85,255,0.2)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                }}
              >
                <iframe
                  title="ISM Data Technology – Selva Complex, Pavoorchatram, Tenkasi, Tamil Nadu"
                  src={MAP_EMBED}
                  width="100%"
                  height="400"
                  style={{
                    display: "block",
                    border: 0,
                    filter:
                      "hue-rotate(200deg) saturate(0.7) brightness(0.85)",
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                <div
                  className="flex items-center justify-between flex-wrap gap-3 px-5 py-4"
                  style={{
                    background: "rgba(12,18,37,0.95)",
                    borderTop: "1px solid rgba(0,85,255,0.15)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 800,
                        fontSize: 15,
                        color: "var(--ism-slate)",
                      }}
                    >
                      ISM Data Technology
                    </p>

                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text2)",
                        marginTop: 3,
                      }}
                    >
                      Selva Complex, V.A. Nagar, Kadayam Road, Pavoorchatram,
                      Tenkasi – 627808
                    </p>
                  </div>

                  <a
                    href={DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      fontSize: 14,
                      padding: "10px 18px",
                      flexShrink: 0,
                    }}
                  >
                    <Navigation size={13} /> Directions
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
