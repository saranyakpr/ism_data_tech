
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp, vp } from "../../lib/motion.js";
import { ArrowRight, Mail } from "lucide-react";

export default function CTA() {
  return (
    <section className="cta-section py-28 relative overflow-hidden">
      <div className="absolute inset-0 fine-grid opacity-30 pointer-events-none" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle, rgba(0,85,255,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(0,85,255,0.07) 0%, transparent 70%)",
          transform: "translate(20%,20%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg,transparent,rgba(0,85,255,0.4),transparent)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={vp}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: "rgba(0,85,255,0.12)",
              border: "1px solid rgba(0,85,255,0.25)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--cyan)",
                animation: "pulseDot 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--cyan)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Ready to Start?
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(2.5rem,7vw,5.5rem)",
              color: "var(--white)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              marginBottom: 20,
            }}
          >
            Let&apos;s Build Something
            <br />
            <span className="tg-main">
              <em
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Exceptional
              </em>{" "}
              Together
            </span>
          </h2>

          <p
            style={{
              color: "var(--text2)",
              fontSize: 16,
              lineHeight: 1.78,
              marginBottom: 48,
              maxWidth: 520,
              margin: "0 auto 48px",
            }}
          >
            Looking for a reliable partner for your data and business support
            operations? Let&apos;s discuss your requirements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact#quote" className="btn-primary">
                Request a Quote <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="btn-outline">
                <Mail size={15} /> Contact Our Team
              </Link>
            </motion.div>
          </div>

          <p style={{ color: "var(--text3)", fontSize: 13 }}>
            Business enquiries:{" "}
            <a
              href="mailto:official@ismdatatech.com"
              style={{ color: "var(--cyan)", fontWeight: 600 }}
              className="hover:underline"
            >
              official@ismdatatech.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
