export default function RestaurantDemoPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-3xl px-6 py-14">
                <h1 className="text-3xl font-bold">
                    Restaurant Demo
                </h1>

                <p className="mt-3 text-muted-foreground">
                    This is a live demo experience inside the website.
                    Try the flow, then continue the conversation on WhatsApp.
                </p>

                <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-6">
                    <p className="text-sm text-white/80">
                        ✅ Demo environment ready.
                        <br />
                        In the next step, this area will contain an interactive demo flow.
                    </p>

                    <a
                        href="https://wa.me/358401604442?text=Hi%20ZIVRA!%20I%20want%20a%20Restaurant%20Demo."
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 text-sm font-medium hover:bg-white/15"
                    >
                        Continue on WhatsApp
                    </a>
                </div>
            </div>
        </main>
    );
}
