
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/data";

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/ism-data-technology/",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/ism_data_technology/",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/918015285629",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.87 9.87 0 0 0-8.48 14.92L2.25 22l5.22-1.37A9.94 9.94 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.22 8.22 0 1 1 6.95 3.84Zm4.5-6.16c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.87-.2-.48-.41-.41-.57-.42h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.42 1.44.54.6.19 1.14.16 1.57.1.48-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.16-.48-.29Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--ism-navy)",
        borderTop: "1px solid rgba(0,85,255,0.25)",
      }}
    >
      <style>{`
        .fl {
          color: rgba(255,255,255,0.62);
          font-size: 15.5px;
          font-weight: 500;
          transition: color .2s;
          display: flex;
          align-items: center;
          gap: 4px;
          line-height: 1.6;
        }
        .fl:hover { color: #fff; }

        .fs {
          color: rgba(255,255,255,0.62);
          font-size: 15px;
          font-weight: 500;
          transition: color .2s;
          line-height: 1.6;
        }
        .fs:hover { color: var(--cyan); }

        .fm {
          color: rgba(255,255,255,0.62);
          font-size: 15px;
          font-weight: 500;
          display: block;
          transition: color .2s;
          line-height: 1.6;
        }
        .fm:hover { color: var(--cyan); }

        .social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          transition: all .25s ease;
        }
        .social-link:hover {
          color: #fff;
          background: rgba(0,85,255,0.25);
          border-color: var(--cyan);
          transform: translateY(-3px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  border: "1px solid rgba(0,85,255,0.3)",
                }}
              >
                <Image
                  src="/images/brand/ismicon.jpeg"
                  alt="ISM Data Technology"
                  fill
                  sizes="38px"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col leading-none">
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 800,
                    color: "#fff",
                    fontSize: 14,
                    letterSpacing: "0.04em",
                  }}
                >
                  ISM DATA
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    color: "var(--cyan)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Technology
                </span>
              </div>
            </Link>

            <p
              style={{
                color: "rgba(255,255,255,0.68)",
                fontSize: 14.5,
                lineHeight: 1.8,
                fontWeight: 400,
              }}
            >
              Delivering accurate, scalable data management and IT-enabled
              services worldwide since 2024.
            </p>

            {/* Social Media Links */}
            <div className="mt-6">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Follow Us
              </p>

              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ISM Data Technology on ${name}`}
                    title={name}
                    className="social-link"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 16,
              }}
            >
              Quick Links
            </h3>

            <ul className="space-y-2.5">
              {[
                ["/", "Home"],
                ["/#about", "About Us"],
                ["/#services", "Services"],
                ["/#projects", "Our Work"],
                ["/#life", "Life at ISM"],
                ["/careers", "Careers"],
                ["/contact", "Contact"],
              ].map(([h, l]) => (
                <li key={h}>
                  <Link href={h} className="fl group">
                    <ArrowUpRight
                      size={11}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    />
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 16,
              }}
            >
              Services
            </h3>

            <ul className="space-y-2.5">
              {[
                "EPUB Services",
                "Healthcare Data Entry",
                "Vital Records – USA",
                "Spanish Data Projects",
                "Newspaper Zoning",
                "USA Documentation",
                "Australian Scraping",
                "XML Processing",
              ].map((s) => (
                <li key={s}>
                  <Link href="/#services" className="fs">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              style={{
                color: "#fff",
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: 16,
              }}
            >
              Contact
            </h3>

            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: "var(--cyan)" }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    fontSize: 14.5,
                    lineHeight: 1.8,
                    fontWeight: 400,
                  }}
                >
                  Selva Complex, V.A. Nagar,
                  <br />
                  Kadayam Road, Pavoorchatram,
                  <br />
                  Tenkasi, Tamil Nadu – 627808, India
                </span>
              </li>

              <li className="flex gap-3">
                <Mail
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: "var(--cyan)" }}
                />
                <div className="space-y-1.5">
                  <a href={`mailto:${COMPANY_INFO.email}`} className="fm">
                    {COMPANY_INFO.email}
                  </a>
                  <a href={`mailto:${COMPANY_INFO.hrEmail}`} className="fm">
                    {COMPANY_INFO.hrEmail}
                  </a>
                </div>
              </li>

              <li className="flex gap-3">
                <Clock
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: "var(--cyan)" }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.68)",
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  {COMPANY_INFO.operationsHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(0,85,255,0.12)" }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.68)",
              fontSize: 13.5,
            }}
          >
            © {year} ISM Data Technology. All rights reserved.
          </p>

          <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-end">
            <Link href="/privacy" className="fs">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
