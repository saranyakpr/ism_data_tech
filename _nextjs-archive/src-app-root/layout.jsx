import { MotionConfig } from "framer-motion";
import "./globals.css";
export const metadata = {
    title: {
        default: "ISM Data Technology | Data Entry & IT Services",
        template: "%s | ISM Data Technology",
    },
    description: "ISM Data Technology delivers accurate, scalable and reliable data management, data entry, document processing, and IT-enabled services to businesses worldwide.",
    keywords: [
        "data entry services", "data processing services", "document digitization",
        "healthcare data entry", "data management services", "USA documentation services",
        "historical records management", "ISM Data Technology",
    ],
    openGraph: {
        type: "website", locale: "en_US",
        url: "https://ismdatatech.com",
        siteName: "ISM Data Technology",
        title: "ISM Data Technology | Data Entry & IT Services",
        description: "Accurate, scalable data management and IT-enabled services for businesses worldwide.",
    },
    robots: { index: true, follow: true },
    metadataBase: new URL("https://ismdatatech.com"),
};
export default function RootLayout({ children }) {
    return (<html lang="en">
      <body>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>);
}
