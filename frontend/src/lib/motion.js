/* Reveals retrigger on viewport entry in either scroll direction. */
export const vp = { once: false, margin: "-80px" };
export const vpEager = { once: false, margin: "-40px" };
export const viewport = vp;
export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
export const fadeIn = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.55 } },
};
export const fadeLeft = {
    hidden: { opacity: 0, x: -48 },
    show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
export const fadeRight = {
    hidden: { opacity: 0, x: 48 },
    show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
export const scaleUp = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
export const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
export const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
};
export const staggerSm = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};
export const clipUp = {
    hidden: { clipPath: "inset(0 0 100% 0)" },
    show: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
};
export const imageReveal = {
    hidden: { clipPath: "inset(0 100% 0 0)", scale: 1.08 },
    show: { clipPath: "inset(0 0% 0 0)", scale: 1, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};
export const cardVariant = item;
export const fadeUpV = fadeUp;
