"use client";
export default function WhatsAppButton() {
    // Replace with the verified company WhatsApp number when available
    // Currently showing as a placeholder — update number before deploying
    const WHATSAPP_NUMBER = ""; // TODO: Add verified WhatsApp number
    if (!WHATSAPP_NUMBER)
        return null;
    return (<a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110" style={{ background: "#25D366" }} aria-label="Chat on WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.735 5.469 2.02 7.77L0 32l8.5-2.01A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.89 22.6c-.33.93-1.93 1.79-2.65 1.9-.68.1-1.54.14-2.48-.16-.57-.18-1.3-.42-2.23-.82-3.93-1.7-6.49-5.67-6.69-5.93-.2-.27-1.63-2.17-1.63-4.14 0-1.97 1.03-2.94 1.4-3.34.37-.4.8-.5 1.07-.5.27 0 .53.003.77.013.25.01.58-.1.9.69.33.8 1.13 2.77 1.23 2.97.1.2.17.43.03.7-.13.27-.2.43-.4.67-.2.23-.42.52-.6.7-.2.2-.4.41-.17.8.23.4.1.59 1.47 2.2 1 1.19 1.87 1.56 2.27 1.73.4.17.63.14.87-.08.23-.23.99-1.15 1.25-1.55.27-.4.53-.33.9-.2.37.13 2.33 1.1 2.73 1.3.4.2.67.3.77.47.1.17.1.97-.22 1.9z"/>
      </svg>
    </a>);
}
