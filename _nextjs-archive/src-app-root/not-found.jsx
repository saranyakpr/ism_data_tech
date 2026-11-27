import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
export default function NotFound() {
    return (<>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-5 pt-[68px] s-snow">
        <div className="text-center">
          <div className="tg-purple font-extrabold mb-6" style={{ fontSize: "clamp(6rem,15vw,10rem)", fontFamily: "var(--font-sans)", letterSpacing: "-0.06em", lineHeight: 1 }}>
            404
          </div>
          <h1 style={{ fontFamily: "var(--font-sans)", fontSize: 28, color: "var(--ink)", marginBottom: 12 }}>Page Not Found</h1>
          <p style={{ color: "var(--text2)", marginBottom: 40, maxWidth: 400, margin: "0 auto 40px" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">Back to Home</Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>);
}
