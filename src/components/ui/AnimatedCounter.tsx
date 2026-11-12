"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
interface Props { end:number; suffix?:string; duration?:number; }
export default function AnimatedCounter({ end, suffix="", duration=2000 }:Props) {
  const count = useMotionValue(end);
  const display = useTransform(count, value => `${Math.floor(value)}${suffix}`);
  const ref=useRef<HTMLSpanElement>(null);
  const hasEntered = useRef(false);
  const inView=useInView(ref,{once:false,margin:"-50px"});
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      count.set(end);
      return;
    }

    if (!hasEntered.current) {
      count.set(0);
      hasEntered.current = true;
    }

    const controls = animate(count, end, { duration: duration / 1000, ease: "easeOut" });
    return () => controls.stop();
  }, [count, duration, end, inView, prefersReducedMotion]);

  return (
    <span ref={ref}>
      <span className="sr-only">{`${end}${suffix}`}</span>
      <motion.span aria-hidden="true">{display}</motion.span>
    </span>
  );
}
