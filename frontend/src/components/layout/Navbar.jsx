
import { useState, useEffect, useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";


const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/life-at-ism", label: "Life at ISM" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];


function subscribeToHashChange(onChange) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);

  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getHashSnapshot() {
  return window.location.hash;
}

function getServerHashSnapshot() {
  return "";
}

function isActive(href, path, hash) {
  const normalizedPath = path.replace(/\/+$/, "") || "/";

  if (href.startsWith("/#")) {
    const section = href.slice(2);
    const sectionPath = `/${section}`;

    return (
      (normalizedPath === "/" && hash === `#${section}`) ||
      normalizedPath === sectionPath ||
      normalizedPath.startsWith(`${sectionPath}/`)
    );
  }

  // if (href === "/") {
  //   return (
  //     normalizedPath === "/" &&
  //     !["about", "services", "projects", "life"].includes(hash)
  //   );
  // }

  const targetPath =
    href.split("#", 1)[0].replace(/\/+$/, "") || "/";

  return (
    normalizedPath === targetPath ||
    normalizedPath.startsWith(`${targetPath}/`)
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const path = useLocation().pathname;

  const hash = useSyncExternalStore(
    subscribeToHashChange,
    getHashSnapshot,
    getServerHashSnapshot
  );

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);

    fn();

    window.addEventListener("scroll", fn, { passive: true });

    return () => window.removeEventListener("scroll", fn);
  }, []);

  const textColor = "var(--ism-navy)";
  const subColor = "var(--ism-accent)";

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background:
          scrolled || open
            ? "rgba(241,245,244,0.97)"
            : "rgba(241,245,244,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom:
          scrolled || open
            ? "1px solid rgba(0,85,255,0.12)"
            : "1px solid transparent",
        boxShadow: scrolled
          ? "0 2px 24px rgba(0,85,255,0.10)"
          : "none",
        transition:
          "background .3s, border-color .3s, box-shadow .3s",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between"
        style={{ height: 72 }}
      >
        {/* Logo + name */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group flex-shrink-0"
        >
          <div
            className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <img
              src="/images/brand/ismicon.jpeg"
              alt="ISM Data Technology"
              className="object-contain w-full h-full"
            />
          </div>

          <div className="flex flex-col leading-none select-none">
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 800,
                color: textColor,
                fontSize: 14,
                letterSpacing: "0.04em",
                transition: "color .3s",
              }}
            >
              ISM DATA
            </span>

            <span
              style={{
                fontSize: 9.5,
                color: subColor,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                transition: "color .3s",
              }}
            >
              Technology
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map(({ href, label }) => {
            const active = isActive(href, path, hash);

            return (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className="relative px-4 py-2.5 text-[15px] font-semibold rounded-xl transition-colors duration-200"
                style={{
                  color: active ? "#0055ff" : "var(--ism-slate)",
                  background: active
                    ? "rgba(0,85,255,0.07)"
                    : "transparent",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {label}

                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "rgba(0,85,255,0.07)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/contact"
              className="btn-primary hidden lg:inline-flex"
              style={{ padding: "10px 20px", fontSize: 14 }}
            >
              Get a Quote
            </Link>
          </motion.div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: open
                ? "rgba(0,85,255,0.12)"
                : "rgba(0,85,255,0.07)",
              color: "#0055ff",
              border: "none",
            }}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "x" : "m"}
                initial={{
                  rotate: -90,
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                  scale: 0.7,
                }}
                transition={{ duration: 0.2 }}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.28,
              ease: "easeInOut",
            }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(241,245,244,0.99)",
              borderTop: "1px solid rgba(0,85,255,0.1)",
            }}
          >
            <div className="px-5 py-4 space-y-1">
              {NAV.map(({ href, label }, i) => {
                const active = isActive(href, path, hash);

                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center px-4 py-3 rounded-xl text-[15px] font-semibold transition-all"
                      style={{
                        color: active
                          ? "#0055ff"
                          : "var(--ism-slate)",
                        background: active
                          ? "rgba(0,85,255,0.07)"
                          : "transparent",
                      }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="pt-3">
                <Link
                  to="/contact"
                  className="btn-primary w-full justify-center"
                  style={{ fontSize: 13 }}
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
