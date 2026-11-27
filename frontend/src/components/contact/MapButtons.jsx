"use client";
import { ExternalLink, Navigation } from "lucide-react";
export default function MapButtons({ mapsSearch, directions }) {
    return (<>
      <a href={mapsSearch} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm transition-all" style={{ background: "rgba(0,85,255,0.12)", border: "1px solid rgba(0,85,255,0.3)", color: "var(--cyan)" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,85,255,0.22)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,85,255,0.12)")}>
        <ExternalLink size={15}/> View on Google Maps
      </a>
      <a href={directions} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all" style={{ background: "linear-gradient(135deg,#0055ff,#0055ff)", boxShadow: "0 4px 18px rgba(0,85,255,0.35)" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,85,255,0.5)"; }} onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(0,85,255,0.35)"; }}>
        <Navigation size={15}/> Get Directions
      </a>
    </>);
}
