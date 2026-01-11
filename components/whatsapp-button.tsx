"use client";

export default function WhatsAppButton() {
    const phoneNumber = "358401604442"; // بدون + وبدون 00
    const message = encodeURIComponent(
        "Hi ZIVRA! I want to ask about building a website, app, or AI automation."
    );

    const href = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            title="Chat on WhatsApp"
            className="fixed bottom-5 right-20 z-[99999]"
        >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:opacity-95">
                <span className="text-xl">📱</span>
            </div>
        </a>
    );
}