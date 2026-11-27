import Navbar from "../../components/layout/Navbar.jsx";
import Footer from "../../components/layout/Footer.jsx";
export default function PrivacyPage() {
    return (<>
      <Navbar />
      <main className="pt-[66px] min-h-screen s-soft">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 40, color: "var(--navy)", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 36 }}>Last updated: August 2024</p>
          <div className="space-y-8 card p-8">
            {[
            { t: "1. Information We Collect", b: "ISM Data Technology collects information you provide when submitting business enquiries, job applications, or contacting us — including your name, email, phone, company name, and project requirements." },
            { t: "2. How We Use Your Information", b: "We use collected information solely to respond to your enquiries, process job applications, and communicate about our services. We do not sell or share your personal information with third parties." },
            { t: "3. Data Security", b: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction." },
            { t: "4. Contact", b: "" },
        ].map(s => (<div key={s.t}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, color: "var(--navy)", marginBottom: 8 }}>{s.t}</h2>
                {s.b ? <p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 14 }}>{s.b}</p> : (<p style={{ color: "var(--text2)", lineHeight: 1.8, fontSize: 14 }}>
                    For privacy-related questions:{" "}
                    <a href="mailto:official@ismdatatech.com" style={{ color: "var(--purple)" }} className="hover:underline font-semibold">
                      official@ismdatatech.com
                    </a>
                  </p>)}
              </div>))}
          </div>
        </div>
      </main>
      <Footer />
    </>);
}
