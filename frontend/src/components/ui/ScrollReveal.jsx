"use client";
import { motion } from "framer-motion";
export default function ScrollReveal({ children, className, delay = 0, }) {
    return (<motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.25 }} transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>);
}
